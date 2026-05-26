// app.js - Full Premium Flow: Search -> Ticket Booking -> Journal
// + Collaborative Notes, Route Editing, Multi-User Simulation

let mapInstance = null;
let markersLayer = null;

let currentOrigin = "IST";
let currentDest = "NRT";
let totalPlannedDays = 3;
let currentItinerary = [];
let bookingState = 'outbound';
let departureBoardInterval = null;

// ============================
// MULTI-USER / COLLABORATION STATE
// ============================
let isCollaborator = false;
let currentViewDay = 'all'; // Track which day tab is active
let collabNotes = {}; // { "1": [{id, text, author, timestamp, edited}], "2": [...] }

// ============================
// LOCALSTORAGE PERSISTENCE LAYER
// ============================
const LS_KEYS = {
    ITINERARY: 'thy_route_itinerary',
    NOTES: 'thy_route_collab_notes',
    DEST: 'thy_route_dest',
    ORIGIN: 'thy_route_origin',
    DAYS: 'thy_route_days'
};

function saveItineraryToStorage() {
    try {
        localStorage.setItem(LS_KEYS.ITINERARY, JSON.stringify(currentItinerary));
        localStorage.setItem(LS_KEYS.DEST, currentDest);
        localStorage.setItem(LS_KEYS.ORIGIN, currentOrigin);
        localStorage.setItem(LS_KEYS.DAYS, totalPlannedDays.toString());
    } catch(e) { console.warn('localStorage kaydetme hatası:', e); }
}

function loadItineraryFromStorage() {
    try {
        const data = localStorage.getItem(LS_KEYS.ITINERARY);
        if (data) {
            currentItinerary = JSON.parse(data);
            currentDest = localStorage.getItem(LS_KEYS.DEST) || currentDest;
            currentOrigin = localStorage.getItem(LS_KEYS.ORIGIN) || currentOrigin;
            totalPlannedDays = parseInt(localStorage.getItem(LS_KEYS.DAYS)) || totalPlannedDays;
            return true;
        }
    } catch(e) { console.warn('localStorage okuma hatası:', e); }
    return false;
}

function saveNotesToStorage() {
    try {
        localStorage.setItem(LS_KEYS.NOTES, JSON.stringify(collabNotes));
    } catch(e) { console.warn('Not kaydetme hatası:', e); }
}

function loadNotesFromStorage() {
    try {
        const data = localStorage.getItem(LS_KEYS.NOTES);
        if (data) {
            collabNotes = JSON.parse(data);
            return true;
        }
    } catch(e) { console.warn('Not okuma hatası:', e); }
    return false;
}

function getCurrentUser() {
    return isCollaborator ? 'Misafir' : 'Bora';
}

function getAvatarClass(author) {
    const map = { 'Bora': 'avatar-bora', 'Ayşe': 'avatar-ayse', 'Ali': 'avatar-ali' };
    return map[author] || 'avatar-guest';
}

function getInitials(name) {
    return name.substring(0, 2).toUpperCase();
}

function formatNoteTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

// ============================
// DOMContentLoaded - INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
    // Check for ?join=true in URL to show online indicator + enable collab
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('join') === 'true') {
        isCollaborator = true;
        const indicator = document.getElementById('online-indicator');
        if(indicator) indicator.style.display = 'block';
    }

    // Load saved notes
    loadNotesFromStorage();

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

    // If collaborator joins and there's saved data, auto-open journal
    if (isCollaborator) {
        const hasData = loadItineraryFromStorage();
        if (hasData && currentItinerary.length > 0) {
            document.getElementById('search-layer').classList.add('slide-up');
            renderDaysTabs();
            renderJournalDay('all');
            startDepartureBoard();
            setTimeout(() => {
                document.getElementById('journal-sidebar').classList.add('active');
                showToast('Ortak plana başarıyla katıldınız! 🎉');
            }, 500);
        }
    }
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

