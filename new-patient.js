import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://srndcnbakqczoqeqhbhj.supabase.co';
const supabaseKey = 'sb_publishable_bs-Ch_l_dWKg4u8vVBxu8g_WM6BOGbc';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('consultForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');

    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const consult_date = document.getElementById('date').value;
    const message = document.getElementById('message').value;

    const { error } = await supabase
        .from('consultations')
        .insert([{ phone, email, consult_date, message }]);

    btn.disabled = false;
    btn.textContent = 'Request a Free Consultation';

    if (error) {
        status.style.color = 'red';
        status.textContent = 'Error: ' + error.message;
    } else {
        status.style.color = 'green';
        status.textContent = 'Form submitted successfully! We will reach out soon.';
        document.getElementById('consultForm').reset();
    }
});
