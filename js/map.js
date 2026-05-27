// map.js — Premium Google Maps JS API Engine, Autocomplete & Places POI

// ==========================================================================
// THY SMART DISCOVERY & RECOMMENDATIONS ENGINE (LOCAL DB)
// ==========================================================================
const THY_SUGGESTIONS_DB = {
    "NRT": [
        { name: "Shibuya Crossing", category: "Şehir", duration: "1 Saat", lat: 35.6595, lng: 139.7006, recommendation: "Dünyanın en yoğun yaya geçidinde Tokyo'nun eşsiz ritmini hissedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300" },
        { name: "Tokyo Tower", category: "Kültür", duration: "2 Saat", lat: 35.6586, lng: 139.7454, recommendation: "Eyfel Kulesi esintili bu muhteşem kırmızı kuleden Tokyo manzarasını izleyin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300" },
        { name: "Senso-ji Temple", category: "Kültür", duration: "2 Saat", lat: 35.7148, lng: 139.7967, recommendation: "Asakusa'da yer alan Tokyo'nun en eski, en renkli ve tarihi Budist tapınağı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300" },
        { name: "Meiji Shrine", category: "Kültür", duration: "1.5 Saat", lat: 35.6764, lng: 139.6993, recommendation: "Yoyogi Parkı'nın sakin ormanında İmparator Meiji'ye adanmış şinto tapınağı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300" },
        { name: "Shinjuku Gyoen", category: "Doğa", duration: "2 Saat", lat: 35.6852, lng: 139.7101, recommendation: "Geleneksel Japon ve Fransız bahçe düzenlemelerinin birleştiği devasa park alanı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1505080856163-26759dcd7d82?w=300" },
        { name: "Tokyo Skytree", category: "Şehir", duration: "2 Saat", lat: 35.7101, lng: 139.8107, recommendation: "634 metre yüksekliği ile dünyanın en yüksek kulelerinden biri ve mükemmel manzara.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=300" },
        { name: "Tsukiji Outer Market", category: "Yemek", duration: "1.5 Saat", lat: 35.6654, lng: 139.7702, recommendation: "Taptaze suşiler, sokak yemekleri ve deniz ürünleriyle ünlü geleneksel pazar.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300" },
        { name: "Harajuku Takeshita Street", category: "Eğlence", duration: "2 Saat", lat: 35.6715, lng: 139.7032, recommendation: "Tokyo'nun çılgın gençlik modası ve renkli butiklerinin kalbinin attığı cadde.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=300" },
        { name: "Ueno Park", category: "Doğa", duration: "2 Saat", lat: 35.7154, lng: 139.7740, recommendation: "Kiraz çiçekleri (Sakura), müzeler ve Tokyo Hayvanat Bahçesi'ni barındıran kültür parkı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=300" },
        { name: "Akihabara Electric Town", category: "Eğlence", duration: "2.5 Saat", lat: 35.6997, lng: 139.7715, recommendation: "Elektronik eşyalar, anime-manga dükkanları ve popüler kültürün merkezi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300" },
        { name: "Imperial Palace", category: "Kültür", duration: "2 Saat", lat: 35.6852, lng: 139.7528, recommendation: "Japon İmparatorluk ailesinin ikametgahı olan tarihi hendekli saray kompleksi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1590559899731-a3828dfc515d?w=300" },
        { name: "Odaiba Seaside Park", category: "Eğlence", duration: "3 Saat", lat: 35.6248, lng: 139.7755, recommendation: "Rainbow Bridge manzaralı, yapay adada konumlanmış eğlence ve plaj alanı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1554797078-958568fab76d?w=300" },
        { name: "Roppongi Hills", category: "Şehir", duration: "2 Saat", lat: 35.6605, lng: 139.7291, recommendation: "Modern mimarisi, sanat müzeleri ve lüks alışveriş noktalarıyla ünlü merkez.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=300" },
        { name: "Ghibli Museum", category: "Sanat", duration: "3 Saat", lat: 35.6962, lng: 139.5704, recommendation: "Efsanevi Studio Ghibli animasyonlarının büyülü dünyasını sergileyen tasarım müzesi.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300" },
        { name: "Yayoi Kusama Museum", category: "Sanat", duration: "1.5 Saat", lat: 35.7037, lng: 139.7268, recommendation: "Dünyaca ünlü sanatçı Yayoi Kusama'nın puantiyeli sonsuzluk odalarını keşfedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1554188248-986adac73be4?w=300" }
    ],
    "CDG": [
        { name: "Eyfel Kulesi", category: "Kültür", duration: "2 Saat", lat: 48.8584, lng: 2.2945, recommendation: "Paris'in efsanevi demir kulesinden şehri kuşbakışı seyredin.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300" },
        { name: "Louvre Müzesi", category: "Sanat", duration: "3 Saat", lat: 48.8606, lng: 2.3376, recommendation: "Dünyanın en büyük sanat müzesinde Mona Lisa ve binlerce şaheseri keşfedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=300" },
        { name: "Montmartre", category: "Şehir", duration: "2 Saat", lat: 48.8867, lng: 2.3431, recommendation: "Ressamlar Tepesi'nde yürüyün ve görkemli Sacré-Cœur Bazilikası'nı ziyaret edin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1509840144525-4c55a4e32191?w=300" },
        { name: "Notre-Dame Katedrali", category: "Kültür", duration: "2 Saat", lat: 48.8530, lng: 2.3499, recommendation: "Gotik mimarinin başyapıtı olan tarihi Paris katedrali.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=300" },
        { name: "Arc de Triomphe", category: "Kültür", duration: "1.5 Saat", lat: 48.8738, lng: 2.2950, recommendation: "Napolyon'un zaferleri anısına inşa edilen ünlü Zafer Takı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300" },
        { name: "Champs-Élysées", category: "Şehir", duration: "2 Saat", lat: 48.8698, lng: 2.3075, recommendation: "Dünyanın en prestijli alışveriş caddelerinden biri.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=300" },
        { name: "Musée d'Orsay", category: "Sanat", duration: "2.5 Saat", lat: 48.8600, lng: 2.3266, recommendation: "Tarihi tren garında sergilenen zengin empresyonist sanat koleksiyonu.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1620332372374-f118c53db474?w=300" },
        { name: "Jardin du Luxembourg", category: "Doğa", duration: "2 Saat", lat: 48.8462, lng: 2.3372, recommendation: "Paris'in kalbinde yer alan, heykellerle bezeli göz alıcı saray bahçesi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300" },
        { name: "Palais Garnier", category: "Kültür", duration: "1.5 Saat", lat: 48.8719, lng: 2.3316, recommendation: "Barok mimarisi ve lüks altın süslemeleriyle büyüleyici Paris Operası.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=300" },
        { name: "Sainte-Chapelle", category: "Kültür", duration: "1 Saat", lat: 48.8554, lng: 2.3450, recommendation: "13. yüzyıldan kalma büyüleyici vitray pencereleriyle ünlü kraliyet şapeli.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1591244033240-ab94031d2794?w=300" },
        { name: "Centre Pompidou", category: "Sanat", duration: "2 Saat", lat: 48.8606, lng: 2.3522, recommendation: "Dış cephe boruları ve endüstriyel tasarımıyla ünlü modern sanat müzesi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300" },
        { name: "Château de Versailles", category: "Kültür", duration: "4 Saat", lat: 48.8049, lng: 2.1204, recommendation: "Göz kamaştırıcı Aynalı Galeri'siyle ünlü tarihi kraliyet sarayı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=300" },
        { name: "Seine River Cruise", category: "Eğlence", duration: "1.5 Saat", lat: 48.8620, lng: 2.3240, recommendation: "Sen Nehri üzerinde tekne turu ile Paris'in tarihi binalarını sudan izleyin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=300" },
        { name: "Panthéon", category: "Kültür", duration: "1.5 Saat", lat: 48.8462, lng: 2.3464, recommendation: "Fransız tarihinin en önemli isimlerinin (Hugo, Curie) mezarlarının yer aldığı anıt.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1572979207869-7c858564e9a1?w=300" },
        { name: "Musée de l'Orangerie", category: "Sanat", duration: "1.5 Saat", lat: 48.8638, lng: 2.3226, recommendation: "Claude Monet'nin devasa Nilüferler tablosuna ev sahipliği yapan galeri.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=300" }
    ],
    "BER": [
        { name: "Brandenburg Kapısı", category: "Kültür", duration: "1 Saat", lat: 52.5163, lng: 13.3777, recommendation: "Soğuk Savaş'ın bitişinin ve Almanya'nın birleşmesinin efsanevi simgesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=300" },
        { name: "East Side Gallery", category: "Sanat", duration: "2 Saat", lat: 52.5050, lng: 13.4397, recommendation: "Berlin Duvarı kalıntıları üzerindeki ünlü açık hava resim sergisi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1560930968-817e5a230948?w=300" },
        { name: "Müzeler Adası", category: "Kültür", duration: "3 Saat", lat: 52.5169, lng: 13.4010, recommendation: "Spree Nehri ortasındaki UNESCO korumalı adada yer alan 5 dünya çapında müze.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?w=300" },
        { name: "Reichstag Building", category: "Kültür", duration: "2 Saat", lat: 52.5186, lng: 13.3761, recommendation: "Modern cam kubbesinden Berlin manzarasını izleyebileceğiniz parlamento binası.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1583156294711-2e6b20acda90?w=300" },
        { name: "Berlin Katedrali", category: "Kültür", duration: "1.5 Saat", lat: 52.5190, lng: 13.4011, recommendation: "Görkemli kubbesi ve tarihi iç dekorasyonuyla ünlü Berlin Katedrali.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1579767220087-434032d8471c?w=300" },
        { name: "Checkpoint Charlie", category: "Kültür", duration: "1 Saat", lat: 52.5074, lng: 13.3904, recommendation: "Doğu ve Batı Berlin arasındaki en ünlü eski sınır geçiş noktası.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1566418854497-6a4a6e87f87a?w=300" },
        { name: "Alexanderplatz TV Kulesi", category: "Şehir", duration: "2 Saat", lat: 52.5208, lng: 13.4094, recommendation: "Berlin'in en yüksek yapısı olan kuleden 360 derece şehir manzarası keyfi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300" },
        { name: "Charlottenburg Sarayı", category: "Kültür", duration: "2.5 Saat", lat: 52.5206, lng: 13.2958, recommendation: "Berlin'in en büyük Barok sarayı ve harika saray bahçeleri.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1596705574343-42bf79069d30?w=300" },
        { name: "Holokost Anıtı", category: "Kültür", duration: "1 Saat", lat: 52.5144, lng: 13.3786, recommendation: "Öldürülen Avrupalı Yahudiler anısına yapılmış etkileyici beton bloklar mezarlığı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1591873812836-de66d744b6b6?w=300" },
        { name: "Tiergarten Parkı", category: "Doğa", duration: "2 Saat", lat: 52.5145, lng: 13.3501, recommendation: "Berlin'in merkezinde yer alan yemyeşil devasa park ve göletler alanı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300" },
        { name: "Kaiser Wilhelm Memorial Church", category: "Kültür", duration: "1 Saat", lat: 52.5048, lng: 13.3352, recommendation: "Savaşın yıkıcı etkisini hatırlatmak için bombalanmış haliyle korunan kilise.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=300" },
        { name: "Potsdamer Platz", category: "Şehir", duration: "1.5 Saat", lat: 52.5096, lng: 13.3759, recommendation: "Gökdelenleri, modern mimarisi ve Sony Center ile ünlü modern meydan.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300" },
        { name: "Berlin Zoolojik Bahçesi", category: "Doğa", duration: "3 Saat", lat: 52.5079, lng: 13.3388, recommendation: "Almanya'nın en eski ve zengin hayvan çeşitliliğine sahip hayvanat bahçesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=300" },
        { name: "Mauerpark", category: "Eğlence", duration: "2 Saat", lat: 52.5448, lng: 13.4041, recommendation: "Pazar günleri bit pazarı ve karaoke etkinlikleriyle ünlü park alanı.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300" },
        { name: "DDR Museum", category: "Kültür", duration: "1.5 Saat", lat: 52.5196, lng: 13.4023, recommendation: "Eski Doğu Almanya'daki günlük yaşamı interaktif olarak deneyimleyin.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300" }
    ],
    "IST": [
        { name: "Ayasofya-i Kebir Cami", category: "Kültür", duration: "2 Saat", lat: 41.0086, lng: 28.9802, recommendation: "Dünya mimarlık tarihinin günümüze ulaşan en büyük şaheserlerinden biri.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300" },
        { name: "Topkapı Sarayı", category: "Kültür", duration: "3 Saat", lat: 41.0115, lng: 28.9834, recommendation: "Osmanlı padişahlarının 400 yıl boyunca devlet idare merkezi ve resmi ikametgahı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1605121800305-597500abb5a4?w=300" },
        { name: "Galata Kulesi", category: "Kültür", duration: "1.5 Saat", lat: 41.0256, lng: 28.9742, recommendation: "İstanbul'u ve büyüleyici Boğaz manzarasını 360 derece izleyebileceğiniz tarihi kule.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300" },
        { name: "Sultanahmet Camii", category: "Kültür", duration: "1.5 Saat", lat: 41.0054, lng: 28.9768, recommendation: "Mavi çinileri ve 6 minaresiyle ünlü, İstanbul'un simge camisi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300" },
        { name: "Yerebatan Sarnıcı", category: "Kültür", duration: "1 Saat", lat: 41.0084, lng: 28.9779, recommendation: "Medusa başları ve sütunlarıyla büyüleyici Bizans dönemi su sarnıcı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1595844736691-e40df5b12854?w=300" },
        { name: "Kapalıçarşı", category: "Kültür", duration: "2.5 Saat", lat: 41.0107, lng: 28.9680, recommendation: "Yüzyıllık tarihi koridorlarda binlerce dükkan barındıran dev kapalı pazar.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1545641203-7d6cf941d21b?w=300" },
        { name: "Mısır Çarşısı", category: "Yemek", duration: "1.5 Saat", lat: 41.0165, lng: 28.9703, recommendation: "Baharatlar, lokumlar ve şifalı otlarla dolu tarihi Eminönü çarşısı.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1596705574343-42bf79069d30?w=300" },
        { name: "Dolmabahçe Sarayı", category: "Kültür", duration: "2.5 Saat", lat: 41.0392, lng: 29.0008, recommendation: "Boğaz kıyısında konumlanmış, görkemli avizeleri ve bahçeleriyle ünlü saray.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=300" },
        { name: "Kız Kulesi", category: "Kültür", duration: "1 Saat", lat: 41.0211, lng: 29.0041, recommendation: "Boğaz'ın ortasında efsanelere konu olmuş tarihi fener ve kule.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=300" },
        { name: "Süleymaniye Camii", category: "Kültür", duration: "2 Saat", lat: 41.0161, lng: 28.9639, recommendation: "Mimar Sinan'ın kalfacılık eseri olan, İstanbul silüetinin en güzel camilerinden biri.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1542451313-a17019f20e49?w=300" },
        { name: "Rumeli Hisarı", category: "Kültür", duration: "1.5 Saat", lat: 41.0862, lng: 29.0567, recommendation: "Fatih Sultan Mehmet tarafından Boğaz'ın en dar noktasında yaptırılan dev kale.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300" },
        { name: "Ortaköy Camii", category: "Kültür", duration: "1 Saat", lat: 41.0473, lng: 29.0271, recommendation: "Boğaziçi Köprüsü ayakları altında, neo-barok tarzda inşa edilmiş simge yapı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1605121800305-597500abb5a4?w=300" },
        { name: "İstiklal Caddesi", category: "Şehir", duration: "2 Saat", lat: 41.0336, lng: 28.9772, recommendation: "Tarihi tramvayı, pasajları ve kültürel zenrichlikleriyle Beyoğlu'nun kalbi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300" },
        { name: "Miniatürk", category: "Eğlence", duration: "2 Saat", lat: 41.0602, lng: 28.9487, recommendation: "Türkiye'nin en önemli tarihi yapılarının minyatür modellerini sergileyen açık hava müzesi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300" },
        { name: "İstanbul Modern", category: "Sanat", duration: "2 Saat", lat: 41.0260, lng: 28.9830, recommendation: "Türkiye'nin ilk modern ve çağdaş sanat müzesinin yeni tasarım binası.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300" }
    ]
};

