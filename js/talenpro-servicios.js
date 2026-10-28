document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll('.item-servicio');

    const opciones = {
        root: null, // Usa la pantalla del dispositivo
        rootMargin: "-50px 0px -50px 0px", // Margen interno para que no aparezcan tan al borde de la pantalla
        threshold: 0.1 // Se activa en cuanto asoma el 10% de la tarjeta
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Al hacer scroll (abajo o arriba): si entra al viewport, se muestra
                entry.target.classList.add('visible');
            } else {
                // Si sale del viewport, evaluamos hacia dónde se movió el usuario
                const rect = entry.boundingClientRect;
                
                // Si la tarjeta quedó por debajo de la pantalla activa (el usuario subió)
                // o si quedó muy arriba, la ocultamos para que pueda volver a animarse
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, opciones);

    items.forEach(item => {
        observer.observe(item);
    });
});
