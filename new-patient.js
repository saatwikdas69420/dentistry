// const supabase = supabase.createClient('URL placeholder', 'ANON_KEY placeholder');

document.getElementById('newPatientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        notes: document.getElementById('notes').value
    };

    // placeholder
    /*
    const { data, error } = await supabase
        .from('consultation_requests')
        .insert([formData]);
    */

    // Simulate success animation
    const btn = e.target.querySelector('button');
    btn.textContent = 'Sending...';
    
    setTimeout(() => {
        document.getElementById('newPatientForm').style.display = 'none';
        document.getElementById('formMessage').classList.remove('hidden');
    }, 1000);
});
