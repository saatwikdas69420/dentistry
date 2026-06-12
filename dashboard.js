import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://srndcnbakqczoqeqhbhj.supabase.co';
const supabaseKey = 'sb_publishable_bs-Ch_l_dWKg4u8vVBxu8g_WM6BOGbc';
const supabase = createClient(supabaseUrl, supabaseKey);

let activeUser = null;
let activeProfile = null;

// Routing layout transitions
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.view-layer').forEach(v => v.classList.remove('dynamic-active'));
        
        item.classList.add('active');
        document.getElementById(item.dataset.target).classList.add('dynamic-active');
    });
});

// Authentication handling
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        document.getElementById('authError').textContent = error.message;
    } else {
        activeUser = data.user;
        await loadUserData();
    }
});

async function loadUserData() {
    const { data: profile } = await supabase.from('patients').select('*').eq('id', activeUser.id).single();
    activeProfile = profile;
    document.getElementById('authOverlay').classList.remove('active');
    
    setupRealtimeChat();
    fetchAppointments();
    fetchBilling();
}

// Appointment requests
document.getElementById('bookAppointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = document.getElementById('appDate').value;
    const time = document.getElementById('appTime').value;

    await supabase.from('appointments').insert([{
        patient_id: activeUser.id,
        doctor_id: activeProfile.doctor_id,
        appointment_date: date,
        appointment_time: time
    }]);
    fetchAppointments();
});

async function fetchAppointments() {
    const { data } = await supabase.from('appointments').select('*').eq('patient_id', activeUser.id);
    const container = document.getElementById('appointmentsList');
    container.innerHTML = data.length ? data.map(a => `
        <div style="padding:10px; border-bottom:1px solid #eee;">
            <strong>${a.appointment_date}</strong> at ${a.appointment_time} - <span style="color:#f39c12">${a.status}</span>
        </div>
    `).join('') : '<p>No scheduled events active.</p>';
}

// Financial logs and structural events
async function fetchBilling() {
    const { data } = await supabase.from('billings').select('*').eq('patient_id', activeUser.id);
    const list = document.getElementById('invoiceList');
    list.innerHTML = data.length ? data.map(b => `
        <div style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;">
            <span>${b.description}</span>
            <strong style="color:${b.status === 'Paid' ? 'green' : 'red'}">$${b.amount} (${b.status})</strong>
        </div>
    `).join('') : '<p>No records found.</p>';
}

// Simulated insurance upload configuration
document.getElementById('uploadInsuranceBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('insuranceFile');
    if(!fileInput.files.length) return alert('Please select an image file first');
    
    const { error } = await supabase.from('patients').update({ insurance_submitted: true }).eq('id', activeUser.id);
    if (!error) {
        document.getElementById('insuranceStatus').style.color = 'green';
        document.getElementById('insuranceStatus').textContent = 'Verification notification logged successfully!';
    }
});

// Chat pipeline routines
async function setupRealtimeChat() {
    fetchChatHistory();
    supabase.channel('messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if(payload.new.patient_id === activeUser.id) appendMessage(payload.new);
    }).subscribe();
}

async function fetchChatHistory() {
    const { data } = await supabase.from('messages').select('*').eq('patient_id', activeUser.id).order('created_at', { ascending: true });
    const box = document.getElementById('doctorChatBox');
    box.innerHTML = '';
    data.forEach(appendMessage);
}

function appendMessage(msg) {
    const box = document.getElementById('doctorChatBox');
    const div = document.createElement('div');
    div.className = `msg ${msg.sender}`;
    div.textContent = msg.content;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

document.getElementById('sendDoctorMsgBtn').addEventListener('click', async () => {
    const input = document.getElementById('doctorMsgInput');
    if(!input.value.trim()) return;
    await supabase.from('messages').insert([{
        patient_id: activeUser.id,
        doctor_id: activeProfile.doctor_id,
        sender: 'patient',
        content: input.value
    }]);
    input.value = '';
});

// Routine Health Logger
document.getElementById('routineForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const brushed = document.getElementById('brushCheck').checked;
    const retainer = document.getElementById('retainerCheck').checked;
    const floss = document.getElementById('flossCheck').checked;

    const { error } = await supabase.from('health_logs').upsert({
        patient_id: activeUser.id,
        brushed, retainer, flossed: floss
    });
    
    const status = document.getElementById('loggerStatus');
    status.style.color = error ? 'red' : 'green';
    status.textContent = error ? 'Error updating logs.' : 'Daily alignment habits logged successfully!';
});

// Featherless AI API Connection Interface Wrapper 
// Featherless AI API Connection Interface Wrapper 
document.getElementById('sendAiMsgBtn').addEventListener('click', async () => {
    const input = document.getElementById('aiMsgInput');
    const box = document.getElementById('aiChatBox');
    if(!input.value.trim()) return;

    const userText = input.value;
    input.value = '';

    // Append User message to UI
    const uDiv = document.createElement('div'); 
    uDiv.className = 'msg patient'; 
    uDiv.textContent = userText;
    box.appendChild(uDiv);

    // AI thinking state placeholder
    const tDiv = document.createElement('div'); 
    tDiv.className = 'msg ai'; 
    tDiv.textContent = 'Analyzing response metrics...';
    box.appendChild(tDiv);
    box.scrollTop = box.scrollHeight;

    // 1. Define the AI Fetch Function
    async function askAIAssistant(userMessage) {
        const apiKey = "rc_1eee4efecb35e9ef273d95a8cce74ae488f0f4b5b65b7ee98f6cf92c9d225b4b"; // Replace with your actual key safely
        const endpoint = "https://api.featherless.ai/v1/chat/completions"; 

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek-ai/DeepSeek-R1-0528", 
                    messages: [
                        { role: "system", content: "You are a helpful dental assistant made for the patients of Orthodontic Associates of New England. Keep your answers brief, friendly, and conversational (1-2 sentences maximum). DO NOT use any Markdown formatting (no asterisks, no bold text). If the user ever describes themselves in a scenario that sounds serious, redirect it to talk to the doctor or suggest that it might be an emergency." },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 1 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Details:", errorData);
                return "Error: Unable to process request. Check console.";
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error("Network Error:", error);
            return "Network error. Please try again.";
        }
    }
  
    const rawResponse = await askAIAssistant(userText);
    

    const cleanResponse = rawResponse.replace(/<think>[\s\S]*?<\/think>\n?/gi, '').trim();
    
    tDiv.textContent = cleanResponse;
    box.scrollTop = box.scrollHeight;

});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
});
