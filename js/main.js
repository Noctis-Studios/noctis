document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 1500);
    }

    // Navigation scroll effect
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        if (sideMenu && menuOverlay && menuToggle) {
            sideMenu.classList.add('open');
            menuOverlay.classList.add('active');
            menuToggle.textContent = 'Close';
            // Use padding instead of changing overflow to prevent shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarWidth + 'px';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        if (sideMenu && menuOverlay && menuToggle) {
            sideMenu.classList.remove('open');
            menuOverlay.classList.remove('active');
            menuToggle.textContent = 'Menu';
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        }
    }

    function toggleMenu() {
        if (sideMenu && sideMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Background switching with video/image support
    const filmItems = document.querySelectorAll('.film-item');
    const backgrounds = document.querySelectorAll('.bg-image');
    let currentBg = null;

    // Initialize backgrounds with proper media
    backgrounds.forEach(bg => {
        const type = bg.getAttribute('data-type');
        const src = bg.getAttribute('data-src');

        if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            bg.appendChild(video);
        } else if (type === 'image') {
            bg.style.backgroundImage = `url('${src}')`;
        }
    });

    filmItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const bgId = item.getAttribute('data-bg');
            const targetBg = document.getElementById(bgId);

            if (currentBg) {
                currentBg.classList.remove('active');
                const video = currentBg.querySelector('video');
                if (video) {
                    video.pause();
                }
            }

            if (targetBg) {
                targetBg.classList.add('active');
                currentBg = targetBg;
                
                const video = targetBg.querySelector('video');
                if (video) {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            }
        });
    });

    // Show first background on load
    if (filmItems.length > 0 && backgrounds.length > 0) {
        const firstBgId = filmItems[0].getAttribute('data-bg');
        const firstBg = document.getElementById(firstBgId);
        if (firstBg) {
            firstBg.classList.add('active');
            currentBg = firstBg;
            
            const video = firstBg.querySelector('video');
            if (video) {
                video.play().catch(e => console.log('Video play failed:', e));
            }
        }
    }

    // Smooth scrolling for menu links
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an external link (starts with http:// or https://)
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                closeMenu();
                // Allow default behavior for external links
                return;
            }
            
            // Check if it's a hash link (internal page link)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    closeMenu();
                    
                    // Wait for menu to close, then scroll
                    setTimeout(() => {
                        targetSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 400);
                }
            } else if (href && !href.endsWith('.html')) {
                // If it's not a hash link and not an HTML file, prevent default
                e.preventDefault();
            } else {
                // For internal HTML files, close menu and allow navigation
                closeMenu();
            }
        });
    });
});