// Global variables for Google Maps instances and state
let map = null;
let googleMarkers = []; // List of google.maps.Marker instances currently plotted
let routePolyline = null; // google.maps.Polyline object for routes
let isMapReady = false;
let pendingRenderPlaces = null;
let activeInfoWindow = null;

let dynamicSuggestions = {};

// Map initialization entry hook
window.setupMap = setupMap;

// Map initialization callback
function setupMap() {
    console.log("Setting up Google Maps...");
    
    // Bind to the #map container (as requested)
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error("Map container element (#map) not found!");
        return;
    }

    // Initialize map centering at Tokyo by default with zoom 12
    map = new google.maps.Map(mapElement, {
        center: { lat: 35.6762, lng: 139.6503 },
        zoom: 12,
        disableDefaultUI: true, // Keep it premium and minimalist
        zoomControl: false,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }] // Turn off default POI clutter
            }
        ]
    });

    // Alias mapInstance to the map object
    mapInstance = map;

    // Implement Leaflet compatibility wrappers on mapInstance
    mapInstance.flyTo = function(latlng, zoom, options) {
        let latVal, lngVal;
        if (Array.isArray(latlng)) {
            latVal = latlng[0];
            lngVal = latlng[1];
        } else if (latlng && typeof latlng.lat === 'function') {
            latVal = latlng.lat();
            lngVal = latlng.lng();
        } else {
            latVal = latlng.lat;
            lngVal = latlng.lng;
        }
        map.panTo({ lat: latVal, lng: lngVal });
        if (zoom !== undefined) {
            map.setZoom(zoom);
        }
    };

    mapInstance.setView = function(latlng, zoom) {
        let latVal, lngVal;
        if (Array.isArray(latlng)) {
            latVal = latlng[0];
            lngVal = latlng[1];
        } else {
            latVal = latlng.lat;
            lngVal = latlng.lng;
        }
        map.setCenter({ lat: latVal, lng: lngVal });
        if (zoom !== undefined) {
            map.setZoom(zoom);
        }
    };

    mapInstance.closePopup = function() {
        if (activeInfoWindow) {
            activeInfoWindow.close();
        }
    };

    // Mock markersLayer object to support Leaflet clearLayers & fitBounds calls
    markersLayer = {
        clearLayers: function() {
            clearAllMapObjects();
        },
        getBounds: function() {
            const bounds = new google.maps.LatLngBounds();
            let count = 0;
            googleMarkers.forEach(m => {
                if (m.isRoutePin) {
                    bounds.extend(m.getPosition());
                    count++;
                }
            });
            return count > 0 ? bounds : null;
        }
    };

    mapInstance.fitBounds = function(bounds, paddingOptions) {
        if (bounds && map) {
            map.fitBounds(bounds);
        }
    };

    // Set up Google Autocomplete on the map search input
    const searchInput = document.getElementById('map-search-input');
    if (searchInput) {
        const autocomplete = new google.maps.places.Autocomplete(searchInput, {
            fields: ['name', 'geometry', 'rating', 'types', 'photos', 'vicinity'],
            types: ['establishment', 'geocode']
        });

        // Bind the autocomplete bounds to map bounds
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                showToast("Aranan mekan bulunamadı.");
                return;
            }

            // Fly map to the place
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(16);
            }

            // Map variables
            const latVal = place.geometry.location.lat();
            const lngVal = place.geometry.location.lng();
            const category = mapGooglePlaceTypeToCategory(place.types);
            const photoUrl = place.photos && place.photos[0] ? place.photos[0].getUrl({ maxWidth: 400 }) : `https://picsum.photos/seed/${place.name.replace(/\s/g, '')}/300/300`;

            const newPlace = {
                name: place.name,
                category: category,
                duration: `${Math.floor(Math.random() * 2) + 1.5} Saat`,
                coordinates: { lat: latVal, lng: lngVal },
                payWithMiles: Math.random() > 0.5,
                milesCost: Math.floor(Math.random() * 10 + 5) * 100,
                addedBy: getCurrentUser(),
                rating: place.rating ? place.rating.toFixed(1) : (Math.random() * 0.8 + 4.1).toFixed(1),
                recommendation: place.vicinity || `${place.name} bölgesini THY ile keşfedin.`,
                imageUrl: photoUrl
            };

            // Add place to the active day's itinerary
            let targetDay = currentViewDay;
            if (targetDay === 'all') {
                targetDay = 1;
            }

            const dayData = currentItinerary.find(x => x.day === targetDay);
            if (dayData) {
                dayData.places.push(newPlace);
                saveItineraryToStorage();
                renderJournalDay(currentViewDay);
                showToast(`"${place.name}" plana başarıyla eklendi! 📍`);
            } else {
                showToast("Lütfen önce bir seyahat günü oluşturun.");
            }

            searchInput.value = '';
        });
    }

    isMapReady = true;
    
    // Check if there are queued markers to render
    if (pendingRenderPlaces) {
        renderMapPins(pendingRenderPlaces);
        pendingRenderPlaces = null;
    } else {
        // Initial render of whatever is in storage
        let allPlaces = [];
        if (currentItinerary && currentItinerary.length > 0) {
            currentItinerary.forEach(d => {
                if (d.places) allPlaces.push(...d.places);
            });
        }
        renderMapPins(allPlaces);
    }
}

