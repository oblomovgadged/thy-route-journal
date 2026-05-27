// data.js - Massive 100+ Airports Database & Generator

const ALL_PORTS = [
    { code: "IST", city: "Istanbul", country: "Turkey", lat: 41.2588, lng: 28.7456, centerLat: 41.0082, centerLng: 28.9784 },
    { code: "SAW", city: "Istanbul Sabiha Gokcen", country: "Turkey", lat: 40.8983, lng: 29.3092, centerLat: 41.0082, centerLng: 28.9784 },
    { code: "ESB", city: "Ankara", country: "Turkey", lat: 40.1281, lng: 32.9951, centerLat: 39.9334, centerLng: 32.8597 },
    { code: "ADB", city: "Izmir", country: "Turkey", lat: 38.2892, lng: 27.1570, centerLat: 38.4192, centerLng: 27.1287 },
    { code: "AYT", city: "Antalya", country: "Turkey", lat: 36.8987, lng: 30.8005, centerLat: 36.8848, centerLng: 30.7040 },
    { code: "JFK", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781, centerLat: 40.7128, centerLng: -74.0060 },
    { code: "EWR", city: "New York Newark", country: "USA", lat: 40.6895, lng: -74.1745, centerLat: 40.7128, centerLng: -74.0060 },
    { code: "LAX", city: "Los Angeles", country: "USA", lat: 33.9416, lng: -118.4085, centerLat: 34.0522, centerLng: -118.2437 },
    { code: "SFO", city: "San Francisco", country: "USA", lat: 37.6213, lng: -122.3790, centerLat: 37.7749, centerLng: -122.4194 },
    { code: "ORD", city: "Chicago", country: "USA", lat: 41.9742, lng: -87.9073 },
    { code: "MIA", city: "Miami", country: "USA", lat: 25.7959, lng: -80.2870 },
    { code: "IAD", city: "Washington", country: "USA", lat: 38.9531, lng: -77.4565 },
    { code: "BOS", city: "Boston", country: "USA", lat: 42.3656, lng: -71.0096 },
    { code: "DFW", city: "Dallas", country: "USA", lat: 32.8998, lng: -97.0403 },
    { code: "SEA", city: "Seattle", country: "USA", lat: 47.4502, lng: -122.3088 },
    { code: "ATL", city: "Atlanta", country: "USA", lat: 33.6407, lng: -84.4277 },
    { code: "LHR", city: "London", country: "UK", lat: 51.4700, lng: -0.4543, centerLat: 51.5074, centerLng: -0.1278 },
    { code: "LGW", city: "London Gatwick", country: "UK", lat: 51.1537, lng: -0.1821, centerLat: 51.5074, centerLng: -0.1278 },
    { code: "CDG", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479, centerLat: 48.8566, centerLng: 2.3522 },
    { code: "ORY", city: "Paris Orly", country: "France", lat: 48.7262, lng: 2.3652, centerLat: 48.8566, centerLng: 2.3522 },
    { code: "FRA", city: "Frankfurt", country: "Germany", lat: 50.0379, lng: 8.5622, centerLat: 50.1109, centerLng: 8.6821 },
    { code: "MUC", city: "Munich", country: "Germany", lat: 48.3537, lng: 11.7861, centerLat: 48.1351, centerLng: 11.5820 },
    { code: "BER", city: "Berlin", country: "Germany", lat: 52.3667, lng: 13.5033, centerLat: 52.5200, centerLng: 13.4050 },
    { code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lng: 4.7683, centerLat: 52.3676, centerLng: 4.9041 },
    { code: "FCO", city: "Rome", country: "Italy", lat: 41.7999, lng: 12.2462, centerLat: 41.9028, centerLng: 12.4964 },
    { code: "MXP", city: "Milan", country: "Italy", lat: 45.6301, lng: 8.7255, centerLat: 45.4642, centerLng: 9.1900 },
    { code: "VCE", city: "Venice", country: "Italy", lat: 45.5016, lng: 12.3388, centerLat: 45.4408, centerLng: 12.3155 },
    { code: "MAD", city: "Madrid", country: "Spain", lat: 40.4839, lng: -3.5680, centerLat: 40.4168, centerLng: -3.7038 },
    { code: "BCN", city: "Barcelona", country: "Spain", lat: 41.2974, lng: 2.0833, centerLat: 41.3851, centerLng: 2.1734 },
    { code: "ZRH", city: "Zurich", country: "Switzerland", lat: 47.4647, lng: 8.5492, centerLat: 47.3769, centerLng: 8.5417 },
    { code: "GVA", city: "Geneva", country: "Switzerland", lat: 46.2370, lng: 6.1092, centerLat: 46.2044, centerLng: 6.1432 },
    { code: "VIE", city: "Vienna", country: "Austria", lat: 48.1103, lng: 16.5697, centerLat: 48.2082, centerLng: 16.3738 },
    { code: "BRU", city: "Brussels", country: "Belgium", lat: 50.9014, lng: 4.4844 },
    { code: "CPH", city: "Copenhagen", country: "Denmark", lat: 55.6180, lng: 12.6508 },
    { code: "ARN", city: "Stockholm", country: "Sweden", lat: 59.6519, lng: 17.9186 },
    { code: "OSL", city: "Oslo", country: "Norway", lat: 60.1976, lng: 11.1004 },
    { code: "HEL", city: "Helsinki", country: "Finland", lat: 60.3172, lng: 24.9633 },
    { code: "DXB", city: "Dubai", country: "UAE", lat: 25.2532, lng: 55.3657, centerLat: 25.2048, centerLng: 55.2708 },
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
    { code: "NRT", city: "Tokyo Narita", country: "Japan", lat: 35.7647, lng: 140.3863, centerLat: 35.6762, centerLng: 139.6503 },
    { code: "HND", city: "Tokyo Haneda", country: "Japan", lat: 35.5494, lng: 139.7798, centerLat: 35.6762, centerLng: 139.6503 },
    { code: "KIX", city: "Osaka", country: "Japan", lat: 34.4320, lng: 135.2304 },
    { code: "ICN", city: "Seoul", country: "South Korea", lat: 37.4602, lng: 126.4407 },
    { code: "PEK", city: "Beijing", country: "China", lat: 40.0799, lng: 116.6031 },
    { code: "PVG", city: "Shanghai", country: "China", lat: 31.1443, lng: 121.8083 },
    { code: "CAN", city: "Guangzhou", country: "China", lat: 28.1892, lng: 113.2196 },
    { code: "HKG", city: "Hong Kong", country: "Hong Kong", lat: 22.3080, lng: 113.9185 },
    { code: "TPE", city: "Taipei", country: "Taiwan", lat: 25.0797, lng: 121.2342 },
    { code: "SIN", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915, centerLat: 1.3521, centerLng: 103.8198 },
    { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lng: 101.7099 },
    { code: "BKK", city: "Bangkok", country: "Thailand", lat: 13.6900, lng: 100.7501, centerLat: 13.7563, centerLng: 100.5018 },
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
    { code: "SYD", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753, centerLat: -33.8688, centerLng: 151.2093 },
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

// Curated districts with real coordinates and descriptions for top cities
const CURATED_DISTRICTS = {
    "IST": [
        {
            name: "Sultanahmet (Tarihi Yarımada)",
            places: [
                { name: "Ayasofya-i Kebir Cami", category: "Kültür", duration: "2 Saat", lat: 41.0086, lng: 28.9802, recommendation: "Dünya mimarlık tarihinin en büyük şaheserlerinden biri.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300" },
                { name: "Topkapı Sarayı", category: "Kültür", duration: "3 Saat", lat: 41.0115, lng: 28.9834, recommendation: "Osmanlı padişahlarının 400 yıl boyunca resmi ikametgahı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1605121800305-597500abb5a4?w=300" },
                { name: "Yerebatan Sarnıcı", category: "Kültür", duration: "1 Saat", lat: 41.0084, lng: 28.9779, recommendation: "Medusa başları ve sütunlarıyla büyüleyici Bizans sarnıcı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1595844736691-e40df5b12854?w=300" },
                { name: "Sultanahmet Camii", category: "Kültür", duration: "1.5 Saat", lat: 41.0054, lng: 28.9768, recommendation: "Mavi çinileri ve 6 minaresiyle ünlü görkemli cami.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300" }
            ]
        },
        {
            name: "Beyoğlu & Galata",
            places: [
                { name: "Galata Kulesi", category: "Kültür", duration: "1.5 Saat", lat: 41.0256, lng: 28.9742, recommendation: "İstanbul ve Boğaz manzarasını 360 derece izleyebileceğiniz tarihi kule.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300" },
                { name: "İstiklal Caddesi", category: "Şehir", duration: "2 Saat", lat: 41.0336, lng: 28.9772, recommendation: "Tarihi kırmızı tramvayı ve pasajlarıyla Beyoğlu'nun kalbi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300" },
                { name: "İstanbul Modern", category: "Sanat", duration: "2 Saat", lat: 41.0260, lng: 28.9830, recommendation: "Türkiye'nin ilk modern ve çağdaş sanat müzesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300" }
            ]
        },
        {
            name: "Beşiktaş & Ortaköy (Boğaz Hattı)",
            places: [
                { name: "Dolmabahçe Sarayı", category: "Kültür", duration: "2.5 Saat", lat: 41.0392, lng: 29.0008, recommendation: "Boğaz kıyısında konumlanmış muhteşem Osmanlı sarayı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=300" },
                { name: "Ortaköy Camii", category: "Kültür", duration: "1 Saat", lat: 41.0473, lng: 29.0271, recommendation: "Boğaziçi Köprüsü'nün altında barok tarzda inşa edilmiş simge yapı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1605121800305-597500abb5a4?w=300" },
                { name: "Rumeli Hisarı", category: "Kültür", duration: "1.5 Saat", lat: 41.0862, lng: 29.0567, recommendation: "Fatih Sultan Mehmet'in Boğaz'ın en dar noktasında yaptırdığı dev kale.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300" }
            ]
        },
        {
            name: "Kadıköy & Moda (Anadolu Yakası)",
            places: [
                { name: "Kız Kulesi", category: "Kültür", duration: "1.5 Saat", lat: 41.0211, lng: 29.0041, recommendation: "Boğaz'ın ortasında efsanelere konu olmuş tarihi fener ve kule.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=300" },
                { name: "Kadıköy Boğa Heykeli", category: "Şehir", duration: "0.5 Saat", lat: 40.9905, lng: 29.0290, recommendation: "Kadıköy'ün en ünlü buluşma noktası ve simgesi.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1545641203-7d6cf941d21b?w=300" },
                { name: "Moda Sahili ve Parkı", category: "Doğa", duration: "2 Saat", lat: 40.9840, lng: 29.0235, recommendation: "Güneşi batırmak ve çay bahçelerinde dinlenmek için mükemmel sahil şeridi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1596705574343-42bf79069d30?w=300" }
            ]
        }
    ],
    "NRT": [
        {
            name: "Shibuya & Harajuku",
            places: [
                { name: "Shibuya Crossing", category: "Şehir", duration: "1 Saat", lat: 35.6595, lng: 139.7006, recommendation: "Dünyanın en yoğun yaya geçidinde Tokyo'nun eşsiz ritmini hissedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300" },
                { name: "Meiji Shrine", category: "Kültür", duration: "1.5 Saat", lat: 35.6764, lng: 139.6993, recommendation: "Yoyogi Parkı'nın sakin ormanında İmparator Meiji'ye adanmış şinto tapınağı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300" },
                { name: "Harajuku Takeshita Street", category: "Eğlence", duration: "2 Saat", lat: 35.6715, lng: 139.7032, recommendation: "Tokyo'nun çılgın gençlik modası ve renkli butiklerinin kalbinin attığı cadde.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=300" }
            ]
        },
        {
            name: "Shinjuku Gökdelenler Bölgesi",
            places: [
                { name: "Tokyo Metropolitan Government Building", category: "Şehir", duration: "1.5 Saat", lat: 35.6895, lng: 139.6917, recommendation: "45. kattaki ücretsiz gözlem terasından nefes kesici Tokyo manzarasını seyredin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300" },
                { name: "Shinjuku Gyoen", category: "Doğa", duration: "2 Saat", lat: 35.6852, lng: 139.7101, recommendation: "Geleneksel Japon ve Fransız bahçe düzenlemelerinin birleştiği devasa park alanı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1505080856163-26759dcd7d82?w=300" },
                { name: "Yayoi Kusama Museum", category: "Sanat", duration: "1.5 Saat", lat: 35.7037, lng: 139.7268, recommendation: "Dünyaca ünlü sanatçının puantiyeli sonsuzluk odalarını keşfedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1554188248-986adac73be4?w=300" }
            ]
        },
        {
            name: "Asakusa & Ueno",
            places: [
                { name: "Senso-ji Temple", category: "Kültür", duration: "2 Saat", lat: 35.7148, lng: 139.7967, recommendation: "Asakusa'da yer alan Tokyo'nun en eski ve en görkemli tarihi Budist tapınağı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300" },
                { name: "Tokyo Skytree", category: "Şehir", duration: "2 Saat", lat: 35.7101, lng: 139.8107, recommendation: "634 metre yüksekliği ile dünyanın en yüksek kulelerinden biri.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=300" },
                { name: "Ueno Park", category: "Doğa", duration: "2 Saat", lat: 35.7154, lng: 139.7740, recommendation: "Kiraz çiçekleri (Sakura), müzeler ve devasa göletlerin yer aldığı kültür parkı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=300" }
            ]
        },
        {
            name: "Odaiba & Tokyo Bay",
            places: [
                { name: "Tokyo Tower", category: "Kültür", duration: "2 Saat", lat: 35.6586, lng: 139.7454, recommendation: "Eyfel Kulesi esintili ünlü kırmızı kuleden Tokyo manzarasını izleyin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300" },
                { name: "Odaiba Seaside Park", category: "Eğlence", duration: "3 Saat", lat: 35.6248, lng: 139.7755, recommendation: "Rainbow Bridge manzaralı, yapay adada konumlanmış eğlence ve plaj alanı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1554797078-958568fab76d?w=300" },
                { name: "Tsukiji Outer Market", category: "Yemek", duration: "1.5 Saat", lat: 35.6654, lng: 139.7702, recommendation: "Taptaze suşiler, sokak yemekleri ve deniz ürünleriyle ünlü geleneksel pazar.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300" }
            ]
        }
    ],
    "CDG": [
        {
            name: "Eiffel & Champs-Élysées",
            places: [
                { name: "Eyfel Kulesi", category: "Kültür", duration: "2 Saat", lat: 48.8584, lng: 2.2945, recommendation: "Paris'in efsanevi demir kulesinden şehri kuşbakışı seyredin.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300" },
                { name: "Arc de Triomphe", category: "Kültür", duration: "1.5 Saat", lat: 48.8738, lng: 2.2950, recommendation: "Napolyon'un zaferleri anısına inşa edilen ünlü Zafer Takı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300" },
                { name: "Champs-Élysées", category: "Şehir", duration: "2 Saat", lat: 48.8698, lng: 2.3075, recommendation: "Dünyanın en prestijli alışveriş caddelerinden biri.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=300" }
            ]
        },
        {
            name: "Louvre & Notre-Dame",
            places: [
                { name: "Louvre Müzesi", category: "Sanat", duration: "3 Saat", lat: 48.8606, lng: 2.3376, recommendation: "Dünyanın en büyük sanat müzesinde Mona Lisa ve binlerce şaheseri keşfedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=300" },
                { name: "Notre-Dame Katedrali", category: "Kültür", duration: "2 Saat", lat: 48.8530, lng: 2.3499, recommendation: "Gotik mimarinin başyapıtı olan tarihi Paris katedrali.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=300" },
                { name: "Sainte-Chapelle", category: "Kültür", duration: "1 Saat", lat: 48.8554, lng: 2.3450, recommendation: "13. yüzyıldan kalma büyüleyici vitray pencereleriyle ünlü kraliyet şapeli.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1591244033240-ab94031d2794?w=300" }
            ]
        },
        {
            name: "Montmartre (Ressamlar Tepesi)",
            places: [
                { name: "Montmartre & Sacré-Cœur", category: "Kültür", duration: "2 Saat", lat: 48.8867, lng: 2.3431, recommendation: "Ressamlar Tepesi'nde yürüyün ve görkemli Sacré-Cœur Bazilikası'nı ziyaret edin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1509840144525-4c55a4e32191?w=300" },
                { name: "Seine River Cruise", category: "Eğlence", duration: "1.5 Saat", lat: 48.8620, lng: 2.3240, recommendation: "Sen Nehri üzerinde tekne turu ile Paris'in tarihi binalarını sudan izleyin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=300" },
                { name: "Centre Pompidou", category: "Sanat", duration: "2 Saat", lat: 48.8606, lng: 2.3522, recommendation: "Dış cephe boruları ve endüstriyel tasarımıyla ünlü modern sanat müzesi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300" }
            ]
        },
        {
            name: "Latin Quarter & Luxembourg",
            places: [
                { name: "Jardin du Luxembourg", category: "Doğa", duration: "2 Saat", lat: 48.8462, lng: 2.3372, recommendation: "Paris'in kalbinde yer alan, heykellerle bezeli göz alıcı saray bahçesi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300" },
                { name: "Musée d'Orsay", category: "Sanat", duration: "2.5 Saat", lat: 48.8600, lng: 2.3266, recommendation: "Tarihi tren garında sergilenen zengin empresyonist sanat koleksiyonu.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1620332372374-f118c53db474?w=300" },
                { name: "Palais Garnier", category: "Kültür", duration: "1.5 Saat", lat: 48.8719, lng: 2.3316, recommendation: "Barok mimarisi ve lüks altın süslemeleriyle büyüleyici Paris Operası.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=300" }
            ]
        }
    ],
    "BER": [
        {
            name: "Mitte (Berlin Merkez)",
            places: [
                { name: "Brandenburg Kapısı", category: "Kültür", duration: "1 Saat", lat: 52.5163, lng: 13.3777, recommendation: "Soğuk Savaş'ın bitişinin ve Almanya'nın birleşmesinin efsanevi simgesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=300" },
                { name: "Reichstag Building", category: "Kültür", duration: "2 Saat", lat: 52.5186, lng: 13.3761, recommendation: "Modern cam kubbesinden Berlin manzarasını izleyebileceğiniz parlamento binası.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1583156294711-2e6b20acda90?w=300" },
                { name: "Holokost Anıtı", category: "Kültür", duration: "1 Saat", lat: 52.5144, lng: 13.3786, recommendation: "Öldürülen Avrupalı Yahudiler anısına yapılmış etkileyici beton bloklar.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1591873812836-de66d744b6b6?w=300" }
            ]
        },
        {
            name: "Müzeler Adası & Alexanderplatz",
            places: [
                { name: "Müzeler Adası", category: "Kültür", duration: "3 Saat", lat: 52.5169, lng: 13.4010, recommendation: "Spree Nehri ortasındaki UNESCO korumalı adada yer alan 5 dünya çapında müze.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?w=300" },
                { name: "Berlin Katedrali", category: "Kültür", duration: "1.5 Saat", lat: 52.5190, lng: 13.4011, recommendation: "Görkemli yeşil kubbesiyle ünlü tarihi Berlin Katedrali.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1579767220087-434032d8471c?w=300" },
                { name: "Alexanderplatz TV Kulesi", category: "Şehir", duration: "2 Saat", lat: 52.5208, lng: 13.4094, recommendation: "Berlin'in en yüksek yapısı olan kuleden 360 derece şehir manzarası.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300" }
            ]
        },
        {
            name: "East Side Gallery & Kreuzberg",
            places: [
                { name: "East Side Gallery", category: "Sanat", duration: "2 Saat", lat: 52.5050, lng: 13.4397, recommendation: "Berlin Duvarı kalıntıları üzerindeki ünlü açık hava resim sergisi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1560930968-817e5a230948?w=300" },
                { name: "Checkpoint Charlie", category: "Kültür", duration: "1 Saat", lat: 52.5074, lng: 13.3904, recommendation: "Doğu ve Batı Berlin arasındaki en ünlü eski sınır geçiş noktası.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1566418854497-6a4a6e87f87a?w=300" },
                { name: "DDR Museum", category: "Kültür", duration: "1.5 Saat", lat: 52.5196, lng: 13.4023, recommendation: "Eski Doğu Almanya'daki günlük yaşamı interaktif deneyimleyin.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300" }
            ]
        },
        {
            name: "Charlottenburg",
            places: [
                { name: "Charlottenburg Sarayı", category: "Kültür", duration: "2.5 Saat", lat: 52.5206, lng: 13.2958, recommendation: "Berlin'in en büyük Barok sarayı ve harika saray bahçeleri.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1596705574343-42bf79069d30?w=300" },
                { name: "Berlin Zoolojik Bahçesi", category: "Doğa", duration: "3 Saat", lat: 52.5079, lng: 13.3388, recommendation: "Almanya'nın en eski ve zengin hayvanat bahçesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=300" },
                { name: "Tiergarten Parkı", category: "Doğa", duration: "2 Saat", lat: 52.5145, lng: 13.3501, recommendation: "Berlin'in merkezindeki yemyeşil devasa park ve göletler alanı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300" }
            ]
        }
    ]
};

// Dynamic Route Generator Function based on districts and coordinates
function generateRouteForPort(iataCode, days) {
    const code = String(iataCode).toUpperCase();
    let dbKey = code;
    if (code === "SAW") dbKey = "IST";
    if (code === "HND") dbKey = "NRT";
    if (code === "ORY") dbKey = "CDG";
    
    let generatedItinerary = [];
    const users = ['Bora', 'Ayşe', 'Ali'];

    // 1. Curated route using predefined districts
    if (CURATED_DISTRICTS[dbKey]) {
        const districts = CURATED_DISTRICTS[dbKey];
        for (let i = 1; i <= days; i++) {
            const districtIndex = (i - 1) % districts.length;
            const district = districts[districtIndex];
            
            const places = district.places.map((p, idx) => ({
                name: p.name,
                category: p.category,
                duration: p.duration,
                coordinates: { lat: p.lat, lng: p.lng },
                payWithMiles: Math.random() > 0.5,
                milesCost: Math.floor(Math.random() * 10 + 5) * 100,
                addedBy: users[idx % users.length],
                rating: p.rating,
                recommendation: p.recommendation,
                imageUrl: p.imageUrl
            }));
            
            generatedItinerary.push({
                day: i,
                title: `${i}. Gün: ${district.name}`,
                places: places
            });
        }
        return generatedItinerary;
    }

    // 2. Dynamic OSM route if POIs are pre-fetched in background
    if (dynamicSuggestions[code] && Array.isArray(dynamicSuggestions[code]) && dynamicSuggestions[code].length > 0) {
        const pois = [...dynamicSuggestions[code]];
        const targetPlacesPerDay = Math.ceil(pois.length / days);
        let remaining = [...pois];
        
        for (let i = 1; i <= days; i++) {
            if (remaining.length === 0) break;
            
            let dayPlaces = [];
            // Start the cluster with the first remaining place
            let current = remaining.shift();
            dayPlaces.push(current);
            
            // Collect closest spots geographically for the current day (Proximity Grouping)
            while (dayPlaces.length < targetPlacesPerDay && remaining.length > 0) {
                let nearestIdx = -1;
                let minDist = Infinity;
                for (let j = 0; j < remaining.length; j++) {
                    const dist = Math.pow(current.lat - remaining[j].lat, 2) + Math.pow(current.lng - remaining[j].lng, 2);
                    if (dist < minDist) {
                        minDist = dist;
                        nearestIdx = j;
                    }
                }
                if (nearestIdx !== -1) {
                    dayPlaces.push(remaining.splice(nearestIdx, 1)[0]);
                } else {
                    break;
                }
            }
            
            const places = dayPlaces.map((p, idx) => ({
                name: p.name,
                category: p.category,
                duration: p.duration,
                coordinates: { lat: p.lat, lng: p.lng },
                payWithMiles: Math.random() > 0.5,
                milesCost: Math.floor(Math.random() * 10 + 5) * 100,
                addedBy: users[idx % users.length],
                rating: p.rating,
                recommendation: p.recommendation,
                imageUrl: p.imageUrl
            }));
            
            generatedItinerary.push({
                day: i,
                title: `${i}. Gün Keşfi`,
                places: places
            });
        }
        return generatedItinerary;
    }

    // 3. Directional Fallback Route Generator (If offline or OSM fetch fails)
    const port = ALL_PORTS.find(p => p.code === code) || ALL_PORTS[0];
    const centerLat = port.centerLat || port.lat;
    const centerLng = port.centerLng || port.lng;
    const categories = ["Kültür", "Doğa", "Şehir", "Sanat", "Eğlence", "Yemek"];
    const placesNames = ["Meydanı", "Tarihi Müzesi", "Yerel Restoranı", "Büyük Parkı", "Sanat Galerisi", "Seyir Terası", "Tarihi Kalesi", "Botanik Bahçesi", "Merkez Caddesi", "Nehir Kenarı"];
    const recommendations = ["Burada kesinlikle yöresel kahve içmelisiniz.", "Akşam üstü manzarası harika oluyor.", "TripAdvisor Gurme Seçimi! Enfes bir akşam yemeği.", "Sessiz, sakin ve tarih dolu bir lokasyon.", "Sosyal medya için harika fotoğraf kareleri yakalayabilirsiniz.", "Bu lokasyonu keşfederken +50 Mil kazanın!"];

    for (let i = 1; i <= days; i++) {
        // Distribute hubs in different directions dynamically (approx 3km radius)
        const angle = (2 * Math.PI * (i - 1)) / days;
        const hubLat = centerLat + Math.cos(angle) * 0.025;
        const hubLng = centerLng + Math.sin(angle) * 0.025;
        
        let dailyPlaces = [];
        let placesPerDay = Math.floor(Math.random() * 2) + 2; 

        for (let j = 0; j < placesPerDay; j++) {
            let latOffset = (Math.random() - 0.5) * 0.008; 
            let lngOffset = (Math.random() - 0.5) * 0.008;
            const placeName = `${port.city} ${placesNames[Math.floor(Math.random() * placesNames.length)]} ${i}-${j}`;
            
            dailyPlaces.push({
                "name": placeName,
                "category": categories[Math.floor(Math.random() * categories.length)],
                "duration": `${Math.floor(Math.random() * 3) + 1} Saat`,
                "coordinates": { lat: hubLat + latOffset, lng: hubLng + lngOffset },
                "payWithMiles": Math.random() > 0.5,
                "milesCost": Math.floor(Math.random() * 10 + 5) * 100,
                "addedBy": users[Math.floor(Math.random() * users.length)],
                "rating": (Math.random() * 1.5 + 3.5).toFixed(1),
                "recommendation": recommendations[Math.floor(Math.random() * recommendations.length)],
                "imageUrl": `https://picsum.photos/seed/${port.code}${i}${j}/200/200`
            });
        }

        generatedItinerary.push({
            day: i,
            title: `${i}. Gün Bölgesi`,
            places: dailyPlaces
        });
    }

    return generatedItinerary;
}
