/* ============================================
   THEME MANAGEMENT
   ============================================ */

const ThemeManager = (() => {
    const THEME_KEY = 'sg-theme';
    const DARK_MODE_CLASS = 'light-mode';

    const init = () => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const isDarkMode = savedTheme === null || savedTheme === 'dark';
        
        if (!isDarkMode) {
            document.body.classList.add(DARK_MODE_CLASS);
            updateThemeIcon('☀️');
        } else {
            updateThemeIcon('🌙');
        }

        setupEventListeners();
    };

    const setupEventListeners = () => {
        const themeToggle = document.getElementById('themeToggle');
        const hamburger = document.getElementById('hamburger');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu on link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
            });
        });
    };

    const toggleTheme = () => {
        const isCurrentlyDark = !document.body.classList.contains(DARK_MODE_CLASS);
        
        if (isCurrentlyDark) {
            document.body.classList.add(DARK_MODE_CLASS);
            localStorage.setItem(THEME_KEY, 'light');
            updateThemeIcon('☀️');
        } else {
            document.body.classList.remove(DARK_MODE_CLASS);
            localStorage.setItem(THEME_KEY, 'dark');
            updateThemeIcon('🌙');
        }
    };

    const toggleMobileMenu = () => {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(12px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-12px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    };

    const updateThemeIcon = (icon) => {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = icon;
        }
    };

    return {
        init,
        toggleTheme
    };
})();

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', ThemeManager.init);