// Maps Google place types to THY Route categories
function mapGooglePlaceTypeToCategory(types) {
    if (!types) return 'Şehir';
    if (types.includes('restaurant') || types.includes('cafe') || types.includes('food') || types.includes('bar')) return 'Yemek';
    if (types.includes('museum') || types.includes('art_gallery')) return 'Sanat';
    if (types.includes('park') || types.includes('amusement_park') || types.includes('zoo')) return 'Doğa';
    if (types.includes('tourist_attraction') || types.includes('church') || types.includes('mosque') || types.includes('hindu_temple') || types.includes('synagogue') || types.includes('place_of_worship')) return 'Kültür';
    if (types.includes('shopping_mall') || types.includes('night_club') || types.includes('casino') || types.includes('movie_theater')) return 'Eğlence';
    return 'Şehir';
}

// Dynamic POI Search via google.maps.places.PlacesService
function fetchRealPOIFromGoogle(lat, lng) {
    return new Promise((resolve) => {
        try {
            if (typeof google === 'undefined' || !google.maps || !google.maps.places || !map) {
                resolve([]);
                return;
            }

            const service = new google.maps.places.PlacesService(map);
            
            service.nearbySearch({
                location: new google.maps.LatLng(lat, lng),
                radius: 8000,
                type: 'tourist_attraction'
            }, (results, status) => {
                try {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        const pois = [];
                        for (let i = 0; i < results.length; i++) {
                            const place = results[i];
                            if (!place || !place.name) continue;
                            
                            const mappedCat = mapGooglePlaceTypeToCategory(place.types);
                            const photoUrl = place.photos && place.photos[0] && typeof place.photos[0].getUrl === 'function'
                                ? place.photos[0].getUrl({ maxWidth: 300 }) 
                                : `https://picsum.photos/seed/${encodeURIComponent(place.name)}/300/300`;
                            
                            let placeLat = lat;
                            let placeLng = lng;
                            if (place.geometry && place.geometry.location) {
                                if (typeof place.geometry.location.lat === 'function') {
                                    placeLat = place.geometry.location.lat();
                                    placeLng = place.geometry.location.lng();
                                } else if (typeof place.geometry.location.lat === 'number') {
                                    placeLat = place.geometry.location.lat;
                                    placeLng = place.geometry.location.lng;
                                }
                            }
                            
                            pois.push({
                                name: place.name,
                                category: mappedCat,
                                duration: `${Math.floor(Math.random() * 2) + 1.5} Saat`,
                                lat: placeLat,
                                lng: placeLng,
                                recommendation: place.vicinity || `${place.name} bölgesini THY ayrıcalıklarıyla keşfedin.`,
                                rating: place.rating ? Number(place.rating).toFixed(1) : (Math.random() * 0.8 + 4.1).toFixed(1),
                                imageUrl: photoUrl
                            });
                            
                            if (pois.length >= 15) break;
                        }
                        resolve(pois);
                    } else {
                        console.warn("Google Nearby POI fetch failed, status:", status);
                        resolve([]);
                    }
                } catch (callbackErr) {
                    console.error("Error inside nearbySearch callback:", callbackErr);
                    resolve([]);
                }
            });
        } catch (e) {
            console.error("Error in fetchRealPOIFromGoogle:", e);
            resolve([]);
        }
    });
}

