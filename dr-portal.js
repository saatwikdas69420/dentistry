import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://srndcnbakqczoqeqhbhj.supabase.co';
const supabaseKey = 'sb_publishable_bs-Ch_l_dWKg4u8vVBxu8g_WM6BOGbc';
const supabase = createClient(supabaseUrl, supabaseKey);

const MASTER_PORTAL_PASSWORD = 'orthoNewEngland2026'; 

let activePatientId = null;

// Handle Gate Lock Security
document.getElementById('gateForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const inputPass = document.getElementById('gatePassword').value;
    const errorMsg = document.getElementById('gateError');
    
    if (inputPass === MASTER_PORTAL_PASSWORD) {
        document.getElementById('portalGateLock').classList.remove('active');
        fetchAssignedPatients(); // Fetch rows only after verification clears
    } else {
        errorMsg.textContent = "Invalid Practice Authentication Key. Access Denied.";
        document.getElementById('gatePassword').value = '';
    }
});

document.getElementById('activeDocSelect').addEventListener('change', fetchAssignedPatients);

// Patient Directory queries
async function fetchAssignedPatients() {
    // Prevent fetching if lock layer is still active
    if(document.getElementById('portalGateLock').classList.contains('active')) return;

    const docName = document.getElementById('activeDocSelect').value;
    const { data: patients, error } = await supabase.from('patients').select('*').eq('doctor_id', docName);
    
    const container = document.getElementById('patientListContainer');
    container.innerHTML = '';
    
    if(patients && patients.length === 0) {
        container.innerHTML = '<p style="color:#999; padding: 10px;">No patients assigned.</p>';
        return;
    }

    patients.forEach(p => {
        const div = document.createElement('div');
        div.className = 'patient-item';
        div.textContent = p.name;
        div.addEventListener('click', () => loadPatientWorkspace(p));
        container.appendChild(div);
    });
}

// Active Profile workspace layout execution
async function loadPatientWorkspace(patient) {
    activePatientId = patient.id;
    
    document.querySelectorAll('.patient-item').forEach(i => i.classList.remove('selected'));
    document.getElementById('emptyState').classList.remove('active');
    document.getElementById('activeWorkspace').classList.add('active');
    
    document.getElementById('activePatientName').textContent = patient.name;
    document.getElementById('transferDocSelect').value = patient.doctor_id;
    
    const badge = document.getElementById('insuranceBadge');
    if (patient.insurance_submitted) {
        badge.className = "badge";
        badge.textContent = "Insurance Verification: OK";
    } else {
        badge.className = "badge unverified";
        badge.textContent = "Insurance Unverified";
    }

    fetchPatientChat();
    fetchPatientHabits();
    fetchPatientLedger();
    fetchAppointmentRequests(); // Run request processing pipeline
}

// Case reassignment selection event handling
document.getElementById('transferDocSelect').addEventListener('change', async (e) => {
    if(!activePatientId) return;
    const targetDoc = e.target.value;
    await supabase.from('patients').update({ doctor_id: targetDoc }).eq('id', activePatientId);
    fetchAssignedPatients();
    document.getElementById('activeWorkspace').classList.remove('active');
    document.getElementById('emptyState').classList.add('active');
});

