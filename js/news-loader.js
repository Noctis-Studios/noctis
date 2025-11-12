// Load and render full news articles on the news page
async function loadNewsArticles() {
    const articlesContent = document.getElementById('news-articles-content');
    if (!articlesContent) return;

    try {
        const response = await fetch('news/news-index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Load full content from markdown files
        const articles = await Promise.all(
            data.articles.map(async (article) => {
                try {
                    const mdResponse = await fetch(`news/${article.file}`);
                    const mdContent = await mdResponse.text();
                    
                    // Parse markdown content
                    const parsedContent = parseMarkdown(mdContent);
                    
                    return {
                        ...article,
                        fullContent: parsedContent
                    };
                } catch (error) {
                    console.error(`Error loading ${article.file}:`, error);
                    return {
                        ...article,
                        fullContent: `<p>${article.excerpt}</p>`
                    };
                }
            })
        );
        
        // Render articles
        articlesContent.innerHTML = articles.map(article => `
            <article class="news-article-full" id="${article.id}">
                <div class="news-article-date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <h2 class="news-article-title">${article.title}</h2>
                <div class="news-article-image" ${article.image ? `style="background-image: url('${article.image}')"` : ''}></div>
                <div class="news-article-body">
                    ${article.fullContent}
                </div>
            </article>
        `).join('');
        
        // Scroll to article if hash is present
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
        
    } catch (error) {
        console.error('Error loading news articles:', error);
        articlesContent.innerHTML = '<p style="color:#999;text-align:center;padding:60px 0;">Unable to load news articles.</p>';
    }
}

// Simple markdown parser
function parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    let inFrontMatter = false;
    let html = [];
    let inParagraph = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Skip front matter
        if (line.trim() === '---') {
            inFrontMatter = !inFrontMatter;
            continue;
        }
        if (inFrontMatter) continue;
        
        // Skip main title (# Title)
        if (line.match(/^# .+/)) continue;
        
        // Handle H2 headings (## Heading)
        if (line.match(/^## .+/)) {
            if (inParagraph) {
                html.push('</p>');
                inParagraph = false;
            }
            html.push(`<h3 class="news-article-subtitle">${line.replace(/^## /, '')}</h3>`);
            continue;
        }
        
        // Handle H3 headings (### Heading)
        if (line.match(/^### .+/)) {
            if (inParagraph) {
                html.push('</p>');
                inParagraph = false;
            }
            html.push(`<h4 class="news-article-subheading">${line.replace(/^### /, '')}</h4>`);
            continue;
        }
        
        // Handle bold text date pattern (**text**)
        if (line.match(/^\*\*.+\*\*$/)) {
            if (inParagraph) {
                html.push('</p>');
                inParagraph = false;
            }
            continue; // Skip date line as it's already in the header
        }
        
        // Handle empty lines
        if (line.trim() === '') {
            if (inParagraph) {
                html.push('</p>');
                inParagraph = false;
            }
            continue;
        }
        
        // Handle regular paragraphs
        if (!inParagraph) {
            html.push('<p>');
            inParagraph = true;
        }
        
        // Process inline markdown
        line = line
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.+?)`/g, '<code>$1</code>'); // Code
        
        html.push(line);
    }
    
    if (inParagraph) {
        html.push('</p>');
    }
    
    return html.join('\n');
}

// Load articles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNewsArticles);
} else {
    loadNewsArticles();
}
