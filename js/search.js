document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('searchIcon');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Open search overlay
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 400);
        });
    }

    // Close search overlay
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Search functionality - wait for newsData to be loaded
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length === 0) {
                searchResults.innerHTML = '';
                return;
            }

            // Check if newsData is loaded
            if (typeof newsData === 'undefined' || newsData.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item"><div class="search-result-title">Loading news data...</div></div>';
                return;
            }

            const filtered = newsData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.excerpt.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item"><div class="search-result-title">No results found</div></div>';
                return;
            }

            searchResults.innerHTML = filtered.map(item => `
                <a href="${item.url}" class="search-result-item" style="text-decoration: none; display: block;">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-excerpt">${item.excerpt}</div>
                </a>
            `).join('');
        });
    }
});
