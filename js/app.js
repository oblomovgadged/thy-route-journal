// app.js - Full Premium Flow: Search -> Ticket Booking -> Journal

let mapInstance = null;
let markersLayer = null;

let currentOrigin = "IST";
let currentDest = "NRT";
let totalPlannedDays = 3;
let currentItinerary = [];
let bookingState = 'outbound';

document.addEventListener('DOMContentLoaded', () => {
    // Check for ?join=true in URL to show online indicator
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('join') === 'true') {
        const indicator = document.getElementById('online-indicator');
        if(indicator) indicator.style.display = 'block';
    }

    // Dates
    const today = new Date();
    const future = new Date(today);
    future.setDate(today.getDate() + 3); 
    document.getElementById('outbound-date').valueAsDate = today;
    document.getElementById('inbound-date').valueAsDate = future;

    // Init Map (Always visible in background)
    initFluidMap();

    // Setup Custom Autocomplete (Live 100+ DB filtering)
    setupLiveAutocomplete('origin', 'origin-autocomplete');
    setupLiveAutocomplete('destination', 'dest-autocomplete');

    // UI Listeners
    document.getElementById('search-form').addEventListener('submit', handleSearchSubmit);
    document.getElementById('btn-reset').addEventListener('click', resetToSearch);

    // Invite Modal Logic
    const inviteModal = document.getElementById('invite-modal-premium');
    document.getElementById('btn-open-invite').addEventListener('click', () => {
        inviteModal.classList.add('active');
    });
    document.getElementById('btn-close-invite').addEventListener('click', () => {
        inviteModal.classList.remove('active');
    });
    document.getElementById('invite-form-premium').addEventListener('submit', handleInviteSubmit);
});

// FLUID MAP BACKGROUND (Light Theme)
function initFluidMap() {
    mapInstance = L.map('map-bg', { zoomControl: false }).setView([41.2588, 28.7456], 3); 
    // Ferah ve Standart Görünüm (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(mapInstance);
    markersLayer = L.featureGroup().addTo(mapInstance);
}

// REALTIME AUTOCOMPLETE LOGIC (NO DATALIST)
function setupLiveAutocomplete(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    // Hide when clicking outside
    document.addEventListener('click', (e) => {
        if(e.target !== input) dropdown.classList.remove('active');
    });

    input.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        dropdown.innerHTML = '';
        if(val.length === 0) {
            dropdown.classList.remove('active');
            return;
        }

        // Live filter from massive DB
        const filtered = ALL_PORT_STRINGS.filter(p => p.toLowerCase().includes(val)).slice(0, 8); // Top 8 results
        
        if(filtered.length > 0) {
            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.innerHTML = `<i class="ph ph-airplane-tilt" style="margin-right: 8px;"></i> ${item}`;
                div.onclick = () => {
                    input.value = item;
                    dropdown.classList.remove('active');
                };
                dropdown.appendChild(div);
            });
            dropdown.classList.add('active');
        } else {
            dropdown.classList.remove('active');
        }
    });
}

// SEARCH SUBMIT -> FLIGHT SELECTION
function handleSearchSubmit(e) {
    e.preventDefault();
    
    const originVal = document.getElementById('origin').value; 
    const destVal = document.getElementById('destination').value; 
    
    // IATA Extract
    const originMatch = originVal.match(/\(([^)]+)\)/);
    const destMatch = destVal.match(/\(([^)]+)\)/);
    currentOrigin = originMatch ? originMatch[1] : originVal.substring(0,3).toUpperCase();
    currentDest = destMatch ? destMatch[1] : destVal.substring(0,3).toUpperCase();

    // Date calculations
    const outbound = new Date(document.getElementById('outbound-date').value);
    const inbound = new Date(document.getElementById('inbound-date').value);
    totalPlannedDays = Math.max(1, Math.ceil(Math.abs(inbound - outbound) / (1000 * 60 * 60 * 24)) + 1);

    // UX Transition
    document.getElementById('search-layer').classList.add('slide-up');
    
    // Map Fly to Destination smoothly
    const destData = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    mapInstance.flyTo([destData.lat, destData.lng], 6, { duration: 2 });

    bookingState = 'outbound'; // Reset booking state

    setTimeout(() => {
        showFlightSelection();
    }, 600);
}

