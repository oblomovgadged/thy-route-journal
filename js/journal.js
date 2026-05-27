// journal.js — Journal Rendering, Place Cards, CRUD, Notes System

function renderDaysTabs() {
    const container = document.getElementById('days-tabs-container');
    container.innerHTML = '';
    const allTab = document.createElement('button');
    allTab.className = 'day-pill active';
    allTab.textContent = 'Tüm Rota';
    allTab.onclick = () => { document.querySelectorAll('.day-pill').forEach(el => el.classList.remove('active')); allTab.classList.add('active'); currentViewDay = 'all'; renderJournalDay('all'); };
    container.appendChild(allTab);
    for(let i=1; i<=totalPlannedDays; i++) {
        const dTab = document.createElement('button'); dTab.className = 'day-pill'; dTab.textContent = `${i}. Gün`;
        dTab.onclick = () => { document.querySelectorAll('.day-pill').forEach(el => el.classList.remove('active')); dTab.classList.add('active'); currentViewDay = i; renderJournalDay(i); };
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
            d.places.forEach((p, idx) => { container.innerHTML += buildPremiumCard(p, d.day, idx, d.places.length); mapPlaces.push(p); });
            container.innerHTML += buildAddPlaceButton(d.day);
            container.innerHTML += buildInlineNotesAccordion(d.day);
        });
    } else {
        const d = currentItinerary.find(x => x.day === dayNumber);
        if(d) d.places.forEach((p, idx) => { container.innerHTML += buildPremiumCard(p, dayNumber, idx, d.places.length); mapPlaces.push(p); });
        container.innerHTML += buildAddPlaceButton(dayNumber);
        container.innerHTML += buildInlineNotesAccordion(dayNumber);
    }
    renderMapPins(mapPlaces);
    attachNotesListeners();
    attachAddPlaceListeners();
}

function buildPremiumCard(place, dayNumber, placeIndex, totalPlaces) {
    const actionsHtml = `<div class="place-card-actions">
        ${placeIndex > 0 ? `<button class="place-action-btn btn-move" onclick="movePlaceUp(${dayNumber}, ${placeIndex})" title="Yukarı Taşı"><i class="ph-bold ph-arrow-up"></i></button>` : ''}
        ${placeIndex < totalPlaces - 1 ? `<button class="place-action-btn btn-move" onclick="movePlaceDown(${dayNumber}, ${placeIndex})" title="Aşağı Taşı"><i class="ph-bold ph-arrow-down"></i></button>` : ''}
        <button class="place-action-btn btn-delete" onclick="deletePlace(${dayNumber}, ${placeIndex})" title="Mekanı Sil"><i class="ph-bold ph-trash"></i></button>
    </div>`;
    return `
        <div class="premium-place-card" id="place-card-${dayNumber}-${placeIndex}">
            ${actionsHtml}
            <img src="${sanitizeHTML(place.imageUrl)}" alt="${sanitizeHTML(place.name)}" class="place-image">
            <div class="place-details">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.25rem;">
                    <div class="place-name">${sanitizeHTML(place.name)}</div>
                    <div style="font-size:0.6rem; font-weight:600; color:var(--thy-red); background:rgba(232,25,50,0.08); padding:1px 5px; border-radius:3px; white-space:nowrap; flex-shrink:0;">${sanitizeHTML(place.addedBy)}</div>
                </div>
                <div class="place-meta" style="margin-top:0.2rem;">
                    <span style="color:#B8860B; font-weight:600; font-size:0.72rem;">★ ${sanitizeHTML(String(place.rating))}</span>
                    <span><i class="ph ph-clock"></i> ${sanitizeHTML(place.duration)}</span>
                    <span><i class="ph ph-tag"></i> ${sanitizeHTML(place.category)}</span>
                </div>
                <p style="font-size:0.75rem; color:var(--thy-grey-text); margin-top:0.25rem; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${sanitizeHTML(place.recommendation)}</p>
                <div style="margin-top:0.35rem; display:flex; align-items:center; gap:0.35rem;">
                    <button class="btn-miles" style="background:#10B981; color:white; border:none; padding:2px 6px; font-size:0.65rem;"><i class="ph-fill ph-plus-circle"></i> 50 Mil</button>
                    ${place.payWithMiles ? `<button class="btn-miles" style="padding:2px 6px; font-size:0.65rem;"><i class="ph-fill ph-coins"></i> ${place.milesCost} Mil</button>` : ''}
                </div>
            </div>
        </div>`;
}