// Get suggestions list for destinations
function getSuggestionsForDestination(iataCode) {
    const code = String(iataCode).toUpperCase();
    let dbKey = code;
    if (code === "HND") dbKey = "NRT";
    if (code === "SAW") dbKey = "IST";
    if (code === "ORY") dbKey = "CDG";
    if (THY_SUGGESTIONS_DB[dbKey]) return THY_SUGGESTIONS_DB[dbKey];
    
    if (dynamicSuggestions[code] && Array.isArray(dynamicSuggestions[code])) {
        return dynamicSuggestions[code];
    }
    
    const port = ALL_PORTS.find(p => p.code === code) || ALL_PORTS[0];
    const cityName = port ? port.city : code;
    return [
        { name: `${cityName} Tarihi Katedrali`, category: "Kültür", duration: "2 Saat", lat: (port.centerLat || port.lat) + 0.012, lng: (port.centerLng || port.lng) - 0.015, recommendation: "Şehrin en eski dini ve mimari anıtını keşfedin.", rating: "4.6", imageUrl: `https://picsum.photos/seed/${cityName}cat/300/300` },
        { name: `${cityName} Botanik Parkı`, category: "Doğa", duration: "1.5 Saat", lat: (port.centerLat || port.lat) - 0.015, lng: (port.centerLng || port.lng) + 0.02, recommendation: "Şehrin göbeğinde huzurlu yeşil alanlar ve yürüyüş yolları.", rating: "4.5", imageUrl: `https://picsum.photos/seed/${cityName}park/300/300` },
        { name: `${cityName} Modern Sanat Müzesi`, category: "Sanat", duration: "2 Saat", lat: (port.centerLat || port.lat) + 0.008, lng: (port.centerLng || port.lng) - 0.005, recommendation: "Modern ve çağdaş sanat eserlerinin sergilendiği göz alıcı müze.", rating: "4.7", imageUrl: `https://picsum.photos/seed/${cityName}mus/300/300` }
    ];
}

