// --- Admin Authentication ---
document.getElementById('drLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // 1. Supabase Auth (Role: Admin/Doctor)
    document.getElementById('drLoginView').classList.add('hidden');
    document.getElementById('drDashboardView').classList.remove('hidden');
});

document.getElementById('drLogoutBtn').addEventListener('click', () => {
    document.getElementById('drDashboardView').classList.add('hidden');
    document.getElementById('drLoginView').classList.remove('hidden');
});

// --- Tab Switching ---
function switchDrTab(tabId) {
    document.querySelectorAll('.admin-sidebar .nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
}

// --- Suggest Appointment Logic ---
document.querySelectorAll('.small-btn').forEach(btn => {
    if(btn.textContent === 'Suggest Appointment') {
        btn.addEventListener('click', () => {
            const date = prompt("Enter a suggested date/time for this patient (e.g. Next Tuesday at 2PM):");
            if(date) {
                // Insert auto-message into patient chat via Supabase
                alert(`Suggestion sent to patient for: ${date}`);
            }
        });
    }
});