function deletePlace(dayNumber, placeIndex) {
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (!dayData || !dayData.places[placeIndex]) return;
    const cardEl = document.getElementById(`place-card-${dayNumber}-${placeIndex}`);
    if (cardEl) { cardEl.classList.add('removing'); setTimeout(() => { const removedPlace = dayData.places.splice(placeIndex, 1)[0]; saveItineraryToStorage(); showToast(`"${sanitizeHTML(removedPlace.name)}" rotadan silindi.`); renderJournalDay(currentViewDay); }, 350); }
    else { dayData.places.splice(placeIndex, 1); saveItineraryToStorage(); renderJournalDay(currentViewDay); }
}

function movePlaceUp(dayNumber, placeIndex) {
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (!dayData || placeIndex <= 0) return;
    [dayData.places[placeIndex - 1], dayData.places[placeIndex]] = [dayData.places[placeIndex], dayData.places[placeIndex - 1]];
    saveItineraryToStorage(); renderJournalDay(currentViewDay); showToast('Mekan sıralaması güncellendi ↑');
}

function movePlaceDown(dayNumber, placeIndex) {
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (!dayData || placeIndex >= dayData.places.length - 1) return;
    [dayData.places[placeIndex], dayData.places[placeIndex + 1]] = [dayData.places[placeIndex + 1], dayData.places[placeIndex]];
    saveItineraryToStorage(); renderJournalDay(currentViewDay); showToast('Mekan sıralaması güncellendi ↓');
}

function buildAddPlaceButton(dayNumber) {
    const categories = ['Kültür', 'Doğa', 'Şehir', 'Sanat', 'Eğlence', 'Yemek'];
    const categoryOptions = categories.map(c => `<option value="${c}">${c}</option>`).join('');
    const suggestions = getSuggestionsForDestination(currentDest);
    const suggestionsHtml = suggestions.map((s, idx) => `<div class="suggestion-chip" onclick="window.addSuggestedPlace(${dayNumber}, ${idx})"><span class="s-name">${sanitizeHTML(s.name)}</span><span class="s-rating">★ ${sanitizeHTML(s.rating)}</span></div>`).join('');
    return `<div class="add-place-wrapper" id="add-place-wrapper-${dayNumber}">
        <button class="add-place-btn" onclick="toggleAddPlaceForm(${dayNumber})" id="add-place-btn-${dayNumber}"><i class="ph ph-plus-circle"></i> Yeni Yer Ekle</button>
        <div class="add-place-form" id="add-place-form-${dayNumber}"><div class="add-place-form-inner">
            <input type="text" id="add-place-name-${dayNumber}" placeholder="Mekan adı yazınız..." autocomplete="off">
            <div class="add-place-form-row"><select id="add-place-cat-${dayNumber}">${categoryOptions}</select>
                <button class="add-place-save-btn" onclick="saveNewPlace(${dayNumber})"><i class="ph-bold ph-check"></i> Kaydet</button>
                <button class="add-place-cancel-btn" onclick="toggleAddPlaceForm(${dayNumber})"><i class="ph ph-x"></i></button>
            </div>
            <div class="thy-suggestions-section"><div class="thy-suggestions-title"><i class="ph-fill ph-sparkle" style="color: var(--gold-accent);"></i> THY Önerilen Popüler Mekanlar</div><div class="thy-suggestions-list">${suggestionsHtml}</div></div>
        </div></div></div>`;
}

function addSuggestedPlace(dayNumber, index) {
    const suggestions = getSuggestionsForDestination(currentDest); const s = suggestions[index]; if (!s) return;
    const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    const latVal = s.lat !== undefined ? s.lat : (port.centerLat || port.lat) + (s.latOffset || 0);
    const lngVal = s.lng !== undefined ? s.lng : (port.centerLng || port.lng) + (s.lngOffset || 0);
    const newPlace = { name: s.name, category: s.category, duration: s.duration, coordinates: { lat: latVal, lng: lngVal }, payWithMiles: Math.random() > 0.5, milesCost: Math.floor(Math.random() * 10 + 5) * 100, addedBy: getCurrentUser(), rating: s.rating, recommendation: s.recommendation, imageUrl: s.imageUrl };
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (dayData) { dayData.places.push(newPlace); saveItineraryToStorage(); renderJournalDay(currentViewDay); showToast(`"${sanitizeHTML(s.name)}" plana başarıyla eklendi! 📍`); }
}
window.addSuggestedPlace = addSuggestedPlace;

function toggleAddPlaceForm(dayNumber) {
    const form = document.getElementById(`add-place-form-${dayNumber}`); const btn = document.getElementById(`add-place-btn-${dayNumber}`); if (!form) return;
    if (form.classList.contains('open')) { form.classList.remove('open'); if (btn) btn.style.display = ''; }
    else { form.classList.add('open'); if (btn) btn.style.display = 'none'; const inp = document.getElementById(`add-place-name-${dayNumber}`); if (inp) setTimeout(() => inp.focus(), 150); }
}

