/**
 * XEER ENTERPRISE OUTSOURCING - LÓGICA CORE DE INTERACCIONES (MAIN.JS)
 * Desarrollado en JavaScript Nativo para máximo rendimiento y carga fluida.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. EFECTO REVELAR TEXTOS Y TARJETAS AL HACER SCROLL (Scroll Reveal)
    // ==========================================================================
    // Vincula las clases de animación cuando el elemento entra en el campo visual.
    const scrollElements = document.querySelectorAll('.reto-card, .service-card, .talento-card, .cert-block, .inmo-card, .contacto-info-sidebar, .contacto-form-sidebar');
    
    // Añadimos la clase base de preparación de forma dinámica si no se puso en el HTML
    scrollElements.forEach(el => el.classList.add('fade-up-element'));

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Deja de vigilarlo una vez animado
            }
        });
    }, {
        threshold: 0.15, // Se dispara cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px" // Margen inferior para retrasar sutilmente la aparición
    });

    scrollElements.forEach(el => scrollObserver.observe(el));


    // ==========================================================================
    // 2. CONTADORES NUMÉRICOS ANIMADOS (Estadísticas del PDF)
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');
    
    const animateCounters = (counterElement) => {
        const target = +counterElement.getAttribute('data-target'); // El número final (ej: 1500)
        const duration = 2000; // Duración total de la animación en milisegundos (2 segundos)
        const speed = duration / target;
        
        let count = 0;
        
        // Estrategia de incremento para números grandes (ej: +1500 colaboradores)
        // Incrementa a pasos más grandes para que termine exactamente al mismo tiempo
        const increment = target > 100 ? Math.ceil(target / 100) : 1;

        const updateCount = () => {
            count += increment;
            
            if (count < target) {
                // Si el objetivo es 1500, añadimos el formato de coma ejecutiva (+1,500)
                if (target >= 1000) {
                    counterElement.innerText = "+" + count.toLocaleString('en-US');
                } else {
                    counterElement.innerText = "+" + count;
                }
                setTimeout(updateCount, duration / (target / increment));
            } else {
                // Forzar el valor exacto final con formato corporativo al terminar
                counterElement.innerText = target >= 1000 ? "+" + target.toLocaleString('en-US') : "+" + target;
            }
        };

        updateCount();
    };

    // Observador para activar los contadores SOLO cuando el usuario baje hasta esa sección
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => animateCounters(counter));
                    observer.unobserve(entry.target); // Se ejecuta una única vez
                }
            });
        }, { threshold: 0.4 }); // Se activa cuando el 40% de la sección de estadísticas es visible

        statsObserver.observe(statsSection);
    }


    // ==========================================================================
    // 3. BARRA DE NAVEGACIÓN INTELIGENTE (Header Scroll Morph)
    // ==========================================================================
    // Cambia sutilmente el fondo del menú al bajar para dar sobriedad en el index
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.style.backgroundColor = 'rgba(11, 19, 43, 0.98)'; // Transparencia ejecutiva profunda
                mainHeader.style.backdropFilter = 'blur(10px)'; // Efecto vidrio esmerilado moderno
                mainHeader.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            } else {
                // Regresa a su estado inicial según el CSS global
                mainHeader.style.backgroundColor = ''; 
                mainHeader.style.backdropFilter = '';
                mainHeader.style.boxShadow = '';
            }
        });
    }

});
