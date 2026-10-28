/**
 * Wellness Spa Group - Lógica Interactiva Frontend
 * Subpágina: spa-faciales.html
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN DEL SISTEMA DE IDIOMAS BILINGÜE ---
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');

    const changeLanguage = (lang) => {
        document.querySelectorAll('[data-es]').forEach(elem => {
            if (elem.hasAttribute(`data-${lang}`)) {
                elem.textContent = elem.getAttribute(`data-${lang}`);
            }
        });
    };

    if (btnEs && btnEn) {
        btnEs.addEventListener('click', () => {
            btnEs.classList.add('active');
            btnEn.classList.remove('active');
            changeLanguage('es');
        });

        btnEn.addEventListener('click', () => {
            btnEn.classList.add('active');
            btnEs.classList.remove('active');
            changeLanguage('en');
        });
    }


    // --- 2. SISTEMA ANIMADO AL HACER SCROLL (SCROLL REVEAL) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    
    revealOnScroll();
});
