// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const userMenu = document.querySelector('.user-menu');
const dropdownMenu = document.querySelector('.dropdown-menu');
const logoutBtn = document.querySelector('.logout');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-btn');
const searchTags = document.querySelectorAll('.search-tags a');
const joinBtns = document.querySelectorAll('.join-btn');
const downloadBtns = document.querySelectorAll('.download-btn');
const registerBtns = document.querySelectorAll('.register-btn');
const viewAllLink = document.querySelector('.view-all');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', newTheme);
});

// User Menu Toggle
userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
});

// Search Functionality
const handleSearch = (query) => {
    // Simulate search functionality
    console.log('Searching for:', query);
    // Here you would typically make an API call to search
    // For now, we'll just show a loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    setTimeout(() => {
        searchBtn.innerHTML = 'Search';
        // Redirect to search results page
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }, 1000);
};

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        handleSearch(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            handleSearch(query);
        }
    }
});

// Search Tags
searchTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        const query = tag.textContent;
        searchInput.value = query;
        handleSearch(query);
    });
});

// Activity Buttons
joinBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            btn.innerHTML = 'Joined';
            btn.disabled = true;
            btn.style.backgroundColor = 'var(--success-color)';
        } catch (error) {
            console.error('Failed to join:', error);
            btn.innerHTML = 'Join';
        }
    });
});

downloadBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            btn.innerHTML = 'Downloaded';
            btn.disabled = true;
            btn.style.backgroundColor = 'var(--success-color)';
        } catch (error) {
            console.error('Failed to download:', error);
            btn.innerHTML = 'Download';
        }
    });
});

registerBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            btn.innerHTML = 'Registered';
            btn.disabled = true;
            btn.style.backgroundColor = 'var(--success-color)';
        } catch (error) {
            console.error('Failed to register:', error);
            btn.innerHTML = 'Register';
        }
    });
});

// View All Link
viewAllLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Redirect to activities page
    window.location.href = 'activities.html';
});

// Scroll Animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.quick-access-card, .activity-card');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);
        
        if (isVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial animation setup
document.querySelectorAll('.quick-access-card, .activity-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);
// Initial check for elements in view
animateOnScroll();

// Quick Access Card Click Animation
document.querySelectorAll('.quick-access-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        ripple.classList.add('active');
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}); 