// RENDER FLIGHT SELECTION TICKETS
function showFlightSelection() {
    const layer = document.getElementById('flight-selection-layer');
    layer.classList.add('active');
    
    const title = document.getElementById('flight-route-title');
    const subtitle = document.getElementById('flight-dates-subtitle');
    const container = document.getElementById('flight-cards-container');
    container.innerHTML = '';

    if (bookingState === 'outbound') {
        title.innerHTML = `${currentOrigin} <i class="ph ph-airplane-tilt" style="color:var(--thy-red);"></i> ${currentDest}`;
        subtitle.textContent = `Gidiş Uçuşunuzu Seçin`;
        renderFlightCards(currentOrigin, currentDest, 'outbound');
    } else if (bookingState === 'inbound') {
        title.innerHTML = `${currentDest} <i class="ph ph-airplane-tilt" style="color:var(--thy-red);"></i> ${currentOrigin}`;
        subtitle.textContent = `Dönüş Uçuşunuzu Seçin`;
        renderFlightCards(currentDest, currentOrigin, 'inbound');
    } else if (bookingState === 'confirm') {
        title.innerHTML = `<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Uçuşlar Seçildi`;
        subtitle.textContent = `Biletleme tamamlandı. Seyahat planınız oluşturulmaya hazır!`;
        container.innerHTML = `
            <div style="background: rgba(255,255,255,0.9); padding: 2rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--thy-grey-border);">
                <i class="ph-fill ph-calendar-check" style="font-size: 4rem; color: var(--thy-dark-blue); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1.5rem; font-family: var(--font-secondary);">Gidiş-Dönüş biletleriniz ayrıldı</h3>
                <button class="btn btn-primary" style="font-size: 1.2rem; padding: 1rem 2rem;" onclick="confirmFlightBooking()">
                    Özet ve Rotayı Oluştur <i class="ph ph-arrow-right"></i>
                </button>
            </div>
        `;
    }
}

function renderFlightCards(from, to, type) {
    const container = document.getElementById('flight-cards-container');
    const mockFlights = [
        { dep: '02:25', arr: '19:45', no: `TK ${Math.floor(Math.random()*100)+10}`, aircraft: 'Airbus A350-900', eco: '8.500', bus: '24.000' },
        { dep: '15:20', arr: '08:45', no: `TK ${Math.floor(Math.random()*100)+10}`, aircraft: 'Boeing 787-9 Dreamliner', eco: '9.200', bus: '26.500' }
    ];

    mockFlights.forEach((f) => {
        container.innerHTML += `
            <div class="flight-ticket-card">
                <div class="flight-times">
                    <div class="time-block">
                        <h3>${f.dep}</h3>
                        <p>${from}</p>
                    </div>
                    <div class="flight-duration">
                        <span style="font-size:0.8rem; color:var(--thy-grey-text);">Direkt Uçuş</span>
                        <i class="ph-fill ph-airplane-right"></i>
                    </div>
                    <div class="time-block">
                        <h3>${f.arr}</h3>
                        <p>${to}</p>
                    </div>
                </div>
                
                <div class="aircraft-info">
                    <div class="aircraft-badge">${f.aircraft}</div>
                    <div style="font-weight:600;">Sefer: ${f.no}</div>
                </div>

                <div class="class-options">
                    <button class="class-btn class-eco" onclick="selectFlightOption('${type}')">
                        <span>Eco Fly</span>
                        <span>${f.eco} ₺</span>
                    </button>
                    <button class="class-btn class-bus" onclick="selectFlightOption('${type}')">
                        <span>Business</span>
                        <span>${f.bus} ₺</span>
                    </button>
                </div>
            </div>
        `;
    });
}

function selectFlightOption(type) {
    if (type === 'outbound') {
        bookingState = 'inbound';
        showFlightSelection();
    } else if (type === 'inbound') {
        bookingState = 'confirm';
        showFlightSelection();
    }
}

