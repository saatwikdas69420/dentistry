const SUPABASE_URL = "https://srndcnbakqczoqeqhbhj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bs-Ch_l_dWKg4u8vVBxu8g_WM6BOGbc";

let supabaseClient;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    supabaseClient = window.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Gatekeeper Key
const PORTAL_PASSWORD = "OANE2026";

document.addEventListener("DOMContentLoaded", () => {
    setupSecurityGating();
    
    // Only fetch database rows if already validated & password stored in browser runtime session
    if (sessionStorage.getItem("staff_authenticated") === "true") {
        revealDashboard();
    }
});

/**
 * Handle authentication checking sequence
 */
function setupSecurityGating() {
    const submitBtn = document.getElementById("submit-pass-btn");
    const passwordInput = document.getElementById("portal-password");
    const errorMsg = document.getElementById("error-message");

    if (!submitBtn || !passwordInput) return;

    // Click trigger
    submitBtn.addEventListener("click", () => {
        validateInput(passwordInput.value, errorMsg);
    });

    // Enter key trigger
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            validateInput(passwordInput.value, errorMsg);
        }
    });
}

function validateInput(value, errorElement) {
    if (value === PORTAL_PASSWORD) {
        sessionStorage.setItem("staff_authenticated", "true");
        revealDashboard();
    } else {
        errorElement.className = "error-visible";
    }
}

/**
 * Grants access layout onto UI and activates Supabase streaming pipelines
 */
function revealDashboard() {
    const overlay = document.getElementById("password-overlay");
    const content = document.getElementById("portal-content");
    
    if (overlay) overlay.style.display = "none";
    if (content) content.className = "content-visible";
    
    if (supabaseClient) {
        fetchAppointments();
        fetchBillings();
        fetchConsultations();
    } else {
        console.warn("Supabase client failed to load or credentials are unconfigured.");
    }
}

/**
 * Supabase Data Queries mapped to your exact schema columns
 */
async function fetchAppointments() {
    // Queries your 'appointments' table ordering by appointment_date
    let { data: appointments, error } = await supabaseClient
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .limit(5);

    renderTable('appointments-table', appointments, error, (item) => `
        <tr>
            <td><b>Patient ID: ${escapeHtml(item.patient_id?.substring(0,8) || 'N/A')}...</b></td>
            <td>${escapeHtml(item.appointment_date || 'N/A')}</td>
            <td>${escapeHtml(item.appointment_time || 'N/A')}</td>
            <td>${escapeHtml(item.doctor_id || 'Staff Assignment')}</td>
        </tr>
    `);
}

async function fetchBillings() {
    // Queries your 'billings' table ordering by created_at
    let { data: billings, error } = await supabaseClient
        .from('billings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    renderTable('billings-table', billings, error, (item) => {
        const parsedAmount = item.amount ? parseFloat(item.amount).toFixed(2) : '0.00';
        return `
            <tr>
                <td>#${escapeHtml(item.id.toString())}</td>
                <td>Patient ID: ${escapeHtml(item.patient_id?.substring(0,8) || 'N/A')}...</td>
                <td><b>$${escapeHtml(parsedAmount)}</b></td>
                <td><span class="status-badge status-${escapeHtml(item.status?.toLowerCase()) || 'unknown'}">${escapeHtml(item.status || 'Pending')}</span></td>
            </tr>
        `;
    });
}

async function fetchConsultations() {
    // Queries your 'consultations' table
    let { data: consultations, error } = await supabaseClient
        .from('consultations')
        .select('*')
        .limit(5);

    renderTable('consultations-table', consultations, error, (item) => `
        <tr>
            <td><b>${escapeHtml(item.name || 'Anonymous Submission')}</b></td>
            <td>${escapeHtml(item.email || 'N/A')}</td>
            <td>${escapeHtml(item.phone || 'N/A')}</td>
            <td>${escapeHtml(item.preferred_day || 'N/A')}</td>
            <td>${escapeHtml(item.notes || '')}</td>
        </tr>
    `);
}

/**
 * UI Renderer Helper Engine
 */
function renderTable(tableId, data, error, templateFn) {
    const tableEl = document.getElementById(tableId);
    if (!tableEl) return;
    
    const tbody = tableEl.querySelector('tbody');
    if (!tbody) return;
    
    if (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="100%" style="color:red; padding:15px; font-weight:bold;">Error fetching items from Supabase. Check RLS policies.</td></tr>`;
        return;
    }
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="100%" class="loading">No records currently available.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = data.map(item => templateFn(item)).join('');
}

// Security sanitization utility against XSS insertions injection
function escapeHtml(str) {
    if (!str) return '';
    return str.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
