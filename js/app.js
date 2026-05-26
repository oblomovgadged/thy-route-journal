// app.js - Full Premium Flow: Search -> Ticket Booking -> Journal
// + Collaborative Notes, Route Editing, Multi-User Simulation

let mapInstance = null;
let markersLayer = null;

// ==========================================================================
// THY SMART DISCOVERY & RECOMMENDATIONS ENGINE (LOCAL DB)
// ==========================================================================
const THY_SUGGESTIONS_DB = {
    "NRT": [
        { name: "Shibuya Crossing", category: "Şehir", duration: "1 Saat", latOffset: 0.012, lngOffset: -0.015, recommendation: "Dünyanın en yoğun yaya geçidinde Tokyo'nun eşsiz ritmini hissedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300" },
        { name: "Tokyo Tower", category: "Kültür", duration: "2 Saat", latOffset: -0.015, lngOffset: 0.01, recommendation: "Eyfel Kulesi esintili bu muhteşem kırmızı kuleden Tokyo manzarasını izleyin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300" },
        { name: "Senso-ji Temple", category: "Kültür", duration: "2 Saat", latOffset: 0.032, lngOffset: 0.035, recommendation: "Asakusa'da yer alan Tokyo'nun en eski, en renkli ve tarihi Budist tapınağı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300" },
        { name: "Meiji Shrine", category: "Kültür", duration: "1.5 Saat", latOffset: 0.015, lngOffset: -0.025, recommendation: "Yoyogi Parkı'nın sakin ormanında İmparator Meiji'ye adanmış şinto tapınağı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300" },
        { name: "Shinjuku Gyoen", category: "Doğa", duration: "2 Saat", latOffset: 0.02, lngOffset: -0.018, recommendation: "Geleneksel Japon ve Fransız bahçe düzenlemelerinin birleştiği devasa park alanı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1505080856163-26759dcd7d82?w=300" },
        { name: "Tokyo Skytree", category: "Şehir", duration: "2 Saat", latOffset: 0.038, lngOffset: 0.045, recommendation: "634 metre yüksekliği ile dünyanın en yüksek kulelerinden biri ve mükemmel manzara.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=300" },
        { name: "Tsukiji Outer Market", category: "Yemek", duration: "1.5 Saat", latOffset: -0.005, lngOffset: 0.022, recommendation: "Taptaze suşiler, sokak yemekleri ve deniz ürünleriyle ünlü geleneksel pazar.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300" },
        { name: "Harajuku Takeshita Street", category: "Eğlence", duration: "2 Saat", latOffset: 0.011, lngOffset: -0.023, recommendation: "Tokyo'nun çılgın gençlik modası ve renkli butiklerinin kalbinin attığı cadde.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=300" },
        { name: "Ueno Park", category: "Doğa", duration: "2 Saat", latOffset: 0.042, lngOffset: 0.025, recommendation: "Kiraz çiçekleri (Sakura), müzeler ve Tokyo Hayvanat Bahçesi'ni barındıran kültür parkı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=300" },
        { name: "Akihabara Electric Town", category: "Eğlence", duration: "2.5 Saat", latOffset: 0.03, lngOffset: 0.02, recommendation: "Elektronik eşyalar, anime-manga dükkanları ve popüler kültürün merkezi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300" },
        { name: "Imperial Palace", category: "Kültür", duration: "2 Saat", latOffset: 0.015, lngOffset: 0.005, recommendation: "Japon İmparatorluk ailesinin ikametgahı olan tarihi hendekli saray kompleksi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1590559899731-a3828dfc515d?w=300" },
        { name: "Odaiba Seaside Park", category: "Eğlence", duration: "3 Saat", latOffset: -0.045, lngOffset: 0.015, recommendation: "Rainbow Bridge manzaralı, yapay adada konumlanmış eğlence ve plaj alanı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1554797078-958568fab76d?w=300" },
        { name: "Roppongi Hills", category: "Şehir", duration: "2 Saat", latOffset: -0.018, lngOffset: -0.005, recommendation: "Modern mimarisi, sanat müzeleri ve lüks alışveriş noktalarıyla ünlü merkez.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=300" },
        { name: "Ghibli Museum", category: "Sanat", duration: "3 Saat", latOffset: 0.035, lngOffset: -0.055, recommendation: "Efsanevi Studio Ghibli animasyonlarının büyülü dünyasını sergileyen tasarım müzesi.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300" },
        { name: "Yayoi Kusama Museum", category: "Sanat", duration: "1.5 Saat", latOffset: 0.028, lngOffset: -0.01, recommendation: "Dünyaca ünlü sanatçı Yayoi Kusama'nın puantiyeli sonsuzluk odalarını keşfedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1554188248-986adac73be4?w=300" }
    ],
    "CDG": [
        { name: "Eyfel Kulesi", category: "Kültür", duration: "2 Saat", latOffset: -0.012, lngOffset: -0.025, recommendation: "Paris'in efsanevi demir kulesinden şehri kuşbakışı seyredin.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300" },
        { name: "Louvre Müzesi", category: "Sanat", duration: "3 Saat", latOffset: 0.005, lngOffset: 0.008, recommendation: "Dünyanın en büyük sanat müzesinde Mona Lisa ve binlerce şaheseri keşfedin.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=300" },
        { name: "Montmartre", category: "Şehir", duration: "2 Saat", latOffset: 0.025, lngOffset: 0.012, recommendation: "Ressamlar Tepesi'nde yürüyün ve görkemli Sacré-Cœur Bazilikası'nı ziyaret edin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1509840144525-4c55a4e32191?w=300" },
        { name: "Notre-Dame Katedrali", category: "Kültür", duration: "2 Saat", latOffset: -0.002, lngOffset: 0.018, recommendation: "Gotik mimarinin başyapıtı olan tarihi Paris katedrali.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=300" },
        { name: "Arc de Triomphe", category: "Kültür", duration: "1.5 Saat", latOffset: 0.008, lngOffset: -0.03, recommendation: "Napolyon'un zaferleri anısına inşa edilen ünlü Zafer Takı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300" },
        { name: "Champs-Élysées", category: "Şehir", duration: "2 Saat", latOffset: 0.004, lngOffset: -0.022, recommendation: "Dünyanın en prestijli alışveriş caddelerinden biri.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=300" },
        { name: "Musée d'Orsay", category: "Sanat", duration: "2.5 Saat", latOffset: -0.006, lngOffset: -0.008, recommendation: "Tarihi tren garında sergilenen zengin empresyonist sanat koleksiyonu.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1620332372374-f118c53db474?w=300" },
        { name: "Jardin du Luxembourg", category: "Doğa", duration: "2 Saat", latOffset: -0.018, lngOffset: -0.002, recommendation: "Paris'in kalbinde yer alan, heykellerle bezeli göz alıcı saray bahçesi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300" },
        { name: "Palais Garnier", category: "Kültür", duration: "1.5 Saat", latOffset: 0.014, lngOffset: -0.004, recommendation: "Barok mimarisi ve lüks altın süslemeleriyle büyüleyici Paris Operası.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=300" },
        { name: "Sainte-Chapelle", category: "Kültür", duration: "1 Saat", latOffset: -0.004, lngOffset: 0.014, recommendation: "13. yüzyıldan kalma büyüleyici vitray pencereleriyle ünlü kraliyet şapeli.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1591244033240-ab94031d2794?w=300" },
        { name: "Centre Pompidou", category: "Sanat", duration: "2 Saat", latOffset: 0.006, lngOffset: 0.022, recommendation: "Dış cephe boruları ve endüstriyel tasarımıyla ünlü modern sanat müzesi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300" },
        { name: "Château de Versailles", category: "Kültür", duration: "4 Saat", latOffset: -0.12, lngOffset: -0.25, recommendation: "Göz kamaştırıcı Aynalı Galeri'siyle ünlü tarihi kraliyet sarayı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=300" },
        { name: "Seine River Cruise", category: "Eğlence", duration: "1.5 Saat", latOffset: -0.005, lngOffset: -0.005, recommendation: "Sen Nehri üzerinde tekne turu ile Paris'in tarihi binalarını sudan izleyin.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=300" },
        { name: "Panthéon", category: "Kültür", duration: "1.5 Saat", latOffset: -0.016, lngOffset: 0.024, recommendation: "Fransız tarihinin en önemli isimlerinin (Hugo, Curie) mezarlarının yer aldığı anıt.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1572979207869-7c858564e9a1?w=300" },
        { name: "Musée de l'Orangerie", category: "Sanat", duration: "1.5 Saat", latOffset: -0.005, lngOffset: -0.02, recommendation: "Claude Monet'nin devasa Nilüferler tablosuna ev sahipliği yapan galeri.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=300" }
    ],
    "BER": [
        { name: "Brandenburg Kapısı", category: "Kültür", duration: "1 Saat", latOffset: 0.002, lngOffset: -0.012, recommendation: "Soğuk Savaş'ın bitişinin ve Almanya'nın birleşmesinin efsanevi simgesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=300" },
        { name: "East Side Gallery", category: "Sanat", duration: "2 Saat", latOffset: -0.015, lngOffset: 0.038, recommendation: "Berlin Duvarı kalıntıları üzerindeki ünlü açık hava resim sergisi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1560930968-817e5a230948?w=300" },
        { name: "Müzeler Adası", category: "Kültür", duration: "3 Saat", latOffset: 0.006, lngOffset: 0.004, recommendation: "Spree Nehri ortasındaki UNESCO korumalı adada yer alan 5 dünya çapında müze.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?w=300" },
        { name: "Reichstag Building", category: "Kültür", duration: "2 Saat", latOffset: 0.008, lngOffset: -0.016, recommendation: "Modern cam kubbesinden Berlin manzarasını izleyebileceğiniz parlamento binası.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1583156294711-2e6b20acda90?w=300" },
        { name: "Berlin Katedrali", category: "Kültür", duration: "1.5 Saat", latOffset: 0.004, lngOffset: 0.008, recommendation: "Görkemli kubbesi ve tarihi iç dekorasyonuyla ünlü Berlin Katedrali.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1579767220087-434032d8471c?w=300" },
        { name: "Checkpoint Charlie", category: "Kültür", duration: "1 Saat", latOffset: -0.015, lngOffset: -0.005, recommendation: "Doğu ve Batı Berlin arasındaki en ünlü eski sınır geçiş noktası.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1566418854497-6a4a6e87f87a?w=300" },
        { name: "Alexanderplatz TV Kulesi", category: "Şehir", duration: "2 Saat", latOffset: 0.01, lngOffset: 0.02, recommendation: "Berlin'in en yüksek yapısı olan kuleden 360 derece şehir manzarası keyfi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300" },
        { name: "Charlottenburg Sarayı", category: "Kültür", duration: "2.5 Saat", latOffset: 0.015, lngOffset: -0.085, recommendation: "Berlin'in en büyük Barok sarayı ve harika saray bahçeleri.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1596705574343-42bf79069d30?w=300" },
        { name: "Holokost Anıtı", category: "Kültür", duration: "1 Saat", latOffset: -0.001, lngOffset: -0.014, recommendation: "Öldürülen Avrupalı Yahudiler anısına yapılmış etkileyici beton bloklar mezarlığı.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1591873812836-de66d744b6b6?w=300" },
        { name: "Tiergarten Parkı", category: "Doğa", duration: "2 Saat", latOffset: -0.002, lngOffset: -0.045, recommendation: "Berlin'in merkezinde yer alan yemyeşil devasa park ve göletler alanı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300" },
        { name: "Kaiser Wilhelm Memorial Church", category: "Kültür", duration: "1 Saat", latOffset: -0.025, lngOffset: -0.075, recommendation: "Savaşın yıkıcı etkisini hatırlatmak için bombalanmış haliyle korunan kilise.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=300" },
        { name: "Potsdamer Platz", category: "Şehir", duration: "1.5 Saat", latOffset: -0.01, lngOffset: -0.025, recommendation: "Gökdelenleri, modern mimarisi ve Sony Center ile ünlü modern meydan.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300" },
        { name: "Berlin Zoolojik Bahçesi", category: "Doğa", duration: "3 Saat", latOffset: -0.02, lngOffset: -0.065, recommendation: "Almanya'nın en eski ve zengin hayvan çeşitliliğine sahip hayvanat bahçesi.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=300" },
        { name: "Mauerpark", category: "Eğlence", duration: "2 Saat", latOffset: 0.038, lngOffset: 0.018, recommendation: "Pazar günleri bit pazarı ve karaoke etkinlikleriyle ünlü park alanı.", rating: "4.5", imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300" },
        { name: "DDR Museum", category: "Kültür", duration: "1.5 Saat", latOffset: 0.005, lngOffset: 0.008, recommendation: "Eski Doğu Almanya'daki günlük yaşamı interaktif olarak deneyimleyin.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300" }
    ],
    "IST": [
        { name: "Ayasofya-i Kebir Cami", category: "Kültür", duration: "2 Saat", latOffset: -0.034, lngOffset: -0.011, recommendation: "Dünya mimarlık tarihinin günümüze ulaşan en büyük şaheserlerinden biri.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300" },
        { name: "Topkapı Sarayı", category: "Kültür", duration: "3 Saat", latOffset: -0.03, lngOffset: -0.005, recommendation: "Osmanlı padişahlarının 400 yıl boyunca devlet idare merkezi ve resmi ikametgahı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1605121800305-597500abb5a4?w=300" },
        { name: "Galata Kulesi", category: "Kültür", duration: "1.5 Saat", latOffset: -0.018, lngOffset: -0.021, recommendation: "İstanbul'u ve büyüleyici Boğaz manzarasını 360 derece izleyebileceğiniz tarihi kule.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300" },
        { name: "Sultanahmet Camii", category: "Kültür", duration: "1.5 Saat", latOffset: -0.036, lngOffset: -0.012, recommendation: "Mavi çinileri ve 6 minaresiyle ünlü, İstanbul'un simge camisi.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300" },
        { name: "Yerebatan Sarnıcı", category: "Kültür", duration: "1 Saat", latOffset: -0.034, lngOffset: -0.012, recommendation: "Medusa başları ve sütunlarıyla büyüleyici Bizans dönemi su sarnıcı.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1595844736691-e40df5b12854?w=300" },
        { name: "Kapalıçarşı", category: "Kültür", duration: "2.5 Saat", latOffset: -0.031, lngOffset: -0.023, recommendation: "Yüzyıllık tarihi koridorlarda binlerce dükkan barındıran dev kapalı pazar.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1545641203-7d6cf941d21b?w=300" },
        { name: "Mısır Çarşısı", category: "Yemek", duration: "1.5 Saat", latOffset: -0.024, lngOffset: -0.018, recommendation: "Baharatlar, lokumlar ve şifalı otlarla dolu tarihi Eminönü çarşısı.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1596705574343-42bf79069d30?w=300" },
        { name: "Dolmabahçe Sarayı", category: "Kültür", duration: "2.5 Saat", latOffset: -0.015, lngOffset: -0.005, recommendation: "Boğaz kıyısında konumlanmış, görkemli avizeleri ve bahçeleriyle ünlü saray.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=300" },
        { name: "Kız Kulesi", category: "Kültür", duration: "1 Saat", latOffset: -0.025, lngOffset: 0.015, recommendation: "Boğaz'ın ortasında efsanelere konu olmuş tarihi fener ve kule.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=300" },
        { name: "Süleymaniye Camii", category: "Kültür", duration: "2 Saat", latOffset: -0.025, lngOffset: -0.025, recommendation: "Mimar Sinan'ın kalfalık eseri olan, İstanbul silüetinin en güzel camilerinden biri.", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1542451313-a17019f20e49?w=300" },
        { name: "Rumeli Hisarı", category: "Kültür", duration: "1.5 Saat", latOffset: 0.045, lngOffset: 0.05, recommendation: "Fatih Sultan Mehmet tarafından Boğaz'ın en dar noktasında yaptırılan dev kale.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300" },
        { name: "Ortaköy Camii", category: "Kültür", duration: "1 Saat", latOffset: -0.005, lngOffset: 0.015, recommendation: "Boğaziçi Köprüsü ayakları altında, neo-barok tarzda inşa edilmiş simge yapı.", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1605121800305-597500abb5a4?w=300" },
        { name: "İstiklal Caddesi", category: "Şehir", duration: "2 Saat", latOffset: -0.015, lngOffset: -0.018, recommendation: "Tarihi tramvayı, pasajları ve kültürel zenginlikleriyle Beyoğlu'nun kalbi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300" },
        { name: "Miniatürk", category: "Eğlence", duration: "2 Saat", latOffset: 0.035, lngOffset: -0.035, recommendation: "Türkiye'nin en önemli tarihi yapılarının minyatür modellerini sergileyen açık hava müzesi.", rating: "4.6", imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300" },
        { name: "İstanbul Modern", category: "Sanat", duration: "2 Saat", latOffset: -0.019, lngOffset: -0.015, recommendation: "Türkiye'nin ilk modern ve çağdaş sanat müzesinin yeni tasarım binası.", rating: "4.7", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300" }
    ]
};

function getSuggestionsForDestination(iataCode) {
    const code = String(iataCode).toUpperCase();
    
    // Find aliases like HND -> NRT, SAW -> IST to enrich data
    let dbKey = code;
    if (code === "HND") dbKey = "NRT";
    if (code === "SAW") dbKey = "IST";
    
    if (THY_SUGGESTIONS_DB[dbKey]) {
        return THY_SUGGESTIONS_DB[dbKey];
    }
    
    // Fallback dynamic generator based on airport database
    const port = ALL_PORTS.find(p => p.code === code) || ALL_PORTS[0];
    const cityName = port ? port.city : code;
    return [
        { name: `${cityName} Tarihi Katedrali`, category: "Kültür", duration: "2 Saat", latOffset: 0.012, lngOffset: -0.015, recommendation: "Şehrin en eski dini ve mimari anıtını keşfedin.", rating: "4.6", imageUrl: `https://picsum.photos/seed/${cityName}cat/300/300` },
        { name: `${cityName} Botanik Parkı`, category: "Doğa", duration: "1.5 Saat", latOffset: -0.015, lngOffset: 0.02, recommendation: "Şehrin göbeğinde huzurlu yeşil alanlar ve yürüyüş yolları.", rating: "4.5", imageUrl: `https://picsum.photos/seed/${cityName}park/300/300` },
        { name: `${cityName} Modern Sanat Müzesi`, category: "Sanat", duration: "2 Saat", latOffset: 0.008, lngOffset: -0.005, recommendation: "Modern ve çağdaş sanat eserlerinin sergilendiği göz alıcı müze.", rating: "4.7", imageUrl: `https://picsum.photos/seed/${cityName}mus/300/300` }
    ];
}

const thyPoiIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

function addPoiToSpecificDay(index, dayNumber) {
    const suggestions = getSuggestionsForDestination(currentDest);
    const s = suggestions[index];
    if (!s) return;
    
    const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    const newPlace = {
        name: s.name,
        category: s.category,
        duration: s.duration,
        coordinates: {
            lat: port.lat + s.latOffset,
            lng: port.lng + s.lngOffset
        },
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
        showToast(`"${s.name}" ${dayNumber}. Gün planına eklendi! 📍`);
        if (mapInstance) mapInstance.closePopup();
    }
}
// Export to window so Leaflet inline onclick can call it
window.addPoiToSpecificDay = addPoiToSpecificDay;

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
let activeTripId = null;

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

function generateTripId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `THY-${num}`;
}

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
            
            // Restore active trip ID if present
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
    let tripParamLoaded = false;
    if(urlParams.get('join') === 'true') {
        isCollaborator = true;
        const indicator = document.getElementById('online-indicator');
        if(indicator) indicator.style.display = 'block';
        
        // Load trip data from URL/localStorage using the trip ID
        const tripParam = urlParams.get('trip');
        if (tripParam) {
            activeTripId = tripParam;
            const storedTripData = localStorage.getItem(tripParam);
            if (storedTripData) {
                try {
                    const decodedTrip = JSON.parse(storedTripData);
                    if (decodedTrip && decodedTrip.itinerary) {
                        currentOrigin = decodedTrip.origin || "IST";
                        currentDest = decodedTrip.dest || "NRT";
                        totalPlannedDays = decodedTrip.days || 3;
                        currentItinerary = decodedTrip.itinerary || [];
                        if (decodedTrip.notes) {
                            collabNotes = decodedTrip.notes;
                            saveNotesToStorage();
                        }
                        saveItineraryToStorage();
                        tripParamLoaded = true;
                    }
                } catch (e) {
                    console.error("Failed to parse trip from localStorage key:", e);
                }
            } else {
                // If not found in localStorage (different device/browser), generate fallback route
                console.log("Trip data not found in local storage, generating simulated fallback itinerary.");
                currentOrigin = "IST";
                currentDest = "NRT"; // Default to Tokyo
                totalPlannedDays = 3;
                currentItinerary = generateRouteForPort(currentDest, totalPlannedDays);
                saveItineraryToStorage();
                tripParamLoaded = true;
            }
        }
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

    // Populate dropdown with saved trips on load
    updateSavedTripsDropdown();

    // Mobile Toggle Layout Listener
    const mobileToggleBtn = document.getElementById('btn-mobile-toggle');
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => {
            const sidebar = document.getElementById('journal-sidebar');
            const toggleText = document.getElementById('mobile-toggle-text');
            if (!sidebar || !toggleText) return;
            
            const isMapOnly = sidebar.classList.contains('mobile-map-view');
            if (isMapOnly) {
                sidebar.classList.remove('mobile-map-view');
                toggleText.innerHTML = '🗺️ Haritayı Göster';
                showToast('Seyahat planı gösteriliyor');
            } else {
                sidebar.classList.add('mobile-map-view');
                toggleText.innerHTML = '📋 Planı Göster';
                showToast('Harita gösteriliyor');
                if (mapInstance) {
                    setTimeout(() => {
                        mapInstance.invalidateSize();
                    }, 400);
                }
            }
        });
    }

    // If collaborator joins and there's saved data, auto-open journal
    if (isCollaborator) {
        let hasData = tripParamLoaded;
        if (!hasData) {
            hasData = loadItineraryFromStorage();
        }
        if (hasData && currentItinerary.length > 0) {
            // Hide search & flight selection layers completely
            document.getElementById('search-layer').style.display = 'none';
            document.getElementById('flight-selection-layer').style.display = 'none';
            
            renderDaysTabs();
            renderJournalDay('all');
            startDepartureBoard();
            setTimeout(() => {
                document.body.classList.add('has-active-journal');
                document.getElementById('journal-sidebar').classList.add('active');
                showToast('Ortak plana başarıyla katıldınız! 🎉');
                startMultiUserSimulation();
            }, 500);
        }
    }
});

// FLUID MAP BACKGROUND (Google Maps Standard Theme with Fallbacks)
function initFluidMap() {
    try {
        // Enforce all interactions explicitly to prevent map locking
        mapInstance = L.map('map-bg', { 
            zoomControl: false,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            boxZoom: true,
            keyboard: true
        }).setView([41.2588, 28.7456], 3); 

        // Primary: Official Google Maps Vector Roadmap style tiles
        const googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; Google Maps'
        });

        // First Fallback: CartoDB Voyager if Google Maps fails
        googleLayer.on('tileerror', function() {
            console.warn('Google Maps tiles failed, falling back to CartoDB Voyager.');
            mapInstance.removeLayer(googleLayer);
            
            const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
                maxZoom: 19,
                attribution: '&copy; CARTO &copy; OpenStreetMap'
            });

            // Second Fallback: OpenStreetMap if CartoDB Voyager fails
            cartoLayer.on('tileerror', function() {
                console.warn('CartoDB tiles failed, falling back to OpenStreetMap.');
                mapInstance.removeLayer(cartoLayer);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(mapInstance);
            });

            cartoLayer.addTo(mapInstance);
        });

        googleLayer.addTo(mapInstance);
        markersLayer = L.featureGroup().addTo(mapInstance);
    } catch (e) {
        console.error("Failed to initialize Google Maps layer: ", e);
        try {
            // Re-attempt with OpenStreetMap if initial L.map fails
            mapInstance = L.map('map-bg', { zoomControl: false }).setView([41.2588, 28.7456], 3);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance);
            markersLayer = L.featureGroup().addTo(mapInstance);
        } catch (err) {
            console.error("Map fallback initialization failed as well: ", err);
        }
    }
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

    // Generate unique Trip ID
    activeTripId = generateTripId();

    // Save to localStorage for multi-user persistence
    saveItineraryToStorage();
    
    // Automatically register the newly created trip in the saved trips index
    try {
        let tripsIndex = [];
        const indexData = localStorage.getItem('thy_trips_index');
        if (indexData) {
            tripsIndex = JSON.parse(indexData);
        }
        
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
        const cityName = port ? port.city : currentDest;
        const tripName = `${activeTripId} - ${cityName}`;
        
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
        updateSavedTripsDropdown();
    } catch (e) {
        console.error("Failed to auto-register new trip in index:", e);
    }

    // Render Journal & Map Pins
    renderDaysTabs();
    renderJournalDay('all'); // Default: all days

    // Start Departure Board
    startDepartureBoard();

    // Slide in sidebar
    document.body.classList.add('has-active-journal');
    setTimeout(() => {
        document.getElementById('journal-sidebar').classList.add('active');
        if (isCollaborator) {
            startMultiUserSimulation();
        }
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
            // Add new place button
            container.innerHTML += buildAddPlaceButton(d.day);
            // Inline notes accordion after each day's cards
            container.innerHTML += buildInlineNotesAccordion(d.day);
        });
    } else {
        const d = currentItinerary.find(x => x.day === dayNumber);
        if(d) d.places.forEach((p, idx) => { 
            container.innerHTML += buildPremiumCard(p, dayNumber, idx, d.places.length); 
            mapPlaces.push(p); 
        });
        // Add new place button
        container.innerHTML += buildAddPlaceButton(dayNumber);
        // Inline notes accordion after this day's cards
        container.innerHTML += buildInlineNotesAccordion(dayNumber);
    }

    renderMapPins(mapPlaces);
    attachNotesListeners();
    attachAddPlaceListeners();
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
// ADD NEW PLACE
// ============================
function buildAddPlaceButton(dayNumber) {
    const categories = ['Kültür', 'Doğa', 'Şehir', 'Sanat', 'Eğlence', 'Yemek'];
    const categoryOptions = categories.map(c => `<option value="${c}">${c}</option>`).join('');

    const suggestions = getSuggestionsForDestination(currentDest);
    const suggestionsHtml = suggestions.map((s, idx) => `
        <div class="suggestion-chip" onclick="window.addSuggestedPlace(${dayNumber}, ${idx})">
            <span class="s-name">${s.name}</span>
            <span class="s-rating">★ ${s.rating}</span>
        </div>
    `).join('');

    return `
        <div class="add-place-wrapper" id="add-place-wrapper-${dayNumber}">
            <button class="add-place-btn" onclick="toggleAddPlaceForm(${dayNumber})" id="add-place-btn-${dayNumber}">
                <i class="ph ph-plus-circle"></i> Yeni Yer Ekle
            </button>
            <div class="add-place-form" id="add-place-form-${dayNumber}">
                <div class="add-place-form-inner">
                    <input type="text" id="add-place-name-${dayNumber}" placeholder="Mekan adı yazınız..." autocomplete="off">
                    <div class="add-place-form-row">
                        <select id="add-place-cat-${dayNumber}">
                            ${categoryOptions}
                        </select>
                        <button class="add-place-save-btn" onclick="saveNewPlace(${dayNumber})">
                            <i class="ph-bold ph-check"></i> Kaydet
                        </button>
                        <button class="add-place-cancel-btn" onclick="toggleAddPlaceForm(${dayNumber})">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>
                    <div class="thy-suggestions-section">
                        <div class="thy-suggestions-title">
                            <i class="ph-fill ph-sparkle" style="color: var(--gold-accent);"></i> THY Önerilen Popüler Mekanlar
                        </div>
                        <div class="thy-suggestions-list">
                            ${suggestionsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addSuggestedPlace(dayNumber, index) {
    const suggestions = getSuggestionsForDestination(currentDest);
    const s = suggestions[index];
    if (!s) return;
    
    const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    const newPlace = {
        name: s.name,
        category: s.category,
        duration: s.duration,
        coordinates: {
            lat: port.lat + s.latOffset,
            lng: port.lng + s.lngOffset
        },
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
        showToast(`"${s.name}" plana başarıyla eklendi! 📍`);
    }
}
window.addSuggestedPlace = addSuggestedPlace;

function toggleAddPlaceForm(dayNumber) {
    const form = document.getElementById(`add-place-form-${dayNumber}`);
    const btn = document.getElementById(`add-place-btn-${dayNumber}`);
    if (!form) return;

    const isOpen = form.classList.contains('open');
    if (isOpen) {
        form.classList.remove('open');
        if (btn) btn.style.display = '';
    } else {
        form.classList.add('open');
        if (btn) btn.style.display = 'none';
        // Focus input
        const inp = document.getElementById(`add-place-name-${dayNumber}`);
        if (inp) setTimeout(() => inp.focus(), 150);
    }
}

function saveNewPlace(dayNumber) {
    const nameInput = document.getElementById(`add-place-name-${dayNumber}`);
    const catSelect = document.getElementById(`add-place-cat-${dayNumber}`);
    if (!nameInput) return;

    const placeName = nameInput.value.trim();
    if (!placeName) {
        nameInput.style.borderColor = 'var(--thy-red)';
        nameInput.focus();
        return;
    }

    const category = catSelect ? catSelect.value : 'Kültür';

    // Find current destination port for coordinate reference
    const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];

    // Generate random nearby coordinates (simulated geocoding)
    const latOffset = (Math.random() - 0.5) * 0.06;
    const lngOffset = (Math.random() - 0.5) * 0.06;

    const recommendations = [
        'Kesinlikle görülmeli, harika bir deneyim!',
        'Yerel halktan çok iyi değerlendirmeler almış.',
        'Sosyal medyada trend olan bir konum.',
        'Ortak planımıza eklendi, birlikte keşfedelim!',
        'Günün en özel durağı olabilir.'
    ];

    const newPlace = {
        name: placeName,
        category: category,
        duration: `${Math.floor(Math.random() * 2) + 1} Saat`,
        coordinates: {
            lat: port.lat + latOffset,
            lng: port.lng + lngOffset
        },
        payWithMiles: Math.random() > 0.5,
        milesCost: Math.floor(Math.random() * 10 + 5) * 100,
        addedBy: getCurrentUser(),
        rating: (Math.random() * 1.0 + 4.0).toFixed(1),
        recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
        imageUrl: `https://picsum.photos/seed/${placeName.replace(/\s/g, '')}${Date.now()}/200/200`
    };

    // Add to itinerary
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (dayData) {
        dayData.places.push(newPlace);
    }

    // Persist
    saveItineraryToStorage();

    // Re-render everything (journal + map)
    renderJournalDay(currentViewDay);

    showToast(`"${placeName}" rotaya eklendi! 📍`);
}

