let newsData = [];

// Fetch news data from the news folder
async function loadNewsData() {
    try {
        const response = await fetch('news/news-index.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }
        
        const data = await response.json();
        
        // Transform the data to match our previous format
        newsData = data.articles.map(article => ({
            id: article.id,
            title: article.title,
            date: article.date,
            excerpt: article.excerpt,
            url: `news.html#${article.id}`,
            file: article.file
        }));
        
        // Render news items after data is loaded
        renderNewsItems();
    } catch (error) {
        console.error('Error loading news data:', error);
        // Fallback: show error message
        const newsGrid = document.getElementById('news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = '<p style="color:#999;text-align:center;">Unable to load news articles.</p>';
        }
    }
}

// Function to render news items on the homepage
function renderNewsItems() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid || newsData.length === 0) return;

    newsGrid.innerHTML = '';
    
    // Show only the 4 most recent news items on homepage
    const recentNews = newsData.slice(0, 4);
    
    recentNews.forEach(item => {
        const article = document.createElement('article');
        article.className = 'news-item';
        article.innerHTML = `
            <div class="news-date">${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-excerpt">${item.excerpt}</p>
        `;
        article.addEventListener('click', () => {
            window.location.href = item.url;
        });
        newsGrid.appendChild(article);
    });
}

// Load news data when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNewsData);
} else {
    loadNewsData();
}
