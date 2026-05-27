// state.js — Shared Application State & LocalStorage Persistence

// ==========================================================================
// GLOBAL STATE VARIABLES
// ==========================================================================
let mapInstance = null;
let markersLayer = null;
let currentOrigin = "IST";
let currentDest = "NRT";
let totalPlannedDays = 3;
let currentItinerary = [];
let bookingState = 'outbound';
let departureBoardInterval = null;

// Multi-User / Collaboration State
let isCollaborator = false;
let currentViewDay = 'all';
let collabNotes = {};
let activeTripId = null;

// ==========================================================================
// LOCALSTORAGE KEYS
// ==========================================================================
const LS_KEYS = {
    ITINERARY: 'thy_route_itinerary',
    NOTES: 'thy_route_collab_notes',
    DEST: 'thy_route_dest',
    ORIGIN: 'thy_route_origin',
    DAYS: 'thy_route_days'
};

// ==========================================================================
// TRIP ID GENERATOR
// ==========================================================================
function generateTripId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${APP_CONFIG.TRIP_PREFIX}-${num}`;
}

// ==========================================================================
// LOCALSTORAGE PERSISTENCE
// ==========================================================================
function saveItineraryToStorage() {
    try {
        localStorage.setItem(LS_KEYS.ITINERARY, JSON.stringify(currentItinerary));
        localStorage.setItem(LS_KEYS.DEST, currentDest);
        localStorage.setItem(LS_KEYS.ORIGIN, currentOrigin);
        localStorage.setItem(LS_KEYS.DAYS, totalPlannedDays.toString());
        
        if (activeTripId) {
            const tripData = {
                origin: currentOrigin,
                dest: currentDest,
                days: totalPlannedDays,
                itinerary: currentItinerary,
                notes: collabNotes
            };
            localStorage.setItem(activeTripId, JSON.stringify(tripData));
            localStorage.setItem('thy_active_trip_id', activeTripId);
        }
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
            activeTripId = localStorage.getItem('thy_active_trip_id') || activeTripId;
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

// ==========================================================================
// USER IDENTITY
// ==========================================================================
function getCurrentUser() {
    return isCollaborator ? 'Misafir' : 'Bora';
}