function attachAddPlaceListeners() {
    // Attach Enter key to all add-place name inputs
    for (let i = 1; i <= totalPlannedDays; i++) {
        const inp = document.getElementById(`add-place-name-${i}`);
        if (inp) {
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveNewPlace(i);
                }
            });
        }
    }
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

    // Draw POI markers (Google Maps like important points)
    if (currentDest) {
        const suggestions = getSuggestionsForDestination(currentDest);
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
        suggestions.forEach((s, index) => {
            const ll = [port.lat + s.latOffset, port.lng + s.lngOffset];
            
            // Generate day selection buttons inside the popup
            let daysButtonsHtml = '';
            for (let d = 1; d <= totalPlannedDays; d++) {
                daysButtonsHtml += `<button onclick="window.addPoiToSpecificDay(${index}, ${d})" style="padding: 3px 6px; background: #E81932; color: white; border: none; border-radius: 4px; font-size: 0.72rem; cursor: pointer; font-weight:600; transition: background 0.2s; margin-left: 2px;">${d}. Gün</button>`;
            }
            
            const popupContent = `
                <div style="font-family: var(--font-primary); min-width: 160px; padding: 2px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <h4 style="margin: 0; color: var(--thy-dark-blue); font-size: 0.85rem; font-family: var(--font-secondary);">${s.name}</h4>
                        <span style="color: #D4AF37; font-weight: 700; font-size: 0.75rem;">★ ${s.rating}</span>
                    </div>
                    <p style="margin: 0 0 6px 0; color: var(--thy-grey-text); font-size: 0.75rem; line-height: 1.3;">${s.recommendation}</p>
                    <div style="display: flex; gap: 4px; align-items: center; border-top: 1px solid #eee; padding-top: 6px; flex-wrap: wrap;">
                        <span style="font-size: 0.7rem; font-weight: 700; color: var(--thy-dark-blue); margin-right: 2px;">Plana Ekle:</span>
                        ${daysButtonsHtml}
                    </div>
                </div>
            `;
            
            L.marker(ll, { icon: thyPoiIcon, opacity: 0.7 })
                .bindPopup(popupContent)
                .bindTooltip(s.name, {
                    permanent: true,
                    direction: 'top',
                    className: 'google-maps-label',
                    offset: [0, -10]
                })
                .addTo(markersLayer);
        });
    }

    if(places.length === 0) {
        if (currentDest) {
            const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
            mapInstance.setView([port.lat, port.lng], 13);
        }
        return;
    }

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
    
    // Fallback if activeTripId is not set for some reason
    if (!activeTripId) {
        activeTripId = generateTripId();
        saveItineraryToStorage();
    }
    
    // 1. Dinamik Davet Linki Oluşturma (Trip ID Dahil)
    const vLink = window.location.origin + window.location.pathname + '?join=true&trip=' + activeTripId;
    
    // 2. EmailJS Parametreleri
    const templateParams = {
        to_email: email,
        invite_link: vLink,
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

// MULTI-TRIP STORAGE AND MANAGEMENT
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
        
        // Check if it already exists in index
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
        
        showToast(`"${activeTripId} - ${cityName}" plan listesine kaydedildi! 💾`);
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
                
                // Format: 'TripID - Şehir Adı' (e.g. 'THY-4815 - Tokyo')
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
                
                // Save loaded trip as current active trip
                localStorage.setItem(LS_KEYS.ITINERARY, JSON.stringify(currentItinerary));
                localStorage.setItem(LS_KEYS.DEST, currentDest);
                localStorage.setItem(LS_KEYS.ORIGIN, currentOrigin);
                localStorage.setItem(LS_KEYS.DAYS, totalPlannedDays.toString());
                localStorage.setItem(LS_KEYS.NOTES, JSON.stringify(collabNotes));
                localStorage.setItem('thy_active_trip_id', activeTripId);
                
                // Hide search/ticketing layer in case we were there
                document.getElementById('search-layer').style.display = 'none';
                document.getElementById('flight-selection-layer').style.display = 'none';
                
                // Re-render UI
                renderDaysTabs();
                renderJournalDay('all');
                startDepartureBoard();
                
                // Open sidebar if not already open
                document.body.classList.add('has-active-journal');
                document.getElementById('journal-sidebar').classList.add('active');
                
                // Update map fly/bounds
                if (currentItinerary.length > 0) {
                    let allPlaces = [];
                    currentItinerary.forEach(d => {
                        if (d.places) allPlaces.push(...d.places);
                    });
                    renderMapPins(allPlaces);
                }
                
                // Update URL parameters
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

// UTILS
function resetToSearch() {
    bookingState = 'outbound';
    activeTripId = null;
    localStorage.removeItem('thy_active_trip_id');
    
    document.body.classList.remove('has-active-journal');
    document.getElementById('journal-sidebar').classList.remove('mobile-map-view');
    document.getElementById('journal-sidebar').classList.remove('active');
    document.getElementById('flight-selection-layer').classList.remove('active');
    document.getElementById('search-layer').classList.remove('slide-up');
    const toggleText = document.getElementById('mobile-toggle-text');
    if (toggleText) {
        toggleText.innerHTML = '🗺️ Haritayı Göster';
    }
    // Clear display overrides
    document.getElementById('search-layer').style.display = '';
    document.getElementById('flight-selection-layer').style.display = '';
    
    // Clean up query parameters on reset
    if (window.location.search) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
    
    // Reset dropdown selection
    const select = document.getElementById('saved-trips-select');
    if (select) select.value = '';
    
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

// ============================
// MULTI-USER SIMULATION ENGINE
// ============================
function startMultiUserSimulation() {
    if (!isCollaborator) return;
    
    // Simulation 1: Ali adds a note after 10 seconds
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
        
        // Re-render notes for this day
        const notesList = document.getElementById(`notes-list-${dayKey}`);
        if (notesList) {
            if (notesList.querySelector('.collab-notes-empty')) {
                notesList.innerHTML = '';
            }
            notesList.innerHTML = collabNotes[dayKey].map(note => buildNoteItem(note, dayKey)).join('');
        }
        updateNoteBadge(dayKey);
        showToast("Ali gruba yeni bir not ekledi! 📝");
    }, 10000);
    
    // Simulation 2: Ayşe adds a new place after 20 seconds
    setTimeout(() => {
        if (currentItinerary.length === 0) return;
        
        const dayNumber = 1;
        const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;
        
        const simulatedPlace = {
            name: "Yerel Çarşı (Simülasyon)",
            category: "Yemek",
            duration: "2 Saat",
            coordinates: {
                lat: port.lat + latOffset,
                lng: port.lng + lngOffset
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
            
            // Re-render journal day and map
            renderJournalDay(currentViewDay);
            showToast("Ayşe rotaya yeni bir yer ekledi! 📍");
        }
    }, 20000);
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered successfully!', reg.scope))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}
