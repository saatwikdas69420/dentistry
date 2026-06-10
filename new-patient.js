const supabase = supabase.createClient("https://krtecekdlsmimoayfrel.supabase.co/rest/v1/", "sb_publishable_KbA0BaBoO4hC5y4KuULt9g_B1qRnu8-");

document.getElementById('newPatientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        notes: document.getElementById('notes').value
    };

    const { data, error } = await supabase
        .from('consultation_requests')
        .insert([formData]);

    // Simulate success animation
    const btn = e.target.querySelector('button');
    btn.textContent = 'Sending...';
    
    setTimeout(() => {
        document.getElementById('newPatientForm').style.display = 'none';
        document.getElementById('formMessage').classList.remove('hidden');
    }, 1000);
});
