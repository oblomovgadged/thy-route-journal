// data.js - Massive 100+ Airports Database & Generator

const ALL_PORTS = [
    { code: "IST", city: "Istanbul", country: "Turkey", lat: 41.2588, lng: 28.7456 },
    { code: "SAW", city: "Istanbul Sabiha Gokcen", country: "Turkey", lat: 40.8983, lng: 29.3092 },
    { code: "ESB", city: "Ankara", country: "Turkey", lat: 40.1281, lng: 32.9951 },
    { code: "ADB", city: "Izmir", country: "Turkey", lat: 38.2892, lng: 27.1570 },
    { code: "AYT", city: "Antalya", country: "Turkey", lat: 36.8987, lng: 30.8005 },
    { code: "JFK", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781 },
    { code: "EWR", city: "New York Newark", country: "USA", lat: 40.6895, lng: -74.1745 },
    { code: "LAX", city: "Los Angeles", country: "USA", lat: 33.9416, lng: -118.4085 },
    { code: "SFO", city: "San Francisco", country: "USA", lat: 37.6213, lng: -122.3790 },
    { code: "ORD", city: "Chicago", country: "USA", lat: 41.9742, lng: -87.9073 },
    { code: "MIA", city: "Miami", country: "USA", lat: 25.7959, lng: -80.2870 },
    { code: "IAD", city: "Washington", country: "USA", lat: 38.9531, lng: -77.4565 },
    { code: "BOS", city: "Boston", country: "USA", lat: 42.3656, lng: -71.0096 },
    { code: "DFW", city: "Dallas", country: "USA", lat: 32.8998, lng: -97.0403 },
    { code: "SEA", city: "Seattle", country: "USA", lat: 47.4502, lng: -122.3088 },
    { code: "ATL", city: "Atlanta", country: "USA", lat: 33.6407, lng: -84.4277 },
    { code: "LHR", city: "London", country: "UK", lat: 51.4700, lng: -0.4543 },
    { code: "LGW", city: "London Gatwick", country: "UK", lat: 51.1537, lng: -0.1821 },
    { code: "CDG", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479 },
    { code: "ORY", city: "Paris Orly", country: "France", lat: 48.7262, lng: 2.3652 },
    { code: "FRA", city: "Frankfurt", country: "Germany", lat: 50.0379, lng: 8.5622 },
    { code: "MUC", city: "Munich", country: "Germany", lat: 48.3537, lng: 11.7861 },
    { code: "BER", city: "Berlin", country: "Germany", lat: 52.3667, lng: 13.5033 },
    { code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lng: 4.7683 },
    { code: "FCO", city: "Rome", country: "Italy", lat: 41.7999, lng: 12.2462 },
    { code: "MXP", city: "Milan", country: "Italy", lat: 45.6301, lng: 8.7255 },
    { code: "VCE", city: "Venice", country: "Italy", lat: 45.5016, lng: 12.3388 },
    { code: "MAD", city: "Madrid", country: "Spain", lat: 40.4839, lng: -3.5680 },
    { code: "BCN", city: "Barcelona", country: "Spain", lat: 41.2974, lng: 2.0833 },
    { code: "ZRH", city: "Zurich", country: "Switzerland", lat: 47.4647, lng: 8.5492 },
    { code: "GVA", city: "Geneva", country: "Switzerland", lat: 46.2370, lng: 6.1092 },
    { code: "VIE", city: "Vienna", country: "Austria", lat: 48.1103, lng: 16.5697 },
    { code: "BRU", city: "Brussels", country: "Belgium", lat: 50.9014, lng: 4.4844 },
    { code: "CPH", city: "Copenhagen", country: "Denmark", lat: 55.6180, lng: 12.6508 },
    { code: "ARN", city: "Stockholm", country: "Sweden", lat: 59.6519, lng: 17.9186 },
    { code: "OSL", city: "Oslo", country: "Norway", lat: 60.1976, lng: 11.1004 },
    { code: "HEL", city: "Helsinki", country: "Finland", lat: 60.3172, lng: 24.9633 },
    { code: "DXB", city: "Dubai", country: "UAE", lat: 25.2532, lng: 55.3657 },
    { code: "AUH", city: "Abu Dhabi", country: "UAE", lat: 24.4330, lng: 54.6511 },
    { code: "DOH", city: "Doha", country: "Qatar", lat: 25.2731, lng: 51.6080 },
    { code: "KWI", city: "Kuwait", country: "Kuwait", lat: 29.2266, lng: 47.9689 },
    { code: "RUH", city: "Riyadh", country: "Saudi Arabia", lat: 24.9576, lng: 46.6988 },
    { code: "JED", city: "Jeddah", country: "Saudi Arabia", lat: 21.6796, lng: 39.1565 },
    { code: "BAH", city: "Manama", country: "Bahrain", lat: 26.2708, lng: 50.6336 },
    { code: "MCT", city: "Muscat", country: "Oman", lat: 23.5933, lng: 58.2844 },
    { code: "AMM", city: "Amman", country: "Jordan", lat: 31.7225, lng: 35.9932 },
    { code: "BEY", city: "Beirut", country: "Lebanon", lat: 33.8209, lng: 35.4884 },
    { code: "TLV", city: "Tel Aviv", country: "Israel", lat: 32.0055, lng: 34.8867 },
    { code: "NRT", city: "Tokyo Narita", country: "Japan", lat: 35.7647, lng: 140.3863 },
    { code: "HND", city: "Tokyo Haneda", country: "Japan", lat: 35.5494, lng: 139.7798 },
    { code: "KIX", city: "Osaka", country: "Japan", lat: 34.4320, lng: 135.2304 },
    { code: "ICN", city: "Seoul", country: "South Korea", lat: 37.4602, lng: 126.4407 },
    { code: "PEK", city: "Beijing", country: "China", lat: 40.0799, lng: 116.6031 },
    { code: "PVG", city: "Shanghai", country: "China", lat: 31.1443, lng: 121.8083 },
    { code: "CAN", city: "Guangzhou", country: "China", lat: 28.1892, lng: 113.2196 },
    { code: "HKG", city: "Hong Kong", country: "Hong Kong", lat: 22.3080, lng: 113.9185 },
    { code: "TPE", city: "Taipei", country: "Taiwan", lat: 25.0797, lng: 121.2342 },
    { code: "SIN", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915 },
    { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lng: 101.7099 },
    { code: "BKK", city: "Bangkok", country: "Thailand", lat: 13.6900, lng: 100.7501 },
    { code: "HKT", city: "Phuket", country: "Thailand", lat: 8.1111, lng: 98.3125 },
    { code: "CGK", city: "Jakarta", country: "Indonesia", lat: -6.1256, lng: 106.6559 },
    { code: "DPS", city: "Bali", country: "Indonesia", lat: -8.7482, lng: 115.1672 },
    { code: "SGN", city: "Ho Chi Minh", country: "Vietnam", lat: 10.8188, lng: 106.6520 },
    { code: "HAN", city: "Hanoi", country: "Vietnam", lat: 21.2212, lng: 105.8072 },
    { code: "MNL", city: "Manila", country: "Philippines", lat: 14.5086, lng: 121.0194 },
    { code: "DEL", city: "New Delhi", country: "India", lat: 28.5562, lng: 77.1000 },
    { code: "BOM", city: "Mumbai", country: "India", lat: 19.0896, lng: 72.8656 },
    { code: "BLR", city: "Bangalore", country: "India", lat: 13.1989, lng: 77.7068 },
    { code: "MAA", city: "Chennai", country: "India", lat: 12.9941, lng: 80.1709 },
    { code: "SYD", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753 },
    { code: "MEL", city: "Melbourne", country: "Australia", lat: -37.6690, lng: 144.8410 },
    { code: "BNE", city: "Brisbane", country: "Australia", lat: -27.3842, lng: 153.1175 },
    { code: "AKL", city: "Auckland", country: "New Zealand", lat: -37.0082, lng: 174.7850 },
    { code: "JNB", city: "Johannesburg", country: "South Africa", lat: -26.1367, lng: 28.2411 },
    { code: "CPT", city: "Cape Town", country: "South Africa", lat: -33.9715, lng: 18.6021 },
    { code: "CAI", city: "Cairo", country: "Egypt", lat: 30.1219, lng: 31.4056 },
    { code: "CMN", city: "Casablanca", country: "Morocco", lat: 33.3673, lng: -7.5898 },
    { code: "ALG", city: "Algiers", country: "Algeria", lat: 36.6910, lng: 3.2154 },
    { code: "TUN", city: "Tunis", country: "Tunisia", lat: 36.8510, lng: 10.2272 },
    { code: "NBO", city: "Nairobi", country: "Kenya", lat: -1.3192, lng: 36.9278 },
    { code: "ADD", city: "Addis Ababa", country: "Ethiopia", lat: 8.9779, lng: 38.7993 },
    { code: "LOS", city: "Lagos", country: "Nigeria", lat: 6.5774, lng: 3.3215 },
    { code: "ACC", city: "Accra", country: "Ghana", lat: 5.6052, lng: -0.1668 },
    { code: "GRU", city: "Sao Paulo", country: "Brazil", lat: -23.4356, lng: -46.4731 },
    { code: "GIG", city: "Rio de Janeiro", country: "Brazil", lat: -22.8100, lng: -43.2436 },
    { code: "EZE", city: "Buenos Aires", country: "Argentina", lat: -34.8222, lng: -58.5358 },
    { code: "SCL", city: "Santiago", country: "Chile", lat: -33.3930, lng: -70.7858 },
    { code: "BOG", city: "Bogota", country: "Colombia", lat: 4.7016, lng: -74.1469 },
    { code: "LIM", city: "Lima", country: "Peru", lat: -12.0219, lng: -77.1143 },
    { code: "MEX", city: "Mexico City", country: "Mexico", lat: 19.4361, lng: -99.0719 },
    { code: "CUN", city: "Cancun", country: "Mexico", lat: 21.0365, lng: -86.8771 },
    { code: "PTY", city: "Panama City", country: "Panama", lat: 9.0714, lng: -79.3835 },
    { code: "HAV", city: "Havana", country: "Cuba", lat: 22.9892, lng: -82.4091 },
    { code: "YVR", city: "Vancouver", country: "Canada", lat: 49.1967, lng: -123.1815 },
    { code: "YYZ", city: "Toronto", country: "Canada", lat: 43.6777, lng: -79.6248 },
    { code: "YUL", city: "Montreal", country: "Canada", lat: 45.4706, lng: -73.7408 }
];

