// init.js — Application Entry Point, Event Listeners, URL Handler

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with config
    if (typeof emailjs !== 'undefined') {
        emailjs.init(APP_CONFIG.EMAILJS_PUBLIC_KEY);
    }

    // Initialize map
    initFluidMap();

    // Load saved notes
    loadNotesFromStorage();

    // Setup autocomplete for origin/destination inputs
    setupLiveAutocomplete('origin-input', 'origin-autocomplete');
    setupLiveAutocomplete('dest-input', 'dest-autocomplete');

    // Set default search dates
    const outboundInput = document.getElementById('outbound-date');
    const inboundInput = document.getElementById('inbound-date');
    if (outboundInput && inboundInput) {
        const today = new Date();
        const future = new Date(today);
        future.setDate(today.getDate() + 3); 
        outboundInput.valueAsDate = today;
        inboundInput.valueAsDate = future;
    }

    // Search form submit
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSearchSubmit();
        });
    }

    // Invite form
    const inviteForm = document.getElementById('premium-invite-form');
    if (inviteForm) inviteForm.addEventListener('submit', handleInviteSubmit);

    // Saved trips dropdown
    const savedTripsSelect = document.getElementById('saved-trips-select');
    if (savedTripsSelect) {
        savedTripsSelect.addEventListener('change', function() {
            loadSavedTripFromDropdown(this.value);
        });
    }

    // Export trip button
    const exportBtn = document.getElementById('export-trip-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportTripAsJSON);

    // Import trip button
    const importBtn = document.getElementById('import-trip-btn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                if (e.target.files[0]) importTripFromJSON(e.target.files[0]);
            };
            input.click();
        });
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('journal-sidebar');
            const toggleText = document.getElementById('mobile-toggle-text');
            if (sidebar.classList.contains('mobile-map-view')) {
                sidebar.classList.remove('mobile-map-view');
                if (toggleText) toggleText.innerHTML = '🗺️ Haritayı Göster';
            } else {
                sidebar.classList.add('mobile-map-view');
                if (toggleText) toggleText.innerHTML = '📋 Planı Göster';
            }
        });
    }

    // Invite modal open/close
    const openInviteBtn = document.getElementById('btn-open-invite');
    const closeInviteBtn = document.getElementById('btn-close-invite');
    const inviteModal = document.getElementById('invite-modal-premium');
    if (openInviteBtn && inviteModal) {
        openInviteBtn.addEventListener('click', () => inviteModal.classList.add('active'));
    }
    if (closeInviteBtn && inviteModal) {
        closeInviteBtn.addEventListener('click', () => inviteModal.classList.remove('active'));
    }

    // Complete route button
    const completeBtn = document.getElementById('btn-complete-route');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            if (typeof confetti === 'function') { confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); }
            showToast('🎉 Tebrikler! Rotanız tamamlandı. 500 Mil kazandınız!');
        });
    }

    // === CROSS-DEVICE URL HANDLER (Issue #5 Fix) ===
    const urlParams = new URLSearchParams(window.location.search);
    const isJoin = urlParams.get('join') === 'true';
    const tripIdFromUrl = urlParams.get('trip');
    const tripDataFromUrl = urlParams.get('data');

    if (isJoin && tripDataFromUrl) {
        // Cross-device: decode trip data from URL
        isCollaborator = true;
        const decoded = decodeTripFromURL(tripDataFromUrl);
        if (decoded && decoded.itinerary) {
            currentOrigin = decoded.origin || 'IST';
            currentDest = decoded.dest || 'NRT';
            totalPlannedDays = decoded.days || 3;
            currentItinerary = decoded.itinerary;
            collabNotes = decoded.notes || {};
            activeTripId = tripIdFromUrl || generateTripId();

            saveItineraryToStorage();
            saveNotesToStorage();

            document.getElementById('search-layer').style.display = 'none';
            renderDaysTabs();
            renderJournalDay('all');
            startDepartureBoard();
            document.body.classList.add('has-active-journal');
            setTimeout(() => {
                document.getElementById('journal-sidebar').classList.add('active');
                startMultiUserSimulation();
            }, 300);
            showToast(`Seyahat planına katıldınız! Trip: ${activeTripId}`);
        } else {
            showToast('Davet linki geçersiz veya süresi dolmuş.');
        }
    } else if (isJoin && tripIdFromUrl) {
        // Same-device join via trip ID
        isCollaborator = true;
        activeTripId = tripIdFromUrl;
        const storedData = localStorage.getItem(tripIdFromUrl);
        if (storedData) {
            try {
                const d = JSON.parse(storedData);
                currentOrigin = d.origin || 'IST';
                currentDest = d.dest || 'NRT';
                totalPlannedDays = d.days || 3;
                currentItinerary = d.itinerary || [];
                collabNotes = d.notes || {};
            } catch(e) { console.warn('Trip parse error:', e); }
        } else if (loadItineraryFromStorage()) {
            // Fallback to general localStorage
        }

        loadNotesFromStorage();
        document.getElementById('search-layer').style.display = 'none';
        renderDaysTabs();
        renderJournalDay('all');
        startDepartureBoard();
        document.body.classList.add('has-active-journal');
        setTimeout(() => {
            document.getElementById('journal-sidebar').classList.add('active');
            startMultiUserSimulation();
        }, 300);
    }

    // Update saved trips dropdown
    updateSavedTripsDropdown();

    // PWA Install Banner Actions
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');
    const banner = document.getElementById('pwa-install-banner');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredInstallPrompt) return;
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('THY Route ana ekranınıza eklendi! ✈️');
            }
            deferredInstallPrompt = null;
            if (banner) banner.classList.remove('visible');
        });
    }
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (banner) banner.classList.remove('visible');
            localStorage.setItem('thy_pwa_dismissed', Date.now().toString());
        });
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registered, scope:', reg.scope))
            .catch(err => console.error('SW registration failed:', err));
    }
});

