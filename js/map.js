// map.js - Real Map Integration with Leaflet.js

let mapInstance = null;
let markersLayer = null;

// Custom THY Red Marker Icon
const thyMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function initRealMap() {
    // Sadece ilk seferde oluştur
    if (!mapInstance) {
        mapInstance = L.map('map-container').setView([35.6895, 139.6917], 12); // Default Tokyo
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            maxZoom: 19
        }).addTo(mapInstance);

        markersLayer = L.featureGroup().addTo(mapInstance);
    }
}

function renderMapSim(places, day) {
    if (!mapInstance) initRealMap();
    
    // Temizle
    markersLayer.clearLayers();
    
    if (!places || places.length === 0) return;

    const latlngs = [];

    // Yeni pinleri ekle
    places.forEach((place) => {
        if (place.coordinates) {
            const latlng = [place.coordinates.lat, place.coordinates.lng];
            latlngs.push(latlng);
            
            const marker = L.marker(latlng, { icon: thyMarkerIcon }).bindPopup(`<b>${place.name}</b><br>${place.category}`);
            markersLayer.addLayer(marker);
        }
    });

    // Pinler arasında rota (Polyline) çiz
    if (latlngs.length > 1) {
        L.polyline(latlngs, { color: '#E81932', weight: 3, dashArray: '5, 10' }).addTo(markersLayer);
    }

    // Haritayı tüm pinleri kapsayacak şekilde ayarla
    if (latlngs.length > 0) {
        mapInstance.fitBounds(markersLayer.getBounds(), { padding: [50, 50] });
    }
}