// Category color mappings
function getCategoryColor(category) {
    if (category === 'Kültür') return '#b45309';
    if (category === 'Sanat') return '#a855f7';
    if (category === 'Doğa') return '#15803d';
    if (category === 'Şehir') return '#0369a1';
    if (category === 'Eğlence') return '#ea580c';
    if (category === 'Yemek') return '#be123c';
    return '#3b82f6';
}

// Generate premium SVG marker icons for Google Maps
function getGoogleMarkerIcon(category, isRoutePin = false) {
    const color = isRoutePin ? '#E81932' : getCategoryColor(category);
    
    // Draw vector marker pin
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38">
            <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13.5 22.2 14.1 22.7.3.2.6.3.9.3s.6-.1.9-.3C16.5 37.2 30 25.5 30 15 30 6.7 23.3 0 15 0zm0 21c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="${color}"/>
            <circle cx="15" cy="15" r="4" fill="#FFFFFF"/>
        </svg>
    `;
    
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        size: new google.maps.Size(30, 38),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 38)
    };
}

// Render dynamic map pins, connections, and suggestions
function renderMapPins(places) {
    if (!isMapReady) {
        pendingRenderPlaces = places;
        return;
    }

    clearAllMapObjects();

    if (currentDest) {
        // Trigger Places search if this is a custom city and suggestions are not yet loaded
        if (!THY_SUGGESTIONS_DB[currentDest] && !dynamicSuggestions[currentDest]) {
            dynamicSuggestions[currentDest] = 'loading';
            const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
            const centerLat = port.centerLat || port.lat;
            const centerLng = port.centerLng || port.lng;
            
            fetchRealPOIFromGoogle(centerLat, centerLng).then(pois => {
                dynamicSuggestions[currentDest] = pois;
                renderMapPins(places);
                
                // Update sidebar suggestion chips dynamically
                for (let d = 1; d <= totalPlannedDays; d++) {
                    const suggList = document.querySelector(`#add-place-form-${d} .thy-suggestions-list`);
                    if (suggList) {
                        suggList.innerHTML = pois.map((s, idx) => `<div class="suggestion-chip" onclick="window.addSuggestedPlace(${d}, ${idx})"><span class="s-name">${sanitizeHTML(s.name)}</span><span class="s-rating">★ ${sanitizeHTML(s.rating)}</span></div>`).join('');
                    }
                }
            }).catch(e => {
                console.error("Places POI Fetch error:", e);
                dynamicSuggestions[currentDest] = [];
            });
        }

        // Draw recommended POI suggestion markers
        const suggestions = getSuggestionsForDestination(currentDest);
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
        suggestions.forEach((s, index) => {
            const latVal = s.lat !== undefined ? s.lat : (port.centerLat || port.lat) + (s.latOffset || 0);
            const lngVal = s.lng !== undefined ? s.lng : (port.centerLng || port.lng) + (s.lngOffset || 0);
            
            let daysButtonsHtml = '';
            for (let d = 1; d <= totalPlannedDays; d++) {
                daysButtonsHtml += `<button class="poi-popup-day-btn" onclick="if(window.activeInfoWindow) window.activeInfoWindow.close(); window.addPoiToSpecificDay(${index}, ${d})">${d}. Gün</button>`;
            }

            const popupContent = `
                <div class="thy-poi-popup-card" style="width: 220px; font-family: 'Inter', sans-serif;">
                    <div class="poi-popup-image-wrapper" style="position: relative; height: 100px; overflow: hidden;">
                        <img src="${s.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${sanitizeHTML(s.name)}">
                        <span class="poi-popup-rating" style="position: absolute; top: 4px; right: 4px; background: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; color: #d97706;">★ ${sanitizeHTML(s.rating)}</span>
                    </div>
                    <div style="padding: 0.6rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                            <span style="font-size: 0.6rem; font-weight: 700; color: var(--thy-red); background: rgba(232, 25, 50, 0.08); padding: 1px 4px; border-radius: 4px;">${sanitizeHTML(s.category)}</span>
                            <span style="font-size: 0.6rem; color: var(--thy-grey-text);"><i class="ph ph-clock"></i> ${sanitizeHTML(s.duration)}</span>
                        </div>
                        <h4 style="margin: 0 0 0.25rem 0; font-size: 0.85rem; font-family: 'Outfit', sans-serif; font-weight: 700; color: var(--thy-dark-blue);">${sanitizeHTML(s.name)}</h4>
                        <p style="font-size: 0.7rem; color: var(--thy-grey-text); margin: 0 0 0.5rem 0; line-height: 1.3;">${sanitizeHTML(s.recommendation)}</p>
                        <div style="font-size: 0.65rem; font-weight: 700; margin-bottom: 0.3rem; border-top: 1px solid #f1f5f9; padding-top: 0.4rem; color: var(--thy-dark-blue);"><i class="ph-fill ph-sparkle" style="color: var(--thy-red);"></i> Rotaya Ekle</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                            ${daysButtonsHtml}
                        </div>
                    </div>
                </div>
            `;

            const m = new google.maps.Marker({
                position: { lat: latVal, lng: lngVal },
                map: map,
                icon: getGoogleMarkerIcon(s.category, false),
                title: s.name
            });

            m.isRoutePin = false;
            googleMarkers.push(m);

            const infowindow = new google.maps.InfoWindow({
                content: popupContent
            });

            m.addListener('click', () => {
                if (activeInfoWindow) activeInfoWindow.close();
                infowindow.open(map, m);
                activeInfoWindow = infowindow;
                window.activeInfoWindow = activeInfoWindow;
            });
        });
    }

    if (places.length === 0) {
        if (currentDest) {
            const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
            map.setCenter({ lat: port.centerLat || port.lat, lng: port.centerLng || port.lng });
            map.setZoom(13);
        }
        return;
    }

    const sortedPlaces = sortPlacesOptimally(places);
    const routeCoords = [];

    sortedPlaces.forEach((p, idx) => {
        const coords = { lat: p.coordinates.lat, lng: p.coordinates.lng };
        routeCoords.push(coords);

        // Find day and index in currentItinerary for synchronized delete
        let foundDay = 1;
        let foundIdx = -1;
        for (const d of currentItinerary) {
            const idxSearch = d.places.findIndex(x => x.name === p.name && x.coordinates.lat === p.coordinates.lat && x.coordinates.lng === p.coordinates.lng);
            if (idxSearch !== -1) {
                foundDay = d.day;
                foundIdx = idxSearch;
                break;
            }
        }

        const infoWindowContent = `
            <div class="google-poi-popup" style="font-family: 'Inter', sans-serif; padding: 0.5rem; max-width: 220px;">
                <h4 style="margin: 0 0 0.3rem 0; font-family: 'Outfit', sans-serif; font-size: 0.95rem; color: var(--thy-dark-blue); font-weight: 700;">${sanitizeHTML(p.name)}</h4>
                <div style="font-size: 0.75rem; color: var(--thy-grey-text); margin-bottom: 0.5rem; display: flex; gap: 0.5rem; align-items: center;">
                    <span style="color:#B8860B; font-weight:700;">★ ${sanitizeHTML(String(p.rating))}</span>
                    <span>${sanitizeHTML(p.category)}</span>
                </div>
                <p style="font-size: 0.72rem; color: var(--thy-grey-text); margin: 0 0 0.6rem 0; line-height: 1.3;">${sanitizeHTML(p.recommendation || '')}</p>
                <button onclick="if(window.activeInfoWindow) window.activeInfoWindow.close(); window.deletePlace(${foundDay}, ${foundIdx})" 
                    style="width: 100%; padding: 0.4rem; background: var(--thy-red); color: white; border: none; border-radius: var(--radius-sm); font-size: 0.7rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem; transition: background 0.2s;">
                    <i class="ph ph-trash"></i> Rotadan Sil
                </button>
            </div>
        `;

        const m = new google.maps.Marker({
            position: coords,
            map: map,
            icon: getGoogleMarkerIcon(p.category, true),
            title: p.name
        });

        m.isRoutePin = true;
        googleMarkers.push(m);

        const infowindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        m.addListener('click', () => {
            if (activeInfoWindow) activeInfoWindow.close();
            infowindow.open(map, m);
            activeInfoWindow = infowindow;
            window.activeInfoWindow = activeInfoWindow;
        });
    });

    // Draw route connections
    if (routeCoords.length > 1) {
        let allCurvePoints = [];
        for (let i = 0; i < sortedPlaces.length - 1; i++) {
            allCurvePoints = allCurvePoints.concat(getBezierCurve(sortedPlaces[i].coordinates, sortedPlaces[i+1].coordinates));
        }

        const lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 2
        };

        routePolyline = new google.maps.Polyline({
            path: allCurvePoints,
            strokeColor: '#E81932',
            strokeOpacity: 0,
            fillOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '15px'
            }],
            map: map
        });

        // Fit map bounds to show route pins
        const bounds = markersLayer.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } else if (routeCoords.length === 1) {
        map.setCenter(routeCoords[0]);
        map.setZoom(14);
    }
}

