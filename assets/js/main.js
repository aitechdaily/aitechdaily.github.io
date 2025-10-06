// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light' mode
    const currentTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        html.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark-mode');
        
        const theme = html.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Add a subtle animation
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.classList.add('dark-mode');
            } else {
                html.classList.remove('dark-mode');
            }
        }
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((resolve, reject) => {
            document.execCommand('copy') ? resolve() : reject();
            textArea.remove();
        });
    }
}

// Share functionality
document.addEventListener('DOMContentLoaded', function() {
    const shareButtons = document.querySelectorAll('.share-buttons a');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const url = this.href;
            
            // For social media links, open in popup
            if (url.includes('twitter.com') || url.includes('facebook.com') || url.includes('linkedin.com')) {
                e.preventDefault();
                window.open(url, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
            }
        });
    });
    
    // Native Web Share API support
    if (navigator.share) {
        const shareContainer = document.querySelector('.post-share');
        if (shareContainer) {
            const nativeShareBtn = document.createElement('button');
            nativeShareBtn.textContent = '分享';
            nativeShareBtn.className = 'native-share-btn';
            nativeShareBtn.style.cssText = `
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.875rem;
                font-weight: 500;
                margin-right: 1rem;
            `;
            
            nativeShareBtn.addEventListener('click', async function() {
                try {
                    await navigator.share({
                        title: document.title,
                        text: document.querySelector('meta[name="description"]')?.content || '',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            });
            
            shareContainer.querySelector('.share-buttons').prepend(nativeShareBtn);
        }
    }
});

// Reading progress indicator
document.addEventListener('DOMContentLoaded', function() {
    const article = document.querySelector('.post-content');
    if (!article) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-color);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const articleBottom = articleTop + articleHeight;
        const windowBottom = scrollTop + windowHeight;
        
        if (scrollTop >= articleTop && scrollTop <= articleBottom) {
            const progress = ((scrollTop - articleTop) / (articleHeight - windowHeight)) * 100;
            progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
        }
    });
});

// Table of Contents (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
    
    if (headings.length > 3) {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>目录</h4><ul></ul>';
        
        const tocList = toc.querySelector('ul');
        
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const li = document.createElement('li');
            li.className = `toc-${heading.tagName.toLowerCase()}`;
            li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
            tocList.appendChild(li);
        });
        
        // Insert TOC after the first paragraph
        const firstParagraph = document.querySelector('.post-content p');
        if (firstParagraph) {
            firstParagraph.parentNode.insertBefore(toc, firstParagraph.nextSibling);
        }
        
        // Style the TOC
        toc.style.cssText = `
            background: var(--bg-tertiary);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            margin: 2rem 0;
            border: 1px solid var(--border-color);
        `;
        
        const tocStyles = document.createElement('style');
        tocStyles.textContent = `
            .table-of-contents h4 {
                margin: 0 0 1rem 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }
            .table-of-contents ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .table-of-contents li {
                margin: 0.5rem 0;
            }
            .table-of-contents a {
                color: var(--text-secondary);
                text-decoration: none;
                transition: color 0.3s ease;
            }
            .table-of-contents a:hover {
                color: var(--primary-color);
            }
            .toc-h2 { padding-left: 1rem; }
            .toc-h3 { padding-left: 2rem; }
        `;
        document.head.appendChild(tocStyles);
    }
});

// Search functionality (basic)
document.addEventListener('DOMContentLoaded', function() {
    // Add search box to header if needed
    const headerTools = document.querySelector('.header-tools');
    if (headerTools && window.location.pathname === '/') {
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '搜索文章...';
        searchBox.className = 'search-box';
        searchBox.style.cssText = `
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 0.875rem;
            width: 200px;
        `;
        
        searchBox.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // Updated selectors for new article layout
            const posts = document.querySelectorAll('.article-card, .post-card, .featured-post, .post-item, article');
            
            posts.forEach(post => {
                const titleElement = post.querySelector('h2 a, h3 a, h2, h3, .post-title');
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const content = post.textContent.toLowerCase();
                
                if (title.includes(query) || content.includes(query)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = query ? 'none' : 'block';
                }
            });
        });
        
        headerTools.insertBefore(searchBox, headerTools.firstChild);
    }
});

// Performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Optional: Send error to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.toString(),
            'fatal': false
        });
    }
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '跳转到主要内容';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
});

// Infinite scroll and pagination for home page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        initializeHomePage();
    }
    
    // Date navigation for post pages
    if (document.getElementById('year-selector')) {
        initializeDateNavigation();
    }
    
    // Tag page infinite scroll
    if (document.getElementById('tag-posts-data')) {
        initializeTagPage();
    }
});

function initializeHomePage() {
    const postsDataElement = document.getElementById('posts-data');
    if (!postsDataElement) return;
    
    let allPosts = [];
    try {
        allPosts = JSON.parse(postsDataElement.textContent);
    } catch (e) {
        console.error('Failed to parse posts data:', e);
        return;
    }
    
    const articlesGrid = document.getElementById('articles-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const loadMoreContainer = document.getElementById('load-more-container');
    
    let currentPage = 0;
    const postsPerPage = 12;
    
    function createArticleCard(post) {
        const tagLinks = post.tags.map(tag => {
            const tagSlug = tag.toLowerCase()
                .replace(/\s+/g, '-')
                .replace('三星', '三星')
                .replace('AI代理', 'ai代理')
                .replace('AI技术', 'ai技术')
                .replace('ASI', 'asi')
                .replace('Anthropic', 'anthropic')
                .replace('Claude', 'claude')
                .replace('Gemini', 'gemini')
                .replace('GitHub Pages', 'github-pages')
                .replace('Google', 'google')
                .replace('Jekyll', 'jekyll')
                .replace('Manus', 'manus')
                .replace('NVIDIA', 'nvidia')
                .replace('OpenAI', 'openai')
                .replace('Sora', 'sora')
                .replace('人工智能', '人工智能')
                .replace('商业化', '商业化')
                .replace('多模态', '多模态')
                .replace('测试发布', '测试发布')
                .replace('科技新闻', '科技新闻')
                .replace('自动化', '自动化')
                .replace('芯片', '芯片')
                .replace('芯片政策', '芯片政策')
                .replace('融资', '融资')
                .replace('行业动态', '行业动态')
                .replace('阿里巴巴', '阿里巴巴');
            return `<a href="/tags/${tagSlug}/" class="tag">${tag}</a>`;
        }).join('');
        
        return `
            <article class="article-card">
                <div class="article-image">
                    <img src="/assets/images/tag-${post.first_tag}.jpg" alt="${post.first_tag}" onerror="this.src='/assets/images/tag-人工智能.jpg'">
                    <div class="article-date">
                        <span class="day">${post.day}</span>
                        <span class="month">${post.month}</span>
                    </div>
                </div>
                <div class="article-content">
                    <h2><a href="${post.url}">${post.title}</a></h2>
                    <div class="article-meta">
                        <time>${post.display_date}</time>
                        <span class="author">${post.author}</span>
                    </div>
                    <div class="article-excerpt">
                        ${post.description}
                    </div>
                    <div class="article-tags">
                        ${tagLinks}
                    </div>
                </div>
            </article>
        `;
    }
    
    function loadMorePosts() {
        const startIndex = currentPage * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToLoad = allPosts.slice(startIndex, endIndex);
        
        if (postsToLoad.length === 0) {
            loadMoreContainer.style.display = 'none';
            return;
        }
        
        loadingIndicator.style.display = 'block';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            postsToLoad.forEach(post => {
                articlesGrid.insertAdjacentHTML('beforeend', createArticleCard(post));
            });
            
            currentPage++;
            loadingIndicator.style.display = 'none';
            loadMoreBtn.disabled = false;
            
            // Hide load more button if no more posts
            if (endIndex >= allPosts.length) {
                loadMoreContainer.style.display = 'none';
            }
        }, 800);
    }
    
    // Load initial posts
    loadMorePosts();
    
    // Load more button click
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }
    
    // Infinite scroll
    let isLoading = false;
    window.addEventListener('scroll', () => {
        if (isLoading) return;
        
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= docHeight - 1000) {
            if (currentPage * postsPerPage < allPosts.length) {
                isLoading = true;
                loadMorePosts();
                setTimeout(() => { isLoading = false; }, 1000);
            }
        }
    });
}

