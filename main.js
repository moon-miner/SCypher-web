// main.js - Main functionality for Scypher website

// Current language
let currentLang = 'en';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    initializeLanguage();

    // Setup navigation
    setupNavigation();

    // Setup smooth scrolling
    setupSmoothScroll();

    // Setup mobile menu
    setupMobileMenu();
});

// Language initialization and switching
function initializeLanguage() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('scypher-lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else {
        // Detect browser language
        const browserLang = navigator.language.substring(0, 2);
        if (translations[browserLang]) {
            currentLang = browserLang;
        }
    }

    // Set language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', handleLanguageChange);
    }

    // Apply translations
    applyTranslations();
}

// Handle language change
function handleLanguageChange(e) {
    currentLang = e.target.value;
    localStorage.setItem('scypher-lang', currentLang);
    applyTranslations();
}

// Apply translations to all elements
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });
}

// Get translation by key path
function getTranslation(keyPath) {
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
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Update active link on scroll
    window.addEventListener('scroll', () => {
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
    });
}

// Setup smooth scrolling
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

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
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Utility function to show status messages
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `${statusElement.className.split(' ')[0]} ${type}`;
        statusElement.style.display = 'block';

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }
}

// Utility function to create loading spinner
function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading';
    return spinner;
}
