import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://cuiievwqnwttjdxdgbjz.supabase.co';
const supabaseKey = 'sb_publishable_SjyhptUaseEAX5pDpa0ANg_EYm2OAfa';
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const authView = document.getElementById('authView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const postForm = document.getElementById('postForm');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');
const postStatus = document.getElementById('postStatus');

// Check session on load
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = 'Logging in...';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        loginError.textContent = error.message;
    } else {
        loginError.textContent = '';
        showDashboard();
    }
});

// Handle Logout
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showLogin();
});

// Handle Post Submission
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('submitPostBtn');
    btn.disabled = true;
    btn.textContent = 'Publishing...';
    postStatus.textContent = '';
    postStatus.style.color = 'black';

    const title = document.getElementById('postTitle').value;
    const excerpt = document.getElementById('postExcerpt').value;
    const image_url = document.getElementById('postImage').value;
    const content = document.getElementById('postContent').value;

    const { data, error } = await supabase
        .from('blogs')
        .insert([
            { title, excerpt, image_url, content }
        ]);

    btn.disabled = false;
    btn.textContent = 'Publish Article';

    if (error) {
        console.error(error);
        postStatus.style.color = 'red';
        postStatus.textContent = 'Error publishing: ' + error.message;
    } else {
        postStatus.style.color = 'green';
        postStatus.textContent = 'Article published successfully!';
        postForm.reset(); // Clear form for the next post
        
        // Clear success message after 3 seconds
        setTimeout(() => { postStatus.textContent = ''; }, 3000);
    }
});

function showDashboard() {
    authView.classList.remove('active');
    dashboardView.classList.add('active');
}

function showLogin() {
    dashboardView.classList.remove('active');
    authView.classList.add('active');
}
