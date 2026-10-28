/**
 * Wellness Spa Group - Lógica Interactiva Frontend
 * Archivo: spa-index.html.js
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN DEL SISTEMA DE IDIOMAS BILINGÜE ---
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');

    const changeLanguage = (lang) => {
        // Traducir todos los elementos con atributos de datos estándar
        document.querySelectorAll('[data-es]').forEach(elem => {
            if (elem.hasAttribute(`data-${lang}`)) {
                elem.textContent = elem.getAttribute(`data-${lang}`);
            }
        });

        // Soporte específico para selectores y opciones del formulario de contacto
        document.querySelectorAll('select option').forEach(elem => {
            if (elem.hasAttribute(`data-${lang}`)) {
                elem.text = elem.getAttribute(`data-${lang}`);
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
            // Disparar la transición cuando el elemento entre al 85% de la pantalla visible
            if (rect.top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    };

    // Escuchadores de eventos para una ejecución limpia y optimizada
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    
    // Ejecución inmediata inicial por si hay elementos ya visibles en la parte superior
    revealOnScroll();
});