// Clear all google map markers and route polylines
function clearAllMapObjects() {
    if (googleMarkers) {
        googleMarkers.forEach(m => m.setMap(null));
        googleMarkers = [];
    }
    if (routePolyline) {
        routePolyline.setMap(null);
        routePolyline = null;
    }
}

// Helper: Optimal nearest-neighbor sorting for route coordinates
function sortPlacesOptimally(places) { 
    if(!places || places.length <= 1) return places; 
    const sorted = [places[0]]; 
    const remaining = [...places.slice(1)]; 
    while(remaining.length > 0) { 
        const current = sorted[sorted.length-1]; 
        let nearestIdx = 0; 
        let minDist = Infinity; 
        for(let i=0; i<remaining.length; i++) { 
            const d = Math.pow(current.coordinates.lat - remaining[i].coordinates.lat, 2) + Math.pow(current.coordinates.lng - remaining[i].coordinates.lng, 2); 
            if(d < minDist) { 
                minDist = d; 
                nearestIdx = i; 
            } 
        } 
        sorted.push(remaining.splice(nearestIdx, 1)[0]); 
    } 
    return sorted; 
}

// Helper: Bezier curve generator between coordinates
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
        points.push({ lat: lat, lng: lng }); 
    } 
    return points; 
}

// Initialize loading process
function initFluidMap() {
    if (window.googleMapsLoaded) {
        setupMap();
    } else {
        console.log("Waiting for Google Maps static script tag callback...");
    }
}