// Structural workflow chat histories
async function fetchPatientChat() {
    const { data } = await supabase.from('messages').select('*').eq('patient_id', activePatientId).order('created_at', { ascending: true });
    const box = document.getElementById('patientChatBox');
    box.innerHTML = data.map(m => `
        <div class="msg ${m.sender}">
            ${m.content}
        </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
}

document.getElementById('sendPatientMsgBtn').addEventListener('click', async () => {
    const input = document.getElementById('patientMsgInput');
    const docName = document.getElementById('activeDocSelect').value;
    if(!input.value.trim() || !activePatientId) return;

    await supabase.from('messages').insert([{
        patient_id: activePatientId,
        doctor_id: docName,
        sender: 'doctor',
        content: input.value
    }]);
    input.value = '';
    fetchPatientChat();
});

// NEW FEATURE: Query and Process Patient Booking Requests
async function fetchAppointmentRequests() {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', activePatientId)
        .order('appointment_date', { ascending: true });

    const container = document.getElementById('appointmentRequestsContainer');
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color:#999;">No scheduling requests found for this patient.</p>';
        return;
    }

    data.forEach(app => {
        const row = document.createElement('div');
        row.className = 'request-row';
        
        let actionsHtml = '';
        if (app.status === 'Pending') {
            actionsHtml = `<button class="approve-btn" data-id="${app.id}">Approve & Schedule</button>`;
        } else {
            actionsHtml = `<span class="status-badge" style="color: ${app.status === 'Scheduled' ? 'green' : '#0b5394'}">${app.status}</span>`;
        }

        row.innerHTML = `
            <span><strong>${app.appointment_date}</strong> at ${app.appointment_time}</span>
            <div>${actionsHtml}</div>
        `;

        // Handle Status Mutation
        const approveBtn = row.querySelector('.approve-btn');
        if (approveBtn) {
            approveBtn.addEventListener('click', async () => {
                approveBtn.disabled = true;
                approveBtn.textContent = 'Updating...';
                
                const { error } = await supabase
                    .from('appointments')
                    .update({ status: 'Scheduled' })
                    .eq('id', app.id);

                if (!error) {
                    fetchAppointmentRequests();
                }
            });
        }

        container.appendChild(row);
    });
}

// Habit tracker audit querying logic
async function fetchPatientHabits() {
    const { data } = await supabase.from('health_logs').select('*').eq('patient_id', activePatientId).order('logged_date', { ascending: false }).limit(3);
    const container = document.getElementById('patientLogsContainer');
    container.innerHTML = data && data.length ? data.map(l => `
        <div style="padding:8px 0; border-bottom:1px solid #eee; font-size:0.9rem;">
            <strong>${l.logged_date}:</strong> 
            Brushed: ${l.brushed ? '✅' : '❌'} | 
            Retainer: ${l.retainer ? '✅' : '❌'} | 
            Flossed: ${l.flossed ? '✅' : '❌'}
        </div>
    `).join('') : '<p style="color:#999;">No routine logs updated for this period.</p>';
}

// Appointment tracking recommendations post
document.getElementById('suggestAppForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = document.getElementById('sugDate').value;
    const time = document.getElementById('sugTime').value;
    const docName = document.getElementById('activeDocSelect').value;

    await supabase.from('appointments').insert([{
        patient_id: activePatientId,
        doctor_id: docName,
        appointment_date: date,
        appointment_time: time,
        status: 'Scheduled' // Direct provider entries skip pending flags
    }]);
    alert('Appointment action suggested to patient account feed.');
    document.getElementById('suggestAppForm').reset();
    fetchAppointmentRequests();
});

// Invoicing statement postings and ledger states mutations
document.getElementById('invoiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('invDesc').value;
    const amount = document.getElementById('invAmount').value;

    await supabase.from('billings').insert([{
        patient_id: activePatientId,
        amount, description
    }]);
    document.getElementById('invoiceForm').reset();
    fetchPatientLedger();
});

async function fetchPatientLedger() {
    const { data } = await supabase.from('billings').select('*').eq('patient_id', activePatientId).order('created_at', { ascending: false });
    const container = document.getElementById('patientLedgerContainer');
    container.innerHTML = data.length ? data.map(b => `
        <div class="ledger-row">
            <span>${b.description} - <strong>$${b.amount}</strong></span>
            <button class="primary-btn toggle-paid-btn" data-id="${b.id}" data-status="${b.status}" style="background:${b.status === 'Paid' ? 'green' : '#e67e22'}">
                ${b.status}
            </button>
        </div>
    `).join('') : '<p style="color:#999;">No active balance statements.</p>';

    // Set interactive toggle events for balance processing updates
    container.querySelectorAll('.toggle-paid-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const currentStatus = btn.dataset.status;
            const nextStatus = currentStatus === 'Unpaid' ? 'Paid' : 'Unpaid';
            await supabase.from('billings').update({ status: nextStatus }).eq('id', btn.dataset.id);
            fetchPatientLedger();
        });
    });
}