function saveNewPlace(dayNumber) {
    const nameInput = document.getElementById(`add-place-name-${dayNumber}`); const catSelect = document.getElementById(`add-place-cat-${dayNumber}`); if (!nameInput) return;
    const placeName = nameInput.value.trim(); if (!placeName) { nameInput.style.borderColor = 'var(--thy-red)'; nameInput.focus(); return; }
    const category = catSelect ? catSelect.value : 'Kültür';
    const port = ALL_PORTS.find(p => p.code === currentDest) || ALL_PORTS[0];
    const recommendations = ['Kesinlikle görülmeli, harika bir deneyim!', 'Yerel halktan çok iyi değerlendirmeler almış.', 'Sosyal medyada trend olan bir konum.', 'Ortak planımıza eklendi, birlikte keşfedelim!', 'Günün en özel durağı olabilir.'];
    const centerLat = port.centerLat || port.lat;
    const centerLng = port.centerLng || port.lng;
    const newPlace = { name: placeName, category: category, duration: `${Math.floor(Math.random() * 2) + 1} Saat`, coordinates: { lat: centerLat + (Math.random() - 0.5) * 0.03, lng: centerLng + (Math.random() - 0.5) * 0.03 }, payWithMiles: Math.random() > 0.5, milesCost: Math.floor(Math.random() * 10 + 5) * 100, addedBy: getCurrentUser(), rating: (Math.random() * 1.0 + 4.0).toFixed(1), recommendation: recommendations[Math.floor(Math.random() * recommendations.length)], imageUrl: `https://picsum.photos/seed/${placeName.replace(/\s/g, '')}${Date.now()}/200/200` };
    const dayData = currentItinerary.find(x => x.day === dayNumber);
    if (dayData) { dayData.places.push(newPlace); }
    saveItineraryToStorage(); renderJournalDay(currentViewDay); showToast(`"${sanitizeHTML(placeName)}" rotaya eklendi! 📍`);
}

function attachAddPlaceListeners() {
    for (let i = 1; i <= totalPlannedDays; i++) { const inp = document.getElementById(`add-place-name-${i}`); if (inp) { inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveNewPlace(i); } }); } }
}

// ==========================================================================
// COLLABORATIVE NOTES
// ==========================================================================
function buildInlineNotesAccordion(dayNumber) {
    const dayKey = String(dayNumber); const notes = collabNotes[dayKey] || []; const countClass = notes.length === 0 ? 'empty' : '';
    return `<div class="collab-notes-section" id="notes-section-${dayKey}">
        <button class="collab-notes-toggle" onclick="toggleNotesAccordion('${dayKey}')" id="notes-toggle-${dayKey}">
            <i class="ph-fill ph-note-pencil" style="color:var(--thy-red); font-size:0.85rem;"></i><span>Ortak Notlar</span><i class="ph ph-caret-down toggle-icon"></i>
            <span class="note-count-badge ${countClass}" id="note-badge-${dayKey}">${notes.length}</span>
        </button>
        <div class="collab-notes-body" id="notes-body-${dayKey}"><div class="collab-notes-inner">
            <div class="collab-note-input-group"><textarea id="note-input-${dayKey}" placeholder="Ekip için bir not yaz..." rows="1"></textarea>
                <button class="collab-note-add-btn" onclick="addCollabNote(${dayNumber})" title="Not Ekle"><i class="ph-bold ph-plus"></i></button>
            </div>
            <div id="notes-list-${dayKey}">${notes.length === 0 ? '<div class="collab-notes-empty"><i class="ph ph-note-blank"></i> Henüz not eklenmedi.</div>' : notes.map(note => buildNoteItem(note, dayKey)).join('')}</div>
        </div></div></div>`;
}

function toggleNotesAccordion(dayKey) {
    const toggle = document.getElementById(`notes-toggle-${dayKey}`); const body = document.getElementById(`notes-body-${dayKey}`); if (!toggle || !body) return;
    if (body.classList.contains('open')) { body.classList.remove('open'); toggle.classList.remove('open'); }
    else { body.classList.add('open'); toggle.classList.add('open'); const ta = document.getElementById(`note-input-${dayKey}`); if (ta) setTimeout(() => ta.focus(), 100); }
}

function attachNotesListeners() {
    for (let i = 1; i <= totalPlannedDays; i++) { const dayKey = String(i); const textarea = document.getElementById(`note-input-${dayKey}`); if (textarea) { textarea.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addCollabNote(i); } }); } }
}

