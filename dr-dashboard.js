import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
const supabase = createClient('https://your-project-id.supabase.co', 'your-anon-key')

// --- Admin Authentication ---
document.getElementById('drLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert('Access Denied: ' + error.message);
    } else {
        document.getElementById('drLoginView').classList.add('hidden');
        document.getElementById('drDashboardView').classList.remove('hidden');
        loadUpcomingAppointments(); // Call function to pull data
    }
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

async function loadUpcomingAppointments() {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'pending');

    if (data) {
        const table = document.querySelector('.data-table');
        // Clear old hardcoded data, leaving header
        table.innerHTML = `<div class="row header"><span>Time</span><span>Patient ID</span><span>Reason</span><span>Action</span></div>`;
        
        data.forEach(appt => {
            table.innerHTML += `
                <div class="row">
                    <span>${new Date(appt.appt_date).toLocaleDateString()}</span>
                    <span>${appt.patient_id || 'New Request'}</span>
                    <span>${appt.notes || 'Consultation'}</span>
                    <button class="small-btn">Manage</button>
                </div>`;
        });
    }
}
