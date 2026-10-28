/* ==========================================================================
   ESTÉTICA BEITH SHALOM - SCRIPT UNIFICADO INTEGRAL (INDEX)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // 1. SISTEMA DE APARICIÓN Y DESAPARICIÓN POR SCROLL (Intersection Observer)
    // ----------------------------------------------------------------------
    const scrollElements = document.querySelectorAll(".scroll-reveal");

    const scrollObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.12 // Reducido levemente para evitar bloqueos en pantallas móviles
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                // Remueve la clase al salir de pantalla (hacia arriba o abajo)
                entry.target.classList.remove("is-visible");
            }
        });
    }, scrollObserverOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));


    // ----------------------------------------------------------------------
    // 2. CONTROLADOR DINÁMICO DEL CARRUSEL INTERACTIVO 3D (17 Servicios)
    // ----------------------------------------------------------------------
    const track3D = document.getElementById("carouselTrack");
    if (track3D) {
        const cards3D = Array.from(track3D.children);
        let currentIndex3D = 0;

        function updateCarousel3D() {
            const totalCards = cards3D.length;
            cards3D.forEach((card, index) => {
                card.classList.remove('is-active', 'is-left', 'is-right', 'is-hidden');

                if (index === currentIndex3D) {
                    card.classList.add('is-active');
                } else if (index === (currentIndex3D - 1 + totalCards) % totalCards) {
                    card.classList.add('is-left');
                } else if (index === (currentIndex3D + 1) % totalCards) {
                    card.classList.add('is-right');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        }

        cards3D.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return;
                if (card.classList.contains('is-right')) {
                    currentIndex3D = (currentIndex3D + 1) % cards3D.length;
                    updateCarousel3D();
                } else if (card.classList.contains('is-left')) {
                    currentIndex3D = (currentIndex3D - 1 + cards3D.length) % cards3D.length;
                    updateCarousel3D();
                }
            });
        });

        // Deslizamiento táctil para móviles en el carrusel 3D
        let startX3D = 0;
        track3D.addEventListener('touchstart', (e) => { startX3D = e.touches[0].clientX; }, { passive: true });
        track3D.addEventListener('touchend', (e) => {
            let diffX = startX3D - e.changedTouches[0].clientX;
            if (Math.abs(diffX) > 50) {
                currentIndex3D = diffX > 0 ? (currentIndex3D + 1) % cards3D.length : (currentIndex3D - 1 + cards3D.length) % cards3D.length;
                updateCarousel3D();
            }
        }, { passive: true });

        updateCarousel3D();
    }


    // ----------------------------------------------------------------------
    // 3. CONTROLADOR AISLADO PARA EL CARRUSEL DE TESTIMONIOS (Inmune a bloqueos)
    // ----------------------------------------------------------------------
    const reviewSlides = document.querySelectorAll(".review-slide");
    const prevReviewBtn = document.getElementById("prevReviewBtn");
    const nextReviewBtn = document.getElementById("nextReviewBtn");
    let activeReviewIndex = 0;

    // Verificamos de forma estricta que los elementos existan en la página antes de ejecutar
    if (reviewSlides.length > 0 && prevReviewBtn && nextReviewBtn) {
        
        function changeReview(nextIndex) {
            // 1. Quitamos la clase activa a la tarjeta vieja
            reviewSlides[activeReviewIndex].classList.remove("is-active");
            
            // 2. Forzamos un micro-retraso para que el navegador limpie los hilos de renderizado
            activeReviewIndex = nextIndex;
            
            // 3. Añadimos la clase activa a la nueva tarjeta elegida
            reviewSlides[activeReviewIndex].classList.add("is-active");
        }

        // Asignación directa y limpia del evento de clic para avanzar
        nextReviewBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Detiene cualquier comportamiento heredado molesto
            let targetIndex = (activeReviewIndex + 1) % reviewSlides.length;
            changeReview(targetIndex);
        });

        // Asignación directa y limpia del evento de clic para retroceder
        prevReviewBtn.addEventListener("click", (e) => {
            e.preventDefault();
            let targetIndex = (activeReviewIndex - 1 + reviewSlides.length) % reviewSlides.length;
            changeReview(targetIndex);
        });
    }


    // ----------------------------------------------------------------------
    // 4. CONTROLADOR DE VÍDEO CON ESPERA INTERACTIVA (Imagen fija 15s -> Video)
    // ----------------------------------------------------------------------
    const videoEditorial = document.getElementById("editorialVideo");
    const TIEMPO_ESPERA_IMG = 15000; // 15 segundos en milisegundos

    if (videoEditorial) {
        function ejecutarCicloVideo() {
            // Oculta el vídeo y fuerza al navegador a resetear su renderizado
            videoEditorial.classList.remove("is-playing");
            videoEditorial.pause();
            videoEditorial.currentTime = 0;
            videoEditorial.load(); // NUEVO: Fuerza al navegador a liberar la capa del video

            // Espera el lapso establecido mostrando únicamente el fondo
            setTimeout(() => {
                videoEditorial.classList.add("is-playing");
                
                videoEditorial.play().catch(error => {
                    console.warn("La autoreproducción requiere muting estricto:", error);
                });
            }, TIEMPO_ESPERA_IMG);
        }

        // Evento que se dispara automáticamente cuando la pista llega a su fin
        videoEditorial.addEventListener("ended", () => {
            ejecutarCicloVideo();
        });

        // Inicia el primer ciclo de retardo apenas se procese el DOM
        ejecutarCicloVideo();
    }

});