function generateRealisticFlights(from, to) {
    const originData = ALL_PORTS.find(p => p.code === from) || ALL_PORTS[0];
    const destData = ALL_PORTS.find(p => p.code === to) || ALL_PORTS[0];
    
    // Calculate pseudo-distance for flight duration (rough estimate)
    const latDiff = originData.lat - destData.lat;
    const lngDiff = originData.lng - destData.lng;
    const distanceKm = Math.sqrt(latDiff*latDiff + lngDiff*lngDiff) * 111; 
    let durationMins = Math.max(60, Math.floor(distanceKm / 12)); 
    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;
    const durationStr = `${hours}sa ${mins}dk`;

    const basePrice = Math.max(1500, Math.floor(distanceKm * 2.5));

    const aircrafts = [
        { type: 'Airbus A350-900', feature: 'Wi-Fi ve 4K Geniş Ekran' },
        { type: 'Boeing 787-9 Dreamliner', feature: 'Geniş Camlar ve Wi-Fi' },
        { type: 'Airbus A330', feature: 'Uçak İçi Eğlence Sistemi' }
    ];

    const flights = [];
    const numFlights = Math.floor(Math.random() * 3) + 6; // 6 to 8 flights
    
    // Spread across different times of the day
    const timeSlots = [
        { start: 1, end: 5 },   // Gece
        { start: 6, end: 11 },  // Sabah
        { start: 12, end: 16 }, // Öğle
        { start: 17, end: 23 }  // Akşam
    ];

    for (let i = 0; i < numFlights; i++) {
        const slot = timeSlots[i % timeSlots.length];
        const depHour = Math.floor(Math.random() * (slot.end - slot.start + 1)) + slot.start;
        const depMin = Math.floor(Math.random() * 12) * 5; // intervals of 5 mins
        
        let arrHour = (depHour + hours) % 24;
        let arrMin = (depMin + mins) % 60;
        if (arrMin >= 60) {
            arrMin -= 60;
            arrHour = (arrHour + 1) % 24;
        }

        const depStr = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
        const arrStr = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
        
        const ac = aircrafts[Math.floor(Math.random() * aircrafts.length)];

        flights.push({
            id: `flight-${Math.random().toString(36).substr(2, 9)}`,
            dep: depStr,
            arr: arrStr,
            duration: durationStr,
            no: `TK ${Math.floor(Math.random()*2000)+1000}`,
            aircraft: ac.type,
            feature: ac.feature,
            prices: {
                ecoFly: (basePrice).toLocaleString('tr-TR'),
                extraFly: (basePrice * 1.3).toLocaleString('tr-TR'),
                primeFly: (basePrice * 1.6).toLocaleString('tr-TR'),
                business: (basePrice * 3.5).toLocaleString('tr-TR')
            },
            miles: {
                ecoFly: Math.floor(distanceKm * 0.5),
                extraFly: Math.floor(distanceKm * 0.75),
                primeFly: Math.floor(distanceKm * 1),
                business: Math.floor(distanceKm * 2)
            }
        });
    }

    // Sort by departure time
    return flights.sort((a, b) => {
        const [ah, am] = a.dep.split(':').map(Number);
        const [bh, bm] = b.dep.split(':').map(Number);
        return (ah*60+am) - (bh*60+bm);
    });
}