// ==========================================================================
// LIVE AUTOCOMPLETE
// ==========================================================================
function setupLiveAutocomplete(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    if (!input || !list) return;

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase().trim();
        list.innerHTML = '';
        if (val.length < 1) { list.classList.remove('active'); return; }
        const matches = ALL_PORT_STRINGS.filter(s => s.toLowerCase().includes(val)).slice(0, 8);
        if (matches.length === 0) { list.classList.remove('active'); return; }
        matches.forEach(m => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = m;
            item.addEventListener('click', () => {
                input.value = m;
                list.classList.remove('active');
            });
            list.appendChild(item);
        });
        list.classList.add('active');
    });

    input.addEventListener('blur', () => {
        setTimeout(() => list.classList.remove('active'), 200);
    });
}

// ==========================================================================
// SEARCH HANDLER
// ==========================================================================
function handleSearchSubmit() {
    const originVal = document.getElementById('origin-input').value;
    const destVal = document.getElementById('dest-input').value;
    const outboundVal = document.getElementById('outbound-date').value;
    const inboundVal = document.getElementById('inbound-date').value;

    const originPort = ALL_PORTS.find(p => originVal.includes(p.code) || originVal.includes(p.city));
    const destPort = ALL_PORTS.find(p => destVal.includes(p.code) || destVal.includes(p.city));

    if (!originPort || !destPort) {
        showToast('Lütfen geçerli bir kalkış ve varış noktası seçin.');
        return;
    }
    if (originPort.code === destPort.code) {
        showToast('Kalkış ve varış noktası aynı olamaz.');
        return;
    }

    if (!outboundVal || !inboundVal) {
        showToast('Lütfen gidiş ve dönüş tarihlerini seçin.');
        return;
    }

    const outbound = new Date(outboundVal);
    const inbound = new Date(inboundVal);

    if (isNaN(outbound.getTime()) || isNaN(inbound.getTime())) {
        showToast('Geçersiz tarih formatı.');
        return;
    }

    if (inbound < outbound) {
        showToast('Dönüş tarihi gidiş tarihinden önce olamaz.');
        return;
    }

    currentOrigin = originPort.code;
    currentDest = destPort.code;
    totalPlannedDays = Math.max(1, Math.ceil(Math.abs(inbound - outbound) / (1000 * 60 * 60 * 24)) + 1);
    bookingState = 'outbound';

    // Start background fetching of OSM POIs for custom destination immediately
    const code = destPort.code.toUpperCase();
    let dbKey = code;
    if (code === "SAW") dbKey = "IST";
    if (code === "HND") dbKey = "NRT";
    if (code === "ORY") dbKey = "CDG";
    if (!CURATED_DISTRICTS[dbKey] && !dynamicSuggestions[code]) {
        dynamicSuggestions[code] = 'loading';
        const centerLat = destPort.centerLat || destPort.lat;
        const centerLng = destPort.centerLng || destPort.lng;
        fetchRealPOIFromGoogle(centerLat, centerLng).then(pois => {
            dynamicSuggestions[code] = pois;
            console.log(`Pre-fetched ${pois.length} Google POIs for ${code}`);
        }).catch(err => {
            console.error(`Google Pre-fetch failed for ${code}:`, err);
            dynamicSuggestions[code] = [];
        });
    }

    // Slide search up
    document.getElementById('search-layer').classList.add('slide-up');

    // Smoothly fly map to destination
    const destData = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    if (mapInstance) {
        mapInstance.flyTo([destData.centerLat || destData.lat, destData.centerLng || destData.lng], 13, { duration: 2 });
    }

    // Show flight selection
    setTimeout(() => {
        showFlightSelection();
    }, 600);
}

// ==========================================================================
// PWA INSTALLATION PROMPT
// ==========================================================================
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    
    const dismissedAt = localStorage.getItem('thy_pwa_dismissed');
    if (dismissedAt) {
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(dismissedAt) < sevenDays) return;
    }
    
    setTimeout(() => {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.add('visible');
    }, 3000);
});

window.addEventListener('appinstalled', () => {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.classList.remove('visible');
    deferredInstallPrompt = null;
    console.log('THY Route PWA installed successfully!');
});
