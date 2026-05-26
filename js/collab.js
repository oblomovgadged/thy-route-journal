// collab.js - Multi-user collaboration logic

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = message;
    
    toast.style.bottom = '2rem';
    
    setTimeout(() => {
        toast.style.bottom = '-100px';
    }, 4000);
}

function startCollabSimulation() {
    // Simulate someone adding a place after 8 seconds
    setTimeout(() => {
        showToast("Ali, yerel bir restoranı rotaya ekledi.");
    }, 8000);

    // Simulate someone changing a plan after 20 seconds
    setTimeout(() => {
        showToast("Ayşe ortak planlama notunu güncelledi.");
    }, 20000);
}