function renderFlightCards(from, to, type) {
    const container = document.getElementById('flight-cards-container');
    const flights = generateRealisticFlights(from, to);

    container.innerHTML = '';

    flights.forEach((f) => {
        container.innerHTML += `
            <div class="flight-ticket-card accordion-card" id="${f.id}">
                <div class="flight-card-header" onclick="toggleAccordion('${f.id}')">
                    <div class="flight-times">
                        <div class="time-block">
                            <h3>${f.dep}</h3>
                            <p>${from}</p>
                        </div>
                        <div class="flight-duration">
                            <span style="font-size:0.8rem; color:var(--thy-grey-text);">${f.duration} Direkt Uçuş</span>
                            <i class="ph-fill ph-airplane-right"></i>
                        </div>
                        <div class="time-block">
                            <h3>${f.arr}</h3>
                            <p>${to}</p>
                        </div>
                    </div>
                    
                    <div class="aircraft-info">
                        <div class="aircraft-badge"><i class="ph-fill ph-airplane"></i> ${f.aircraft}</div>
                        <div class="feature-badge"><i class="ph-fill ph-star"></i> ${f.feature}</div>
                        <div style="font-weight:600; margin-top: 0.5rem; color: var(--thy-grey-text); font-size: 0.85rem;">Sefer: ${f.no}</div>
                    </div>

                    <div class="accordion-icon">
                        <i class="ph ph-caret-down"></i>
                    </div>
                </div>

                <div class="flight-card-body" style="display: none;">
                    <h4 style="margin-bottom: 1rem; color: var(--thy-dark-blue);">Sınıf Seçimi</h4>
                    <div class="fare-tabs">
                        <!-- Eco Fly -->
                        <div class="fare-card eco-fly">
                            <div class="fare-header">
                                <h5>Eco Fly</h5>
                            </div>
                            <div class="fare-price">
                                <span>${f.prices.ecoFly} ₺</span>
                            </div>
                            <ul class="fare-features">
                                <li><i class="ph ph-check"></i> 1 Parça 15 kg Bagaj</li>
                                <li><i class="ph ph-x" style="color:var(--thy-red);"></i> Ücretsiz Koltuk Seçimi</li>
                                <li><i class="ph ph-x" style="color:var(--thy-red);"></i> Değişiklik/İade</li>
                            </ul>
                            <div class="fare-miles">+${f.miles.ecoFly} Mil</div>
                            <button class="fare-select-btn" onclick="selectFlightOption('${type}')">
                                <i class="ph ph-check-circle"></i> Seç
                            </button>
                        </div>

                        <!-- ExtraFly -->
                        <div class="fare-card extra-fly">
                            <div class="fare-header">
                                <h5>ExtraFly</h5>
                            </div>
                            <div class="fare-price">
                                <span>${f.prices.extraFly} ₺</span>
                            </div>
                            <ul class="fare-features">
                                <li><i class="ph ph-check"></i> 1 Parça 20 kg Bagaj</li>
                                <li><i class="ph ph-check"></i> Standart Koltuk Seçimi</li>
                                <li><i class="ph ph-x" style="color:var(--thy-red);"></i> Değişiklik/İade</li>
                            </ul>
                            <div class="fare-miles">+${f.miles.extraFly} Mil</div>
                            <button class="fare-select-btn" onclick="selectFlightOption('${type}')">
                                <i class="ph ph-check-circle"></i> Seç
                            </button>
                        </div>

                        <!-- Business -->
                        <div class="fare-card business-fly">
                            <div class="fare-header">
                                <h5>Business</h5>
                            </div>
                            <div class="fare-price">
                                <span>${f.prices.business} ₺</span>
                            </div>
                            <ul class="fare-features">
                                <li><i class="ph ph-check"></i> 2 Parça 30 kg Bagaj</li>
                                <li><i class="ph ph-check"></i> CIP Salon Kullanımı</li>
                                <li><i class="ph ph-check"></i> Ücretsiz Değişiklik/İade</li>
                            </ul>
                            <div class="fare-miles">+${f.miles.business} Mil</div>
                            <button class="fare-select-btn" onclick="selectFlightOption('${type}')">
                                <i class="ph ph-crown"></i> Seç
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function toggleAccordion(id) {
    const card = document.getElementById(id);
    const body = card.querySelector('.flight-card-body');
    const icon = card.querySelector('.accordion-icon i');

    // Close all others
    document.querySelectorAll('.accordion-card').forEach(c => {
        if(c.id !== id) {
            c.classList.remove('expanded');
            c.querySelector('.flight-card-body').style.display = 'none';
            const otherIcon = c.querySelector('.accordion-icon i');
            if (otherIcon) {
                otherIcon.classList.remove('ph-caret-up');
                otherIcon.classList.add('ph-caret-down');
            }
        }
    });

    if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        body.style.display = 'none';
        icon.classList.remove('ph-caret-up');
        icon.classList.add('ph-caret-down');
    } else {
        card.classList.add('expanded');
        body.style.display = 'block';
        icon.classList.remove('ph-caret-down');
        icon.classList.add('ph-caret-up');
    }
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

    // Save to localStorage for multi-user persistence
    saveItineraryToStorage();

    // Render Journal & Map Pins
    renderDaysTabs();
    renderJournalDay('all'); // Default: all days

    // Start Departure Board
    startDepartureBoard();

    // Slide in sidebar
    setTimeout(() => {
        document.getElementById('journal-sidebar').classList.add('active');
    }, 300);
}

// ============================
// RENDERING JOURNAL (ENHANCED)
// ============================
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
        currentViewDay = 'all';
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
            currentViewDay = i;
            renderJournalDay(i);
        };
        container.appendChild(dTab);
    }
}

function renderJournalDay(dayNumber) {
    currentViewDay = dayNumber;
    const container = document.getElementById('places-container');
    container.innerHTML = '';
    let mapPlaces = [];

    if(dayNumber === 'all') {
        currentItinerary.forEach(d => {
            container.innerHTML += `<div class="day-section-header"><i class="ph-fill ph-calendar-blank"></i> ${d.day}. Gün</div>`;
            d.places.forEach((p, idx) => { 
                container.innerHTML += buildPremiumCard(p, d.day, idx, d.places.length); 
                mapPlaces.push(p); 
            });
            // Inline notes accordion after each day's cards
            container.innerHTML += buildInlineNotesAccordion(d.day);
        });
    } else {
        const d = currentItinerary.find(x => x.day === dayNumber);
        if(d) d.places.forEach((p, idx) => { 
            container.innerHTML += buildPremiumCard(p, dayNumber, idx, d.places.length); 
            mapPlaces.push(p); 
        });
        // Inline notes accordion after this day's cards
        container.innerHTML += buildInlineNotesAccordion(dayNumber);
    }

    renderMapPins(mapPlaces);
    attachNotesListeners();
}

// ============================
// PREMIUM CARD WITH ACTIONS (ENHANCED)
// ============================
function buildPremiumCard(place, dayNumber, placeIndex, totalPlaces) {
    // Action buttons HTML
    const actionsHtml = `
        <div class="place-card-actions">
            ${placeIndex > 0 ? `<button class="place-action-btn btn-move" onclick="movePlaceUp(${dayNumber}, ${placeIndex})" title="Yukarı Taşı"><i class="ph-bold ph-arrow-up"></i></button>` : ''}
            ${placeIndex < totalPlaces - 1 ? `<button class="place-action-btn btn-move" onclick="movePlaceDown(${dayNumber}, ${placeIndex})" title="Aşağı Taşı"><i class="ph-bold ph-arrow-down"></i></button>` : ''}
            <button class="place-action-btn btn-delete" onclick="deletePlace(${dayNumber}, ${placeIndex})" title="Mekanı Sil"><i class="ph-bold ph-trash"></i></button>
        </div>
    `;

    return `
        <div class="premium-place-card" id="place-card-${dayNumber}-${placeIndex}">
            ${actionsHtml}
            <img src="${place.imageUrl}" alt="${place.name}" class="place-image">
            <div class="place-details">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.25rem;">
                    <div class="place-name">${place.name}</div>
                    <div style="font-size:0.6rem; font-weight:600; color:var(--thy-red); background:rgba(232,25,50,0.08); padding:1px 5px; border-radius:3px; white-space:nowrap; flex-shrink:0;">
                        ${place.addedBy}
                    </div>
                </div>
                <div class="place-meta" style="margin-top:0.2rem;">
                    <span style="color:#B8860B; font-weight:600; font-size:0.72rem;">★ ${place.rating}</span>
                    <span><i class="ph ph-clock"></i> ${place.duration}</span>
                    <span><i class="ph ph-tag"></i> ${place.category}</span>
                </div>
                <p style="font-size:0.75rem; color:var(--thy-grey-text); margin-top:0.25rem; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                    ${place.recommendation}
                </p>
                <div style="margin-top:0.35rem; display:flex; align-items:center; gap:0.35rem;">
                    <button class="btn-miles" style="background:#10B981; color:white; border:none; padding:2px 6px; font-size:0.65rem;">
                        <i class="ph-fill ph-plus-circle"></i> 50 Mil
                    </button>
                    ${place.payWithMiles ? `<button class="btn-miles" style="padding:2px 6px; font-size:0.65rem;"><i class="ph-fill ph-coins"></i> ${place.milesCost} Mil</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ============================
// ROUTE EDITING (DELETE / MOVE)
// ============================
function deletePlace(dayNumber, placeIndex) {
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (!dayData || !dayData.places[placeIndex]) return;

    // Animate removal
    const cardEl = document.getElementById(`place-card-${dayNumber}-${placeIndex}`);
    if (cardEl) {
        cardEl.classList.add('removing');
        setTimeout(() => {
            // Remove from data
            const removedPlace = dayData.places.splice(placeIndex, 1)[0];
            saveItineraryToStorage();
            showToast(`"${removedPlace.name}" rotadan silindi.`);
            // Re-render current view
            renderJournalDay(currentViewDay);
        }, 350);
    } else {
        dayData.places.splice(placeIndex, 1);
        saveItineraryToStorage();
        renderJournalDay(currentViewDay);
    }
}

function movePlaceUp(dayNumber, placeIndex) {
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (!dayData || placeIndex <= 0) return;

    // Swap
    [dayData.places[placeIndex - 1], dayData.places[placeIndex]] = 
    [dayData.places[placeIndex], dayData.places[placeIndex - 1]];

    saveItineraryToStorage();
    renderJournalDay(currentViewDay);
    showToast('Mekan sıralaması güncellendi ↑');
}

function movePlaceDown(dayNumber, placeIndex) {
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (!dayData || placeIndex >= dayData.places.length - 1) return;

    // Swap
    [dayData.places[placeIndex], dayData.places[placeIndex + 1]] = 
    [dayData.places[placeIndex + 1], dayData.places[placeIndex]];

    saveItineraryToStorage();
    renderJournalDay(currentViewDay);
    showToast('Mekan sıralaması güncellendi ↓');
}

// ============================
// COLLABORATIVE NOTES — INLINE ACCORDION
// ============================
function buildInlineNotesAccordion(dayNumber) {
    const dayKey = String(dayNumber);
    const notes = collabNotes[dayKey] || [];
    const countClass = notes.length === 0 ? 'empty' : '';

    return `
        <div class="collab-notes-section" id="notes-section-${dayKey}">
            <button class="collab-notes-toggle" onclick="toggleNotesAccordion('${dayKey}')" id="notes-toggle-${dayKey}">
                <i class="ph-fill ph-note-pencil" style="color:var(--thy-red); font-size:0.85rem;"></i>
                <span>Ortak Notlar</span>
                <i class="ph ph-caret-down toggle-icon"></i>
                <span class="note-count-badge ${countClass}" id="note-badge-${dayKey}">${notes.length}</span>
            </button>
            <div class="collab-notes-body" id="notes-body-${dayKey}">
                <div class="collab-notes-inner">
                    <div class="collab-note-input-group">
                        <textarea id="note-input-${dayKey}" placeholder="Ekip için bir not yaz..." rows="1"></textarea>
                        <button class="collab-note-add-btn" onclick="addCollabNote(${dayNumber})" title="Not Ekle">
                            <i class="ph-bold ph-plus"></i>
                        </button>
                    </div>
                    <div id="notes-list-${dayKey}">
                        ${notes.length === 0 ? `
                            <div class="collab-notes-empty">
                                <i class="ph ph-note-blank"></i> Henüz not eklenmedi.
                            </div>
                        ` : notes.map(note => buildNoteItem(note, dayKey)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleNotesAccordion(dayKey) {
    const toggle = document.getElementById(`notes-toggle-${dayKey}`);
    const body = document.getElementById(`notes-body-${dayKey}`);
    if (!toggle || !body) return;

    const isOpen = body.classList.contains('open');
    if (isOpen) {
        body.classList.remove('open');
        toggle.classList.remove('open');
    } else {
        body.classList.add('open');
        toggle.classList.add('open');
        // Focus textarea
        const ta = document.getElementById(`note-input-${dayKey}`);
        if (ta) setTimeout(() => ta.focus(), 100);
    }
}

function attachNotesListeners() {
    // Attach Enter key listeners to all note textareas
    for (let i = 1; i <= totalPlannedDays; i++) {
        const dayKey = String(i);
        const textarea = document.getElementById(`note-input-${dayKey}`);
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addCollabNote(i);
                }
            });
        }
    }
}

function buildNoteItem(note, dayKey) {
    const avatarClass = getAvatarClass(note.author);
    const initials = getInitials(note.author);
    const timeStr = formatNoteTime(note.timestamp);
    const editedBadge = note.edited ? ' <span style="font-size:0.6rem; color:#9ca3af;">(düzenlendi)</span>' : '';

    return `
        <div class="collab-note-item" id="note-${note.id}">
            <div class="note-avatar ${avatarClass}">${initials}</div>
            <div class="note-content">
                <div class="note-author">${note.author}${editedBadge}</div>
                <div class="note-text" id="note-text-${note.id}">${note.text}</div>
                <div class="note-time">${timeStr}</div>
            </div>
            <div class="note-actions">
                <button class="note-action-btn note-edit-btn" onclick="startEditNote('${dayKey}', '${note.id}')" title="Düzenle">
                    <i class="ph ph-pencil-simple"></i>
                </button>
                <button class="note-action-btn" onclick="deleteCollabNote('${dayKey}', '${note.id}')" title="Sil">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function addCollabNote(dayNumber) {
    const dayKey = String(dayNumber);
    const textarea = document.getElementById(`note-input-${dayKey}`);
    if (!textarea) return;

    const text = textarea.value.trim();
    if (!text) return;

    // Initialize array if needed
    if (!collabNotes[dayKey]) collabNotes[dayKey] = [];

    const newNote = {
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        text: text,
        author: getCurrentUser(),
        timestamp: Date.now(),
        edited: false
    };

    collabNotes[dayKey].push(newNote);
    saveNotesToStorage();

    // Clear input
    textarea.value = '';

    // Re-render notes for this day
    const notesList = document.getElementById(`notes-list-${dayKey}`);
    if (notesList) {
        notesList.innerHTML = collabNotes[dayKey].map(note => buildNoteItem(note, dayKey)).join('');
    }

    // Update badge count
    updateNoteBadge(dayKey);

    showToast(`Not eklendi — ${dayKey}. Gün`);
}

function deleteCollabNote(dayKey, noteId) {
    if (!collabNotes[dayKey]) return;

    const noteEl = document.getElementById(`note-${noteId}`);
    if (noteEl) {
        noteEl.style.transition = 'all 0.3s ease';
        noteEl.style.opacity = '0';
        noteEl.style.transform = 'translateX(20px)';
        setTimeout(() => {
            collabNotes[dayKey] = collabNotes[dayKey].filter(n => n.id !== noteId);
            saveNotesToStorage();

            const notesList = document.getElementById(`notes-list-${dayKey}`);
            if (notesList) {
                if (collabNotes[dayKey].length === 0) {
                    notesList.innerHTML = `<div class="collab-notes-empty"><i class="ph ph-note-blank"></i>Henüz not eklenmedi.</div>`;
                } else {
                    notesList.innerHTML = collabNotes[dayKey].map(note => buildNoteItem(note, dayKey)).join('');
                }
            }
            updateNoteBadge(dayKey);
        }, 300);
    }
}

function startEditNote(dayKey, noteId) {
    const notes = collabNotes[dayKey];
    if (!notes) return;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const textEl = document.getElementById(`note-text-${noteId}`);
    if (!textEl) return;

    const currentText = note.text;
    textEl.innerHTML = `
        <input type="text" class="note-edit-input" id="note-edit-${noteId}" value="${currentText.replace(/"/g, '&quot;')}" 
               onkeydown="if(event.key==='Enter'){saveEditNote('${dayKey}','${noteId}');} if(event.key==='Escape'){cancelEditNote('${dayKey}','${noteId}','${currentText.replace(/'/g, "\\'")}');}">
    `;
    const editInput = document.getElementById(`note-edit-${noteId}`);
    if (editInput) {
        editInput.focus();
        editInput.select();
    }
}

function saveEditNote(dayKey, noteId) {
    const editInput = document.getElementById(`note-edit-${noteId}`);
    if (!editInput) return;

    const newText = editInput.value.trim();
    if (!newText) return;

    const notes = collabNotes[dayKey];
    if (!notes) return;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    note.text = newText;
    note.edited = true;
    saveNotesToStorage();

    // Re-render
    const notesList = document.getElementById(`notes-list-${dayKey}`);
    if (notesList) {
        notesList.innerHTML = collabNotes[dayKey].map(n => buildNoteItem(n, dayKey)).join('');
    }

    showToast('Not güncellendi ✏️');
}

function cancelEditNote(dayKey, noteId, originalText) {
    const textEl = document.getElementById(`note-text-${noteId}`);
    if (textEl) {
        textEl.textContent = originalText;
    }
}

function updateNoteBadge(dayKey) {
    const badge = document.getElementById(`note-badge-${dayKey}`);
    if (badge) {
        const count = (collabNotes[dayKey] || []).length;
        badge.textContent = count;
        badge.classList.toggle('empty', count === 0);
    }
}

// ============================
// MAP PINS RENDERING (PRESERVED)
// ============================
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
    stopDepartureBoard();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = msg;
    toast.style.bottom = '2rem';
    setTimeout(() => toast.style.bottom = '-100px', 4000);
}

// ============================
// LIVE DEPARTURE BOARD ENGINE
// ============================
const BOARD_STATUSES = [
    { text: 'Biniş Başladı', css: 'status-boarding' },
    { text: 'Kapı Kapanıyor', css: 'status-gate-closing' },
    { text: 'Son Çağrı', css: 'status-last-call' },
    { text: 'Gecikme 15 Dk', css: 'status-delayed' },
    { text: 'Kalkış Yaptı', css: 'status-departed' },
    { text: 'Zamanında', css: 'status-on-time' },
    { text: 'Kapı A12', css: 'status-boarding' },
    { text: 'Kapı B07', css: 'status-on-time' },
    { text: 'Gecikme 30 Dk', css: 'status-delayed' },
    { text: 'Son Çağrı!', css: 'status-last-call' }
];

const BOARD_FLIGHTS = [
    { no: 'TK 1982', dest: 'Tokyo' },
    { no: 'TK 0412', dest: 'Berlin' },
    { no: 'TK 0721', dest: 'New York' },
    { no: 'TK 1852', dest: 'Londra' },
    { no: 'TK 0034', dest: 'Paris' },
    { no: 'TK 2164', dest: 'Dubai' },
    { no: 'TK 1792', dest: 'Roma' },
    { no: 'TK 0068', dest: 'Amsterdam' },
    { no: 'TK 1388', dest: 'Barcelona' },
    { no: 'TK 0070', dest: 'Münih' },
    { no: 'TK 2098', dest: 'Doha' },
    { no: 'TK 0016', dest: 'Chicago' },
    { no: 'TK 0078', dest: 'Zürih' },
    { no: 'TK 1962', dest: 'Seoul' },
    { no: 'TK 0054', dest: 'Viyana' },
    { no: 'TK 2580', dest: 'Singapur' },
    { no: 'TK 0012', dest: 'Washington' },
    { no: 'TK 0800', dest: 'Moskova' },
    { no: 'TK 1920', dest: 'Pekin' },
    { no: 'TK 0764', dest: 'Bangkok' }
];

let boardIndex = 0;

function startDepartureBoard() {
    stopDepartureBoard();
    updateBoardTicker();
    departureBoardInterval = setInterval(updateBoardTicker, 5000);
}

function stopDepartureBoard() {
    if (departureBoardInterval) {
        clearInterval(departureBoardInterval);
        departureBoardInterval = null;
    }
}

function updateBoardTicker() {
    const ticker = document.getElementById('board-ticker');
    if (!ticker) return;

    const flight = BOARD_FLIGHTS[boardIndex % BOARD_FLIGHTS.length];
    const status = BOARD_STATUSES[Math.floor(Math.random() * BOARD_STATUSES.length)];

    ticker.innerHTML = `
        <div class="ticker-row">
            <span class="ticker-flight">${flight.no}</span>
            <span class="ticker-dest">${flight.dest}</span>
            <span class="ticker-status ${status.css}">${status.text}</span>
        </div>
    `;

    boardIndex++;
}
