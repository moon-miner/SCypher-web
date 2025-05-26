// main.js - Main functionality for Scypher website

// Current language
let currentLang = 'en';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Scypher website loading...');

    // Initialize language
    initializeLanguage();

    // Setup navigation
    setupNavigation();

    // Setup smooth scrolling
    setupSmoothScroll();

    // Setup mobile menu
    setupMobileMenu();

    console.log('✅ Website initialized successfully');
});

// Language initialization and switching
function initializeLanguage() {
    console.log('🌐 Initializing language system...');

    // Check for saved language preference
    const savedLang = localStorage.getItem('scypher-lang');
    if (savedLang && translations && translations[savedLang]) {
        currentLang = savedLang;
        console.log('📝 Using saved language:', currentLang);
    } else {
        // Detect browser language
        const browserLang = navigator.language.substring(0, 2);
        if (translations && translations[browserLang]) {
            currentLang = browserLang;
            console.log('🌍 Using browser language:', currentLang);
        } else {
            console.log('🇺🇸 Using default language: en');
        }
    }

    // Set language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', handleLanguageChange);
        console.log('✅ Language selector initialized');
    }

    // Apply translations
    applyTranslations();
}

// Handle language change
function handleLanguageChange(e) {
    console.log('🔄 Changing language to:', e.target.value);
    currentLang = e.target.value;
    localStorage.setItem('scypher-lang', currentLang);
    applyTranslations();
}

// Apply translations to all elements
function applyTranslations() {
    if (!translations || !translations[currentLang]) {
        console.warn('⚠️ Translations not available for language:', currentLang);
        return;
    }

    const elements = document.querySelectorAll('[data-i18n]');
    console.log('🔤 Applying translations to', elements.length, 'elements');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation && translation !== key) {
            element.textContent = translation;
        }
    });

    console.log('✅ Translations applied');
}

// Get translation by key path
function getTranslation(keyPath) {
    if (!translations || !translations[currentLang]) {
        return keyPath;
    }

    const keys = keyPath.split('.');
    let value = translations[currentLang];

    for (const key of keys) {
        if (value && value[key]) {
            value = value[key];
        } else {
            // Fallback to English
            value = translations.en;
            for (const k of keys) {
                if (value && value[k]) {
                    value = value[k];
                } else {
                    return keyPath; // Return key if translation not found
                }
            }
            break;
        }
    }

    return value;
}

// Setup navigation active states
function setupNavigation() {
    console.log('🧭 Setting up navigation...');

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    if (navLinks.length === 0 || sections.length === 0) {
        console.warn('⚠️ Navigation elements not found');
        return;
    }

    // Update active link on scroll
    let ticking = false;

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    });

    console.log('✅ Navigation setup complete');
}

// Setup smooth scrolling
function setupSmoothScroll() {
    console.log('📜 Setting up smooth scrolling...');

    const links = document.querySelectorAll('a[href^="#"]');
    console.log('🔗 Found', links.length, 'internal links');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }

                console.log('📍 Scrolled to section:', targetId);
            } else {
                console.warn('⚠️ Target section not found:', targetId);
            }
        });
    });

    console.log('✅ Smooth scrolling setup complete');
}

// Setup mobile menu
function setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) {
        console.warn('⚠️ Mobile menu elements not found');
        return;
    }

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        console.log('🔄 Mobile menu toggled:', navMenu.classList.contains('active') ? 'open' : 'closed');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                console.log('📱 Mobile menu closed (click outside)');
            }
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                console.log('📱 Mobile menu closed (link clicked)');
            }
        });
    });

    console.log('✅ Mobile menu setup complete');
}

// Utility function to show status messages
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.innerHTML = `<div class="status-message ${type}">${message}</div>`;
        statusElement.style.display = 'block';

        console.log(`📢 Status (${type}):`, message);

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                if (statusElement) {
                    statusElement.style.display = 'none';
                }
            }, 5000);
        }
    } else {
        console.log(`📢 Status (${type}) [${elementId}]:`, message);
    }
}

// Utility function to create loading spinner
function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading';
    return spinner;
}

// Error handling for uncaught errors
window.addEventListener('error', function(e) {
    console.error('❌ Uncaught error:', e.error);
    console.error('📍 Error location:', e.filename, 'line', e.lineno);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.scypherMain = {
        showStatus,
        getTranslation,
        createLoadingSpinner
    };
}