// Returns an array of strings like "Tokyo (NRT)"
const ALL_PORT_STRINGS = ALL_PORTS.map(p => `${p.city} (${p.code})`);

// Dynamic Route Generator Function based on coordinates
function generateRouteForPort(iataCode, days) {
    const port = ALL_PORTS.find(p => p.code === iataCode) || ALL_PORTS[0]; // fallback IST
    
    let generatedItinerary = [];
    const categories = ["Kültür", "Doğa", "Şehir", "Sanat", "Eğlence", "Yemek"];
    const placesNames = ["Meydanı", "Tarihi Müzesi", "Yerel Restoranı", "Büyük Parkı", "Sanat Galerisi", "Seyir Terası", "Tarihi Kalesi", "Botanik Bahçesi", "Merkez Caddesi", "Nehir Kenarı"];
    const recommendations = ["Burada kesinlikle yöresel kahve içmelisiniz.", "Akşam üstü manzarası harika oluyor.", "TripAdvisor Gurme Seçimi! Enfes bir akşam yemeği.", "Sessiz, sakin ve tarih dolu bir lokasyon.", "Sosyal medya için harika fotoğraf kareleri yakalayabilirsiniz.", "Bu lokasyonu keşfederken +50 Mil kazanın!"];
    const users = ['Bora', 'Ayşe', 'Ali'];

    for (let i = 1; i <= days; i++) {
        let dailyPlaces = [];
        let placesPerDay = Math.floor(Math.random() * 2) + 2; 

        for (let j = 0; j < placesPerDay; j++) {
            let latOffset = (Math.random() - 0.5) * 0.05; 
            let lngOffset = (Math.random() - 0.5) * 0.05;
            const placeName = `${port.city} ${placesNames[Math.floor(Math.random() * placesNames.length)]} ${i}-${j}`;
            
            dailyPlaces.push({
                "name": placeName,
                "category": categories[Math.floor(Math.random() * categories.length)],
                "duration": `${Math.floor(Math.random() * 3) + 1} Saat`,
                "coordinates": { lat: port.lat + latOffset, lng: port.lng + lngOffset },
                "payWithMiles": Math.random() > 0.5,
                "milesCost": Math.floor(Math.random() * 10 + 5) * 100,
                "addedBy": users[Math.floor(Math.random() * users.length)],
                "rating": (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
                "recommendation": recommendations[Math.floor(Math.random() * recommendations.length)],
                "imageUrl": `https://picsum.photos/seed/${port.code}${i}${j}/200/200`
            });
        }

        generatedItinerary.push({
            day: i,
            title: `${i}. Gün Keşfi`,
            places: dailyPlaces
        });
    }

    return generatedItinerary;
}