// BOOKING SUCCESS -> SLIDE IN JOURNAL
function confirmFlightBooking() {
    showToast("Biletleme onaylandı. Seyahat Journal'ınız hazırlanıyor!");
    
    // Hide flight layer
    document.getElementById('flight-selection-layer').classList.remove('active');

    // Generate Itinerary
    currentItinerary = generateRouteForPort(currentDest, totalPlannedDays);

    // Render Journal & Map Pins
    renderDaysTabs();
    renderJournalDay(1); // Default Day 1

    // Slide in sidebar
    setTimeout(() => {
        document.getElementById('journal-sidebar').classList.add('active');
    }, 300);
}

// RENDERING JOURNAL
function renderDaysTabs() {
    const container = document.getElementById('days-tabs-container');
    container.innerHTML = '';
    
    // Overview
    const allTab = document.createElement('button');
    allTab.className = 'day-pill active';
    allTab.textContent = 'Tüm Rota';
    allTab.onclick = () => {
        document.querySelectorAll('.day-pill').forEach(el => el.classList.remove('active'));
        allTab.classList.add('active');
        renderJournalDay('all');
    };
    container.appendChild(allTab);

    // Days
    for(let i=1; i<=totalPlannedDays; i++) {
        const dTab = document.createElement('button');
        dTab.className = 'day-pill';
        dTab.textContent = `${i}. Gün`;
        dTab.onclick = () => {
            document.querySelectorAll('.day-pill').forEach(el => el.classList.remove('active'));
            dTab.classList.add('active');
            renderJournalDay(i);
        };
        container.appendChild(dTab);
    }
}

function renderJournalDay(dayNumber) {
    const container = document.getElementById('places-container');
    container.innerHTML = '';
    let mapPlaces = [];

    if(dayNumber === 'all') {
        currentItinerary.forEach(d => {
            container.innerHTML += `<h4 style="margin: 1rem 0; color:var(--thy-red);">${d.day}. Gün</h4>`;
            d.places.forEach(p => { container.innerHTML += buildPremiumCard(p); mapPlaces.push(p); });
        });
    } else {
        const d = currentItinerary.find(x => x.day === dayNumber);
        if(d) d.places.forEach(p => { container.innerHTML += buildPremiumCard(p); mapPlaces.push(p); });
    }

    renderMapPins(mapPlaces);
}