function buildNoteItem(note, dayKey) {
    const avatarClass = getAvatarClass(note.author); const initials = getInitials(note.author); const timeStr = formatNoteTime(note.timestamp);
    const editedBadge = note.edited ? ' <span style="font-size:0.6rem; color:#9ca3af;">(düzenlendi)</span>' : '';
    return `<div class="collab-note-item" id="note-${note.id}">
        <div class="note-avatar ${avatarClass}">${initials}</div>
        <div class="note-content"><div class="note-author">${sanitizeHTML(note.author)}${editedBadge}</div><div class="note-text" id="note-text-${note.id}">${sanitizeHTML(note.text)}</div><div class="note-time">${timeStr}</div></div>
        <div class="note-actions">
            <button class="note-action-btn note-edit-btn" onclick="startEditNote('${dayKey}', '${note.id}')" title="Düzenle"><i class="ph ph-pencil-simple"></i></button>
            <button class="note-action-btn" onclick="deleteCollabNote('${dayKey}', '${note.id}')" title="Sil"><i class="ph ph-trash"></i></button>
        </div></div>`;
}

function addCollabNote(dayNumber) {
    const dayKey = String(dayNumber); const textarea = document.getElementById(`note-input-${dayKey}`); if (!textarea) return;
    const text = textarea.value.trim(); if (!text) return;
    if (!collabNotes[dayKey]) collabNotes[dayKey] = [];
    collabNotes[dayKey].push({ id: 'n_' + Math.random().toString(36).substr(2, 9), text: text, author: getCurrentUser(), timestamp: Date.now(), edited: false });
    saveNotesToStorage(); textarea.value = '';
    const notesList = document.getElementById(`notes-list-${dayKey}`); if (notesList) { notesList.innerHTML = collabNotes[dayKey].map(note => buildNoteItem(note, dayKey)).join(''); }
    updateNoteBadge(dayKey); showToast(`Not eklendi — ${dayKey}. Gün`);
}

function deleteCollabNote(dayKey, noteId) {
    if (!collabNotes[dayKey]) return;
    const noteEl = document.getElementById(`note-${noteId}`);
    if (noteEl) { noteEl.style.transition = 'all 0.3s ease'; noteEl.style.opacity = '0'; noteEl.style.transform = 'translateX(20px)';
        setTimeout(() => { collabNotes[dayKey] = collabNotes[dayKey].filter(n => n.id !== noteId); saveNotesToStorage();
            const notesList = document.getElementById(`notes-list-${dayKey}`);
            if (notesList) { notesList.innerHTML = collabNotes[dayKey].length === 0 ? '<div class="collab-notes-empty"><i class="ph ph-note-blank"></i>Henüz not eklenmedi.</div>' : collabNotes[dayKey].map(note => buildNoteItem(note, dayKey)).join(''); }
            updateNoteBadge(dayKey);
        }, 300); }
}

function startEditNote(dayKey, noteId) {
    const notes = collabNotes[dayKey]; if (!notes) return; const note = notes.find(n => n.id === noteId); if (!note) return;
    const textEl = document.getElementById(`note-text-${noteId}`); if (!textEl) return;
    textEl.innerHTML = `<input type="text" class="note-edit-input" id="note-edit-${noteId}" value="${sanitizeHTML(note.text)}" onkeydown="if(event.key==='Enter'){saveEditNote('${dayKey}','${noteId}');} if(event.key==='Escape'){cancelEditNote('${dayKey}','${noteId}');}">`;
    const editInput = document.getElementById(`note-edit-${noteId}`); if (editInput) { editInput.focus(); editInput.select(); }
}

function saveEditNote(dayKey, noteId) {
    const editInput = document.getElementById(`note-edit-${noteId}`); if (!editInput) return;
    const newText = editInput.value.trim(); if (!newText) return;
    const notes = collabNotes[dayKey]; if (!notes) return; const note = notes.find(n => n.id === noteId); if (!note) return;
    note.text = newText; note.edited = true; saveNotesToStorage();
    const notesList = document.getElementById(`notes-list-${dayKey}`); if (notesList) { notesList.innerHTML = collabNotes[dayKey].map(n => buildNoteItem(n, dayKey)).join(''); }
    showToast('Not güncellendi ✏️');
}

function cancelEditNote(dayKey, noteId) {
    const notes = collabNotes[dayKey]; if (!notes) return; const note = notes.find(n => n.id === noteId); if (!note) return;
    const textEl = document.getElementById(`note-text-${noteId}`); if (textEl) { textEl.textContent = note.text; }
}

function updateNoteBadge(dayKey) {
    const badge = document.getElementById(`note-badge-${dayKey}`);
    if (badge) { const count = (collabNotes[dayKey] || []).length; badge.textContent = count; badge.classList.toggle('empty', count === 0); }
}
