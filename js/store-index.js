
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VARIABLES GLOBALES DE CONTROL DE CARRITO ---
    let currentLang = 'es';
    let totalCartUnits = 0;
    let shoppingCartItems = {};
    let currentSelectedVariants = {}; // Control de stock para esencias

    // Elementos persistentes de la interfaz
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    const globalCartCounter = document.getElementById('cart-global-counter');
    const navCartTrigger = document.getElementById('nav-cart-trigger');
    
    // Elementos del modal de detalle de producto
    const modal = document.getElementById('product-detail-modal');
    const modalCloseX = document.getElementById('modal-close-x');
    const modalCloseBase = document.getElementById('modal-close-base');
    const btnQtyMinus = document.getElementById('btn-qty-minus');
    const btnQtyPlus = document.getElementById('btn-qty-plus');
    const qtyInput = document.getElementById('qty-counter-input');
    const btnAddCart = document.getElementById('btn-add-to-cart');

    // Nodos para variantes de esencias (Ubicados de forma segura)
    const modalVariantsSection = document.getElementById('modal-variants-section');
    const variantsSelectorsContainer = document.getElementById('variants-selectors-container');
    const normalQtyWrapper = qtyInput ? qtyInput.closest('.quantity-selector-wrapper') : null;

    // Nodos internos del modal de detalle para inyección técnica dinámica
    const mBrandSubtitle = document.getElementById('modal-brand-subtitle');
    const mFluidTitle = document.getElementById('modal-brand-fluid-title');
    const mProductImg = document.getElementById('modal-product-img');
    const mProductTitle = document.getElementById('modal-product-title');
    const mNetWeight = document.getElementById('modal-product-net-weight');
    const mBenefits = document.getElementById('modal-product-benefits');
    const mUsage = document.getElementById('modal-product-usage');
    const mIngredients = document.getElementById('modal-product-ingredients');
    const mPrecautions = document.getElementById('modal-product-precautions');
    const mPrice = document.getElementById('modal-product-price');


        // --- 2. MOTOR DE IDIOMAS BILINGÜE NATIVO ---
    const changeLanguage = (lang) => {
        currentLang = lang;
        
        // Traducir elementos de marcado estándar con atributos data-es and data-en
        document.querySelectorAll('[data-es]').forEach(elem => {
            if (elem.hasAttribute(`data-${lang}`)) {
                elem.textContent = elem.getAttribute(`data-${lang}`);
            }
        });

        // Traducir los placeholders dinámicos del buscador y formularios
        document.querySelectorAll('[data-placeholder-es]').forEach(elem => {
            if (elem.hasAttribute(`data-placeholder-${lang}`)) {
                elem.placeholder = elem.getAttribute(`data-placeholder-${lang}`);
            }
        });

        // Traducir opciones activas de los selectores desplegables
        document.querySelectorAll('select option').forEach(elem => {
            if (elem.hasAttribute(`data-${lang}`)) {
                elem.text = elem.getAttribute(`data-${lang}`);
            }
        });

          const activeProductId = btnAddCart ? btnAddCart.getAttribute('data-active-product') : null;
        if (activeProductId && productsDatabase[activeProductId]) {
            originalRenderModalTechnicalData(activeProductId, lang); // <-- Cambiado a original aquí también
        }

        // Si el modal de carrito de compras está abierto, refrescar la tabla
        if (document.getElementById('store-cart-modal').classList.contains('open')) {
            renderCartTableDOM();
        }
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

    // --- 3. BASE DE DATOS TÉCNICA  ---
    const productsDatabase = {
    'ahava-avena-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial Avena & Fresas', en: 'Oatmeal & Strawberry Facial Cleanser' },
        fluidTitle: 'Avena & Fresas',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-limpiador-avena-fresas-modal.png',
        benefits: {
            es: 'Remueve impurezas profundamente mientras controla el pH fisiológico. Mantiene la piel libre de toxinas, aportando hidratación continua por 24 horas. Ideal para piel seca.',
            en: 'Deeply removes impurities while controlling physiological pH. Keeps skin free of toxins, providing continuous 24-hour hydration. Ideal for dry skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Aceite de uvas, extracto de avena, fresas, glicerina, vitamina E y base de jabón vegetal.',
            en: 'Grape seed oil, oatmeal extract, strawberries, glycerin, vitamin E, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-avena-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial Avena & Fresas', en: 'Oatmeal & Strawberry Facial Toner' },
        fluidTitle: 'Avena & Fresas',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-tonico-avena-y-fresas-modal.png',
        benefits: {
            es: 'Equilibra el pH, hidrata profundamente y refresca la piel seca, proporcionando 24 horas de hidratación continua.',
            en: 'Balances pH, deeply hydrates, and refreshes dry skin, providing 24 hours of continuous hydration.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de avena 2%, hidrolato de fresa 2%, glicerina y vitamina E.',
            en: 'Witch hazel water, avena sativa (oat) kernel extract 2%, strawberry hydrosol 2%, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-menta-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial Menta & Piperita', en: 'Peppermint Facial Toner' },
        fluidTitle: 'Menta & Piperita',
        volume: '250 ml e 8.45 fl. oz.',
        price: 36.00,
        img: 'img/store-tonico-menta-y-piperita-modal.png',
        benefits: {
            es: 'Controla el exceso de grasa y el pH fisiológico, manteniendo la piel libre de impurezas con un efecto fresco y purificante. Ideal para piel grasa.',
            en: 'Controls excess oil and physiological pH, keeping skin free of impurities with a fresh and purifying effect. Ideal for oily skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de menta piperita, cristal de mentol, glicerina y vitamina E.',
            en: 'Witch hazel water, mentha piperita (peppermint) extract, menthol crystals, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-menta-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial Menta & Piperita', en: 'Peppermint Facial Cleanser' },
        fluidTitle: 'Menta & Piperita',
        volume: '250 ml e 8.45 fl. oz.',
        price: 36.00,
        img: 'img/store-limpiador-menta-y-piperita-modal.png',
        benefits: {
            es: 'Limpia profundamente las impurezas y ayuda a regular la producción de sebo. Controla el pH dejando una sensación refrescante. Ideal para piel grasa.',
            en: 'Deeply cleanses impurities and helps regulate sebum production. Controls pH leaving a refreshing sensation. Ideal for oily skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de menta piperita 2%, cristal de mentol, glicerina, vitamina E y base de jabón vegetal.',
            en: 'Grape seed oil, mentha piperita (peppermint) extract 2%, menthol crystals, glycerin, vitamin E, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-melon-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial Melón & Romero', en: 'Melon & Rosemary Facial Toner' },
        fluidTitle: 'Melón & Romero',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-tonico-melon-romero-modal.png',
        benefits: {
            es: 'Hidrata, controla el pH fisiológico y ayuda a calmar las pieles propensas a imperfecciones. Ideal para piel acneica.',
            en: 'Hydrates, controls physiological pH, and helps soothe blemish-prone skin. Ideal for acne-prone skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de melón, romero, glicerina y vitamina E.',
            en: 'Witch hazel water, melon extract, rosemary, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-melon-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial Melón & Romero', en: 'Melon & Rosemary Facial Cleanser' },
        fluidTitle: 'Melón & Romero',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-limpiador-melon-romero-modal.png',
        benefits: {
            es: 'Elimina las impurezas suavemente sin resecar, equilibrando el pH y ofreciendo propiedades purificantes. Ideal para piel acneica.',
            en: 'Gently removes impurities without drying, balancing pH and offering purifying properties. Ideal for acne-prone skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de melón, romero, glicerina, vitamina E y base de jabón vegetal.',
            en: 'Grape seed oil, melon extract, rosemary, glycerin, vitamin E, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-jazmin-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial Jazmín', en: 'Jasmine Facial Toner' },
        fluidTitle: 'Jazmín',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-tonico-jazmin-modal.png',
        benefits: {
            es: 'Aporta una barrera de protección ambiental (antipolución) e hidratación continua por 24 horas mientras equilibra la piel. Ideal para piel mixta.',
            en: 'Provides an environmental protection barrier (anti-pollution) and continuous 24-hour hydration while balancing the skin. Ideal for combination skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de jazmín, antipolución, glicerina y vitamina E.',
            en: 'Witch hazel water, jasmine extract, anti-pollution agents, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-jazmin-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial Jazmín', en: 'Jasmine Facial Cleanser' },
        fluidTitle: 'Jazmín',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-limpiador-jazmin-modal.png',
        benefits: {
            es: 'Remueve impurezas y toxinas diarias gracias a su acción antipolución, manteniendo el pH y la hidratación por 24 horas. Ideal para piel mixta.',
            en: 'Removes daily impurities and toxins thanks to its anti-pollution action, maintaining pH and hydration for 24 hours. Ideal for combination skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de jazmín, antipolución, glicerina, vitamina y base de jabón vegetal.',
            en: 'Grape seed oil, jasmine extract, anti-pollution agents, glycerin, vitamin, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-calendula-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial Caléndula', en: 'Calendula Facial Toner' },
        fluidTitle: 'Caléndula',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-tonico-calendula-modal.png',
        benefits: {
            es: 'Hidrata, controla el pH fisiológico y refresca suavemente las pieles sensibles o reactivas. Ideal para piel con rosácea.',
            en: 'Hydrates, controls physiological pH, and gently refreshes sensitive or reactive skin. Ideal for skin with rosacea.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de caléndula, manzanilla, glicerina y vitamina E.',
            en: 'Witch hazel water, calendula extract, chamomile, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-calendula-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial Caléndula', en: 'Calendula Facial Cleanser' },
        fluidTitle: 'Caléndula',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-limpiador-calendula-modal.png',
        benefits: {
            es: 'Limpia profundamente liberando la piel de impurezas cotidianas, respetando al máximo el pH fisiológico. Ideal para piel con rosácea.',
            en: 'Deeply cleanses, freeing the skin from daily impurities while fully respecting the physiological pH. Ideal for skin with rosacea.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de caléndula, manzanilla, glicerina, vitamina E y base de jabón vegetal.',
            en: 'Grape seed oil, calendula extract, chamomile, glycerin, vitamin E, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-ginkgo-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial Ginkgo Biloba', en: 'Ginkgo Biloba Facial Toner' },
        fluidTitle: 'Ginkgo Biloba',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-tonico-ginkgo-biloba-modal.png',
        benefits: {
            es: 'Ofrece una profunda acción hidratante por 24 horas y equilibra el pH fisiológico. Ideal para el cuidado de pieles maduras.',
            en: 'Offers a deep 24-hour hydrating action and balances physiological pH. Ideal for mature skin care.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de ginkgo biloba, glicerina y vitamina E.',
            en: 'Witch hazel water, ginkgo biloba extract, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-ginkgo-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial Ginkgo Biloba', en: 'Ginkgo Biloba Facial Cleanser' },
        fluidTitle: 'Ginkgo Biloba',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-limpiador-ginkgo-biloba-modal.png',
        benefits: {
            es: 'Mantiene la piel madura completamente libre de impurezas diarias, aportando hidratación continua y controlando el pH.',
            en: 'Keeps mature skin completely free of daily impurities, providing continuous hydration and controlling pH.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de ginkgo biloba, glicerina, vitamina E y base de jabón vegetal.',
            en: 'Grape seed oil, ginkgo biloba extract, glycerin, vitamin E, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
        'ahava-teen-fresa-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador de Fresa y Sandía', en: 'Strawberry & Watermelon Cleanser' },
        fluidTitle: 'Fresa y Sandía',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-limpiador-fresa-sandia-modal.png',
        benefits: {
            es: 'Limpia profundamente la piel de impurezas y proporciona elasticidad natural. Especialmente diseñado con una fórmula ligera para pieles jóvenes.',
            en: 'Deeply cleanses the skin of impurities and provides natural elasticity. Specially designed with a lightweight formula for young skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de sandía 2%, extracto de fresa 2%, ácido hialurónico, vitamina E y base de jabón vegetal.',
            en: 'Grape seed oil, 2% watermelon extract, 2% strawberry extract, hyaluronic acid, vitamin E, and vegetable soap base.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-teen-fresa-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico de Fresa y Sandía', en: 'Strawberry & Watermelon Toner' },
        fluidTitle: 'Fresa y Sandía',
        volume: '250 ml e 8.45 fl. oz.',
        price: 38.00,
        img: 'img/store-tonico-fresa-sandia-modal.png',
        benefits: {
            es: 'Hidrata de forma ligera, reduce visiblemente los poros y controla el pH. Elimina el brillo excesivo y ayuda a reducir el enrojecimiento cutáneo.',
            en: 'Lightly hydrates, visibly reduces pores, and controls pH. Eliminates excess shine and helps reduce skin redness.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua de hamamelis, extracto de sandía 2%, extracto de fresa 2%, glicerina y vitamina E.',
            en: 'Witch hazel water, 2% watermelon extract, 2% strawberry extract, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-teen-fresa-serum': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum de Fresa y Sandía', en: 'Strawberry & Watermelon Serum' },
        fluidTitle: 'Fresa y Sandía',
        volume: '30 ml e 1.01 fl. oz.',
        price: 29.00,
        img: 'img/store-serum-fresa-sandia-modal.png',
        benefits: {
            es: 'Hidrata y humecta la piel joven, actuando eficazmente contra la hiperpigmentación para unificar el tono cutáneo.',
            en: 'Hydrates and moisturizes young skin, effectively acting against hyperpigmentation to even out skin tone.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajear en círculos.',
            en: 'Apply small amounts onto face and massage in circles.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de sandía 2%, extracto de fresa 2%, ácido hialurónico, vitamina E.',
            en: 'Grape seed oil, 2% watermelon extract, 2% strawberry extract, hyaluronic acid, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-teen-fresa-crema': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Crema Hidratante de Fresa y Sandía', en: 'Strawberry & Watermelon Moisturizing Cream' },
        fluidTitle: 'Fresa y Sandía',
        volume: '100 g e 3.38 oz.',
        price: 29.00,
        img: 'img/store-crema-fresa-sandia-modal.png',
        benefits: {
            es: 'Hidrata profundamente la barrera cutánea, regula la producción de sebo y aporta excelente elasticidad con una sensación de sedosidad.',
            en: 'Deeply hydrates the skin barrier, regulates sebum production, and provides excellent elasticity with a silky feel.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajear en círculos.',
            en: 'Apply small amounts onto face and massage in circles.'
        },
        ingredients: {
            es: 'Manteca de karité, extracto de sandía 2%, alantoína al 2%, extracto de fresa 2%, alcohol cetílico, vitamina E.',
            en: 'Shea butter, 2% watermelon extract, 2% allantoin, 2% strawberry extract, cetyl alcohol, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
        'ahava-teen-salicilico-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial de Ácido Salicílico', en: 'Salicylic Acid Facial Cleanser' },
        fluidTitle: 'Ácido Salicílico',
        volume: '250 ml e 8.45 fl. oz.',
        price: 34.00,
        img: 'img/store-limpiador-acido-salicilico-modal.png',
        benefits: {
            es: 'Ofrece un control eficaz de impurezas, hidratación profunda y promueve el aumento de la barrera cutánea. Ideal para pieles jóvenes.',
            en: 'Offers effective impurity control, deep hydration, and promotes the enhancement of the skin barrier. Ideal for young skin.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre la cara y masajear en círculos, enjuaga con bastante agua. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Aceite de uva, ácido salicílico 3%, extracto de romero al 2%, niacinamida, glicerina, base de jabón vegetal, vitamina E.',
            en: 'Grape seed oil, 3% salicylic acid, 2% rosemary extract, niacinamide, glycerin, vegetable soap base, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-teen-salicilico-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial de Ácido Salicílico', en: 'Salicylic Acid Facial Toner' },
        fluidTitle: 'Ácido Salicílico',
        volume: '250 ml e 8.45 fl. oz.',
        price: 34.00,
        img: 'img/store-tonico-acido-salicilico-modal.png',
        benefits: {
            es: 'Hidrata, controla el pH y el brillo, ayuda a la reducción de poros y reduce eficazmente el enrojecimiento. Uso diario.',
            en: 'Hydrates, controls pH and shine, helps with pore reduction, and effectively reduces redness. Daily use.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre la cara y masajear en círculos. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and massage in circles. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua de hamamelis, ácido salicílico, hidrolato de menta 2%, extracto de romero.',
            en: 'Witch hazel water, salicylic acid, 2% peppermint hydrosol, rosemary extract.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-teen-salicilico-serum': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial de Ácido Salicílico', en: 'Salicylic Acid Facial Serum' },
        fluidTitle: 'Ácido Salicílico',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-acido-salicilico-modal.png',
        benefits: {
            es: 'Actúa como un potente sebo regulador. Brinda control de sebo, hidratación profunda y ayuda con la hiperpigmentación de la piel.',
            en: 'Acts as a powerful sebum regulator. Provides sebum control, deep hydration, and helps with skin hyperpigmentation.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre la piel y masajear en círculos.',
            en: 'Apply small amounts onto skin and massage in circles.'
        },
        ingredients: {
            es: 'Aceite de uva, ácido salicílico al 2%, extracto de bakuchiol 1.25%, niacinamida, vitamina E.',
            en: 'Grape seed oil, 2% salicylic acid, 1.25% bakuchiol extract, niacinamide, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-teen-salicilico-crema': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Crema Hidratante Facial de Ácido Salicílico', en: 'Salicylic Acid Facial Moisturizer' },
        fluidTitle: 'Ácido Salicílico',
        volume: '100 g e 3.38 oz.',
        price: 29.00,
        img: 'img/store-crema-acido-salicilico-modal.png',
        benefits: {
            es: 'Aporta una óptima hidratación y humecta la piel. Combate directamente la producción de sebo y disminuye el tamaño de los poros.',
            en: 'Provides optimal hydration and moisturizes the skin. Directly fights sebum production and diminishes pore size.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre la piel y masajear en círculos.',
            en: 'Apply small amounts onto skin and massage in circles.'
        },
        ingredients: {
            es: 'Manteca de karité, ácido salicílico al 2%, alantoína 2%, alcohol cetílico, niacinamida 2%, vitamina E.',
            en: 'Shea butter, 2% salicylic acid, 2% allantoin, cetyl alcohol, 2% niacinamide, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-protector-solar': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Protector Solar 50 SPF', en: 'SPF 50 Sunscreen Cream' },
        fluidTitle: 'Protector Solar',
        volume: '100 g e 3.38 oz.',
        price: 0.00,
        img: 'img/store-protector-50-modal.png',
        benefits: {
            es: 'Protege eficazmente la piel contra arrugas, manchas y la pérdida de elasticidad que son causadas directamente por la radiación solar.',
            en: 'Effectively protects the skin against wrinkles, spots, and loss of elasticity that are directly caused by solar radiation.'
        },
        usage: {
            es: 'Aplicar una cantidad generosa sobre el rostro de forma uniforme antes de la exposición al sol y reaplicar regularmente.',
            en: 'Apply a generous amount evenly onto the face before sun exposure and reapply regularly.'
        },
        ingredients: {
            es: 'Agua desmineralizada, vitamina E, alcohol cetílico, benzofenona, ácido esteárico, glicerina, óxido de zinc, trietanolamina, aceite de aloe vera.',
            en: 'Demineralized water, vitamin E, cetyl alcohol, benzophenone, stearic acid, glycerin, zinc oxide, triethanolamine, aloe vera oil.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso y consulte a su médico.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use and consult your doctor.'
        }
    },
        'ahava-men-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador Facial For Men', en: 'For Men Facial Cleanser' },
        fluidTitle: 'For Men',
        volume: '250 ml e 8.45 fl. oz.',
        price: 34.00,
        img: 'img/store-limpiador-man-modal.png',
        benefits: {
            es: 'Proporciona 24 horas de hidratación continua mientras controla el pH y mantiene la piel completamente libre de impurezas. Diseñado para el uso diario masculino.',
            en: 'Provides 24 hours of continuous hydration while controlling pH and keeping the skin completely free of impurities. Designed for daily male use.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea en círculos, enjuaga con bastante agua. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and massage in circles, rinse with plenty of water. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de tara espinoza 2%, glicerina, base de jabón vegetal, vitamina E.',
            en: 'Grape seed oil, 2% tara spinosa extract, glycerin, vegetable soap base, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-men-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico Facial For Men', en: 'For Men Facial Toner' },
        fluidTitle: 'For Men',
        volume: '250 ml e 8.45 fl. oz.',
        price: 34.00,
        img: 'img/store-tonico-man-modal.png',
        benefits: {
            es: 'Ofrece 24 horas de hidratación profunda, controla el pH fisiológico, mantiene la piel libre de impurezas y reduce visiblemente el enrojecimiento cutáneo.',
            en: 'Offers 24 hours of deep hydration, controls physiological pH, keeps the skin free of impurities, and visibly reduces skin redness.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajea suavemente con toques ligeros hasta que se absorba por completo. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and gently massage with light taps until completely absorbed. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua de hamamelis, hidrolato de caléndula 2%, mentol 2%, tara espinoza 2%, glicerina y vitamina E.',
            en: 'Witch hazel water, 2% calendula hydrosol, 2% menthol, 2% tara spinosa, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-men-balsamo': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Bálsamo Hidratante Arbutina For Men', en: 'For Men Arbutin Moisturizing Balm' },
        fluidTitle: 'For Men Arbutina',
        volume: '100 g e 3.38 oz.',
        price: 34.00,
        img: 'img/store-crema-man-modal.png',
        benefits: {
            es: 'Garantiza 24 horas de hidratación continua, humecta la piel profundamente y combate de forma eficaz los signos del envejecimiento prematuro.',
            en: 'Guarantees 24 hours of continuous hydration, deeply moisturizes the skin, and effectively fights the signs of premature aging.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajear en círculos. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto face and massage in circles. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Manteca de karité, colágeno al 2%, arbutina al 2%, alcohol cetílico, vitamina E.',
            en: 'Shea butter, 2% collagen, 2% arbutin, cetyl alcohol, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-men-bakuchiol-serum': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial de Bakuchiol For Men', en: 'For Men Bakuchiol Facial Serum' },
        fluidTitle: 'For Men Bakuchiol',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-man-modal.png',
        benefits: {
            es: 'Permite el engrosamiento de la barba, aporta una hidratación profunda, ayuda a reducir la caída del vello de la barba y previene eficazmente la producción de caspa.',
            en: 'Allows beard thickening, provides deep hydration, helps reduce beard hair loss, and effectively prevents dandruff production.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajear en círculos.',
            en: 'Apply small amounts onto face and massage in circles.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de bakuchiol 1.25%, aceite de INKA, romero, vitamina E.',
            en: 'Grape seed oil, 1.25% bakuchiol extract, INKA oil, rosemary, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
        'ahava-pies-exfoliante': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Exfoliante para Pies', en: 'Foot Scrub' },
        fluidTitle: 'Exfoliante Pies',
        volume: '100 g e 3.38 oz.',
        price: 26.00,
        img: 'img/store-crema-exfoliante-pies-modal.png',
        benefits: {
            es: 'Elimina eficazmente las células muertas de la piel y previene el desgaste cutáneo de los pies, promoviendo el aumento de la barrera cutánea y aportando excelente hidratación.',
            en: 'Effectively removes dead skin cells and prevents skin wear on the feet, promoting the enhancement of the skin barrier and providing excellent hydration.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre los pies y masajear en círculos, lavar con agua.',
            en: 'Apply small amounts onto feet and massage in circles, wash with water.'
        },
        ingredients: {
            es: 'Manteca de karité, semillas de albaricoque, extracto de menta 2%, sal de epsom, alcohol cetílico, vitamina E.',
            en: 'Shea butter, apricot seeds, 2% mint extract, epsom salt, cetyl alcohol, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. No aplicar sobre piel irritada o heridas abiertas. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Do not apply to irritated skin or open wounds. In case of irritation, discontinue use.'
        }
    },
    'ahava-pies-tonico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Tónico para Pies', en: 'Foot Toner' },
        fluidTitle: 'Tónico Pies',
        volume: '250 ml e 8.45 fl. oz.',
        price: 26.00,
        img: 'img/store-tonico-exfoliante-pies-modal.png',
        benefits: {
            es: 'Aporta 24 horas de hidratación profunda y refrescante para los pies cansados, ayudando al aumento de la barrera cutánea. Ideal para uso diario.',
            en: 'Provides 24 hours of deep and refreshing hydration for tired feet, helping to increase the skin barrier. Ideal for daily use.'
        },
        usage: {
            es: 'Aplica una pequeña cantidad del producto sobre los pies y masajea suavemente con toques ligeros hasta que se absorba por completo. Uso diario: mañana y noche.',
            en: 'Apply a small amount of the product onto feet and gently massage with light taps until completely absorbed. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua de hamamelis, hidrolato de caléndula 2%, mentol 2%, cristales de mentol, glicerina, vitamina E.',
            en: 'Witch hazel water, 2% calendula hydrosol, 2% menthol, menthol crystals, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-pies-limpiador': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Limpiador para Pies', en: 'Foot Cleanser' },
        fluidTitle: 'Limpiador Pies',
        volume: '250 ml e 8.45 fl. oz.',
        price: 26.00,
        img: 'img/store-limpiador-exfoliante-pies-modal.png',
        benefits: {
            es: 'Limpia profundamente la piel de los pies removiendo impurezas cotidianas, manteniendo la hidratación continua por 24 horas y reforzando la barrera cutánea.',
            en: 'Deeply cleanses the skin of the feet removing daily impurities, maintaining continuous 24-hour hydration and reinforcing the skin barrier.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre los pies y masajear en círculos, enjuaga con bastante agua. Uso diario: mañana y noche.',
            en: 'Apply small amounts onto feet and massage in circles, rinse with plenty of water. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Aceite de uva, extracto de menta y piperita 2%, cristales de mentol 2%, glicerina, base de jabón vegetal y vitamina E.',
            en: 'Grape seed oil, 2% peppermint extract, 2% menthol crystals, glycerin, vegetable soap base, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
        'ahava-serum-vitamina-c': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial Anti-Oxidante Iluminador con Vitamina C', en: 'Brightening Anti-Oxidant Facial Serum with Vitamin C' },
        fluidTitle: 'Vitamina C',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-antioxidante-modal.png',
        benefits: {
            es: 'Hidrata profundamente y regenera las líneas de expresión retardando eficazmente el envejecimiento cutáneo. Aporta luminosidad y una potente acción antioxidante.',
            en: 'Deeply hydrates and regenerates expression lines, effectively delaying skin aging. Provides brightness and powerful antioxidant action.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y masajear en círculos, preferiblemente en la noche.',
            en: 'Apply small amounts onto clean face and massage in circles, preferably at night.'
        },
        ingredients: {
            es: 'Aceite de uva, ácido ascórbico al 20%, aceite esencial de naranja, extracto limonero, vitamina E.',
            en: 'Grape seed oil, 20% ascorbic acid, orange essential oil, lemon extract, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Al contener Vitamina C, se recomienda su uso nocturno. Si se usa de día, aplicar protector solar obligatoriamente. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Due to Vitamin C content, nighttime use is recommended. If used during the day, mandatory sunscreen application is required. In case of irritation, discontinue use.'
        }
    },
    'ahava-serum-hialuronico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial Regenerador Anti-Age con Ácido Hialurónico', en: 'Anti-Aging Regenerating Facial Serum with Hyaluronic Acid' },
        fluidTitle: 'Ácido Hialurónico',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-regenerador-antiage-acido-hialuronico-modal.png',
        benefits: {
            es: 'Brinda una combinación avanzada de hidratación y regeneración cutánea. Trata las líneas de expresión y retarda los signos visibles del envejecimiento.',
            en: 'Provides an advanced combination of skin hydration and regeneration. Treats expression lines and delays visible signs of aging.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y masajear en círculos, preferiblemente en la noche.',
            en: 'Apply small amounts onto clean face and massage in circles, preferably at night.'
        },
        ingredients: {
            es: 'Aceite de uva, coco, ácido hialurónico al 2%, aceite esencial de ylang ylang, vitamina E.',
            en: 'Grape seed oil, coconut, 2% hyaluronic acid, ylang ylang essential oil, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
        'ahava-serum-colageno-24k': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial Regenerador e Iluminador con 24Kilates Colágeno', en: 'Brightening & Regenerating Facial Serum with 24K Gold & Collagen' },
        fluidTitle: '24K Colágeno',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-iluminador-24lilates-modal.png',
        benefits: {
            es: 'Hidrata profundamente y regenera las líneas de expresión retardando el envejecimiento cutáneo, aportando un efecto iluminador único y renovador.',
            en: 'Deeply hydrates and regenerates expression lines, delaying skin aging while providing a unique brightening and renewing effect.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y masajear en círculos, preferiblemente en la noche.',
            en: 'Apply small amounts onto clean face and massage in circles, preferably at night.'
        },
        ingredients: {
            es: 'Aceite de uva, coco, colágeno al 10%, seda, elastina, vitamina E.',
            en: 'Grape seed oil, coconut, 10% collagen, silk, elastin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-serum-argan-jojoba': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial Equilibrante y Regenerador con Argán y Jojoba', en: 'Balancing & Regenerating Facial Serum with Argan & Jojoba' },
        fluidTitle: 'Argán & Jojoba',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-argan-jojoba-modal.png',
        benefits: {
            es: 'Hidrata, equilibra y regenera las líneas de expresión de la piel, controlando imperfecciones y retardando el envejecimiento celular.',
            en: 'Hydrates, balances, and regenerates skin expression lines, controlling blemishes and delaying cellular aging.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y masajear en círculos, preferiblemente en la noche.',
            en: 'Apply small amounts onto clean face and massage in circles, preferably at night.'
        },
        ingredients: {
            es: 'Aceite de uva, coco, colágeno al 10%, seda, elastina, vitamina E.',
            en: 'Grape seed oil, coconut, 10% collagen, silk, elastin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-serum-vitaminae-rosa-mosqueta': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Sérum Facial Revitaliza y Nutre con Vitamina E y Rosa Mosqueta', en: 'Revitalizing & Nourishing Facial Serum with Vitamin E & Rosehip' },
        fluidTitle: 'Vitamina E & Rosa Mosqueta',
        volume: '30 ml e 1.01 fl. oz.',
        price: 34.00,
        img: 'img/store-serum-revitaliza-rosa-mosqueta-modal.png',
        benefits: {
            es: 'Hidrata y regenera las líneas de expresión retardando el envejecimiento. Nutre profundamente gracias a su fórmula revitalizante.',
            en: 'Hydrates and regenerates expression lines, delaying aging. Deeply nourishes thanks to its revitalizing formula.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y masajear en círculos, preferiblemente en la noche.',
            en: 'Apply small amounts onto clean face and massage in circles, preferably at night.'
        },
        ingredients: {
            es: 'Aceite de uva geranio, rosa mosqueta, frankincense al 10%, vitamina E.',
            en: 'Geranium grape seed oil, rosehip, 10% frankincense, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
        'ahava-aceite-corporal': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Aceite Vegetal Corporal para Masajes', en: 'Nourishing Massage Body Oil' },
        fluidTitle: 'Aceite Corporal',
        volume: '280 ml e 9.47 fl. oz.',
        price: 34.00,
        img: 'img/store-aceite-corporal-modal.png',
        benefits: {
            es: 'Nutre profundamente la piel corporal durante el masaje, aportando suavidad, elasticidad y una experiencia de aromaterapia personalizada según la esencia seleccionada. Libre de parabenos.',
            en: 'Deeply nourishes body skin during massage, providing softness, elasticity, and a personalized aromatherapy experience depending on the selected essence. Paraben-free.'
        },
        usage: {
            es: 'Aplicar una cantidad generosa sobre la piel corporal y masajear suavemente hasta su completa absorción.',
            en: 'Apply a generous amount onto body skin and massage gently until completely absorbed.'
        },
        ingredients: {
            es: 'Aceite de pepita de uva, glicerina, vitamina E y extracto de esencias.',
            en: 'Grape seed oil, glycerin, vitamin E, and fragrance (essential oil blends).'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Solo para uso externo. Evitar el contacto con ojos y zonas sensibles. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. For external use only. Avoid contact with eyes and sensitive areas. In case of irritation, discontinue use.'
        },
        variants: [
            'Chocolate', 'Café', 'Menta', 'Melón', 'Ylan Yland', 
            'Naranja', 'Anis', 'Vainilla', 'Lavanda', 'Almendra', 
            'Clavel', 'Coco', 'Fresa', 'Romero'
        ]
    },
        'ahava-mascarilla-curcuma': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Mascarilla de Cúrcuma', en: 'Turmeric Face Mask' },
        fluidTitle: 'Cúrcuma',
        volume: '250 g e 8.81 oz.',
        price: 26.00,
        img: 'img/store-mascarilla-curcuma-modal.png',
        benefits: {
            es: 'Aporta una potente acción iluminadora, unifica el tono de la piel y limpia impurezas. Fórmula libre de aceites minerales y parabenos.',
            en: 'Provides a powerful brightening action, evens out skin tone, and cleanses impurities. Formula free of mineral oils and parabens.'
        },
        usage: {
            es: 'Aplicar una capa uniforme sobre el rostro limpio, dejar actuar por 15 minutos y enjuagar con abundante agua.',
            en: 'Apply an even layer onto clean face, leave on for 15 minutes, and rinse thoroughly with water.'
        },
        ingredients: {
            es: 'Manteca de karité, vitamina E, alcohol cetílico, extracto de cúrcuma, glicerina, arcilla blanca y aceite de pepita de uva.',
            en: 'Shea butter, vitamin E, cetyl alcohol, turmeric extract, glycerin, kaolin clay, and grape seed oil.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'ahava-mascarilla-ylangylang': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Mascarilla de Ylang Ylang', en: 'Ylang Ylang Face Mask' },
        fluidTitle: 'Ylang Ylang',
        volume: '250 g e 8.81 oz.',
        price: 26.00,
        img: 'img/store-mascarilla-ylang-modal.png',
        benefits: {
            es: 'Calma, purifica y equilibra la piel cansada gracias a las propiedades antioxidantes del té verde. Fórmula libre de aceites minerales y parabenos.',
            en: 'Soothes, purifies, and balances tired skin thanks to the antioxidant properties of green tea. Formula free of mineral oils and parabens.'
        },
        usage: {
            es: 'Aplicar una capa uniforme sobre el rostro limpio, dejar actuar por 15 minutes y enjuagar con bastante agua.',
            en: 'Apply an even layer onto clean face, leave on for 15 minutes, and rinse thoroughly with water.'
        },
        ingredients: {
            es: 'Manteca de karité, vitamina E, alcohol cetílico, extracto de ylang ylang, glicerina, arcilla blanca y té verde.',
            en: 'Shea butter, vitamin E, cetyl alcohol, ylang ylang extract, glycerin, kaolin clay, and green tea.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use.'
        }
    },
    'ahava-mascarilla-colageno-alantoina': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Mascarilla de Colágeno Alantoína', en: 'Collagen & Allantoin Face Mask' },
        fluidTitle: 'Colágeno Alantoína',
        volume: '250 g e 8.81 oz.',
        price: 26.00,
        img: 'img/store-mascarilla-alantoina-modal.png',
        benefits: {
            es: 'Promueve la firmeza y elasticidad, calma la piel reactiva y ayuda a la regeneración celular profunda. Fórmula libre de aceites minerales.',
            en: 'Promotes firmness and elasticity, soothes reactive skin, and helps with deep cellular regeneration. Formula mineral oil-free.'
        },
        usage: {
            es: 'Aplicar una capa uniforme sobre el rostro limpio, dejar actuar por 15 minutos y enjuagar con bastante agua.',
            en: 'Apply an even layer onto clean face, leave on for 15 minutes, and rinse thoroughly with water.'
        },
        ingredients: {
            es: 'Colágeno, alantoína, manteca de karité, vitamina E, alcohol cetílico 2%, glicerina, arcilla blanca y aceite de pepita de uva.',
            en: 'Collagen, allantoin, shea butter, vitamin E, 2% cetyl alcohol, glycerin, kaolin clay, and grape seed oil.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    'ahava-mascarilla-menta-piperita': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Mascarilla de Menta y Piperita', en: 'Peppermint Face Mask' },
        fluidTitle: 'Menta & Piperita',
        volume: '250 g e 8.81 oz.',
        price: 26.00,
        img: 'img/store-mascarilla-menta-piperita-modal.png',
        benefits: {
            es: 'Brinda un efecto altamente refrescante, purifica los poros y revitaliza la piel opaca. Fórmula libre de aceites minerales y parabenos.',
            en: 'Provides a highly refreshing effect, purifies pores, and revitalizes dull skin. Formula free of mineral oils and parabens.'
        },
        usage: {
            es: 'Aplicar una capa uniforme sobre el rostro limpio, dejar actuar por 15 minutos y enjuagar con bastante agua.',
            en: 'Apply an even layer onto clean face, leave on for 15 minutes, and rinse thoroughly with water.'
        },
        ingredients: {
            es: 'Manteca de karité, vitamina E, alcohol cítrico, extracto de menta 2%, glicerina, arcilla blanca y aceite de pepita de uva.',
            en: 'Shea butter, vitamin E, citric alcohol, 2% mint extract, glycerin, kaolin clay, and grape seed oil.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos y mucosas debido a su efecto refrescante. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes and mucous membranes due to its refreshing effect. In case of irritation, discontinue use.'
        }
    },
        'ahava-crema-kojico': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Crema Despigmentante con Ácido Kójico', en: 'Kojic Acid Depigmenting Cream' },
        fluidTitle: 'Ácido Kójico',
        volume: '250 g e 8.81 oz.',
        price: 26.00,
        img: 'img/store-crema-acido-kojico-modal.png',
        benefits: {
            es: 'Ayuda a atenuar manchas faciales e hiperpigmentaciones gracias a las propiedades unificadoras de la castaña de la India y el ácido kójico. Fórmula libre de aceites minerales y parabenos.',
            en: 'Helps fade facial dark spots and hyperpigmentation thanks to the tone-evening properties of horse chestnut and kojic acid. Formula free of mineral oils and parabens.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad sobre el rostro limpio por las noches y masajear suavemente hasta su completa absorción. Es obligatorio el uso de protector solar al día siguiente.',
            en: 'Apply a small amount onto clean face at night and gently massage until completely absorbed. Sunscreen application is mandatory the following day.'
        },
        ingredients: {
            es: 'Manteca de karité, vitamina E, alcohol cetílico, castaña de la India.',
            en: 'Shea butter, vitamin E, cetyl alcohol, horse chestnut.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Al ser un producto despigmentante, utilícelo preferiblemente de noche. En caso de irritación, suspenda su uso de inmediato.',
            en: 'Keep out of reach of children. Being a depigmenting product, use preferably at night. In case of irritation, discontinue use immediately.'
        }
    },
    'ahava-crema-arbutina-colageno': {
        brand: 'AHAVA HOLÍSTICA',
        title: { es: 'Crema de Arbutina - Colágeno', en: 'Arbutin & Collagen Cream' },
        fluidTitle: 'Arbutina - Colágeno',
        volume: '250 g e 8.81 oz.',
        price: 26.00,
        img: 'img/store-crema-arbutina-modal.png',
        benefits: {
            es: 'Combina la acción aclarante de la arbutina con la firmeza del colágeno para unificar el tono cutáneo, hidratar profundamente y aportar elasticidad. Libre de parabenos.',
            en: 'Combines the brightening action of arbutin with the firmness of collagen to even out skin tone, deeply hydrate, and provide elasticity. Paraben-free.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro y masajear en círculos hasta que se absorba por completo.',
            en: 'Apply small amounts onto face and massage in circles until completely absorbed.'
        },
        ingredients: {
            es: 'Manteca de karité, vitamina E, alcohol cetílico, arbutina al 2%, colágeno al 2%, glicerina.',
            en: 'Shea butter, vitamin E, cetyl alcohol, 2% arbutin, 2% collagen, glycerin.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de irritación o reacción desfavorable, suspenda su uso. Si persiste, consulte a su médico.',
            en: 'Keep out of reach of children. In case of irritation or unfavorable reaction, discontinue use. If it persists, consult your doctor.'
        }
    },
    
    'noah-colageno-tonico': {
        brand: 'SPA BIONOAH',
        title: { es: 'Tónico Facial Colágeno & Elastina', en: 'Collagen & Elastin Facial Toner' },
        fluidTitle: 'Colágeno & Elastina',
        volume: '250 ml e 8.45 fl. oz.',
        price: 45.00,
        img: 'img/noah-tonico-colageno-elastina-modal.png',
        benefits: {
            es: 'Reafirma, hidrata y revitaliza profundamente la piel madura. Ayuda a mejorar significativamente la elasticidad cutánea.',
            en: 'Deeply firms, hydrates, and revitalizes mature skin. Helps to significantly improve skin elasticity.'
        },
        usage: {
            es: 'Aplicar sobre el rostro limpio mediante ligeros toques o con ayuda de un disco de algodón. Uso diario: mañana y noche.',
            en: 'Apply onto clean face using light taps or with a cotton pad. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, colágeno hidrolizado, elastina soluble, glicerina vegetal, extracto de aloe vera, vitamina E, ácido cítrico.',
            en: 'Purified water, Dead Sea minerals, hydrolyzed collagen, soluble elastin, vegetable glycerin, aloe vera extract, vitamin E, citric acid.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'noah-colageno-limpiador': {
        brand: 'SPA BIONOAH',
        title: { es: 'Gel Limpiador con Colágeno & Elastina', en: 'Collagen & Elastin Cleansing Gel' },
        fluidTitle: 'Colágeno & Elastina',
        volume: '250 ml e 8.45 fl. oz.',
        price: 42.00,
        img: 'img/noah-limpiador-colageno-elastina-modal.png',
        benefits: {
            es: 'Limpia delicadamente la piel removiendo impurezas sin resecar. Hidrata profundamente y mejora la firmeza del rostro.',
            en: 'Gently cleanses the skin, removing impurities without drying. Deeply hydrates and improves facial firmness.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad sobre el rostro húmedo, masajear suavemente en círculos y enjuagar con abundante agua.',
            en: 'Apply a small amount onto wet face, gently massage in circular motions, and rinse thoroughly with water.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, base de jabón vegetal, colágeno hidrolizado, elastina soluble, glicerina, vitamina E.',
            en: 'Purified water, Dead Sea minerals, vegetable soap base, hydrolyzed collagen, soluble elastin, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de reacción desfavorable o enrojecimiento, suspenda su uso y consulte a su médico.',
            en: 'Keep out of reach of children. In case of unfavorable reaction or redness, discontinue use and consult your doctor.'
        }
    },
    'noah-colageno-serum': {
        brand: 'SPA BIONOAH',
        title: { es: 'Sérum Facial con Colágeno & Elastina', en: 'Collagen & Elastin Facial Serum' },
        fluidTitle: 'Colágeno & Elastina',
        volume: '30 ml e 1.01 fl. oz.',
        price: 55.00,
        img: 'img/noah-serum-colageno-elastina-modal.png',
        benefits: {
            es: 'Reafirma, regenera y aporta una hidratación intensiva. Ayuda de manera efectiva a prevenir los signos visibles del envejecimiento.',
            en: 'Firms, regenerates, and provides intensive hydration. Effectively helps prevent visible signs of aging.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y seco. Masajear suavemente en círculos hasta su completa absorción.',
            en: 'Apply small amounts onto clean and dry face. Gently massage in circles until completely absorbed.'
        },
        ingredients: {
            es: 'Aceite de uva, minerales del Mar Muerto, colágeno al 10%, elastina, glicerina, extracto de esencias botánicas, vitamina E.',
            en: 'Grape seed oil, Dead Sea minerals, 10% collagen, elastin, glycerin, botanical essence extract, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Uso externo únicamente. En caso de irritación persistente, suspenda su uso.',
            en: 'Keep out of reach of children. External use only. In case of persistent irritation, discontinue use.'
        }
    },
    'noah-colageno-crema': {
        brand: 'SPA BIONOAH',
        title: { es: 'Crema de Noche con Colágeno & Elastina', en: 'Collagen & Elastin Night Cream' },
        fluidTitle: 'Colágeno & Elastina',
        volume: '100 g e 3.38 oz.',
        price: 48.00,
        img: 'img/noah-crema-colageno-elastina-modal.png',
        benefits: {
            es: 'Nutre profundamente la piel durante la noche mientras mejora la firmeza y elasticidad. Ayuda a restaurar la hidratación facial.',
            en: 'Deeply nourishes the skin overnight while improving firmness and elasticity. Helps restore facial hydration.'
        },
        usage: {
            es: 'Aplicar por la noche sobre el rostro y cuello perfectamente limpios, realizando un masaje suave hasta que se absorba por completo.',
            en: 'Apply at night onto perfectly clean face and neck, gently massaging until fully absorbed.'
        },
        ingredients: {
            es: 'Manteca de karité, minerales del Mar Muerto, colágeno hidrolizado, elastina soluble, alcohol cetílico, glicerina, vitamina E.',
            en: 'Shea butter, Dead Sea minerals, hydrolyzed collagen, soluble elastin, cetyl alcohol, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el área de los ojos. Suspender su uso si presenta sensibilidad a los componentes.',
            en: 'Keep out of reach of children. Avoid the eye area. Discontinue use if sensitivity to any components occurs.'
        }
    },
    'noah-trufa-tonico': {
        brand: 'SPA BIONOAH',
        title: { es: 'Tónico Facial con Trufa Blanca', en: 'White Truffle Facial Toner' },
        fluidTitle: 'Trufa Blanca',
        volume: '250 ml e 8.45 fl. oz.',
        price: 45.00,
        img: 'img/noah-tonico-trufa-blanca-modal.png',
        benefits: {
            es: 'Ilumina, hidrata profundamente y favorece un tono de piel más uniforme. Ayuda notablemente a mejorar la apariencia de manchas faciales.',
            en: 'Brightens, deeply hydrates, and promotes a more even skin tone. Visibly helps improve the appearance of facial dark spots.'
        },
        usage: {
            es: 'Aplicar sobre el rostro limpio dando ligeros toques hasta que se absorba por completo. Uso diario: mañana y noche.',
            en: 'Apply onto clean face using light taps until completely absorbed. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, extracto de trufa blanca (Tuber Magnatum), agua de hamamelis, glicerina vegetal, vitamina E, ácido cítrico.',
            en: 'Purified water, Dead Sea minerals, white truffle extract (Tuber Magnatum), witch hazel water, vegetable glycerin, vitamin E, citric acid.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'noah-trufa-limpiador': {
        brand: 'SPA BIONOAH',
        title: { es: 'Gel Limpiador con Trufa Blanca', en: 'White Truffle Cleansing Gel' },
        fluidTitle: 'Trufa Blanca',
        volume: '250 ml e 8.45 fl. oz.',
        price: 42.00,
        img: 'img/noah-limpiador-trufa-blanca-modal.png',
        benefits: {
            es: 'Limpia, ilumina e hidrata suavemente la piel. Elimina de forma eficaz las impurezas y los residuos cotidianos sin resecar.',
            en: 'Gently cleanses, brightens, and hydrates the skin. Effectively removes daily impurities and residues without drying.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad sobre el rostro húmedo, masajear suavemente en círculos y enjuagar con bastante agua.',
            en: 'Apply a small amount onto wet face, gently massage in circular motions, and rinse with plenty of water.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, base de jabón vegetal, extracto de trufa blanca, glicerina, vitamina E.',
            en: 'Purified water, Dead Sea minerals, vegetable soap base, white truffle extract, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Uso externo únicamente. En caso de reacción desfavorable, suspenda su uso inmediato.',
            en: 'Keep out of reach of children. External use only. In case of unfavorable reaction, discontinue use immediately.'
        }
    },
    'noah-trufa-serum': {
        brand: 'SPA BIONOAH',
        title: { es: 'Sérum Facial con Trufa Blanca', en: 'White Truffle Facial Serum' },
        fluidTitle: 'Trufa Blanca',
        volume: '30 ml e 1.01 fl. oz.',
        price: 55.00,
        img: 'img/noah-serum-trufa-blanca-modal.png',
        benefits: {
            es: 'Ilumina intensamente la piel mientras hidrata y mejora el tono desigual, disminuyendo los signos visibles de manchas.',
            en: 'Intensely brightens the skin while hydrating and improving uneven skin tone, reducing the visible signs of dark spots.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y seco, masajeando suavemente en círculos hasta su completa absorción.',
            en: 'Apply small amounts onto clean and dry face, gently massaging in circles until completely absorbed.'
        },
        ingredients: {
            es: 'Aceite de uva, minerales del Mar Muerto, extracto concentrado de trufa blanca, glicerina, extracto de esencias, vitamina E.',
            en: 'Grape seed oil, Dead Sea minerals, concentrated white truffle extract, glycerin, fragrance extract, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Al ser un suero iluminador, se recomienda usar protector solar durante el día.',
            en: 'Keep out of reach of children. Being a brightening serum, sunscreen application is recommended during the day.'
        }
    },
    'noah-trufa-crema': {
        brand: 'SPA BIONOAH',
        title: { es: 'Crema Facial con Trufa Blanca', en: 'White Truffle Facial Cream' },
        fluidTitle: 'Trufa Blanca',
        volume: '100 g e 3.38 oz.',
        price: 48.00,
        img: 'img/noah-crema-trufa-blanca-modal.png',
        benefits: {
            es: 'Nutre e ilumina profundamente la piel durante la noche. Favorece una piel más luminosa ayudando a mitigar manchas y tono desigual.',
            en: 'Deeply nourishes and brightens the skin overnight. Favors a more luminous skin by helping mitigate spots and uneven tone.'
        },
        usage: {
            es: 'Aplicar por la noche sobre el rostro limpio y masajear suavemente en círculos hasta que se absorba por completo.',
            en: 'Apply at night onto clean face and gently massage in circular motions until completely absorbed.'
        },
        ingredients: {
            es: 'Manteca de karité, minerales del Mar Muerto, extracto de trufa blanca, alcohol cetílico, glicerina, vitamina E.',
            en: 'Shea butter, Dead Sea minerals, white truffle extract, cetyl alcohol, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. No aplicar sobre piel irritada o heridas abiertas. Si nota irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Do not apply to irritated skin or open wounds. If you notice irritation, discontinue use.'
        }
    },
    'noah-uchuva-tonico': {
        brand: 'SPA BIONOAH',
        title: { es: 'Tónico Facial con extracto de Uchuva', en: 'Uchuva Extract Facial Toner' },
        fluidTitle: 'Extracto de Uchuva',
        volume: '250 ml e 8.45 fl. oz.',
        price: 45.00,
        img: 'img/noah-tonico-uchuva-modal.png',
        benefits: {
            es: 'Hidrata y revitaliza profundamente la piel con una potente acción antioxidante, ayudándola a protegerse eficazmente del estrés oxidativo diario.',
            en: 'Deeply hydrates and revitalizes the skin with a powerful antioxidant action, effectively helping to protect it from daily oxidative stress.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad sobre el rostro limpio y seco mediante toques ligeros o con un disco de algodón hasta que se absorba por completo. Uso diario.',
            en: 'Apply a small amount onto clean and dry face with light taps or a cotton pad until completely absorbed. Daily use.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, extracto de fruta de Physalis Peruviana (Uchuva), agua de hamamelis, glicerina vegetal, vitamina E y ácido cítrico.',
            en: 'Purified water, Dead Sea minerals, Physalis Peruviana (Uchuva) fruit extract, witch hazel water, vegetable glycerin, vitamin E, and citric acid.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'noah-uchuva-limpiador': {
        brand: 'SPA BIONOAH',
        title: { es: 'Gel Limpiador con extracto de Uchuva', en: 'Uchuva Extract Cleansing Gel' },
        fluidTitle: 'Extracto de Uchuva',
        volume: '250 ml e 8.45 fl. oz.',
        price: 42.00,
        img: 'img/noah-limpiador-uchuva-modal.png',
        benefits: {
            es: 'Limpia de forma muy suave mientras hidrata y revitaliza la piel, eliminando por completo todas las impurezas acumuladas sin resecar.',
            en: 'Cleanses very gently while hydrating and revitalizing the skin, completely removing accumulated impurities without drying.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro húmedo, masajear suavemente en círculos y enjuagar con bastante agua. Uso diario.',
            en: 'Apply small amounts onto wet face, gently massage in circular motions, and rinse thoroughly with water. Daily use.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, base de jabón vegetal, extracto de Physalis Peruviana (Uchuva), glicerina, vitamina E.',
            en: 'Purified water, Dead Sea minerals, vegetable soap base, Physalis Peruviana (Uchuva) extract, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Solo para uso externo. Si observa alguna reacción desfavorable, suspenda su uso.',
            en: 'Keep out of reach of children. For external use only. If you notice an unfavorable reaction, discontinue use.'
        }
    },
    'noah-uchuva-serum': {
        brand: 'SPA BIONOAH',
        title: { es: 'Sérum Facial con extracto de Uchuva', en: 'Uchuva Extract Facial Serum' },
        fluidTitle: 'Extracto de Uchuva',
        volume: '30 ml e 1.01 fl. oz.',
        price: 55.00,
        img: 'img/noah-serum-uchuva-modal.png',
        benefits: {
            es: 'Hidrata profundamente mientras revitaliza y protege la piel, actuando activamente para combatir y reducir los efectos del estrés oxidativo.',
            en: 'Deeply hydrates while revitalizing and protecting the skin, actively working to combat and reduce the effects of oxidative stress.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y seco, extendiendo el producto con un suave masaje circular hasta su absorción.',
            en: 'Apply small amounts onto clean and dry face, spreading the product with a gentle circular massage until absorbed.'
        },
        ingredients: {
            es: 'Aceite de uva, minerales del Mar Muerto, extracto de fruta de Physalis Peruviana (Uchuva), glicerina, vitamina E, extracto de aceites esenciales.',
            en: 'Grape seed oil, Dead Sea minerals, Physalis Peruviana (Uchuva) fruit extract, glycerin, vitamin E, essential oil extract.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. En caso de presentar sensibilidad o irritación a los componentes, discontinúe su uso.',
            en: 'Keep out of reach of children. In case of sensitivity or irritation to any components, discontinue use.'
        }
    },
    'noah-uchuva-crema': {
        brand: 'SPA BIONOAH',
        title: { es: 'Crema Facial con extracto de Uchuva', en: 'Uchuva Extract Facial Cream' },
        fluidTitle: 'Extracto de Uchuva',
        volume: '100 g e 3.38 oz.',
        price: 48.00,
        img: 'img/noah-crema-uchuva-modal.png',
        benefits: {
            es: 'Nutre e hidrata profundamente la piel del rostro brindando una nutrición intensiva que la revitaliza de forma óptima durante la noche.',
            en: 'Deeply nourishes and hydrates facial skin, providing intensive nourishment that optimally revitalizes it overnight.'
        },
        usage: {
            es: 'Aplicar por la noche sobre el rostro limpio mediante masajes circulares ascendentes hasta que el producto se asimile por completo.',
            en: 'Apply at night onto clean face using upward circular massages until the product is completely absorbed.'
        },
        ingredients: {
            es: 'Manteca de karité, minerales del Mar Muerto, extracto de Physalis Peruviana (Uchuva), alcohol cetílico, glicerina vegetal y vitamina E.',
            en: 'Shea butter, Dead Sea minerals, Physalis Peruviana (Uchuva) extract, cetyl alcohol, vegetable glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar aplicar sobre heridas o piel excesivamente lesionada. Suspenda su uso si hay irritación.',
            en: 'Keep out of reach of children. Avoid applying onto wounds or excessively damaged skin. Discontinue use if irritation occurs.'
        }
    },
    'noah-bakuchiol-tonico': {
        brand: 'SPA BIONOAH',
        title: { es: 'Tónico Facial con Bakuchiol', en: 'Bakuchiol Facial Toner' },
        fluidTitle: 'Bakuchiol',
        volume: '250 ml e 8.45 fl. oz.',
        price: 45.00,
        img: 'img/noah-tonico-bakuchiol-modal.png',
        benefits: {
            es: 'Renueva, hidrata y revitaliza profundamente la piel mediante una acción antioxidante suave que ayuda a mejorar visiblemente la textura facial.',
            en: 'Deeply renews, hydrates, and revitalizes the skin through a gentle antioxidant action that helps visibly improve facial texture.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad sobre el rostro limpio y seco con la ayuda de un disco de algodón o con toques ligeros. Uso diario: mañana y noche.',
            en: 'Apply a small amount onto clean and dry face using a cotton pad or light taps. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, extracto de bakuchiol, agua de hamamelis, glicerina vegetal, vitamina E y ácido cítrico.',
            en: 'Purified water, Dead Sea minerals, bakuchiol extract, witch hazel water, vegetable glycerin, vitamin E, and citric acid.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'noah-bakuchiol-limpiador': {
        brand: 'SPA BIONOAH',
        title: { es: 'Gel Limpiador con Bakuchiol', en: 'Bakuchiol Cleansing Gel' },
        fluidTitle: 'Bakuchiol',
        volume: '250 ml e 8.45 fl. oz.',
        price: 42.00,
        img: 'img/noah-limpiador-bakuchiol-modal.png',
        benefits: {
            es: 'Limpia delicadamente la piel removiendo impurezas cotidianas, mientras aporta una óptima suavidad, confort y ayuda a renovar la barrera cutánea.',
            en: 'Gently cleanses the skin, removing daily impurities, while providing optimal softness, comfort, and helping to renew the skin barrier.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro húmedo, masajear suavemente en círculos y enjuagar con bastante agua.',
            en: 'Apply small amounts onto wet face, gently massage in circular motions, and rinse thoroughly with plenty of water.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, base de jabón vegetal, extracto de bakuchiol, glicerina y vitamina E.',
            en: 'Purified water, Dead Sea minerals, vegetable soap base, bakuchiol extract, glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Solo para uso externo. Si observa alguna reacción desfavorable, suspenda su uso.',
            en: 'Keep out of reach of children. For external use only. If you notice any unfavorable reaction, discontinue use.'
        }
    },
    'noah-bakuchiol-serum': {
        brand: 'SPA BIONOAH',
        title: { es: 'Sérum Facial con Bakuchiol', en: 'Bakuchiol Facial Serum' },
        fluidTitle: 'Bakuchiol',
        volume: '30 ml e 1.01 fl. oz.',
        price: 55.00,
        img: 'img/noah-serum-bakuchiol-modal.png',
        benefits: {
            es: 'Ofrece una potente acción antioxidante y renovadora para lograr una piel más firme y uniforme, ayudando a mejorar de forma notable la elasticidad.',
            en: 'Offers a powerful antioxidant and renewing action to achieve firmer and more even skin, helping to visibly improve elasticity.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y seco. Masajear suavemente en círculos hasta que el producto se absorba por completo.',
            en: 'Apply small amounts onto clean and dry face. Gently massage in circles until the product is completely absorbed.'
        },
        ingredients: {
            es: 'Aceite de uva, minerales del Mar Muerto, extracto concentrado de bakuchiol, glicerina vegetal, vitamina E y extracto de esencias aromáticas.',
            en: 'Grape seed oil, Dead Sea minerals, concentrated bakuchiol extract, vegetable glycerin, vitamin E, and aromatic essence extract.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Uso externo únicamente. En caso de presentar sensibilidad a los componentes, discontinúe su uso.',
            en: 'Keep out of reach of children. External use only. In case of sensitivity to any components, discontinue use.'
        }
    },
    'noah-bakuchiol-crema': {
        brand: 'SPA BIONOAH',
        title: { es: 'Crema Facial con Bakuchiol', en: 'Bakuchiol Facial Cream' },
        fluidTitle: 'Bakuchiol',
        volume: '120 g e 4.23 oz.',
        price: 48.00,
        img: 'img/noah-crema-bakuchiol-modal.png',
        benefits: {
            es: 'Nutre y renueva profundamente la piel del rostro durante la noche. Ofrece una acción antioxidante continua que favorece la renovación facial nocturna.',
            en: 'Deeply nourishes and renews facial skin overnight. Offers continuous antioxidant action that favors nightly facial renewal.'
        },
        usage: {
            es: 'Aplicar por la noche sobre el rostro limpio, realizando suaves masajes circulares hasta su total absorción.',
            en: 'Apply at night onto clean face, performing gentle circular massages until fully absorbed.'
        },
        ingredients: {
            es: 'Manteca de karité, minerales del Mar Muerto, extracto de bakuchiol, alcohol cetílico, glicerina vegetal y vitamina E.',
            en: 'Shea butter, Dead Sea minerals, bakuchiol extract, cetyl alcohol, vegetable glycerin, and vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar la aplicación directa sobre los ojos. Suspenda su uso si nota signos de irritación cutánea.',
            en: 'Keep out of reach of children. Avoid direct application to the eyes. Discontinue use if you notice signs of skin irritation.'
        }
    },
    'noah-kojico-tonico': {
        brand: 'SPA BIONOAH',
        title: { es: 'Tónico Facial con Ácido Kójico y Glicólico', en: 'Kojic & Glycolic Acid Facial Toner' },
        fluidTitle: 'Ácido Kójico & Glicólico',
        volume: '250 ml e 8.45 fl. oz.',
        price: 45.00,
        img: 'img/noah-tonico-acido-kojico-modal.png',
        benefits: {
            es: 'Ayuda a renovar, iluminar y mejorar notablemente el tono de la piel. Favorece la renovación celular y prepara el rostro para el tratamiento.',
            en: 'Helps renew, brighten, and noticeably improve skin tone. Favors cellular renewal and prepares the face for treatment.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad sobre el rostro limpio y seco con ayuda de un disco de algodón, preferiblemente por la noche. Uso diario.',
            en: 'Apply a small amount onto clean and dry face using a cotton pad, preferably at night. Daily use.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, ácido kójico, ácido glicólico, agua de hamamelis, glicerina vegetal, vitamina E.',
            en: 'Purified water, Dead Sea minerals, kojic acid, glycolic acid, witch hazel water, vegetable glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Al contener ácidos exfoliantes, se recomienda su uso nocturno y es obligatorio aplicar protector solar al día siguiente.',
            en: 'Keep out of reach of children. Containing exfoliating acids, nighttime use is recommended, and applying sunscreen the next day is mandatory.'
        }
    },
    'noah-kojico-limpiador': {
        brand: 'SPA BIONOAH',
        title: { es: 'Gel Limpiador con Ácido Kójico y Glicólico', en: 'Kojic & Glycolic Acid Cleansing Gel' },
        fluidTitle: 'Ácido Kójico & Glicólico',
        volume: '250 ml e 8.45 fl. oz.',
        price: 42.00,
        img: 'img/noah-limpiador-acido-kojico-modal.png',
        benefits: {
            es: 'Limpia suavemente el rostro mientras ayuda a renovar e iluminar la piel. Contribuye de forma eficaz a mejorar la apariencia de las manchas.',
            en: 'Gently cleanses the face while helping renew and brighten the skin. Effectively contributes to improving the appearance of dark spots.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro húmedo, masajear suavemente en círculos y enjuagar con bastante agua.',
            en: 'Apply small amounts onto wet face, gently massage in circular motions, and rinse thoroughly with plenty of water.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, base de jabón vegetal, ácido kójico, ácido glicólico, glicerina, vitamina E.',
            en: 'Purified water, Dead Sea minerals, vegetable soap base, kojic acid, glycolic acid, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Solo para uso externo. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. For external use only. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'noah-kojico-serum': {
        brand: 'SPA BIONOAH',
        title: { es: 'Sérum Facial con Ácido Kójico y Glicólico', en: 'Kojic & Glycolic Acid Facial Serum' },
        fluidTitle: 'Ácido Kójico & Glicólico',
        volume: '30 ml e 1.01 fl. oz.',
        price: 55.00,
        img: 'img/noah-serum-acido-kojico-modal.png',
        benefits: {
            es: 'Ayuda a despigmentar y renovar la piel para lograr una apariencia más uniforme, luminosa y libre de manchas o marcas.',
            en: 'Helps depigment and renew the skin to achieve a more uniform, luminous appearance free of spots or marks.'
        },
        usage: {
            es: 'Aplicar pequeñas cantidades sobre el rostro limpio y seco exclusivamente por la noche, masajeando suavemente hasta su completa absorción.',
            en: 'Apply small amounts onto clean and dry face exclusively at night, gently massaging until completely absorbed.'
        },
        ingredients: {
            es: 'Aceite de uva, minerales del Mar Muerto, ácido kójico concentrado, ácido glicólico, glicerina vegetal, vitamina E.',
            en: 'Grape seed oil, Dead Sea minerals, concentrated kojic acid, glycolic acid, vegetable glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Uso nocturno exclusivo. No aplicar sobre piel irritada. Use protector solar SPF 50 indispensablemente durante el día.',
            en: 'Keep out of reach of children. Exclusive nighttime use. Do not apply on irritated skin. Indispensably use SPF 50 sunscreen during the day.'
        }
    },
    'noah-kojico-crema': {
        brand: 'SPA BIONOAH',
        title: { es: 'Crema Facial con Ácido Kójico y Glicólico', en: 'Kojic & Glycolic Acid Facial Cream' },
        fluidTitle: 'Ácido Kójico & Glicólico',
        volume: '250 ml e 8.45 fl. oz.',
        price: 48.00,
        img: 'img/noah-crema-acido-kojico-modal.png',
        benefits: {
            es: 'Renueva e ilumina la piel durante la noche. Ayuda activamente a reducir las manchas y refinar la textura irregular del rostro.',
            en: 'Renews and brightens the skin overnight. Actively helps reduce spots and refine irregular facial skin texture.'
        },
        usage: {
            es: 'Aplicar por la noche sobre el rostro limpio mediante movimientos circulares, favoreciendo la renovación nocturna.',
            en: 'Apply at night onto clean face using circular motions, promoting nightly renewal.'
        },
        ingredients: {
            es: 'Manteca de karité, minerales del Mar Muerto, ácido kójico, ácido glicólico, alcohol cetílico, glicerina, vitamina E.',
            en: 'Shea butter, Dead Sea minerals, kojic acid, glycolic acid, cetyl alcohol, glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Uso externo únicamente. Suspenda su uso inmediatamente si presenta hipersensibilidad o enrojecimiento severo.',
            en: 'Keep out of reach of children. External use only. Discontinue use immediately if hypersensitivity or severe redness occurs.'
        }
    },
    'noah-hialuronico-crema': {
        brand: 'SPA BIONOAH',
        title: { es: 'Crema Facial con Ácido Hialurónico', en: 'Hyaluronic Acid Facial Cream' },
        fluidTitle: 'Ácido Hialurónico',
        volume: '180 g e 6.09 oz.',
        price: 46.00,
        img: 'img/noah-crema-acido-hialuronico-modal.png',
        benefits: {
            es: 'Brinda una hidratación intensiva para lograr una piel más firme, suave y luminosa. Favorece visiblemente la elasticidad y firmeza del rostro.',
            en: 'Provides intensive hydration to achieve firmer, softer, and more luminous skin. Visibly promotes facial elasticity and firmness.'
        },
        usage: {
            es: 'Aplicar por la mañana sobre el rostro limpio y seco, extendiendo uniformemente con masajes circulares ascendentes.',
            en: 'Apply in the morning onto clean and dry face, spreading evenly with upward circular massages.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, ácido hialurónico de bajo peso molecular, manteca de karité, alcohol cetílico, glicerina vegetal, vitamina E.',
            en: 'Purified water, Dead Sea minerals, low molecular weight hyaluronic acid, shea butter, cetyl alcohol, vegetable glycerin, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Evitar el contacto directo con los ojos. En caso de irritación, suspenda su uso.',
            en: 'Keep out of reach of children. Avoid direct contact with eyes. In case of irritation, discontinue use.'
        }
    },
    'noah-hialuronico-contorno': {
        brand: 'SPA BIONOAH',
        title: { es: 'Contorno de Ojos con Ácido Hialurónico', en: 'Hyaluronic Acid Eye Cream' },
        fluidTitle: 'Contorno de Ojos',
        volume: '30 g e 1.06 oz.',
        price: 38.00,
        img: 'img/noah-contorno-ojos-modal.png',
        benefits: {
            es: 'Hidrata y revitaliza la delicada zona ocular mientras ayuda a disminuir los signos de cansancio. Contribuye a suavizar las líneas de expresión.',
            en: 'Hydrates and revitalizes the delicate eye area while helping to diminish signs of fatigue. Helps smooth expression lines.'
        },
        usage: {
            es: 'Aplicar una pequeña cantidad alrededor del contorno de ojos mediante suaves toques con el dedo anular hasta su total absorción. Uso diario: mañana y noche.',
            en: 'Apply a small amount around the eye contour using gentle taps with the ring finger until fully absorbed. Daily use: morning and night.'
        },
        ingredients: {
            es: 'Agua purificada, minerales del Mar Muerto, ácido hialurónico, extracto de aloe vera, colágeno soluble, alcohol cetílico, vitamina E.',
            en: 'Purified water, Dead Sea minerals, hyaluronic acid, aloe vera extract, soluble collagen, cetyl alcohol, vitamin E.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. Uso externo únicamente. Si el producto entra en contacto directo con el globo ocular, enjuagar con abundante agua.',
            en: 'Keep out of reach of children. External use only. If the product comes into direct contact with the eyeball, rinse thoroughly with water.'
        }
    },
    'noah-solar-bloqueador': {
        brand: 'SPA BIONOAH',
        title: { es: 'Bloqueador Solar Facial con SPF 50', en: 'SPF 50 Facial Sunscreen' },
        fluidTitle: 'Bloqueador Solar',
        volume: '10 g e 0.47 oz.',
        price: 25.00,
        img: 'img/noah-bloqueador-modal.png',
        benefits: {
            es: 'Ofrece una protección avanzada contra los rayos UVA y UVB mientras hidrata la piel. Ayuda eficazmente a prevenir manchas y el envejecimiento prematuro.',
            en: 'Offers advanced protection against UVA and UVB rays while hydrating the skin. Effectively helps prevent dark spots and premature aging.'
        },
        usage: {
            es: 'Aplicar una cantidad adecuada de forma uniforme sobre el rostro y cuello limpio antes de la exposición al sol. Reaplicar cada 2 o 3 horas.',
            en: 'Apply an adequate amount evenly onto clean face and neck before sun exposure. Reapply every 2 to 3 hours.'
        },
        ingredients: {
            es: 'Agua desmineralizada, minerales del Mar Muerto, óxido de zinc, dióxido de titanio, vitamina E, alcohol cetílico, glicerina vegetal, extracto de aloe vera.',
            en: 'Demineralized water, Dead Sea minerals, zinc oxide, titanium dioxide, vitamin E, cetyl alcohol, vegetable glycerin, aloe vera extract.'
        },
        precautions: {
            es: 'Mantener fuera del alcance de los niños. No aplicar sobre piel severamente dañada. Evitar el contacto con los ojos. Suspender su uso si presenta enrojecimiento.',
            en: 'Keep out of reach of children. Do not apply onto severely damaged skin. Avoid contact with eyes. Discontinue use if redness occurs.'
        }
    }
};
  
        

        // --- 4. FUNCIÓN PARA RENDERIZAR LA INFORMACIÓN DEL MODAL CON CLASES LIMPIAS ---
    const originalRenderModalTechnicalData = (id, lang) => {
        const prod = productsDatabase[id];
        if (!prod) return;

        // Inyecciones nativas de tu base de datos en los campos del modal
        mBrandSubtitle.textContent = prod.brand;
        mFluidTitle.textContent = prod.fluidTitle;
        mProductImg.src = prod.img;
        mProductImg.alt = prod.title[lang];
        mProductTitle.textContent = prod.title[lang];
        mNetWeight.textContent = prod.volume;
        mPrice.textContent = `$${prod.price.toFixed(2)}`;
        mBenefits.textContent = prod.benefits[lang];
        mUsage.textContent = prod.usage[lang];
        mIngredients.textContent = prod.ingredients[lang];
        mPrecautions.textContent = prod.precautions[lang];

        // Pregunta lógica: ¿El producto tiene variantes (los 14 olores)?
        if (prod.variants && prod.variants.length > 0) {
            if (normalQtyWrapper) normalQtyWrapper.style.display = 'none';
            if (modalVariantsSection) modalVariantsSection.style.display = 'block';
            if (qtyInput) qtyInput.value = 0; 

            currentSelectedVariants = {};
            if (variantsSelectorsContainer) {
                variantsSelectorsContainer.innerHTML = '';
                
                prod.variants.forEach(variant => {
                    currentSelectedVariants[variant] = 0;

                    const row = document.createElement('div');
                    row.className = 'variant-selection-row';
                    row.innerHTML = `
                        <span class="variant-name">${variant}</span>
                        <div class="quantity-selector-wrapper variant-qty-wrapper">
                            <button type="button" class="qty-btn qty-btn-v btn-v-minus" data-variant="${variant}">&#8722;</button>
                            <input type="number" class="qty-input qty-input-v input-v-val" data-variant="${variant}" value="0" readonly>
                            <button type="button" class="qty-btn qty-btn-v btn-v-plus" data-variant="${variant}">&#43;</button>
                        </div>
                    `;
                    variantsSelectorsContainer.appendChild(row);
                });

                assignVariantsListeners();
            }
        } else {
            if (normalQtyWrapper) normalQtyWrapper.style.display = 'flex';
            if (modalVariantsSection) modalVariantsSection.style.display = 'none';
        }
    };

    // Controladores de clics independientes para sumar o restar en cada olor
    const assignVariantsListeners = () => {
        document.querySelectorAll('.btn-v-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const v = e.target.getAttribute('data-variant');
                const input = e.target.parentElement.querySelector('.input-v-val');
                if (currentSelectedVariants[v] > 0) {
                    currentSelectedVariants[v]--;
                    input.value = currentSelectedVariants[v];
                    updateVariantsGlobalSum();
                }
            });
        });

        document.querySelectorAll('.btn-v-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const v = e.target.getAttribute('data-variant');
                const input = e.target.parentElement.querySelector('.input-v-val');
                if (currentSelectedVariants[v] < 99) {
                    currentSelectedVariants[v]++;
                    input.value = currentSelectedVariants[v];
                    updateVariantsGlobalSum();
                }
            });
        });
    };

    // Esta función suma internamente todos los olores para actualizar el contador principal
    const updateVariantsGlobalSum = () => {
        let totalSum = 0;
        for (const v in currentSelectedVariants) {
            totalSum += currentSelectedVariants[v];
        }
        if (qtyInput) qtyInput.value = totalSum; 
    };

        //  apertura del modal a las tarjetas de la tienda
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll('.btn-open-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product');
            if (productsDatabase[productId]) {
                if (qtyInput) qtyInput.value = 0;
                btnAddCart.setAttribute('data-active-product', productId);
                originalRenderModalTechnicalData(productId, currentLang); // <-- Cambiado a original para corregir el ts(2570)
                modal.classList.add('open');
            }
        });
    });


    const closeModalWindow = () => {
        modal.classList.remove('open');
        if (btnAddCart) {
            btnAddCart.removeAttribute('data-active-product');
        }
    };

    if (modalCloseX) modalCloseX.addEventListener('click', closeModalWindow);
    if (modalCloseBase) modalCloseBase.addEventListener('click', closeModalWindow);

    // --- 5. LÓGICA DEL CONTADOR NUMÉRICO INDIVIDUAL (- 0 +) ---
    if (btnQtyMinus && btnQtyPlus && qtyInput) {
        btnQtyMinus.addEventListener('click', () => {
            let currentVal = parseInt(qtyInput.value) || 0;
            if (currentVal > 0) {
                qtyInput.value = currentVal - 1;
            }
        });

        btnQtyPlus.addEventListener('click', () => {
            let currentVal = parseInt(qtyInput.value) || 0;
            if (currentVal < 99) {
                qtyInput.value = currentVal + 1;
            }
        });

        qtyInput.addEventListener('input', () => {
            let currentVal = parseInt(qtyInput.value);
            if (isNaN(currentVal) || currentVal < 0) {
                qtyInput.value = 0;
            }
        });
    }

    // --- 6. ADICIÓN SILENCIOSA AL CARRITO ADAPTATIVA CON SOPORTE DE ESENCIAS ---
    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            const productId = btnAddCart.getAttribute('data-active-product');
            const qty = parseInt(qtyInput.value) || 0;
            const prod = productsDatabase[productId];

            if (qty === 0) {
                alert(currentLang === 'es' ? 'Por favor, selecciona al menos 1 unidad o esencia.' : 'Please select at least 1 unit or essence.');
                return;
            }

            // Si el producto cuenta con la estructura de esencias (Aceite Corporal)
            if (prod && prod.variants && prod.variants.length > 0) {
                if (!shoppingCartItems[productId]) {
                    shoppingCartItems[productId] = { isVariantStructure: true, totalQty: 0, choices: {} };
                }
                
                shoppingCartItems[productId].totalQty += qty;
                for (const v in currentSelectedVariants) {
                    if (currentSelectedVariants[v] > 0) {
                        shoppingCartItems[productId].choices[v] = (shoppingCartItems[productId].choices[v] || 0) + currentSelectedVariants[v];
                    }
                }
            } else {
                // Tratamiento estándar para cremas, limpiadores y tónicos normales
                if (shoppingCartItems[productId] && typeof shoppingCartItems[productId] === 'object') {
                    shoppingCartItems[productId] = (shoppingCartItems[productId].totalQty || 0) + qty;
                } else {
                    shoppingCartItems[productId] = (shoppingCartItems[productId] || 0) + qty;
                }
            }

            // Actualización del Navbar y animación de rebote (bump)
            totalCartUnits += qty;
            if (globalCartCounter) {
                globalCartCounter.textContent = totalCartUnits;
                globalCartCounter.classList.add('has-products');
            }

            closeModalWindow();
        });
    }


       // --- 7. MOTOR INTERACTIVO DEL CARRITO DE COMPRAS EXTENDIDO CON TRATAMIENTO MULTIESENCIA ---
    const cartModal = document.getElementById('store-cart-modal');
    const cartModalCloseX = document.getElementById('cart-modal-close-x');
    const btnCartContinueShopping = document.getElementById('btn-cart-continue-shopping');
    const btnCartProceedCheckout = document.getElementById('btn-cart-proceed-checkout');
    const cartTableBody = document.getElementById('cart-table-body');
    const shippingSelect = document.getElementById('cart-shipping-method-select');

    // Nodos de desglose financiero
    const lblSubtotal = document.getElementById('breakdown-subtotal');
    const lblShipping = document.getElementById('breakdown-shipping');
    const lblTax = document.getElementById('breakdown-tax');
    const lblGrandTotal = document.getElementById('breakdown-grand-total');

    // Función unificada que dibuja la tabla del carrito desglosando cada esencia por separado
    const renderCartTableDOM = () => {
        if (!cartTableBody) return;
        cartTableBody.innerHTML = '';
        let hasItems = false;
        let subtotal = 0;

        for (const id in shoppingCartItems) {
            const item = shoppingCartItems[id];
            const prod = productsDatabase[id];
            if (!prod) continue;

            // Si el producto es el Aceite Corporal y tiene el desglose de olores
            if (item && item.isVariantStructure) {
                for (const esencia in item.choices) {
                    const qtyEsencia = item.choices[esencia];
                    if (qtyEsencia <= 0) continue;

                    hasItems = true;
                    const itemTotal = prod.price * qtyEsencia;
                    subtotal += itemTotal;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="cart-item-title-td">
                            ${prod.title[currentLang]} 
                            <span class="cart-item-variant-breakdown">(${esencia})</span>
                        </td>
                        <td>$${prod.price.toFixed(2)}</td>
                        <td>
                            <div class="quantity-selector-wrapper">
                                <button class="qty-btn btn-cart-custom-minus" data-id="${id}" data-variant="${esencia}">&#8722;</button>
                                <input type="number" class="qty-input" value="${qtyEsencia}" readonly>
                                <button class="qty-btn btn-cart-custom-plus" data-id="${id}" data-variant="${esencia}">&#43;</button>
                            </div>
                        </td>
                        <td><strong>$${itemTotal.toFixed(2)}</strong></td>
                        <td><button class="btn-remove-item btn-cart-custom-delete" data-id="${id}" data-variant="${esencia}">🗑️</button></td>
                    `;
                    cartTableBody.appendChild(row);
                }
            } else {
                // Flujo clásico e histórico para cremas, limpiadores y tónicos planos
                const displayQty = item;
                if (displayQty <= 0) continue;

                hasItems = true;
                const itemTotal = prod.price * displayQty;
                subtotal += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="cart-item-title-td">${prod.title[currentLang]}</td>
                    <td>$${prod.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-selector-wrapper">
                            <button class="qty-btn btn-cart-custom-minus" data-id="${id}">&#8722;</button>
                            <input type="number" class="qty-input" value="${displayQty}" readonly>
                            <button class="qty-btn btn-cart-custom-plus" data-id="${id}">&#43;</button>
                        </div>
                    </td>
                    <td><strong>$${itemTotal.toFixed(2)}</strong></td>
                    <td><button class="btn-remove-item btn-cart-custom-delete" data-id="${id}">🗑️</button></td>
                `;
                cartTableBody.appendChild(row);
            }
        }

        if (!hasItems) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center" style="padding: 40px; color: #999;">
                        ${currentLang === 'es' ? 'Tu carrito está completamente vacío.' : 'Your cart is completely empty.'}
                    </td>
                </tr>
            `;
        }

        // Cálculos financieros e impuestos de Costa Rica (Cambio a \$10.00 de envío incluido)
        const shippingCost = (shippingSelect && shippingSelect.value === 'delivery' && subtotal > 0) ? 10.00 : 0.00;
        const taxIVA = subtotal * 0.13;
        const grandTotal = subtotal + shippingCost + taxIVA;

        lblSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        lblShipping.textContent = `$${shippingCost.toFixed(2)}`;
        lblTax.textContent = `$${taxIVA.toFixed(2)}`;
        lblGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;

        const pickupLocationBox = document.getElementById('payment-pickup-location-text');
        if (pickupLocationBox && shippingSelect) {
            if (shippingSelect.value === 'pickup') {
                pickupLocationBox.textContent = currentLang === 'es'
                    ? "✓ Retiro seleccionado en Sede Aliada (Gasto de envío: \$0.00). Cancela en recepción al retirar."
                    : "✓ Pickup selected at Allied Branch (Shipping cost: \$0.00). Pay at reception upon pickup.";
            } else {
                pickupLocationBox.textContent = currentLang === 'es'
                    ? "⚠ Has seleccionado Envío a Domicilio en el carrito. Esta opción requiere pago previo por Tarjeta, SINPE o Depósito."
                    : "⚠ You have selected Home Delivery in the cart. This option requires prior payment by Card, SINPE, or Deposit.";
            }
        }

        assignCartActionsListeners();
    };


        // Controladores de clics precisos para sumar, restar o eliminar esencias específicas fila por fila
    const assignCartActionsListeners = () => {
        
        // BOTÓN MENOS (−)
        document.querySelectorAll('.btn-cart-custom-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const variant = e.target.getAttribute('data-variant');
                const item = shoppingCartItems[id];

                if (item && item.isVariantStructure && variant) {
                    if (item.choices[variant] > 1) {
                        item.choices[variant]--;
                        item.totalQty--;
                        totalCartUnits--;
                    }
                } else {
                    if (shoppingCartItems[id] > 1) {
                        shoppingCartItems[id]--;
                        totalCartUnits--;
                    }
                }
                globalCartCounter.textContent = totalCartUnits;
                renderCartTableDOM();
            });
        });

        // BOTÓN MÁS (+)
        document.querySelectorAll('.btn-cart-custom-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const variant = e.target.getAttribute('data-variant');
                const item = shoppingCartItems[id];

                if (item && item.isVariantStructure && variant) {
                    if (item.choices[variant] < 99) {
                        item.choices[variant]++;
                        item.totalQty++;
                        totalCartUnits++;
                    }
                } else {
                    if (shoppingCartItems[id] < 99) {
                        shoppingCartItems[id]++;
                        totalCartUnits++;
                    }
                }
                globalCartCounter.textContent = totalCartUnits;
                renderCartTableDOM();
            });
        });

        // BOTÓN ELIMINAR FILA (🗑️)
        document.querySelectorAll('.btn-cart-custom-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const variant = e.target.getAttribute('data-variant');
                const item = shoppingCartItems[id];

                if (item && item.isVariantStructure && variant) {
                    const qtyToRemove = item.choices[variant];
                    totalCartUnits -= qtyToRemove;
                    item.totalQty -= qtyToRemove;
                    delete item.choices[variant];
                    
                    if (item.totalQty <= 0) delete shoppingCartItems[id];
                } else {
                    totalCartUnits -= shoppingCartItems[id];
                    delete shoppingCartItems[id];
                }
                
                if (totalCartUnits <= 0) {
                    totalCartUnits = 0;
                    globalCartCounter.classList.remove('has-products');
                }
                globalCartCounter.textContent = totalCartUnits;
                renderCartTableDOM();
            });
        });
    };


        document.querySelectorAll('.btn-cart-custom-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = shoppingCartItems[id];

                if (item && item.isVariantStructure) {
                    if (item.totalQty < 99) {
                        const firstEsence = Object.keys(item.choices)[0];
                        if (firstEsence) {
                            item.choices[firstEsence]++;
                            item.totalQty++;
                            totalCartUnits++;
                        }
                    }
                } else {
                    if (shoppingCartItems[id] < 99) {
                        shoppingCartItems[id]++;
                        totalCartUnits++;
                    }
                }
                globalCartCounter.textContent = totalCartUnits;
                renderCartTableDOM();
            });
        });

        document.querySelectorAll('.btn-cart-custom-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = shoppingCartItems[id];
                const subUnits = (item && item.isVariantStructure) ? item.totalQty : item;
                
                totalCartUnits -= subUnits;
                delete shoppingCartItems[id];
                
                if(totalCartUnits <= 0) { 
                    totalCartUnits = 0; 
                    globalCartCounter.classList.remove('has-products'); 
                }
                globalCartCounter.textContent = totalCartUnits;
                renderCartTableDOM();
            });
        });
    

    if (document.getElementById('nav-cart-trigger')) {
        document.getElementById('nav-cart-trigger').addEventListener('click', () => {
            renderCartTableDOM();
            cartModal.classList.add('open');
        });
    }

    const closeCartModalWindow = () => {
        cartModal.classList.remove('open');
    };

    if (cartModalCloseX) cartModalCloseX.addEventListener('click', closeCartModalWindow);
    if (btnCartContinueShopping) btnCartContinueShopping.addEventListener('click', closeCartModalWindow);
    if (shippingSelect) shippingSelect.addEventListener('change', renderCartTableDOM);


        // --- 8. ETAPA DE VERIFICACIÓN DE IDENTIDAD Y REGISTRO OBLIGATORIO (CORREGIDO) ---
    const secureRegisterModal = document.getElementById('secure-register-modal');
    const registerCloseX = document.getElementById('register-modal-close-x');
    const formRegistration = document.getElementById('form-customer-registration');
    
    const boxStageRegister = document.getElementById('checkout-stage-register-box');
    const boxStagePayment = document.getElementById('checkout-stage-payment-box');
    const lblStageLeftTitle = document.getElementById('register-stage-left-title');
    const lblStageLeftIcon = document.getElementById('register-stage-left-icon');

    // Al presionar "Proceder al Pago", cerramos el carrito y abrimos el formulario de registro
    if (btnCartProceedCheckout) {
        btnCartProceedCheckout.addEventListener('click', () => {
            let hasItems = false;
            for (const id in shoppingCartItems) {
                if (shoppingCartItems[id] > 0) {
                    hasItems = true;
                }
            }
            if (!hasItems) {
                alert(currentLang === 'es' ? 'No tienes artículos para procesar.' : 'You have no items to process.');
                return;
            }
            
            // Inicializar las pantallas del modal de registro en su estado original (Paso A)
            if (boxStageRegister) {
                boxStageRegister.style.display = 'block';
            }
            if (boxStagePayment) {
                boxStagePayment.style.display = 'none';
            }
            if (lblStageLeftTitle) {
                lblStageLeftTitle.textContent = currentLang === 'es' ? "Verificación de Identidad" : "Identity Verification";
            }
            if (lblStageLeftIcon) {
                lblStageLeftIcon.textContent = "🛡️";
            }

            closeCartModalWindow();
            
            if (secureRegisterModal) {
                secureRegisterModal.classList.add('open');
            }
        });
    }

       // Captura del envío del formulario de registro (Pasaje al paso B de Pago sin perder datos)
    if (formRegistration) {
        formRegistration.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga de página para proteger datos en memoria

            // Transición animada hacia la pasarela de comprobantes (Paso B)
            if (boxStageRegister) {
                boxStageRegister.style.display = 'none';
            }
            if (boxStagePayment) {
                boxStagePayment.style.display = 'block';
            }
            
            // Modificar bloque visual izquierdo para confirmación corporativa
            if (lblStageLeftTitle) {
                lblStageLeftTitle.textContent = currentLang === 'es' ? "Perfil Verificado" : "Profile Verified";
            }
            if (lblStageLeftIcon) {
                lblStageLeftIcon.textContent = "✅";
            }
        });
    }

    

    // Cierre del modal de registro
    if (registerCloseX) {
        registerCloseX.addEventListener('click', () => {
            if (secureRegisterModal) {
                secureRegisterModal.classList.remove('open');
            }
        });
    }


    // --- 9. FINALIZAR COMPRA (Envío de Comprobante o Tarjeta) ---
    const formPaymentFinal = document.getElementById('form-secure-payment-final');
    if (formPaymentFinal) {
        formPaymentFinal.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(currentLang === 'es' 
                ? '¡Orden Recibida con Éxito!\n\nNuestro departamento de logística validará tu identidad y comprobante para proceder con el despacho de tus fórmulas.' 
                : 'Purchase Order Successfully Received!\n\nOur logistics department will validate your identity and voucher to proceed with your formulas dispatch.');
            
            // Resetear el carrito global por completo tras el éxito comercial
            shoppingCartItems = {};
            totalCartUnits = 0;
            if (globalCartCounter) {
                globalCartCounter.textContent = 0;
                globalCartCounter.classList.remove('has-products');
            }
            secureRegisterModal.classList.remove('open');
        });
    }

    // --- 10. MOTOR DE BÚSQUEDA Y FILTRADO POR MARCAS ---
    const searchInput = document.getElementById('store-search-input');
    const searchSubmit = document.getElementById('store-search-submit');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-item-card');

    const executeSearchAndFilter = () => {
        const queryText = searchInput.value.toLowerCase().trim();
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            const cardTags = card.getAttribute('data-tags') || '';
            
            const matchesFilter = (activeFilter === 'all' || cardBrand === activeFilter);
            const matchesQuery = (queryText === '' || cardTags.includes(queryText));

            if (matchesFilter && matchesQuery) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', executeSearchAndFilter);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearchAndFilter();
            }
        });
    }
    if (searchSubmit) searchSubmit.addEventListener('click', executeSearchAndFilter);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            executeSearchAndFilter();
        });
    });

        // --- 11. ACORDEÓN INTERACTIVO DE MÉTODOS DE PAGO E INTEGRACIÓN ENTORNO PAYPAL ---
    const paymentBlocks = document.querySelectorAll('.payment-method-block');
    
    // Función encargada de dibujar de forma limpia el botón de pago seguro
    const initPayPalSDKEnvironment = () => {
        const btnContainer = document.getElementById('paypal-button-container');
        if (!btnContainer || btnContainer.innerHTML !== "") return; // Evita duplicaciones si hace clics seguidos

        // Inyectamos el botón utilizando la clase limpia de tu CSS externo
        btnContainer.innerHTML = `<div class="paypal-mock-button">PayPal Checkout</div>`;
        
        // Evento de clic para simular o procesar la pasarela internacional
        btnContainer.firstChild.addEventListener('click', () => {
            const finalAmount = document.getElementById('breakdown-grand-total').textContent;
            alert(currentLang === 'es' 
                ? `Redirigiendo de forma segura a la pasarela de PayPal por un monto total de ${finalAmount}.`
                : `Redirecting securely to PayPal gateway for a grand total of ${finalAmount}.`);
            
            // Disparamos automáticamente el envío del formulario final de éxito de compra
            const formPaymentFinal = document.getElementById('form-secure-payment-final');
            if (formPaymentFinal) {
                formPaymentFinal.dispatchEvent(new Event('submit'));
            }
        });
    };

    paymentBlocks.forEach(block => {
        const header = block.querySelector('.payment-method-header');
        const radio = block.querySelector('input[type="radio"]');

        if (header) {
            header.addEventListener('click', () => {
                paymentBlocks.forEach(b => b.classList.remove('active'));
                block.classList.add('active');
                if (radio) {
                    radio.checked = true;
                    // Si el usuario seleccionó la opción de PayPal, inicializamos su entorno seguro
                    if (radio.value === 'paypal') {
                        initPayPalSDKEnvironment();
                    }
                }
            });
        }
    });


    // --- 12. ACORDEÓN DESPLEGABLE DE TÉRMINOS LEGALES ---
    const legalHeader = document.getElementById('legal-accordion-header');
    const legalBody = document.getElementById('legal-accordion-body');

    if (legalHeader && legalBody) {
        legalHeader.addEventListener('click', () => {
            legalHeader.classList.toggle('active');
            legalBody.classList.toggle('open');
        });
    }

    // --- 13. OBSERVADOR DE SCROLL ANIMADO (SCROLL REVEAL) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    revealOnScroll();

}); 