// Adding recommended POIs from the sidebar
function addPoiToSpecificDay(index, dayNumber) {
    const suggestions = getSuggestionsForDestination(currentDest);
    const s = suggestions[index];
    if (!s) return;
    const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    
    const latVal = s.lat !== undefined ? s.lat : (port.centerLat || port.lat) + (s.latOffset || 0);
    const lngVal = s.lng !== undefined ? s.lng : (port.centerLng || port.lng) + (s.lngOffset || 0);
    
    const newPlace = { 
        name: s.name, 
        category: s.category, 
        duration: s.duration, 
        coordinates: { lat: latVal, lng: lngVal }, 
        payWithMiles: Math.random() > 0.5, 
        milesCost: Math.floor(Math.random() * 10 + 5) * 100, 
        addedBy: getCurrentUser(), 
        rating: s.rating, 
        recommendation: s.recommendation, 
        imageUrl: s.imageUrl 
    };
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (dayData) { 
        dayData.places.push(newPlace); 
        saveItineraryToStorage(); 
        renderJournalDay(currentViewDay); 
        showToast(`"${sanitizeHTML(s.name)}" ${dayNumber}. Gün planına eklendi! 📍`); 
        if (activeInfoWindow) activeInfoWindow.close(); 
    }
}
window.addPoiToSpecificDay = addPoiToSpecificDay;

// Backward compatibility alias for legacy scripts
window.fetchRealPOIFromOSM = fetchRealPOIFromGoogle;
