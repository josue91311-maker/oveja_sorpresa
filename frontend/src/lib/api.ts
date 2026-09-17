const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api';

// Fallback demo data to ensure zero build interruptions if backend is initializing
const FALLBACK_SETTINGS = {
  businessName: 'Ovejita Sorpresas',
  description: 'Tienda de Regalos & Papelería con Propósito',
  whatsappNumber: '986951425',
  contactNumber: '986951425',
  whatsappMessage: 'Hola Ovejita Sorpresas, quiero hacer un pedido con dedicatoria gratis',
  email: 'contacto@ovejitasorpresas.com',
  instagram: 'https://instagram.com/ovejitasorpresas',
  logoUrl: '/images/LOGO.jpg',
  faviconUrl: '/images/LOGO.jpg',
  generalTexts: {
    isCanvaCatalogsMode: false,
    canvaCatalogs: [
      {
        id: 'papeleria',
        tag: '🌸 Papelería Bonita & Promesas',
        title: 'Catálogo de Papelería Bonita',
        desc: 'Cuadernos artesanales, devocionales, stickers y planners listos para regalar con dedicatoria.',
        url: 'https://ovejitasorpresas.my.canva.site/ovejitasorpresaspapeleria',
        badge: 'Más Solicitado',
        waMessage: 'Hola Ovejita Sorpresas 🌸📖🎁, vi su Catálogo de Papelería bonita y deseo información de un producto. ¿Me ayudas a elegir? 🎁',
      },
      {
        id: 'paraellos',
        tag: '💁🏻‍♂️ Detalles Masculinos & Fe',
        title: 'Catálogo de Regalos para Él',
        desc: 'Libretas sobrias, tomatodos ejecutivos, bolígrafos premium y sets diseñados para bendecir su día.',
        url: 'https://ovejitasorpresas.my.canva.site/paraellos',
        badge: 'Edición Especial',
        waMessage: '¡Hola! 💁🏻‍♂️🎁 Vi su Catálogo de Regalos para Él y me interesó un detalle. ¿Me cuentas más detalles? ✨',
      },
      {
        id: 'boxes',
        tag: '🎁🛍️ Fechas Especiales & Sorpresas',
        title: 'Catálogo de Boxes & Fechas Especiales',
        desc: 'Cajas aromáticas temáticas con tazas, espejos flor, dijes y envoltura personalizada lista para entregar.',
        url: 'https://ovejitasorpresas.my.canva.site/boxpersonalizados',
        badge: 'Listo para Entregar',
        waMessage: 'Hola Ovejita Sorpresas 🎁🛍️, estuve viendo el Catálogo de Boxes & Fechas Especiales y me gustó un box. ¿Me ayudas a elegir el ideal? ✨',
      },
      {
        id: 'amor-amistad',
        tag: '🎁💖 Aniversarios & Momentos Únicos',
        title: 'Catálogo de Amor & Amistad',
        desc: 'Detalles llenos de significado, cartas caligrafiadas, álbumes de recuerdos y recuerdos perdurables.',
        url: 'https://ovejitasorpresas.my.canva.site/regalos-de-amor-aniversarios',
        badge: 'Romántico & Tierno',
        waMessage: '¡Hola! 🎁💖 Estuve revisando su Catálogo de Amor & Amistad. ¿Me ayudas con los detalles para pedir uno? ✨',
      },
    ],
    announcementText: 'Ediciones con propósito · Dedicatoria & personalización',
    heroTag: 'Edición Coleccionable • Primavera con Propósito',
    heroTitle: 'Papelería hecha a mano para atesorar momentos y regalar sonrisas.',
    heroSubtitle: 'Cada cuaderno y set de obsequio nace con una promesa: inspirar tu cotidianidad a través de versículos grabados en el alma, anillados artesanales y empaques fragantes listos para entregar.',
    qualityPillars: {
      tag: 'Excelencia en el Detalle',
      title: 'Empaque & Calidad Artesanal',
      subtitle: 'Cada pieza es armada y empaquetada a mano con cariño especial.',
      cards: [
        { num: '01', title: 'Hojas Bond 90 Gramos', desc: 'Gramaje superior resistente a tintas de gel, plumones y resaltadores sin traspasar la página.' },
        { num: '02', title: 'Tapas Resistentes', desc: 'Laminado mate aterciopelado que protege de polvo y humedad con elegancia perdurable.' },
        { num: '03', title: 'Wire-o Dorado', desc: 'Anillado metálico doble para apertura rotatoria 360° y durabilidad en tu escritorio.' },
        { num: '04', title: 'Regalo Completo', desc: 'Dijes metálicos, espejos flor y envoltura con dedicatoria personalizada lista para entregar.' },
      ],
    },
    footer: {
      description: 'Creamos papelería y regalos con intención y devoción. Cada detalle es empacado con amor para edificar y alegrar el corazón de quien lo recibe.',
      locationText: '✦ Sedes de taller creativo con despachos con amor a todo el país.',
      collectionsTitle: 'Colecciones',
      collectionsLinks: [
        { label: 'Cuadernos Salmos & Promesas', url: '/catalogo' },
        { label: 'Sets con Espejo y Llavero', url: '/catalogo' },
        { label: 'Devocionales Diarios', url: '/catalogo' },
        { label: 'Bolígrafos y Papelería Pastel', url: '/catalogo' },
      ],
      customerServiceTitle: 'Servicio al Cliente',
      customerServiceLinks: [
        { label: 'Tiempos de Despacho & Tarifas', url: '/#empaque-calidad' },
        { label: 'Guía de Cuidado de Papelería', url: '/#empaque-calidad' },
        { label: 'Garantía de Satisfacción Taller', url: '/#empaque-calidad' },
        { label: 'Ventas Corporativas & Eventos', url: '/#corporativo' },
      ],
      clubTitle: 'Club Ovejita',
      clubSubtitle: 'Recibe versículos semanales y acceso previo a nuevas colecciones.',
      clubButtonText: 'Unirme al Club',
      copyrightText: 'Hecho con amor y bendición.',
    },
    socialShowcase: {
      enabled: true,
      tag: '✨ NUESTRA COMUNIDAD EN VIVO',
      title: 'Publicaciones Reales en Instagram & TikTok',
      subtitle: 'Conéctate con nuestro día a día: mira nuestros detrás de cámaras, empaques perfumados, dedicatorias y novedades recién salidas del taller.',
      instagramUrl: 'https://www.instagram.com/ovejitasorpresas_/',
      instagramHandle: '@ovejitasorpresas_',
      tiktokUrl: 'https://www.tiktok.com/@ovejitasorpresas',
      tiktokHandle: '@ovejitasorpresas',
      instagramPostUrl: 'https://www.instagram.com/p/DdIXOkLDUIK/',
      tiktokEmbedUrl: 'https://www.tiktok.com/@ovejitasorpresas',
      cards: [
        {
          title: 'Tomatodo Personalizado Pink',
          desc: 'Tu tomatodo, tu estilo 🎀💖 Llévatelo contigo a todas partes 🌷🩷 Escríbenos para pedir el tuyo.',
          platform: 'instagram',
          postUrl: 'https://www.instagram.com/p/DdIXOkLDUIK/',
          imageUrl: '/images/libreta1.png',
        },
        {
          title: 'Detrás de Cámaras & Taller',
          desc: 'Grabado con anillado dorado y preparación de pedidos con amor en TikTok 🎬✨',
          platform: 'tiktok',
          postUrl: 'https://www.tiktok.com/@ovejitasorpresas',
          imageUrl: '/images/libreta2.png',
        },
        {
          title: 'Nuevas Colecciones & Regalos',
          desc: 'Conoce los nuevos sets con espejo flor en tendencia y dedicatorias especiales 💕',
          platform: 'instagram',
          postUrl: 'https://www.instagram.com/ovejitasorpresas_/',
          imageUrl: '/images/libreta3.png',
        },
        {
          title: 'Empaque Aromático con Amor',
          desc: 'Cajas perfumadas con notas suaves y tarjetas caligrafiadas hechas a mano 🎁🌸',
          platform: 'tiktok',
          postUrl: 'https://www.tiktok.com/@ovejitasorpresas',
          imageUrl: '/images/planificador1.png',
        },
      ],
    },
  },
};

export async function fetchApi<T>(endpoint: string, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data as T;
  } catch (err) {
    console.warn(`[API] Could not fetch ${endpoint}, using fallback:`, err);
    return fallback as T;
  }
}

export async function getProducts(category?: string) {
  const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
  return fetchApi<any[]>(url, []);
}

export async function getProductBySlug(slug: string) {
  return fetchApi<any>(`/products/${encodeURIComponent(slug)}`, null);
}

export async function getCategories() {
  return fetchApi<any[]>('/categories', []);
}

export async function getCampaigns() {
  return fetchApi<any[]>('/campaigns', []);
}

export async function getCampaignBySlug(slug: string) {
  return fetchApi<any>(`/campaigns/${encodeURIComponent(slug)}`, null);
}

export async function getBanners() {
  return fetchApi<any[]>('/banners', []);
}

export async function getSettings() {
  return fetchApi<any>('/settings', FALLBACK_SETTINGS);
}
