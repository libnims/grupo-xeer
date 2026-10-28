          document.addEventListener('DOMContentLoaded', () => {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const capCards = document.querySelectorAll('.cap-card-premium');

            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    capCards.forEach(card => {
                        card.style.transform = 'scale(0.8)';
                        card.style.opacity = '0';
                        
                        setTimeout(() => {
                            if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                                card.style.display = 'block';
                                setTimeout(() => {
                                    card.style.transform = 'scale(1)';
                                    card.style.opacity = '1';
                                }, 50);
                            } else {
                                card.style.display = 'none';
                            }
                        }, 300);
                    });
                });
            });
        });
    