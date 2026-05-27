// utils.js — Utility Functions (Sanitization, Toast, Formatting)

// ==========================================================================
// XSS PROTECTION — HTML Sanitizer
// ==========================================================================
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==========================================================================
// TOAST NOTIFICATION
// ==========================================================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.style.bottom = '2rem';
    setTimeout(() => toast.style.bottom = '-100px', 4000);
}

// ==========================================================================
// AVATAR & FORMATTING UTILS
// ==========================================================================
function getAvatarClass(author) {
    const map = { 'Bora': 'avatar-bora', 'Ayşe': 'avatar-ayse', 'Ali': 'avatar-ali' };
    return map[author] || 'avatar-guest';
}

function getInitials(name) {
    if (!name) return '??';
    return name.substring(0, 2).toUpperCase();
}

function formatNoteTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

// ==========================================================================
// TRIP DATA ENCODING (Cross-Device Sharing — Issue #5 Fix)
// ==========================================================================
function encodeTripForURL(tripData) {
    try {
        const json = JSON.stringify(tripData);
        // Use base64 encoding for URL safety
        return btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
        console.error('Trip encode hatası:', e);
        return null;
    }
}

function decodeTripFromURL(encoded) {
    try {
        const json = decodeURIComponent(escape(atob(encoded)));
        return JSON.parse(json);
    } catch (e) {
        console.error('Trip decode hatası:', e);
        return null;
    }
}

// ==========================================================================
// TRIP EXPORT / IMPORT (Dosya Bazlı Paylaşım)
// ==========================================================================
function exportTripAsJSON() {
    const tripData = {
        version: 1,
        origin: currentOrigin,
        dest: currentDest,
        days: totalPlannedDays,
        itinerary: currentItinerary,
        notes: collabNotes,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(tripData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTripId || 'THY-Trip'}_${currentDest}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Seyahat planı dışa aktarıldı! 📁');
}

function importTripFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data && data.itinerary) {
                currentOrigin = data.origin || 'IST';
                currentDest = data.dest || 'NRT';
                totalPlannedDays = data.days || 3;
                currentItinerary = data.itinerary || [];
                collabNotes = data.notes || {};
                activeTripId = generateTripId();

                saveItineraryToStorage();
                saveNotesToStorage();

                // Auto-register imported trip in the saved trips index (so it appears in dropdown)
                try {
                    let tripsIndex = [];
                    const indexData = localStorage.getItem('thy_trips_index');
                    if (indexData) {
                        tripsIndex = JSON.parse(indexData);
                    }
                    const exists = tripsIndex.some(t => t.id === activeTripId);
                    if (!exists) {
                        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
                        const cityName = port ? port.city : currentDest;
                        tripsIndex.push({
                            id: activeTripId,
                            name: `${activeTripId} - ${cityName}`,
                            destination: cityName,
                            origin: currentOrigin,
                            dest: currentDest,
                            days: totalPlannedDays,
                            timestamp: Date.now()
                        });
                        localStorage.setItem('thy_trips_index', JSON.stringify(tripsIndex));
                        if (typeof updateSavedTripsDropdown === 'function') {
                            updateSavedTripsDropdown();
                        }
                    }
                } catch (e) {
                    console.error("Failed to register imported trip in index:", e);
                }

                // Re-render UI
                renderDaysTabs();
                renderJournalDay('all');
                startDepartureBoard();

                document.getElementById('search-layer').style.display = 'none';
                document.getElementById('flight-selection-layer').style.display = 'none';
                document.body.classList.add('has-active-journal');
                document.getElementById('journal-sidebar').classList.add('active');

                showToast('Seyahat planı içe aktarıldı! ✈️');
            } else {
                showToast('Geçersiz plan dosyası.');
            }
        } catch (err) {
            console.error('Import hatası:', err);
            showToast('Dosya okunamadı. Geçerli bir JSON dosyası seçin.');
        }
    };
    reader.readAsText(file);
}
