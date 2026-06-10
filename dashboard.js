import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
const supabase = createClient('https://nsobqrbbgcqojztfmuwu.supabase.co/rest/v1/', 'sb_publishable_4nRPX_X1Pgur2KIfDHJgIQ_ktILYdZM')

// --- Authentication ---
document.getElementById('patientLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    // Standard Supabase email sign-in login
    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${phone}@patient.com`, 
        password: password
    });

    if (error) {
        alert('Login failed: ' + error.message);
    } else {
        document.getElementById('loginView').classList.add('hidden');
        document.getElementById('dashboardView').classList.remove('hidden');
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('loginView').classList.remove('hidden');
});

// --- Tab Switching ---
function switchTab(tabId) {
    // Update buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update views
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
}

// --- Chat & AI Implementation ---
document.getElementById('sendMsgBtn').addEventListener('click', async () => {
    const input = document.getElementById('chatInput');
    const msgText = input.value.trim();
    if(!msgText) return;

    const chatWindow = document.getElementById('chatWindow');
    
    // Display Patient Message
    chatWindow.innerHTML += `<div class="msg sent">${msgText}</div>`;
    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // TODO: Send to Supabase 'messages' table. 
    // If doctor is offline, trigger DeepSeek API (Featherless)
    
    /* 
    const aiResponse = await fetch('https://api.featherless.ai/v1/chat/completions', { ... });
    */

    // Simulated AI Response
    setTimeout(() => {
        chatWindow.innerHTML += `<div class="msg received"><strong>AI Assistant:</strong> Here is some general information about your query. Remember to confirm with the doctor during your next visit.</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1000);
});

// --- Progress Logger ---
document.getElementById('hygieneForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const brushCount = parseInt(document.getElementById('brushCount').value);
    const retainer = document.getElementById('retainerStatus').value;
    
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase
        .from('hygiene_logs')
        .insert([{ 
            patient_id: user.id, 
            brushing_frequency: brushCount, 
            retainer_compliance: retainer 
        }]);

    if (error) {
        alert('Error saving log: ' + error.message);
    } else {
        alert('Progress successfully logged!');
    }
});

// --- Insurance Upload ---
document.getElementById('insuranceUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
        // TODO: Upload to Supabase Storage 'insurance-cards' bucket
        alert('Insurance photo attached and ready to upload.');
    }
});
