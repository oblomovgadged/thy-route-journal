// flights.js — Flight Generation, Ticket Selection, Booking Flow

function showFlightSelection() {
    const layer = document.getElementById('flight-selection-layer');
    layer.classList.add('active');
    const title = document.getElementById('flight-route-title');
    const subtitle = document.getElementById('flight-dates-subtitle');
    const container = document.getElementById('flight-cards-container');
    container.innerHTML = '';

    if (bookingState === 'outbound') {
        title.innerHTML = `${sanitizeHTML(currentOrigin)} <i class="ph ph-airplane-tilt" style="color:var(--thy-red);"></i> ${sanitizeHTML(currentDest)}`;
        subtitle.textContent = 'Gidiş Uçuşunuzu Seçin';
        renderFlightCards(currentOrigin, currentDest, 'outbound');
    } else if (bookingState === 'inbound') {
        title.innerHTML = `${sanitizeHTML(currentDest)} <i class="ph ph-airplane-tilt" style="color:var(--thy-red);"></i> ${sanitizeHTML(currentOrigin)}`;
        subtitle.textContent = 'Dönüş Uçuşunuzu Seçin';
        renderFlightCards(currentDest, currentOrigin, 'inbound');
    } else if (bookingState === 'confirm') {
        title.innerHTML = '<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Uçuşlar Seçildi';
        subtitle.textContent = 'Biletleme tamamlandı. Seyahat planınız oluşturulmaya hazır!';
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
    const numFlights = Math.floor(Math.random() * 3) + 6;
    const timeSlots = [{ start: 1, end: 5 }, { start: 6, end: 11 }, { start: 12, end: 16 }, { start: 17, end: 23 }];

    for (let i = 0; i < numFlights; i++) {
        const slot = timeSlots[i % timeSlots.length];
        const depHour = Math.floor(Math.random() * (slot.end - slot.start + 1)) + slot.start;
        const depMin = Math.floor(Math.random() * 12) * 5;
        let arrHour = (depHour + hours) % 24;
        let arrMin = (depMin + mins) % 60;
        if (arrMin >= 60) { arrMin -= 60; arrHour = (arrHour + 1) % 24; }
        const depStr = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
        const arrStr = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
        const ac = aircrafts[Math.floor(Math.random() * aircrafts.length)];
        flights.push({
            id: `flight-${Math.random().toString(36).substr(2, 9)}`, dep: depStr, arr: arrStr, duration: durationStr,
            no: `TK ${Math.floor(Math.random()*2000)+1000}`, aircraft: ac.type, feature: ac.feature,
            prices: { ecoFly: (basePrice).toLocaleString('tr-TR'), extraFly: (basePrice * 1.3).toLocaleString('tr-TR'), primeFly: (basePrice * 1.6).toLocaleString('tr-TR'), business: (basePrice * 3.5).toLocaleString('tr-TR') },
            miles: { ecoFly: Math.floor(distanceKm * 0.5), extraFly: Math.floor(distanceKm * 0.75), primeFly: Math.floor(distanceKm * 1), business: Math.floor(distanceKm * 2) }
        });
    }
    return flights.sort((a, b) => { const [ah, am] = a.dep.split(':').map(Number); const [bh, bm] = b.dep.split(':').map(Number); return (ah*60+am) - (bh*60+bm); });
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
                        <div class="time-block"><h3>${f.dep}</h3><p>${sanitizeHTML(from)}</p></div>
                        <div class="flight-duration"><span style="font-size:0.8rem; color:var(--thy-grey-text);">${f.duration} Direkt Uçuş</span><i class="ph-fill ph-airplane-right"></i></div>
                        <div class="time-block"><h3>${f.arr}</h3><p>${sanitizeHTML(to)}</p></div>
                    </div>
                    <div class="aircraft-info">
                        <div class="aircraft-badge"><i class="ph-fill ph-airplane"></i> ${f.aircraft}</div>
                        <div class="feature-badge"><i class="ph-fill ph-star"></i> ${f.feature}</div>
                        <div style="font-weight:600; margin-top: 0.5rem; color: var(--thy-grey-text); font-size: 0.85rem;">Sefer: ${f.no}</div>
                    </div>
                    <div class="accordion-icon"><i class="ph ph-caret-down"></i></div>
                </div>
                <div class="flight-card-body" style="display: none;">
                    <h4 style="margin-bottom: 1rem; color: var(--thy-dark-blue);">Sınıf Seçimi</h4>
                    <div class="fare-tabs">
                        <div class="fare-card eco-fly">
                            <div class="fare-header"><h5>Eco Fly</h5></div>
                            <div class="fare-price"><span>${f.prices.ecoFly} ₺</span></div>
                            <ul class="fare-features"><li><i class="ph ph-check"></i> 1 Parça 15 kg Bagaj</li><li><i class="ph ph-x" style="color:var(--thy-red);"></i> Ücretsiz Koltuk Seçimi</li><li><i class="ph ph-x" style="color:var(--thy-red);"></i> Değişiklik/İade</li></ul>
                            <div class="fare-miles">+${f.miles.ecoFly} Mil</div>
                            <button class="fare-select-btn" onclick="selectFlightOption('${type}')"><i class="ph ph-check-circle"></i> Seç</button>
                        </div>
                        <div class="fare-card extra-fly">
                            <div class="fare-header"><h5>ExtraFly</h5></div>
                            <div class="fare-price"><span>${f.prices.extraFly} ₺</span></div>
                            <ul class="fare-features"><li><i class="ph ph-check"></i> 1 Parça 20 kg Bagaj</li><li><i class="ph ph-check"></i> Standart Koltuk Seçimi</li><li><i class="ph ph-x" style="color:var(--thy-red);"></i> Değişiklik/İade</li></ul>
                            <div class="fare-miles">+${f.miles.extraFly} Mil</div>
                            <button class="fare-select-btn" onclick="selectFlightOption('${type}')"><i class="ph ph-check-circle"></i> Seç</button>
                        </div>
                        <div class="fare-card business-fly">
                            <div class="fare-header"><h5>Business</h5></div>
                            <div class="fare-price"><span>${f.prices.business} ₺</span></div>
                            <ul class="fare-features"><li><i class="ph ph-check"></i> 2 Parça 30 kg Bagaj</li><li><i class="ph ph-check"></i> CIP Salon Kullanımı</li><li><i class="ph ph-check"></i> Ücretsiz Değişiklik/İade</li></ul>
                            <div class="fare-miles">+${f.miles.business} Mil</div>
                            <button class="fare-select-btn" onclick="selectFlightOption('${type}')"><i class="ph ph-crown"></i> Seç</button>
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
    document.querySelectorAll('.accordion-card').forEach(c => {
        if(c.id !== id) { c.classList.remove('expanded'); c.querySelector('.flight-card-body').style.display = 'none'; const otherIcon = c.querySelector('.accordion-icon i'); if (otherIcon) { otherIcon.classList.remove('ph-caret-up'); otherIcon.classList.add('ph-caret-down'); } }
    });
    if (card.classList.contains('expanded')) { card.classList.remove('expanded'); body.style.display = 'none'; icon.classList.remove('ph-caret-up'); icon.classList.add('ph-caret-down'); }
    else { card.classList.add('expanded'); body.style.display = 'block'; icon.classList.remove('ph-caret-down'); icon.classList.add('ph-caret-up'); }
}

function selectFlightOption(type) {
    if (type === 'outbound') { bookingState = 'inbound'; showFlightSelection(); }
    else if (type === 'inbound') { bookingState = 'confirm'; showFlightSelection(); }
}

function confirmFlightBooking() {
    const code = String(currentDest).toUpperCase();
    if (dynamicSuggestions[code] === 'loading') {
        showToast("Şehir detayları ve rotanız hazırlanıyor... ✈️");
        setTimeout(() => {
            confirmFlightBooking();
        }, 800);
        return;
    }

    showToast("Biletleme onaylandı. Seyahat Journal'ınız hazırlanıyor!");
    document.getElementById('flight-selection-layer').classList.remove('active');
    document.getElementById('flight-selection-layer').style.display = 'none';
    document.getElementById('search-layer').style.display = 'none';
    currentItinerary = generateRouteForPort(currentDest, totalPlannedDays);
    activeTripId = generateTripId();
    saveItineraryToStorage();
    try {
        let tripsIndex = []; const indexData = localStorage.getItem('thy_trips_index'); if (indexData) { tripsIndex = JSON.parse(indexData); }
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0]; const cityName = port ? port.city : currentDest;
        tripsIndex.push({ id: activeTripId, name: `${activeTripId} - ${cityName}`, destination: cityName, origin: currentOrigin, dest: currentDest, days: totalPlannedDays, timestamp: Date.now() });
        localStorage.setItem('thy_trips_index', JSON.stringify(tripsIndex)); updateSavedTripsDropdown();
    } catch (e) { console.error("Failed to auto-register new trip in index:", e); }
    renderDaysTabs(); renderJournalDay('all'); startDepartureBoard();
    document.body.classList.add('has-active-journal');
    setTimeout(() => { document.getElementById('journal-sidebar').classList.add('active'); if (isCollaborator) { startMultiUserSimulation(); } }, 300);
}
