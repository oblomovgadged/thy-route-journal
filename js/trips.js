// trips.js — Trip Management, Departure Board, Invite, Simulation

// ==========================================================================
// MULTI-USER INVITE (EmailJS Integration with Config)
// ==========================================================================
function handleInviteSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('invite-email');
    const email = emailInput.value;
    
    if (typeof emailjs === 'undefined') {
        showToast('E-posta gönderim servisi yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        return;
    }
    
    document.getElementById('invite-modal-premium').classList.remove('active');
    
    if (!activeTripId) {
        activeTripId = generateTripId();
        saveItineraryToStorage();
    }
    
    // === CROSS-DEVICE SHARING FIX (Issue #5) ===
    // Encode trip data into the URL so the recipient can load it without needing same localStorage
    const tripData = {
        origin: currentOrigin,
        dest: currentDest,
        days: totalPlannedDays,
        itinerary: currentItinerary,
        notes: collabNotes
    };
    const encodedData = encodeTripForURL(tripData);
    
    let vLink;
    if (encodedData && encodedData.length < 2000) {
        // Short trips: encode in URL directly
        vLink = window.location.origin + window.location.pathname + '?join=true&trip=' + activeTripId + '&data=' + encodedData;
    } else {
        // Long trips: fallback to trip ID only (same device/browser)
        vLink = window.location.origin + window.location.pathname + '?join=true&trip=' + activeTripId;
    }
    
    // EmailJS Parameters (using config)
    const templateParams = {
        to_email: email,
        invite_link: vLink,
        destination: currentDest,
        message: "THY Seyahat Rotamıza Davetlisiniz! Aşağıdaki linke tıklayarak plana canlı olarak katılabilirsiniz."
    };
    
    emailjs.send(APP_CONFIG.EMAILJS_SERVICE_ID, APP_CONFIG.EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            showToast('Davet E-postası Gönderildi!');
            emailInput.value = '';
        }, function(error) {
            showToast('E-posta gönderilemedi. Hata oluştu.');
            console.error('EmailJS Hatası:', error);
        });
}

// ==========================================================================
// MULTI-TRIP STORAGE AND MANAGEMENT
// ==========================================================================
function saveActiveTripToSavedList() {
    if (!activeTripId) {
        activeTripId = generateTripId();
    }
    saveItineraryToStorage();
    
    try {
        let tripsIndex = [];
        const indexData = localStorage.getItem('thy_trips_index');
        if (indexData) {
            tripsIndex = JSON.parse(indexData);
        }
        
        const exists = tripsIndex.some(t => t.id === activeTripId);
        
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
        const cityName = port ? port.city : currentDest;
        const tripName = `${activeTripId} - ${cityName}`;
        
        if (!exists) {
            tripsIndex.push({
                id: activeTripId,
                name: tripName,
                destination: cityName,
                origin: currentOrigin,
                dest: currentDest,
                days: totalPlannedDays,
                timestamp: Date.now()
            });
            localStorage.setItem('thy_trips_index', JSON.stringify(tripsIndex));
        }
        
        showToast(`"${activeTripId} - ${sanitizeHTML(cityName)}" plan listesine kaydedildi! 💾`);
        updateSavedTripsDropdown();
    } catch (e) {
        console.error("Failed to save trip to index:", e);
        showToast("Plan kaydedilirken hata oluştu.");
    }
}

