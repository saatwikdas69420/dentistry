import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://cuiievwqnwttjdxdgbjz.supabase.co';
const supabaseKey = 'sb_publishable_SjyhptUaseEAX5pDpa0ANg_EYm2OAfa';
const supabase = createClient(supabaseUrl, supabaseKey);

let allArticles = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchArticles();
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allArticles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) || 
            article.excerpt.toLowerCase().includes(searchTerm)
        );
        renderArticles(filtered);
    });
});

async function fetchArticles() {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
        document.getElementById('articlesContainer').innerHTML = '<p>Error loading articles.</p>';
        return;
    }

    allArticles = data;
    renderArticles(data);
    renderRecommended(data);
}

function renderArticles(articles) {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = '';

    if (articles.length === 0) {
        container.innerHTML = '<p>No articles found.</p>';
        return;
    }

    articles.forEach(article => {
        const date = new Date(article.created_at).toLocaleDateString();
        
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
            ${article.image_url ? `<img src="${article.image_url}" class="article-image" alt="Blog Image">` : ''}
            <div class="article-body">
                <h2 class="article-title">${article.title}</h2>
                <small style="color: #999;">${date}</small>
                <p class="article-excerpt">${article.excerpt}</p>
                
                <div class="article-full-content">
                    <div>
                        <p style="margin-top: 15px; line-height: 1.8; color: #333;">${article.content.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                
                <button class="read-more-btn">Read Full Article</button>
            </div>
        `;

        // Handle Expansion Animation
        const btn = card.querySelector('.read-more-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent clicking card multiple times
            card.classList.toggle('expanded');
            btn.textContent = card.classList.contains('expanded') ? 'Show Less' : 'Read Full Article';
        });

        container.appendChild(card);
    });
}

function renderRecommended(articles) {
    const list = document.getElementById('recommendedList');
    list.innerHTML = '';
    
    // Pick top 3 most recent articles to recommend
    const recommended = articles.slice(0, 3);
    
    recommended.forEach(article => {
        const li = document.createElement('li');
        li.textContent = article.title;
        li.addEventListener('click', () => {
            // Filter search to show just this article
            document.getElementById('searchInput').value = article.title;
            renderArticles([article]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        list.appendChild(li);
    });
}
