/* =========================================================
   INSTITUTO PROFESIONAL BEITH SHALOM
   instituto-index.js
   ========================================================= */

(function () {
  'use strict';

  /* =======================================================
     0. CONFIGURACIÓN
     ======================================================= */
  const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : '/api';

  const RESERVA_MINUTOS = 15;
  const FORMALIZACION_MINUTOS = 15;

  const estado = {
    idioma: localStorage.getItem('idioma') || 'es',
    tokenSesionCarrito: localStorage.getItem('tokenSesionCarrito') || null,
    tokenUsuario: localStorage.getItem('tokenUsuario') || null,
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
    programaEnModal: null,
    grupoTallerAbierto: null,
    intervaloCuenta: null,
    intervaloInactividad: null,
  };

  /* =======================================================
     1. DATOS DE RESPALDO (mientras se completan cupos, precios,
        horarios y fechas reales en la base de datos).
        Cuando exista conexión con la API, esos campos se
        sobrescriben con los valores reales del backend.
     ======================================================= */
  const PROGRAMAS = {
    carreras_profesionales: [
      {
        slug: 'master-estetica-profesional-integral',
        sede: ['central', 'paraiso'],
        nombre_es: 'Máster en Estética Profesional Integral',
        nombre_en: 'Master in Comprehensive Professional Aesthetics',
        titulacion_es: 'Máster Profesional (título propio + respaldo internacional)',
        modalidad_es: 'Presencial',
        descripcion_es: 'Formación avanzada en tratamientos faciales y corporales, aparatología estética y protocolos personalizados. Aprenderás a evaluar la piel, diseñar tratamientos y trabajar con tecnologías actuales del mercado.',
        salida_laboral_es: 'Spas, clínicas estéticas, consultorios propios, centros de bienestar.',
        requisitos_es: 'Bachillerato completo, identificación vigente, entrevista de admisión.',
        lugar_es: 'Sede a confirmar según selección',
        horario_es: 'Por confirmar',
        informacion_adicional_es: 'Cupos limitados por grupo para garantizar atención personalizada.',
        contenido_programa_es: 'Evaluación de piel, protocolos faciales y corporales, aparatología, bioseguridad, atención al cliente.',
        precio_unitario: 0,
        cupos_disponibles: 12,
      },
      {
        slug: 'master-terapias-integrales',
        sede: ['central', 'paraiso'],
        nombre_es: 'Máster en Terapias Integrales',
        nombre_en: 'Master in Integrative Therapies',
        titulacion_es: 'Máster Profesional (título propio + respaldo internacional)',
        modalidad_es: 'Presencial',
        descripcion_es: 'Enfocado en el bienestar físico y emocional, este programa integra distintas técnicas terapéuticas para el manejo del estrés, dolor muscular y equilibrio energético.',
        salida_laboral_es: 'Centros de bienestar, spas terapéuticos, práctica independiente.',
        requisitos_es: 'Bachillerato completo, identificación vigente, entrevista de admisión.',
        lugar_es: 'Sede a confirmar según selección',
        horario_es: 'Por confirmar',
        informacion_adicional_es: 'Incluye prácticas supervisadas.',
        contenido_programa_es: 'Técnicas manuales, manejo del estrés, anatomía aplicada, ética profesional.',
        precio_unitario: 0,
        cupos_disponibles: 10,
      },
      {
        slug: 'master-maquillaje-profesional',
        sede: ['central'],
        nombre_es: 'Máster en Maquillaje Profesional',
        nombre_en: 'Master in Professional Makeup',
        titulacion_es: 'Máster Profesional (título propio + respaldo internacional)',
        modalidad_es: 'Presencial',
        descripcion_es: 'Desarrolla habilidades en maquillaje social, artístico y profesional. Incluye técnicas modernas y tendencias actuales para desenvolverte en eventos, moda y medios.',
        salida_laboral_es: 'Freelance, estudios fotográficos, producción audiovisual, eventos.',
        requisitos_es: 'Bachillerato completo, identificación vigente.',
        lugar_es: 'Sede Central',
        horario_es: 'Por confirmar',
        informacion_adicional_es: 'Kit básico de maquillaje incluido.',
        contenido_programa_es: 'Maquillaje social, artístico, novias, editorial y de pasarela.',
        precio_unitario: 0,
        cupos_disponibles: 15,
      },
    ],

    carreras_tecnicas: [
      { slug: 'tecnico-estetica-facial', nombre_es: 'Técnico en Estética Facial', nombre_en: 'Facial Aesthetics Technician', descripcion_es: 'Aprende técnicas de limpieza, hidratación, rejuvenecimiento y tratamientos específicos para diferentes tipos de piel.' },
      { slug: 'tecnico-masajes-terapeuticos', nombre_es: 'Técnico en Masajes Terapéuticos', nombre_en: 'Therapeutic Massage Technician', descripcion_es: 'Formación en técnicas manuales para aliviar tensiones, mejorar la circulación y promover el bienestar físico.' },
      { slug: 'tecnico-cosmiatria', nombre_es: 'Técnico en Cosmiatría', nombre_en: 'Cosmiatry Technician', descripcion_es: 'Especialización en el cuidado de la piel con enfoque clínico-estético, combinando productos, aparatología y diagnóstico facial.' },
      { slug: 'tecnico-reflexologia-integral', nombre_es: 'Técnico en Reflexología Integral', nombre_en: 'Comprehensive Reflexology Technician', descripcion_es: 'Aprende a estimular puntos específicos del cuerpo para mejorar la salud general y el equilibrio energético.' },
      { slug: 'tecnico-kinesiotaping', nombre_es: 'Técnico en Kinesiotaping', nombre_en: 'Kinesiotaping Technician', descripcion_es: 'Aplicación de vendaje neuromuscular para tratar lesiones, mejorar el rendimiento físico y aliviar dolores musculares.' },
    ].map(completarCamposComunes),

    certificaciones: [
      { slug: 'instructor-elite-estetica-belleza', nombre_es: 'Instructor Élite en Estética y Belleza', nombre_en: 'Elite Instructor in Aesthetics & Beauty', descripcion_es: 'Prepárate para formar a otros profesionales, desarrollando habilidades pedagógicas y dominio técnico.' },
      { slug: 'wellness-coach-and-health', nombre_es: 'Wellness Coach and Health', nombre_en: 'Wellness Coach and Health', descripcion_es: 'Adquiere herramientas para guiar a personas en hábitos saludables, bienestar integral y estilo de vida equilibrado.' },
      { slug: 'tecnicas-reductivas-moldeo-corporal', nombre_es: 'Técnicas Reductivas y Moldeo Corporal', nombre_en: 'Reductive Techniques & Body Contouring', descripcion_es: 'Aprende procedimientos para reducción de medidas, tonificación y modelado corporal.' },
      { slug: 'cosmetologia-aplicada-principios-activos', nombre_es: 'Cosmetología Aplicada y Principios Activos', nombre_en: 'Applied Cosmetology & Active Ingredients', descripcion_es: 'Conoce los componentes de los productos cosméticos y su aplicación efectiva según cada tipo de piel.' },
    ].map(completarCamposComunes),

    cursos_faciales: [
      { slug: 'tecnicas-limpieza-facial', nombre_es: 'Técnicas de Limpieza Facial', nombre_en: 'Facial Cleansing Techniques', descripcion_es: 'Aprendé procedimientos básicos y profundos para purificar la piel, eliminar impurezas y devolverle un aspecto saludable y equilibrado.' },
      { slug: 'rejuvenecimiento-facial', nombre_es: 'Rejuvenecimiento Facial', nombre_en: 'Facial Rejuvenation', descripcion_es: 'Aplicá métodos especializados que ayudan a mejorar la apariencia de la piel, aportando firmeza, luminosidad y vitalidad.' },
      { slug: 'microagujas-microneedling', nombre_es: 'Microagujas (Microneedling)', nombre_en: 'Microneedling', descripcion_es: 'Estimulación de colágeno mediante microperforaciones que mejoran la textura, reducen marcas y rejuvenecen la piel.' },
      { slug: 'hollywood-peeling', nombre_es: 'Hollywood Peeling', nombre_en: 'Hollywood Peeling', descripcion_es: 'Tratamiento innovador que aporta luminosidad inmediata, mejora la textura y unifica el tono de la piel.' },
      { slug: 'tratamientos-acneicos', nombre_es: 'Tratamientos Acneicos', nombre_en: 'Acne Treatments', descripcion_es: 'Desarrollá protocolos efectivos para tratar el acné, controlar la grasa y mejorar visiblemente la piel.' },
      { slug: 'peeling-quimico', nombre_es: 'Peeling Químico', nombre_en: 'Chemical Peel', descripcion_es: 'Aplicación de ácidos para renovar la piel, mejorar manchas, textura y promover la regeneración celular.' },
      { slug: 'microdermoabrasion', nombre_es: 'Microdermoabrasión', nombre_en: 'Microdermabrasion', descripcion_es: 'Exfoliación mecánica que elimina células muertas, dejando la piel más suave, uniforme y luminosa.' },
      { slug: 'aparatologia-facial', nombre_es: 'Aparatología Facial', nombre_en: 'Facial Technology Devices', descripcion_es: 'Uso de equipos tecnológicos aplicados a la estética.' },
      { slug: 'lifting-facial', nombre_es: 'Lifting Facial', nombre_en: 'Facial Lifting', descripcion_es: 'Técnicas especializadas para reafirmar la piel, mejorar la tonicidad y lograr un efecto rejuvenecedor.' },
      { slug: 'dermaplaning', nombre_es: 'Dermaplaning', nombre_en: 'Dermaplaning', descripcion_es: 'Técnica de exfoliación manual que elimina células muertas y vello facial fino, dejando la piel más suave, luminosa y preparada.' },
    ].map(completarCamposComunes),

    cursos_corporales: [
      { slug: 'masajes-terapeuticos-taller', nombre_es: 'Masajes Terapéuticos', nombre_en: 'Therapeutic Massage', descripcion_es: 'Relajantes, descontracturantes, drenaje linfático, entre otros.' },
      { slug: 'terapias-fisio-musculares', nombre_es: 'Terapias Fisio-Musculares', nombre_en: 'Physio-Muscular Therapies', descripcion_es: 'Tratamiento de lesiones como esguinces, contracturas, lumbalgias y más.' },
    ].map(completarCamposComunes),
  };

  function completarCamposComunes(item) {
    return Object.assign({
      titulacion_es: 'Certificado de aprovechamiento Instituto Beith Shalom',
      modalidad_es: 'Presencial',
      salida_laboral_es: 'Spas, clínicas estéticas, centros de bienestar, práctica independiente.',
      requisitos_es: 'Mayoría de edad, identificación vigente.',
      lugar_es: 'Sede Central',
      horario_es: 'Por confirmar',
      informacion_adicional_es: 'Datos de cupos, precio y fechas pendientes de confirmar con administración.',
      contenido_programa_es: item.descripcion_es,
      precio_unitario: 0,
      cupos_disponibles: 15,
    }, item);
  }

  // Contenido de ejemplo para anuncios / blog / eventos / alianzas / publicidad
  // (el cliente pidió ejemplos; esto se reemplaza por contenido real del panel
  // de directivos una vez esté conectado a la API en producción).
  const EJEMPLOS = {
    anuncios: [
      { titulo_es: 'Matrícula abierta para el próximo cuatrimestre', fecha: '2026-09-01', contenido_es: 'Del 1 al 20 de setiembre se recibe matrícula para todas las carreras técnicas y profesionales. Cupos limitados por grupo.' },
      { titulo_es: 'Feriado institucional', fecha: '2026-10-12', contenido_es: 'El instituto permanecerá cerrado el 12 de octubre. Las clases se reprograman según calendario académico.' },
    ],
    blog: [
      { titulo_es: 'Tendencias en aparatología facial para 2026', autor: 'Dirección Académica', fecha: '2026-08-15', contenido_es: 'Un repaso de las tecnologías que están marcando la pauta en tratamientos faciales no invasivos y su aplicación en el aula.', 
        galeria: ['img/tendencias.jpg'],
      },
      { titulo_es: 'Por qué la certificación internacional hace la diferencia', autor: 'Coordinación de Carreras', fecha: '2026-07-30', contenido_es: 'El respaldo académico internacional abre puertas laborales que un certificado local, por sí solo, no siempre garantiza.',
        galería: ['img/certificaciones-internacionales.jpg'],
       },
       
    ],
    eventos: [
      {
        titulo_es: 'Graduación generación 2026',
        fecha: '2026-12-05',
        descripcion_es: 'Ceremonia de graduación de todas las carreras profesionales y técnicas, Sede Central.',
        descripcion_larga_es: 'Invitamos a estudiantes, familias y cuerpo docente a la ceremonia de graduación de la generación 2026. Se entregarán los títulos de las carreras profesionales, técnicas y certificaciones cursadas durante el año, con un reconocimiento especial a los promedios más altos de cada programa.',
        galeria: ['img/tendencias.jpg', 'assets/evento-2.jpg', 'assets/evento-3.jpg'],
      },
      {
        titulo_es: 'Seminario de aparatología avanzada',
        fecha: '2026-11-10',
        descripcion_es: 'Seminario abierto con expositor invitado sobre nuevas tecnologías en tratamientos corporales.',
        descripcion_larga_es: 'Un espacio de actualización profesional con un expositor invitado especializado en nuevas tecnologías de aparatología corporal, dirigido a estudiantes y egresados del instituto. Incluye demostración práctica en vivo.',
        galeria: ['assets/evento-4.jpg', 'assets/evento-5.jpg'],
      },
    ],
    alianzas: [
      {
        nombre: 'Saint Peters Universtity',
        descripcion_es: 'Alianza académica que respalda internacionalmente nuestros programas de Máster, fortaleciendo la validez del título ante empleadores fuera de Costa Rica.',
        beneficios_es: 'Los egresados pueden solicitar una carta de equivalencia académica para trámites de reconocimiento internacional.',
      },
      {
        nombre: 'Fecoprobe',
        descripcion_es: 'Federación que certifica la calidad académica de nuestros programas de estética y bienestar.',
        beneficios_es: 'Certificación reconocida por el gremio profesional de estética a nivel nacional.',
      },
      {
        nombre: 'Xeer Empresarial',
        descripcion_es: 'Alianza empresarial y de gestión administrativa del instituto.',
        beneficios_es: 'Descuentos preferenciales en servicios de asesoría empresarial para egresados que emprendan su propio negocio.',
      },
    ],
    publicidad: [
      { nombre_empresa: 'Distribuidora de Insumos Estéticos CR', descripcion: 'Productos y equipos profesionales para estética con envío a todo el país.', sitio_web_url: 'https://example.com', logo_url: null },
      { nombre_empresa: 'Uniformes Profesionales Delta', descripcion: 'Uniformes y batas para profesionales de la estética y la salud.', whatsapp_numero: '50688887777', logo_url: null },
    ],
    comentarios: [
      { nombre_completo: 'Estudiante verificada', texto_es: 'Excelente formación práctica, los profesores acompañan de cerca cada protocolo.', fecha: '2026-08-20' },
    ],
  };

  /* =======================================================
     2. IDIOMA (ES / EN)
     ======================================================= */
  function aplicarIdioma() {
    document.documentElement.lang = estado.idioma;
    document.querySelectorAll('[data-es]').forEach((el) => {
      const texto = estado.idioma === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
      if (texto !== null) el.textContent = texto;
    });
    document.querySelectorAll('[data-idioma]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.idioma === estado.idioma));
    });
  }

  document.querySelectorAll('[data-idioma]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.idioma = btn.dataset.idioma;
      localStorage.setItem('idioma', estado.idioma);
      aplicarIdioma();
      renderizarTodo(); // vuelve a pintar tarjetas y listas en el nuevo idioma
    });
  });

  /* =======================================================
     3. NAVBAR MÓVIL
     ======================================================= */
  const botonMenuMovil = document.getElementById('boton-menu-movil');
  const navbarEnlaces = document.getElementById('navbar-enlaces');
  botonMenuMovil.addEventListener('click', () => {
    const abierto = navbarEnlaces.classList.toggle('abierto');
    botonMenuMovil.setAttribute('aria-expanded', String(abierto));
  });
  navbarEnlaces.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navbarEnlaces.classList.remove('abierto');
      botonMenuMovil.setAttribute('aria-expanded', 'false');
    });
  });

  /* =======================================================
     4. REVELADO AL HACER SCROLL
     ======================================================= */
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revelado');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('[data-revelar]').forEach((el) => observador.observe(el));

  /* =======================================================
     5. MODALES (genérico)
     ======================================================= */
  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    const primerFocable = modal.querySelector('input, select, textarea, button');
    if (primerFocable) primerFocable.focus();
  }

  function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('abierto');
    const algunoAbierto = document.querySelector('.modal-fondo.abierto');
    if (!algunoAbierto) document.body.style.overflow = '';
  }

  function cerrarTodosLosModales() {
    document.querySelectorAll('.modal-fondo.abierto').forEach((m) => m.classList.remove('abierto'));
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-fondo').forEach((fondo) => {
    fondo.addEventListener('click', (e) => {
      if (e.target === fondo) cerrarModal(fondo.id);
    });
  });
  document.querySelectorAll('[data-cerrar-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-fondo');
      if (modal) cerrarModal(modal.id);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarTodosLosModales();
  });

  function mostrarAviso(titulo_es, titulo_en, texto_es, texto_en) {
    document.getElementById('modal-aviso-titulo').textContent = estado.idioma === 'en' ? titulo_en : titulo_es;
    document.getElementById('modal-aviso-texto').textContent = estado.idioma === 'en' ? texto_en : texto_es;
    abrirModal('modal-aviso');
  }

  /* =======================================================
     6. TARJETAS DE PROGRAMAS
     ======================================================= */
  function crearTarjetaPrograma(programa) {
    const articulo = document.createElement('article');
    articulo.className = 'tarjeta';
    const nombre = estado.idioma === 'en' && programa.nombre_en ? programa.nombre_en : programa.nombre_es;
    const descripcion = estado.idioma === 'en' && programa.descripcion_en ? programa.descripcion_en : programa.descripcion_es;

    articulo.innerHTML = `
      <h3 class="tarjeta__titulo">${nombre}</h3>
      <p class="tarjeta__texto">${descripcion}</p>
      <button type="button" class="boton boton--primario" data-ver-programa="${programa.slug}">
        ${estado.idioma === 'en' ? 'See details' : 'Ver detalles'}
      </button>
    `;
    articulo.querySelector('[data-ver-programa]').addEventListener('click', () => abrirModalPrograma(programa));
    return articulo;
  }

  function pintarGrid(id, lista) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;
    contenedor.innerHTML = '';
    lista.forEach((programa) => contenedor.appendChild(crearTarjetaPrograma(programa)));
  }

  let sedeActiva = 'central';
  function pintarCarrerasProfesionales() {
    const filtradas = PROGRAMAS.carreras_profesionales.filter((p) => p.sede.includes(sedeActiva));
    pintarGrid('grid-carreras-profesionales', filtradas);
  }

  document.querySelectorAll('.selector-sedes button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.selector-sedes button').forEach((b) => b.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');
      sedeActiva = btn.dataset.sede;
      pintarCarrerasProfesionales();
    });
  });

  document.querySelectorAll('[data-abrir-grupo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const grupo = btn.dataset.abrirGrupo; // 'faciales' | 'corporales'
      const subgrid = document.getElementById(`grid-${grupo}`);
      const contenedorGrupo = document.getElementById(`grupo-${grupo}`);
      const yaAbierto = subgrid.classList.contains('abierto');
      subgrid.classList.toggle('abierto', !yaAbierto);
      if (!yaAbierto) {
        contenedorGrupo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  function renderizarTodo() {
    pintarCarrerasProfesionales();
    pintarGrid('grid-carreras-tecnicas', PROGRAMAS.carreras_tecnicas);
    pintarGrid('grid-certificaciones', PROGRAMAS.certificaciones);
    pintarGrid('grid-faciales', PROGRAMAS.cursos_faciales);
    pintarGrid('grid-corporales', PROGRAMAS.cursos_corporales);
    pintarAnuncios();
    pintarBlog();
    pintarEventos();
    pintarComentarios();
    pintarAlianzas();
    pintarPublicidad();
    poblarSelectorProgramas();
  }

  /* =======================================================
     7. MODAL DE FICHA DE PROGRAMA + CARRITO
     ======================================================= */
  function abrirModalPrograma(programa) {
    estado.programaEnModal = programa;
    const idioma = estado.idioma;
    const t = (es, en) => (idioma === 'en' && en ? en : es);

    const contenedor = document.getElementById('modal-generico-contenido');
    contenedor.innerHTML = `
      <h2 id="modal-generico-titulo">${t(programa.nombre_es, programa.nombre_en)}</h2>
      <dl class="ficha-programa">
        <dt>${t('Titulación', 'Credential')}</dt><dd>${programa.titulacion_es || '—'}</dd>
        <dt>${t('Modalidad', 'Format')}</dt><dd>${programa.modalidad_es || '—'}</dd>
        <dt>${t('Descripción', 'Description')}</dt><dd>${t(programa.descripcion_es, programa.descripcion_en)}</dd>
        <dt>${t('¿En qué puedo trabajar?', 'Where can I work?')}</dt><dd>${programa.salida_laboral_es || '—'}</dd>
        <dt>${t('Requisitos de ingreso', 'Admission requirements')}</dt><dd>${programa.requisitos_es || '—'}</dd>
        <dt>${t('Lugar', 'Location')}</dt><dd>${programa.lugar_es || '—'}</dd>
        <dt>${t('Fecha inicio', 'Start date')}</dt><dd>${programa.fecha_inicio || t('Por confirmar', 'To be confirmed')}</dd>
        <dt>${t('Fecha fin', 'End date')}</dt><dd>${programa.fecha_fin || t('Por confirmar', 'To be confirmed')}</dd>
        <dt>${t('Horario', 'Schedule')}</dt><dd>${programa.horario_es || '—'}</dd>
        <dt>${t('Información adicional', 'Additional information')}</dt><dd>${programa.informacion_adicional_es || '—'}</dd>
        <dt>${t('Contenido del programa', 'Program content')}</dt><dd>${programa.contenido_programa_es || '—'}</dd>
      </dl>

      <div class="ficha-programa__contador">
        <button type="button" id="restar-cantidad" aria-label="${t('Quitar cupo', 'Remove seat')}">−</button>
        <output id="cantidad-programa">0</output>
        <button type="button" id="sumar-cantidad" aria-label="${t('Agregar cupo', 'Add seat')}">+</button>
      </div>

      <div class="ficha-programa__acciones">
        <button type="button" class="boton boton--primario" id="boton-inscribirme">
          ${t('Me quiero inscribir', 'I want to enroll')}
        </button>
      </div>
    `;

    let cantidad = 0;
    const salida = contenedor.querySelector('#cantidad-programa');
    contenedor.querySelector('#sumar-cantidad').addEventListener('click', () => {
      cantidad += 1;
      salida.textContent = cantidad;
    });
    contenedor.querySelector('#restar-cantidad').addEventListener('click', () => {
      cantidad = Math.max(0, cantidad - 1);
      salida.textContent = cantidad;
    });
    contenedor.querySelector('#boton-inscribirme').addEventListener('click', async () => {
      if (cantidad < 1) {
        mostrarAviso('Elegí al menos un cupo', 'Choose at least one seat', 'Usá el botón "+" para indicar cuántos cupos querés apartar.', 'Use the "+" button to choose how many seats to reserve.');
        return;
      }
      await agregarAlCarrito(programa, cantidad);
    });

    abrirModal('modal-generico');
  }

  /* =======================================================
     8. CARRITO (conecta con la API cuando está disponible)
     ======================================================= */
  async function obtenerTokenCarrito() {
    if (estado.tokenSesionCarrito) return estado.tokenSesionCarrito;
    try {
      const resp = await fetch(`${API_BASE}/carrito`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const datos = await resp.json();
      estado.tokenSesionCarrito = datos.tokenSesion;
    } catch (err) {
      // Sin backend disponible: generamos un token local para que la
      // experiencia siga siendo usable mientras se conecta la API.
      estado.tokenSesionCarrito = crypto.randomUUID();
    }
    localStorage.setItem('tokenSesionCarrito', estado.tokenSesionCarrito);
    return estado.tokenSesionCarrito;
  }

  const carritoLocal = new Map(); // respaldo si la API no está disponible

  async function agregarAlCarrito(programa, cantidad) {
    const tokenSesion = await obtenerTokenCarrito();
    try {
      const resp = await fetch(`${API_BASE}/carrito/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenSesion, programaId: programa.id || programa.slug, cantidad }),
      });
      const datos = await resp.json();

      if (resp.status === 409 && datos.error === 'CHOQUE_HORARIO') {
        mostrarAviso('Choque de horario', 'Schedule conflict', datos.mensaje, datos.mensaje);
        return;
      }
      if (resp.status === 409 && datos.error === 'CUPO_CERRADO') {
        mostrarAviso('Cupo cerrado', 'Seats full', datos.mensaje, datos.mensaje);
        return;
      }
      if (!resp.ok) throw new Error(datos.error || 'Error al agregar al carrito');

      iniciarCuentaRegresiva(datos.expiraEn, RESERVA_MINUTOS);
    } catch (err) {
      // Respaldo local si el backend aún no está desplegado.
      carritoLocal.set(programa.slug, { programa, cantidad });
    }

    cerrarModal('modal-generico');
    actualizarContadorCarrito();
    mostrarAviso(
      'Cupo apartado',
      'Seat reserved',
      `Tenés ${RESERVA_MINUTOS} minutos para registrarte o iniciar sesión y conservarlo.`,
      `You have ${RESERVA_MINUTOS} minutes to register or sign in to keep it.`
    );
  }

  function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    const total = carritoLocal.size; // se reemplaza por el total real al conectar la API
    contador.hidden = total === 0;
    contador.textContent = total;
  }

  async function abrirCarrito() {
    const tokenSesion = await obtenerTokenCarrito();
    const contenedorLista = document.getElementById('lista-carrito-items');
    const resumen = document.getElementById('resumen-carrito');
    const vacio = document.getElementById('carrito-vacio');
    contenedorLista.innerHTML = '';

    try {
      const resp = await fetch(`${API_BASE}/carrito/${tokenSesion}`);
      const datos = await resp.json();

      if (!datos.items || !datos.items.length) {
        vacio.hidden = false;
        resumen.hidden = true;
      } else {
        vacio.hidden = true;
        resumen.hidden = false;
        datos.items.forEach((item) => {
          const div = document.createElement('div');
          div.className = 'carrito-item';
          const nombre = estado.idioma === 'en' && item.nombre_en ? item.nombre_en : item.nombre_es;
          div.innerHTML = `<span>${nombre} × ${item.cantidad}</span><span>₡${(item.cantidad * item.precio_unitario).toFixed(2)}</span>`;
          contenedorLista.appendChild(div);
        });
        document.getElementById('carrito-subtotal').textContent = `Subtotal: ₡${datos.subtotal.toFixed(2)}`;
        document.getElementById('carrito-iva').textContent = `IVA (13%): ₡${datos.iva.toFixed(2)}`;
        document.getElementById('carrito-total').textContent = `Total: ₡${datos.total.toFixed(2)}`;
      }
    } catch (err) {
      // Respaldo local
      if (carritoLocal.size === 0) {
        vacio.hidden = false;
        resumen.hidden = true;
      } else {
        vacio.hidden = true;
        resumen.hidden = false;
        let subtotal = 0;
        carritoLocal.forEach(({ programa, cantidad }) => {
          const div = document.createElement('div');
          div.className = 'carrito-item';
          div.innerHTML = `<span>${programa.nombre_es} × ${cantidad}</span><span>${estado.idioma === 'en' ? 'pending price' : 'precio pendiente'}</span>`;
          contenedorLista.appendChild(div);
        });
      }
    }

    abrirModal('modal-carrito');
  }

  document.getElementById('boton-abrir-carrito').addEventListener('click', abrirCarrito);

  /* =======================================================
     9. CUENTA REGRESIVA (15 min apartado / 15 min formalización)
     ======================================================= */
  function iniciarCuentaRegresiva(expiraEnISO, minutosBase) {
    clearInterval(estado.intervaloCuenta);
    const expiraEn = expiraEnISO ? new Date(expiraEnISO).getTime() : Date.now() + minutosBase * 60 * 1000;

    function actualizar() {
      const restanteMs = expiraEn - Date.now();
      const avisos = [document.getElementById('aviso-tiempo-carrito'), document.getElementById('aviso-tiempo-formalizar')];

      if (restanteMs <= 0) {
        clearInterval(estado.intervaloCuenta);
        avisos.forEach((a) => { if (a) a.hidden = true; });
        carritoLocal.clear();
        estado.tokenSesionCarrito = null;
        localStorage.removeItem('tokenSesionCarrito');
        actualizarContadorCarrito();
        mostrarAviso(
          'El tiempo venció',
          'Time expired',
          'Tu tiempo para continuar venció y tu selección se reinició. Podés volver a elegir tus cursos.',
          'Your time to continue expired and your selection was reset. You can choose your courses again.'
        );
        return;
      }

      const minutos = Math.floor(restanteMs / 60000);
      const segundos = Math.floor((restanteMs % 60000) / 1000);
      const texto = estado.idioma === 'en'
        ? `Time remaining: ${minutos}:${String(segundos).padStart(2, '0')}`
        : `Tiempo restante: ${minutos}:${String(segundos).padStart(2, '0')}`;
      avisos.forEach((a) => { if (a) { a.hidden = false; a.textContent = texto; } });
    }

    actualizar();
    estado.intervaloCuenta = setInterval(actualizar, 1000);
  }

  /* =======================================================
     10. FLUJO DE FORMALIZACIÓN DE MATRÍCULA
     ======================================================= */
  document.getElementById('boton-formalizar-matricula').addEventListener('click', () => {
    cerrarModal('modal-carrito');
    abrirModal('modal-modalidad-matricula');
  });

  document.getElementById('boton-matricula-web').addEventListener('click', async () => {
    cerrarModal('modal-modalidad-matricula');
    if (!estado.tokenUsuario) {
      abrirModal('modal-requiere-cuenta');
      return;
    }
    await vincularCarritoAUsuario();
    abrirModal('modal-formalizar');
  });

  document.getElementById('boton-matricula-presencial').addEventListener('click', () => {
    cerrarModal('modal-modalidad-matricula');
    abrirModal('modal-presencial');
  });

  document.getElementById('boton-ir-registro').addEventListener('click', () => {
    cerrarModal('modal-requiere-cuenta');
    cargarUbicaciones();
    abrirModal('modal-registro');
  });
  document.getElementById('boton-ir-login').addEventListener('click', () => {
    cerrarModal('modal-requiere-cuenta');
    abrirModal('modal-login');
  });

  async function vincularCarritoAUsuario() {
    const tokenSesion = await obtenerTokenCarrito();
    try {
      const resp = await fetch(`${API_BASE}/carrito/${tokenSesion}/vincular-usuario`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${estado.tokenUsuario}` },
      });
      const datos = await resp.json();
      iniciarCuentaRegresiva(datos.expiraEn, FORMALIZACION_MINUTOS);
    } catch (err) {
      iniciarCuentaRegresiva(null, FORMALIZACION_MINUTOS);
    }
  }

  document.getElementById('formulario-formalizar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const errorEl = document.getElementById('formalizar-error');
    errorEl.hidden = true;

    const cuerpo = new FormData(form);
    cuerpo.append('tokenSesion', estado.tokenSesionCarrito || '');

    try {
      const resp = await fetch(`${API_BASE}/matriculas/web`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${estado.tokenUsuario}` },
        body: cuerpo,
      });
      const datos = await resp.json();
      if (!resp.ok) throw new Error(datos.error || 'No se pudo formalizar la matrícula.');

      cerrarModal('modal-formalizar');
      mostrarAviso(
        '¡Matrícula registrada!',
        'Enrollment registered!',
        'Tu pago será verificado por el equipo administrativo. Podés descargar tu comprobante desde el enlace enviado a tu correo.',
        'Your payment will be verified by our administrative team. You can download your receipt from the link sent to your email.'
      );
      carritoLocal.clear();
      actualizarContadorCarrito();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById('formulario-presencial').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const datosFormulario = Object.fromEntries(new FormData(form).entries());
    const exito = document.getElementById('presencial-exito');

    try {
      await fetch(`${API_BASE}/matriculas/presencial-telefonica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modalidad: 'presencial', ...datosFormulario, programaId: estado.programaEnModal?.slug }),
      });
    } catch (err) {
      // Si el backend no está disponible, igual confirmamos la intención al usuario;
      // el equipo administrativo puede dar seguimiento por WhatsApp/correo.
    }

    exito.hidden = false;
    exito.textContent = estado.idioma === 'en'
      ? 'Thanks! Our team will contact you to confirm your enrollment.'
      : '¡Gracias! Nuestro equipo te contactará para confirmar tu matrícula.';
    form.reset();
  });

  /* =======================================================
     11. UBICACIONES (provincia > cantón > distrito)
     ======================================================= */
  async function cargarUbicaciones() {
    const selectProvincia = document.getElementById('registro-provincia');
    if (selectProvincia.dataset.cargado) return;
    try {
      const resp = await fetch(`${API_BASE}/ubicaciones/provincias`);
      const provincias = await resp.json();
      selectProvincia.innerHTML = `<option value="">${estado.idioma === 'en' ? 'Select...' : 'Seleccioná...'}</option>` +
        provincias.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join('');
      selectProvincia.dataset.cargado = 'true';
    } catch (err) {
      selectProvincia.innerHTML = `<option value="">${estado.idioma === 'en' ? 'Not available offline' : 'No disponible sin conexión al servidor'}</option>`;
    }
  }

  document.getElementById('registro-provincia').addEventListener('change', async (e) => {
    const selectCanton = document.getElementById('registro-canton');
    const selectDistrito = document.getElementById('registro-distrito');
    selectDistrito.innerHTML = '';
    selectDistrito.disabled = true;
    if (!e.target.value) { selectCanton.disabled = true; return; }
    try {
      const resp = await fetch(`${API_BASE}/ubicaciones/provincias/${e.target.value}/cantones`);
      const cantones = await resp.json();
      selectCanton.innerHTML = cantones.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('');
      selectCanton.disabled = false;
    } catch (err) {
      selectCanton.disabled = true;
    }
  });

  document.getElementById('registro-canton').addEventListener('change', async (e) => {
    const selectDistrito = document.getElementById('registro-distrito');
    try {
      const resp = await fetch(`${API_BASE}/ubicaciones/cantones/${e.target.value}/distritos`);
      const distritos = await resp.json();
      selectDistrito.innerHTML = distritos.map((d) => `<option value="${d.id}">${d.nombre}</option>`).join('');
      selectDistrito.disabled = false;
    } catch (err) {
      selectDistrito.disabled = true;
    }
  });

  /* =======================================================
     12. AUTENTICACIÓN: REGISTRO / LOGIN / GOOGLE / RECUPERAR
     ======================================================= */
  function guardarSesionUsuario(token, usuario) {
    estado.tokenUsuario = token;
    estado.usuario = usuario;
    localStorage.setItem('tokenUsuario', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    reiniciarRelojInactividad();
    actualizarBotonCuenta();
  }

  function cerrarSesionUsuario(mostrarAvisoExpiracion) {
    estado.tokenUsuario = null;
    estado.usuario = null;
    localStorage.removeItem('tokenUsuario');
    localStorage.removeItem('usuario');
    clearInterval(estado.intervaloInactividad);
    actualizarBotonCuenta();
    if (mostrarAvisoExpiracion) {
      mostrarAviso(
        'Sesión finalizada',
        'Session ended',
        'Tu sesión se cerró por inactividad. Los cambios sin guardar no se conservaron.',
        'Your session was closed due to inactivity. Unsaved changes were not kept.'
      );
    }
  }

  function reiniciarRelojInactividad() {
    clearInterval(estado.intervaloInactividad);
    let ultimaActividad = Date.now();
    const marcarActividad = () => { ultimaActividad = Date.now(); };
    ['click', 'keydown', 'scroll', 'mousemove'].forEach((evento) => window.addEventListener(evento, marcarActividad, { passive: true }));

    estado.intervaloInactividad = setInterval(() => {
      if (Date.now() - ultimaActividad > 15 * 60 * 1000) {
        cerrarSesionUsuario(true);
      }
    }, 15000);
  }

  function actualizarBotonCuenta() {
    const boton = document.getElementById('boton-cuenta');
    if (estado.usuario) {
      boton.textContent = estado.usuario.nombreCompleto || estado.usuario.email;
    } else {
      boton.textContent = estado.idioma === 'en' ? 'My account' : 'Mi cuenta';
    }
  }

  document.getElementById('boton-cuenta').addEventListener('click', () => {
    if (estado.usuario) {
      cerrarSesionUsuario(false);
    } else {
      abrirModal('modal-login');
    }
  });

  document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('registro-error');
    errorEl.hidden = true;
    const datos = Object.fromEntries(new FormData(e.target).entries());

    try {
      const resp = await fetch(`${API_BASE}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const respuesta = await resp.json();
      if (!resp.ok) throw new Error(respuesta.error || 'No se pudo completar el registro.');

      guardarSesionUsuario(respuesta.token, respuesta.usuario);
      cerrarModal('modal-registro');
      await vincularCarritoAUsuario();
      abrirModal('modal-formalizar');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById('formulario-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    errorEl.hidden = true;
    const datos = Object.fromEntries(new FormData(e.target).entries());

    try {
      const resp = await fetch(`${API_BASE}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const respuesta = await resp.json();
      if (!resp.ok) throw new Error(respuesta.error || 'Correo o contraseña incorrectos.');

      guardarSesionUsuario(respuesta.token, respuesta.usuario);
      cerrarModal('modal-login');

      const carritoEsperando = document.getElementById('modal-carrito').classList.contains('abierto') || carritoLocal.size > 0;
      if (carritoEsperando) {
        await vincularCarritoAUsuario();
        abrirModal('modal-formalizar');
      }
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById('boton-olvide-password').addEventListener('click', () => {
    cerrarModal('modal-login');
    abrirModal('modal-recuperar');
  });

  document.getElementById('formulario-recuperar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get('email');
    const exito = document.getElementById('recuperar-exito');
    try {
      const resp = await fetch(`${API_BASE}/usuarios/olvide-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const datos = await resp.json();
      exito.textContent = datos.mensaje;
    } catch (err) {
      exito.textContent = estado.idioma === 'en'
        ? 'If the email exists in our system, a recovery link will be sent.'
        : 'Si el correo existe en nuestro sistema, se enviará un enlace de recuperación.';
    }
    exito.hidden = false;
  });

  // Google Identity Services: requiere que se configure GOOGLE_CLIENT_ID
  // y se cargue el script de Google (https://accounts.google.com/gsi/client)
  // antes de que estos botones puedan iniciar el flujo real.
  ['boton-registro-google', 'boton-login-google'].forEach((id) => {
    document.getElementById(id).addEventListener('click', () => {
      mostrarAviso(
        'Google en configuración',
        'Google sign-in pending setup',
        'El inicio de sesión con Google se habilitará en cuanto se configure el Client ID del instituto.',
        'Google sign-in will be enabled once the institute\'s Client ID is configured.'
      );
    });
  });

  actualizarBotonCuenta();
  if (estado.tokenUsuario) reiniciarRelojInactividad();

  /* =======================================================
     13. COMENTARIOS
     ======================================================= */
  function pintarComentarios() {
    const contenedor = document.getElementById('lista-comentarios');
    contenedor.innerHTML = '';
    EJEMPLOS.comentarios.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'comentario';
      div.innerHTML = `
        <img class="comentario__avatar" src="assets/avatar-generico.png" alt="" />
        <div>
          <strong>${c.nombre_completo}</strong>
          <p class="comentario__fecha">${c.fecha}</p>
          <p>${c.texto_es}</p>
        </div>
      `;
      contenedor.appendChild(div);
    });
  }

  document.getElementById('boton-abrir-comentario').addEventListener('click', () => {
    if (!estado.tokenUsuario) {
      abrirModal('modal-requiere-cuenta');
      return;
    }
    abrirModal('modal-comentario');
  });

  document.getElementById('formulario-comentario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = document.getElementById('comentario-texto').value;
    try {
      await fetch(`${API_BASE}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${estado.tokenUsuario}` },
        body: JSON.stringify({ texto }),
      });
    } catch (err) {
      // Backend no disponible aún; igual confirmamos la intención al usuario.
    }
    cerrarModal('modal-comentario');
    mostrarAviso(
      'Comentario enviado',
      'Comment submitted',
      'Tu comentario será publicado una vez verificado su contenido.',
      'Your comment will be published once its content has been reviewed.'
    );
    e.target.reset();
  });

  /* =======================================================
     14. ANUNCIOS / BLOG / EVENTOS / ALIANZAS / PUBLICIDAD
     ======================================================= */
  function pintarAnuncios() {
    const contenedor = document.getElementById('lista-anuncios');
    contenedor.innerHTML = '';
    EJEMPLOS.anuncios.forEach((a) => {
      const articulo = document.createElement('article');
      articulo.className = 'tarjeta';
      articulo.innerHTML = `
        <p class="tarjeta__texto" style="font-size:.8rem; color: var(--color-turquesa-oscuro); font-weight:600;">${a.fecha}</p>
        <h3 class="tarjeta__titulo">${a.titulo_es}</h3>
        <p class="tarjeta__texto">${a.contenido_es.slice(0, 90)}…</p>
        <button type="button" class="boton boton--texto" data-ver-mas>${estado.idioma === 'en' ? 'See more' : 'Ver más'}</button>
      `;
      articulo.querySelector('[data-ver-mas]').addEventListener('click', () => {
        document.getElementById('modal-generico-contenido').innerHTML = `
          <h2 id="modal-generico-titulo">${a.titulo_es}</h2>
          <p style="font-size:.85rem;color:var(--color-carbon-suave);">${a.fecha}</p>
          <p style="margin-top:1rem;">${a.contenido_es}</p>
        `;
        abrirModal('modal-generico');
      });
      contenedor.appendChild(articulo);
    });
  }

  function pintarBlog() {
    const contenedor = document.getElementById('lista-blog');
    contenedor.innerHTML = '';
    EJEMPLOS.blog.forEach((post) => {
      const articulo = document.createElement('article');
      articulo.className = 'tarjeta tarjeta-horizontal';
      articulo.innerHTML = `
        <img src="img/tendencias.jpg" alt="" />
        <div>
          <p class="tarjeta-horizontal__meta">${post.fecha} · ${post.autor}</p>
          <h3 class="tarjeta__titulo">${post.titulo_es}</h3>
          <p class="tarjeta__texto">${post.contenido_es.slice(0, 110)}…</p>
          <button type="button" class="boton boton--texto" data-leer-mas>${estado.idioma === 'en' ? 'Read more…' : 'Leer más…'}</button>
        </div>
      `;
      articulo.querySelector('[data-leer-mas]').addEventListener('click', () => {
        document.getElementById('modal-generico-contenido').innerHTML = `
          <h2 id="modal-generico-titulo">${post.titulo_es}</h2>
          <p style="font-size:.85rem;color:var(--color-carbon-suave);">${post.fecha} · ${post.autor}</p>
          <p style="margin-top:1rem;">${post.contenido_es}</p>
        `;
        abrirModal('modal-generico');
      });
      contenedor.appendChild(articulo);
    });
  }

  function pintarEventos() {
    const contenedor = document.getElementById('lista-eventos');
    contenedor.innerHTML = '';
    EJEMPLOS.eventos.forEach((evento) => {
      const articulo = document.createElement('article');
      articulo.className = 'tarjeta';
      articulo.innerHTML = `
        <p class="tarjeta__texto" style="font-size:.8rem; color: var(--color-turquesa-oscuro); font-weight:600;">${evento.fecha}</p>
        <h3 class="tarjeta__titulo">${evento.titulo_es}</h3>
        <p class="tarjeta__texto">${evento.descripcion_es}</p>
        <button type="button" class="boton boton--texto" data-mas-info>${estado.idioma === 'en' ? 'More information' : 'Más información'}</button>
      `;
      articulo.querySelector('[data-mas-info]').addEventListener('click', () => abrirModalEvento(evento));
      contenedor.appendChild(articulo);
    });
  }

  function abrirModalEvento(evento) {
    const galeriaHtml = (evento.galeria || [])
      .map((src) => `<img src="${src}" alt="" loading="lazy" />`)
      .join('');

    document.getElementById('modal-generico-contenido').innerHTML = `
      <h2 id="modal-generico-titulo">${evento.titulo_es}</h2>
      <p style="font-size:.85rem;color:var(--color-carbon-suave);">${evento.fecha}</p>
      <p style="margin-top:1rem;">${evento.descripcion_larga_es || evento.descripcion_es}</p>
      ${galeriaHtml ? `<div class="galeria-fotos">${galeriaHtml}</div>` : ''}
      <div class="ficha-programa__acciones">
        <button type="button" class="boton boton--primario" id="boton-comentar-desde-evento">
          ${estado.idioma === 'en' ? 'Comment' : 'Comentar'}
        </button>
      </div>
    `;

    document.getElementById('boton-comentar-desde-evento').addEventListener('click', () => {
      cerrarModal('modal-generico');
      document.getElementById('comentarios').scrollIntoView({ behavior: 'smooth' });
      if (!estado.tokenUsuario) {
        abrirModal('modal-requiere-cuenta');
      } else {
        abrirModal('modal-comentario');
      }
    });

    abrirModal('modal-generico');
  }

  function pintarAlianzas() {
    const pista = document.getElementById('pista-alianzas');
    const crearBoton = (a) => `
      <button type="button" class="carrusel-alianzas__logo" data-alianza="${a.nombre}" style="background:none;padding:0;">
        <img src="img/.png" alt="${a.nombre}" />
      </button>
    `;
    // Se duplica el contenido para que la animación CSS haga un loop continuo sin salto.
    pista.innerHTML = EJEMPLOS.alianzas.map(crearBoton).join('') + EJEMPLOS.alianzas.map(crearBoton).join('');

    pista.querySelectorAll('[data-alianza]').forEach((boton, indice) => {
      const alianza = EJEMPLOS.alianzas[indice % EJEMPLOS.alianzas.length];
      boton.addEventListener('click', () => abrirModalAlianza(alianza));
    });
  }

  function abrirModalAlianza(alianza) {
    document.getElementById('modal-generico-contenido').innerHTML = `
      <h2 id="modal-generico-titulo">${alianza.nombre}</h2>
      <p style="margin-top:1rem;">${alianza.descripcion_es}</p>
      <h3 class="tarjeta__titulo" style="margin-top:1.5rem; font-size:1.1rem;">
        ${estado.idioma === 'en' ? 'Benefits for our students' : 'Beneficios para nuestros estudiantes'}
      </h3>
      <p class="tarjeta__texto">${alianza.beneficios_es}</p>
    `;
    abrirModal('modal-generico');
  }

  function pintarPublicidad() {
    const contenedor = document.getElementById('lista-publicidad');
    contenedor.innerHTML = '';
    EJEMPLOS.publicidad.forEach((empresa) => {
      const div = document.createElement('button');
      div.type = 'button';
      div.className = 'anuncio-publicitario';
      div.innerHTML = `<img src="assets/logo-generico.png" alt="${empresa.nombre_empresa}" /><span>${empresa.nombre_empresa}</span>`;
      div.addEventListener('click', () => {
        const enlace = empresa.sitio_web_url || `https://wa.me/${empresa.whatsapp_numero}`;
        document.getElementById('modal-generico-contenido').innerHTML = `
          <h2 id="modal-generico-titulo">${empresa.nombre_empresa}</h2>
          <p style="margin-top:1rem;">${empresa.descripcion}</p>
          <div class="ficha-programa__acciones">
            <a href="${enlace}" target="_blank" rel="noopener" class="boton boton--primario">${estado.idioma === 'en' ? 'Learn more' : 'Saber más'}</a>
          </div>
        `;
        abrirModal('modal-generico');
      });
      contenedor.appendChild(div);
    });
  }

  /* =======================================================
     15. MODAL DE ESTADO DE ENVÍO (spinner → check / X)
     ======================================================= */
  const ICONO_SPINNER = `<div class="estado-envio__spinner" style="width:100%;height:100%;"></div>`;
  const ICONO_EXITO = `
    <svg viewBox="0 0 52 52" width="100%" height="100%">
      <circle class="estado-envio__circulo estado-envio__circulo--exito" cx="26" cy="26" r="23" />
      <path class="estado-envio__marca-exito" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M14 27l7 7 17-17" />
    </svg>`;
  const ICONO_ERROR = `
    <svg viewBox="0 0 52 52" width="100%" height="100%">
      <circle class="estado-envio__circulo estado-envio__circulo--error" cx="26" cy="26" r="23" />
      <path class="estado-envio__marca-error" fill="none" stroke-width="4" stroke-linecap="round" d="M17 17l18 18M35 17l-18 18" />
    </svg>`;

  function mostrarEstadoEnvio(fase, mensajeEs, mensajeEn) {
    const icono = document.getElementById('estado-envio-icono');
    const titulo = document.getElementById('estado-envio-titulo');
    const texto = document.getElementById('estado-envio-texto');
    const botonReintentar = document.getElementById('boton-reintentar-envio');
    botonReintentar.hidden = true;

    if (fase === 'cargando') {
      icono.innerHTML = ICONO_SPINNER;
      titulo.textContent = estado.idioma === 'en' ? 'Sending your request…' : 'Enviando tu solicitud…';
      texto.textContent = '';
    } else if (fase === 'exito') {
      icono.innerHTML = ICONO_EXITO;
      titulo.textContent = estado.idioma === 'en' ? 'Request sent!' : '¡Solicitud enviada!';
      texto.textContent = estado.idioma === 'en' ? mensajeEn : mensajeEs;
    } else if (fase === 'error') {
      icono.innerHTML = ICONO_ERROR;
      titulo.textContent = estado.idioma === 'en' ? "Couldn't send your request" : 'No pudimos enviar tu solicitud';
      texto.textContent = estado.idioma === 'en' ? mensajeEn : mensajeEs;
      botonReintentar.hidden = false;
    }
    abrirModal('modal-estado-envio');
  }

  /* =======================================================
     16. FORMULARIO DE CONTACTO / SOLICITUD DE INFORMACIÓN
     ======================================================= */
  function poblarSelectorProgramas() {
    const select = document.getElementById('contacto-programa');
    const grupos = [
      { etiqueta_es: 'Carreras Profesionales', etiqueta_en: 'Professional Programs', lista: PROGRAMAS.carreras_profesionales },
      { etiqueta_es: 'Carreras Técnicas', etiqueta_en: 'Technical Programs', lista: PROGRAMAS.carreras_tecnicas },
      { etiqueta_es: 'Certificaciones', etiqueta_en: 'Certifications', lista: PROGRAMAS.certificaciones },
      { etiqueta_es: 'Cursos y Talleres — Faciales y Estéticos', etiqueta_en: 'Courses — Facial & Aesthetic', lista: PROGRAMAS.cursos_faciales },
      { etiqueta_es: 'Cursos y Talleres — Corporales y Terapéuticos', etiqueta_en: 'Courses — Body & Therapeutic', lista: PROGRAMAS.cursos_corporales },
    ];

    select.innerHTML = `<option value="">${estado.idioma === 'en' ? 'Select a program…' : 'Elegí un programa…'}</option>` +
      grupos.map((grupo) => `
        <optgroup label="${estado.idioma === 'en' ? grupo.etiqueta_en : grupo.etiqueta_es}">
          ${grupo.lista.map((p) => `<option value="${p.nombre_es}">${estado.idioma === 'en' && p.nombre_en ? p.nombre_en : p.nombre_es}</option>`).join('')}
        </optgroup>
      `).join('') +
      `<option value="general">${estado.idioma === 'en' ? 'General inquiry' : 'Consulta general'}</option>`;
  }

  document.getElementById('formulario-contacto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const datos = Object.fromEntries(new FormData(form).entries());

    mostrarEstadoEnvio('cargando');

    try {
      const resp = await fetch(`${API_BASE}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const respuesta = await resp.json();
      if (!resp.ok) throw new Error(respuesta.mensaje || respuesta.error || 'Error al enviar.');

      mostrarEstadoEnvio(
        'exito',
        'Recibimos tu solicitud, te contactaremos a la brevedad.',
        "We've received your request and will contact you shortly."
      );
      form.reset();
    } catch (err) {
      mostrarEstadoEnvio(
        'error',
        'Por favor intentalo de nuevo en unos minutos, o escribinos por WhatsApp.',
        'Please try again in a few minutes, or reach us on WhatsApp.'
      );
    }
  });

  document.getElementById('boton-reintentar-envio').addEventListener('click', () => {
    cerrarModal('modal-estado-envio');
    document.getElementById('formulario-contacto').requestSubmit();
  });

  /* =======================================================
     17. INICIALIZACIÓN
     ======================================================= */
  document.getElementById('anio-actual').textContent = new Date().getFullYear();
  aplicarIdioma();
  renderizarTodo();
  actualizarContadorCarrito();
})();
