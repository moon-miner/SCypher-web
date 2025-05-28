// main.js - Main functionality for Scypher website
// Versión 2.0 - Con Sistema de Themes Dark/Light

// Current language and theme
let currentLang = 'en';
let currentTheme = 'dark'; // DARK MODE POR DEFECTO

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Scypher website loading...');

    // Initialize theme FIRST (before language to avoid flashing)
    initializeTheme();

    // Initialize language
    initializeLanguage();

    // Setup navigation
    setupNavigation();

    // Setup smooth scrolling
    setupSmoothScroll();

    // Setup mobile menu
    setupMobileMenu();

    console.log('✅ Website initialized successfully');
    console.log(`🎨 Current theme: ${currentTheme}`);
    console.log(`🌐 Current language: ${currentLang}`);
});

// ========================================
// THEME SYSTEM - NUEVO COMPLETO
// ========================================

function initializeTheme() {
    console.log('🎨 Initializing theme system...');

    // Check for saved theme preference, default to 'dark'
    const savedTheme = localStorage.getItem('scypher-theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        currentTheme = savedTheme;
        console.log('💾 Using saved theme:', currentTheme);
    } else {
        // Check user preference, but default to dark
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'dark'; // Always default to dark for now
        console.log('🌙 Using default theme: dark');
    }

    // Apply theme immediately to prevent flash
    applyTheme(currentTheme);

    // Setup theme toggle
    setupThemeToggle();

    // Listen for system theme changes (optional)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        console.log('🔄 System theme changed to:', e.matches ? 'dark' : 'light');
        // Don't auto-switch if user has manually set a preference
        if (!localStorage.getItem('scypher-theme')) {
            // Keep dark as default even if system changes
            // applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    console.log('✅ Theme system initialized');
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.warn('⚠️ Theme toggle element not found');
        return;
    }

    // Setup click handlers for theme options
    const themeOptions = themeToggle.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            if (selectedTheme && selectedTheme !== currentTheme) {
                console.log('🔄 Theme switch requested:', currentTheme, '->', selectedTheme);
                switchTheme(selectedTheme);
            }
        });
    });

    // Setup keyboard navigation
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            switchTheme(newTheme);
        }
    });

    // Make toggle focusable
    themeToggle.setAttribute('tabindex', '0');
    themeToggle.setAttribute('role', 'button');
    themeToggle.setAttribute('aria-label', 'Toggle between dark and light themes');

    console.log('✅ Theme toggle setup complete');
}

function switchTheme(newTheme) {
    if (newTheme === currentTheme) return;

    console.log('🎨 Switching theme:', currentTheme, '->', newTheme);

    // Show loading state briefly
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.style.opacity = '0.7';
    }

    // Apply new theme
    currentTheme = newTheme;
    applyTheme(currentTheme);

    // Save preference
    localStorage.setItem('scypher-theme', currentTheme);

    // Restore toggle appearance
    setTimeout(() => {
        if (themeToggle) {
            themeToggle.style.opacity = '1';
        }
    }, 150);

    console.log('✅ Theme switched successfully to:', currentTheme);
}

function applyTheme(theme) {
    console.log('🎨 Applying theme:', theme);

    // Set theme attribute on document root
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle UI
    updateThemeToggleUI(theme);

    // Dispatch custom event for other components
    const themeChangeEvent = new CustomEvent('themeChange', {
        detail: { theme: theme }
    });
    document.dispatchEvent(themeChangeEvent);

    console.log('✅ Theme applied:', theme);
}

function updateThemeToggleUI(theme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions.length === 0) {
        console.warn('⚠️ Theme options not found for UI update');
        return;
    }

    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme');
        if (optionTheme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Update toggle aria-label
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentModeText = theme === 'dark' ? 'Dark' : 'Light';
        const nextModeText = theme === 'dark' ? 'Light' : 'Dark';
        themeToggle.setAttribute('aria-label', `Current theme: ${currentModeText}. Click to switch to ${nextModeText} mode`);
    }

    console.log('🎨 Theme toggle UI updated for:', theme);
}

// Function to get current theme (for use by other scripts)
function getCurrentTheme() {
    return currentTheme;
}

// ========================================
// LANGUAGE SYSTEM (PRESERVED)
// ========================================

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

function handleLanguageChange(e) {
    console.log('🔄 Changing language to:', e.target.value);
    currentLang = e.target.value;
    localStorage.setItem('scypher-lang', currentLang);
    applyTranslations();
}

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

// ========================================
// NAVIGATION SYSTEM (PRESERVED)
// ========================================

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

// ========================================
// SMOOTH SCROLLING (PRESERVED)
// ========================================

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

// ========================================
// MOBILE MENU (PRESERVED + THEME SUPPORT)
// ========================================

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

        // Update aria attributes for accessibility
        const isOpen = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        navMenu.setAttribute('aria-hidden', !isOpen);

        console.log('🔄 Mobile menu toggled:', isOpen ? 'open' : 'closed');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
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
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                console.log('📱 Mobile menu closed (link clicked)');
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            navToggle.focus(); // Return focus to toggle button
            console.log('📱 Mobile menu closed (escape key)');
        }
    });

    // Set initial aria attributes
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'nav-menu');
    navMenu.setAttribute('aria-hidden', 'true');
    navMenu.setAttribute('id', 'nav-menu');

    console.log('✅ Mobile menu setup complete');
}

// ========================================
// UTILITY FUNCTIONS (PRESERVED + ENHANCED)
// ========================================

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

function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading';
    return spinner;
}

// ========================================
// ERROR HANDLING (ENHANCED)
// ========================================

window.addEventListener('error', function(e) {
    console.error('❌ Uncaught error:', e.error);
    console.error('📍 Error location:', e.filename, 'line', e.lineno);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
});

// ========================================
// THEME CHANGE LISTENER FOR OTHER COMPONENTS
// ========================================

document.addEventListener('themeChange', function(e) {
    console.log('🎨 Theme change event received:', e.detail.theme);

    // Notify other components if needed
    // This can be used by donation.js, download.js etc. if they need theme info

    // Example: Update any theme-dependent elements
    const themeIndicator = document.querySelector('.demo-indicator');
    if (themeIndicator) {
        themeIndicator.textContent = `${e.detail.theme === 'dark' ? '🌙' : '☀️'} ${e.detail.theme.toUpperCase()} MODE`;
    }
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Focus management for theme toggle
document.addEventListener('keydown', function(e) {
    // Alt + T to toggle theme (keyboard shortcut)
    if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        switchTheme(newTheme);

        // Announce to screen readers
        const announcement = `Theme switched to ${newTheme} mode`;
        announceToScreenReader(announcement);
    }
});

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ========================================
// EXPORT FUNCTIONS FOR OTHER SCRIPTS
// ========================================

if (typeof window !== 'undefined') {
    window.scypherMain = {
        showStatus,
        getTranslation,
        createLoadingSpinner,
        getCurrentTheme,
        switchTheme,
        applyTheme
    };

    // Make theme functions globally available
    window.getCurrentTheme = getCurrentTheme;
    window.switchTheme = switchTheme;

    console.log('✅ Global functions exported');
}