function buildPremiumCard(place) {
    const starsHtml = '⭐'.repeat(Math.floor(place.rating)) + (place.rating % 1 !== 0 ? '✨' : '');
    return `
        <div class="premium-place-card">
            <img src="${place.imageUrl}" alt="${place.name}" class="place-image">
            <div class="place-details" style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div class="place-name">${place.name}</div>
                    <div style="font-size:0.75rem; font-weight:600; color:var(--thy-red); background:rgba(232,25,50,0.1); padding:2px 6px; border-radius:4px;">
                        ${place.addedBy} ekledi
                    </div>
                </div>
                
                <div style="font-size:0.8rem; color:#B8860B; margin-bottom:0.5rem; font-weight:600;">
                    ${starsHtml} <span style="color:var(--thy-grey-text); font-weight:normal;">(${place.rating} TripAdvisor)</span>
                </div>

                <p style="font-size:0.85rem; color:var(--thy-grey-text); margin-bottom:0.75rem; line-height:1.4;">
                    <i class="ph-fill ph-quotes" style="color:var(--thy-red);"></i> ${place.recommendation}
                </p>

                <div class="place-meta">
                    <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px;"><i class="ph ph-clock"></i> ${place.duration}</span>
                    <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px;"><i class="ph ph-tag"></i> ${place.category}</span>
                </div>
                
                <div style="margin-top:0.75rem; display:flex; align-items:center; gap:0.5rem;">
                    <button class="btn-miles" style="background:#10B981; color:white; border:none; padding:4px 8px; font-size:0.75rem;">
                        <i class="ph-fill ph-plus-circle"></i> 50 Mil Kazan
                    </button>
                    ${place.payWithMiles ? `<button class="btn-miles"><i class="ph-fill ph-coins"></i> ${place.milesCost} Mille Giriş</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

// MAP PINS RENDERING
const thyMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

// En Yakın Komşu Algoritması (Örümcek Ağını Önleme)
function sortPlacesOptimally(places) {
    if(!places || places.length <= 1) return places;
    const sorted = [places[0]];
    const remaining = [...places.slice(1)];
    while(remaining.length > 0) {
        const current = sorted[sorted.length-1];
        let nearestIdx = 0;
        let minDist = Infinity;
        for(let i=0; i<remaining.length; i++) {
            const d = Math.pow(current.coordinates.lat - remaining[i].coordinates.lat, 2) + 
                      Math.pow(current.coordinates.lng - remaining[i].coordinates.lng, 2);
            if(d < minDist) { minDist = d; nearestIdx = i; }
        }
        sorted.push(remaining.splice(nearestIdx, 1)[0]);
    }
    return sorted;
}

// Matematiksel Bezier Kavis Üretici Algoritma (Düz çizgiyi engellemek için)
function getBezierCurve(start, end) {
    const points = [];
    const numPoints = 20;
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    const latDiff = end.lat - start.lat;
    const lngDiff = end.lng - start.lng;
    const offset = 0.2; 
    const ctrlLat = midLat - lngDiff * offset;
    const ctrlLng = midLng + latDiff * offset;

    for(let t = 0; t <= 1; t += 1/numPoints) {
        const lat = (1-t)*(1-t)*start.lat + 2*(1-t)*t*ctrlLat + t*t*end.lat;
        const lng = (1-t)*(1-t)*start.lng + 2*(1-t)*t*ctrlLng + t*t*end.lng;
        points.push([lat, lng]);
    }
    return points;
}

function renderMapPins(places) {
    markersLayer.clearLayers();
    if(places.length === 0) return;

    // Lokasyonları en mantıklı / yakın sıraya sok
    const sortedPlaces = sortPlacesOptimally(places);

    const latlngs = [];
    sortedPlaces.forEach(p => {
        const ll = [p.coordinates.lat, p.coordinates.lng];
        latlngs.push(ll);
        L.marker(ll, {icon: thyMarkerIcon}).bindPopup(`<b>${p.name}</b>`).addTo(markersLayer);
    });

    // Sadece sıralanmış noktalar arası kavisli (Bezier) yayları çiz
    if(latlngs.length > 1) {
        let allCurvePoints = [];
        for(let i=0; i < sortedPlaces.length - 1; i++) {
            const curve = getBezierCurve(sortedPlaces[i].coordinates, sortedPlaces[i+1].coordinates);
            allCurvePoints = allCurvePoints.concat(curve);
        }
        L.polyline(allCurvePoints, { color: '#E81932', weight: 3, dashArray: '8, 8', opacity: 0.8 }).addTo(markersLayer);
        mapInstance.fitBounds(markersLayer.getBounds(), { padding: [50, 50] });
    } else if(latlngs.length === 1) {
        mapInstance.setView(latlngs[0], 14);
    }
}

// MULTI-USER INVITE (EmailJS Integration)
const EMAILJS_SERVICE_ID = 'service_8oc4sw9';
const EMAILJS_TEMPLATE_ID = 'template_y1ch11o';

function handleInviteSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('invite-email');
    const email = emailInput.value;
    
    document.getElementById('invite-modal-premium').classList.remove('active');
    
    // 1. Dinamik Davet Linki Oluşturma
    const inviteLink = window.location.origin + window.location.pathname + '?join=true';
    
    // 2. EmailJS Parametreleri
    const templateParams = {
        to_email: email,
        invite_link: inviteLink,
        destination: currentDest,
        message: "THY Seyahat Rotamıza Davetlisiniz! Aşağıdaki linke tıklayarak plana canlı olarak katılabilirsiniz."
    };
    
    // 3. EmailJS ile Gerçek Mail Gönderimi
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            showToast('Davet E-postası Gönderildi!');
            emailInput.value = '';
        }, function(error) {
            showToast('E-posta gönderilemedi. Hata oluştu.');
            console.error('EmailJS Hatası:', error);
        });
}

// UTILS
function resetToSearch() {
    bookingState = 'outbound';
    document.getElementById('journal-sidebar').classList.remove('active');
    document.getElementById('flight-selection-layer').classList.remove('active');
    document.getElementById('search-layer').classList.remove('slide-up');
    markersLayer.clearLayers();
    mapInstance.flyTo([41.2588, 28.7456], 3, { duration: 1 });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = msg;
    toast.style.bottom = '2rem';
    setTimeout(() => toast.style.bottom = '-100px', 4000);
}