function initializeDateNavigation() {
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    const dateList = document.getElementById('date-list');
    
    // Get all posts data for date navigation
    const allPosts = [];
    
    // This would be populated from Jekyll data in a real implementation
    // For now, we'll use a simplified approach
    
    function updateDateList() {
        const selectedYear = yearSelector.value;
        const selectedMonth = monthSelector.value;
        
        if (!selectedYear || !selectedMonth) {
            dateList.innerHTML = '<div class="date-item">请选择年份和月份</div>';
            return;
        }
        
        // In a real implementation, this would filter posts by date
        // For now, show a placeholder
        dateList.innerHTML = `
            <div class="date-item">
                <a href="/">正在加载 ${selectedYear}年${parseInt(selectedMonth)}月的文章...</a>
            </div>
        `;
    }
    
    yearSelector.addEventListener('change', updateDateList);
    monthSelector.addEventListener('change', updateDateList);
}

function initializeTagPage() {
    const postsDataElement = document.getElementById('tag-posts-data');
    if (!postsDataElement) return;
    
    let allPosts = [];
    try {
        allPosts = JSON.parse(postsDataElement.textContent);
    } catch (e) {
        console.error('Failed to parse tag posts data:', e);
        return;
    }
    
    const articlesGrid = document.getElementById('tag-articles-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const loadMoreContainer = document.getElementById('load-more-container');
    
    let currentPage = 0;
    const postsPerPage = 9;
    
    function createTagArticleCard(post) {
        const tagSpans = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        return `
            <article class="article-card">
                <div class="article-image">
                    <img src="/assets/images/tag-${post.first_tag}.jpg" alt="${post.first_tag}" onerror="this.src='/assets/images/tag-人工智能.jpg'">
                </div>
                <div class="article-content">
                    <h2><a href="${post.url}">${post.title}</a></h2>
                    <div class="article-meta">
                        <time>${post.display_date}</time>
                        <span class="author">${post.author}</span>
                    </div>
                    <div class="article-excerpt">
                        ${post.description}
                    </div>
                    <div class="article-tags">
                        ${tagSpans}
                    </div>
                </div>
            </article>
        `;
    }
    
    function loadMoreTagPosts() {
        const startIndex = currentPage * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToLoad = allPosts.slice(startIndex, endIndex);
        
        if (postsToLoad.length === 0) {
            loadMoreContainer.style.display = 'none';
            return;
        }
        
        loadingIndicator.style.display = 'block';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            postsToLoad.forEach(post => {
                articlesGrid.insertAdjacentHTML('beforeend', createTagArticleCard(post));
            });
            
            currentPage++;
            loadingIndicator.style.display = 'none';
            loadMoreBtn.disabled = false;
            
            // Hide load more button if no more posts
            if (endIndex >= allPosts.length) {
                loadMoreContainer.style.display = 'none';
            }
        }, 600);
    }
    
    // Load initial posts
    loadMoreTagPosts();
    
    // Load more button click
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreTagPosts);
    }
    
    // Infinite scroll
    let isLoading = false;
    window.addEventListener('scroll', () => {
        if (isLoading) return;
        
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= docHeight - 1000) {
            if (currentPage * postsPerPage < allPosts.length) {
                isLoading = true;
                loadMoreTagPosts();
                setTimeout(() => { isLoading = false; }, 800);
            }
        }
    });
}

// Global function for date navigation
function navigateToDate() {
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    const dateList = document.getElementById('date-list');
    
    const selectedYear = yearSelector.value;
    const selectedMonth = monthSelector.value;
    
    if (selectedYear && selectedMonth) {
        // Navigate to archive page or filter posts
        const archiveUrl = `/?year=${selectedYear}&month=${selectedMonth}`;
        // For now, just update the date list
        dateList.innerHTML = `
            <div class="date-item">
                <a href="${archiveUrl}">查看 ${selectedYear}年${parseInt(selectedMonth)}月的所有文章</a>
            </div>
        `;
    }
}

// Console message
console.log(`
🤖 AI Tech Daily - Powered by Manus AI
📧 Contact: contact@aitechdaily.com
🌐 Website: https://aitechdaily.github.io
`);
