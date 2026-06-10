import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://nsobqrbbgcqojztfmuwu.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = 'sb_publishable_4nRPX_X1Pgur2KIfDHJgIQ_ktILYdZM'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.getElementById('newPatientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        notes: document.getElementById('notes').value
    };

    // Live database insert
    const { data, error } = await supabase
        .from('appointments') 
        .insert([
            { 
                notes: `NEW PATIENT REQUEST: ${formData.notes}. Email: ${formData.email}`,
                status: 'pending'
            }
        ]);
    
    if (error) {
        alert('Error submitting request: ' + error.message);
        return;
    }

    // Simulate success animation
    const btn = e.target.querySelector('button');
    btn.textContent = 'Sending...';
    
    setTimeout(() => {
        document.getElementById('newPatientForm').style.display = 'none';
        document.getElementById('formMessage').classList.remove('hidden');
    }, 1000);
});