function updateSavedTripsDropdown() {
    const select = document.getElementById('saved-trips-select');
    if (!select) return;
    
    select.innerHTML = '<option value="">✈ Kayıtlı Rotalarım...</option>';
    
    try {
        const indexData = localStorage.getItem('thy_trips_index');
        if (indexData) {
            const tripsIndex = JSON.parse(indexData);
            tripsIndex.forEach(trip => {
                const option = document.createElement('option');
                option.value = trip.id;
                
                const cityName = trip.destination || trip.dest || 'Bilinmeyen Şehir';
                option.textContent = `${trip.id} - ${cityName}`;
                
                if (trip.id === activeTripId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    } catch (e) {
        console.error("Failed to update saved trips dropdown:", e);
    }
}

function loadSavedTripFromDropdown(tripId) {
    if (!tripId) return;
    
    const storedTripData = localStorage.getItem(tripId);
    if (storedTripData) {
        try {
            const decodedTrip = JSON.parse(storedTripData);
            if (decodedTrip && decodedTrip.itinerary) {
                activeTripId = tripId;
                currentOrigin = decodedTrip.origin || "IST";
                currentDest = decodedTrip.dest || "NRT";
                totalPlannedDays = decodedTrip.days || 3;
                currentItinerary = decodedTrip.itinerary || [];
                collabNotes = decodedTrip.notes || {};
                
                localStorage.setItem(LS_KEYS.ITINERARY, JSON.stringify(currentItinerary));
                localStorage.setItem(LS_KEYS.DEST, currentDest);
                localStorage.setItem(LS_KEYS.ORIGIN, currentOrigin);
                localStorage.setItem(LS_KEYS.DAYS, totalPlannedDays.toString());
                localStorage.setItem(LS_KEYS.NOTES, JSON.stringify(collabNotes));
                localStorage.setItem('thy_active_trip_id', activeTripId);
                
                document.getElementById('search-layer').style.display = 'none';
                document.getElementById('flight-selection-layer').style.display = 'none';
                
                renderDaysTabs();
                renderJournalDay('all');
                startDepartureBoard();
                
                document.body.classList.add('has-active-journal');
                document.getElementById('journal-sidebar').classList.add('active');
                
                if (currentItinerary.length > 0) {
                    let allPlaces = [];
                    currentItinerary.forEach(d => {
                        if (d.places) allPlaces.push(...d.places);
                    });
                    renderMapPins(allPlaces);
                }
                
                const newUrl = window.location.origin + window.location.pathname + '?join=true&trip=' + activeTripId;
                window.history.replaceState({}, document.title, newUrl);
                
                showToast(`"${activeTripId}" seyahati yüklendi! ✈️`);
                updateSavedTripsDropdown();
            }
        } catch (e) {
            console.error("Failed to load saved trip:", e);
            showToast("Plan yüklenirken hata oluştu.");
        }
    } else {
        showToast("Plan verisi bulunamadı.");
    }
}

// ==========================================================================
// RESET TO SEARCH
// ==========================================================================
function resetToSearch() {
    bookingState = 'outbound';
    activeTripId = null;
    localStorage.removeItem('thy_active_trip_id');
    localStorage.removeItem(LS_KEYS.ITINERARY);
    localStorage.removeItem(LS_KEYS.DEST);
    localStorage.removeItem(LS_KEYS.ORIGIN);
    localStorage.removeItem(LS_KEYS.DAYS);
    localStorage.removeItem(LS_KEYS.NOTES);
    
    currentItinerary = [];
    collabNotes = {};
    
    document.body.classList.remove('has-active-journal');
    document.getElementById('journal-sidebar').classList.remove('mobile-map-view');
    document.getElementById('journal-sidebar').classList.remove('active');
    document.getElementById('flight-selection-layer').classList.remove('active');
    document.getElementById('search-layer').classList.remove('slide-up');
    const toggleText = document.getElementById('mobile-toggle-text');
    if (toggleText) {
        toggleText.innerHTML = '🗺️ Haritayı Göster';
    }
    document.getElementById('search-layer').style.display = '';
    document.getElementById('flight-selection-layer').style.display = '';
    
    // Clean up join flow override style
    const overrideStyle = document.getElementById('join-flow-override-style');
    if (overrideStyle) {
        overrideStyle.remove();
    }
    
    if (window.location.search) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
    
    const select = document.getElementById('saved-trips-select');
    if (select) select.value = '';
    
    if (markersLayer && typeof markersLayer.clearLayers === 'function') {
        markersLayer.clearLayers();
    } else {
        clearAllMapObjects();
    }
    
    if (mapInstance && typeof mapInstance.flyTo === 'function') {
        mapInstance.flyTo([APP_CONFIG.DEFAULT_LAT, APP_CONFIG.DEFAULT_LNG], APP_CONFIG.DEFAULT_ZOOM, { duration: 1 });
    }
    stopDepartureBoard();
}

// ==========================================================================
// LIVE DEPARTURE BOARD ENGINE
// ==========================================================================
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
    departureBoardInterval = setInterval(updateBoardTicker, APP_CONFIG.BOARD_INTERVAL);
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

// ==========================================================================
// MULTI-USER SIMULATION ENGINE
// ==========================================================================
function startMultiUserSimulation() {
    if (!isCollaborator) return;
    
    setTimeout(() => {
        if (currentItinerary.length === 0) return;
        
        const dayKey = "1";
        if (!collabNotes[dayKey]) collabNotes[dayKey] = [];
        
        const simulatedNote = {
            id: 'n_sim_' + Math.random().toString(36).substr(2, 9),
            text: "Bölgedeki yerel lezzetleri denemek için harika restoranlar var! 🍜",
            author: "Ali",
            timestamp: Date.now(),
            edited: false
        };
        
        collabNotes[dayKey].push(simulatedNote);
        saveNotesToStorage();
        
        const notesList = document.getElementById(`notes-list-${dayKey}`);
        if (notesList) {
            if (notesList.querySelector('.collab-notes-empty')) {
                notesList.innerHTML = '';
            }
            notesList.innerHTML = collabNotes[dayKey].map(note => buildNoteItem(note, dayKey)).join('');
        }
        updateNoteBadge(dayKey);
        showToast("Ali gruba yeni bir not ekledi! 📝");
    }, APP_CONFIG.SIM_NOTE_DELAY);
    
    setTimeout(() => {
        if (currentItinerary.length === 0) return;
        
        const dayNumber = 1;
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
        const centerLat = port.centerLat || port.lat;
        const centerLng = port.centerLng || port.lng;
        const latOffset = (Math.random() - 0.5) * 0.03;
        const lngOffset = (Math.random() - 0.5) * 0.03;
        
        const simulatedPlace = {
            name: "Yerel Çarşı (Simülasyon)",
            category: "Yemek",
            duration: "2 Saat",
            coordinates: {
                lat: centerLat + latOffset,
                lng: centerLng + lngOffset
            },
            payWithMiles: true,
            milesCost: 1200,
            addedBy: "Ayşe",
            rating: "4.8",
            recommendation: "Geleneksel lezzetleri ve el sanatlarını keşfetmek için harika bir yer.",
            imageUrl: `https://picsum.photos/seed/localmarket/200/200`
        };
        
        const dayData = currentItinerary.find(x => x.day === dayNumber);
        if (dayData) {
            dayData.places.push(simulatedPlace);
            saveItineraryToStorage();
            renderJournalDay(currentViewDay);
            showToast("Ayşe rotaya yeni bir yer ekledi! 📍");
        }
    }, APP_CONFIG.SIM_PLACE_DELAY);
}
