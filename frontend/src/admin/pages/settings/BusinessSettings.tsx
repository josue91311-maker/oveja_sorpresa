import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  Save,
  Check,
  MessageSquare,
  Globe,
  Phone,
  Palette,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Package,
  PanelBottom,
  Share2,
  BookOpen,
  ExternalLink,
  Link2,
} from 'lucide-react';

export const BusinessSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: 'Ovejita Sorpresas',
    description: 'Tienda de Regalos & Papelería con Propósito',
    whatsappNumber: '986951425',
    contactNumber: '986951425',
    whatsappMessage: 'Hola Ovejita Sorpresas, quiero hacer un pedido con dedicatoria gratis',
    email: 'contacto@ovejitasorpresas.com',
    instagram: 'https://instagram.com/ovejitasorpresas',
    facebook: '',
    tiktok: '',
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
          waMessage: 'Hola Ovejita Sorpresas 🌸📖🎁, vi su Catálogo de Papelería bonita y deseo información de un producto. ¿Me ayudas a elegir? 🎁',
        },
        {
          id: 'paraellos',
          tag: '💁🏻‍♂️ Detalles Masculinos & Fe',
          title: 'Catálogo de Regalos para Él',
          desc: 'Libretas sobrias, tomatodos ejecutivos, bolígrafos premium y sets diseñados para bendecir su día.',
          url: 'https://ovejitasorpresas.my.canva.site/paraellos',
          waMessage: '¡Hola! 💁🏻‍♂️🎁 Vi su Catálogo de Regalos para Él y me interesó un detalle. ¿Me cuentas más detalles? ✨',
        },
        {
          id: 'boxes',
          tag: '🎁🛍️ Fechas Especiales & Sorpresas',
          title: 'Catálogo de Boxes & Fechas Especiales',
          desc: 'Cajas aromáticas temáticas con tazas, espejos flor, dijes y envoltura personalizada lista para entregar.',
          url: 'https://ovejitasorpresas.my.canva.site/boxpersonalizados',
          waMessage: 'Hola Ovejita Sorpresas 🎁🛍️, estuve viendo el Catálogo de Boxes & Fechas Especiales y me gustó un box. ¿Me ayudas a elegir el ideal? ✨',
        },
        {
          id: 'amor-amistad',
          tag: '🎁💖 Aniversarios & Momentos Únicos',
          title: 'Catálogo de Amor & Amistad',
          desc: 'Detalles llenos de significado, cartas caligrafiadas, álbumes de recuerdos y recuerdos perdurables.',
          url: 'https://ovejitasorpresas.my.canva.site/regalos-de-amor-aniversarios',
          waMessage: '¡Hola! 🎁💖 Estuve revisando su Catálogo de Amor & Amistad. ¿Me ayudas con los detalles para pedir uno? ✨',
        },
      ],
      announcementText: 'Ediciones con propósito · Dedicatoria & personalización',
      heroTag: 'Edición Coleccionable • Primavera con Propósito',
      heroTitle: 'Papelería hecha a mano para atesorar momentos y regalar sonrisas.',
      heroSubtitle: 'Cada cuaderno y set de obsequio nace con una promesa: inspirar tu cotidianidad.',
      themeColors: {
        primary: '#9A80BD',
        primaryDark: '#7D60A6',
        secondary: '#F472B6',
        ink: '#2D2235',
        background: '#FAF7FC',
      },
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
        locationText: '✦ Sedes de taller creativo en Lima con despachos con amor a todo el Perú.',
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
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/settings');
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          businessName: d.businessName || 'Ovejita Sorpresas',
          description: d.description || '',
          whatsappNumber: d.whatsappNumber || '986951425',
          contactNumber: d.contactNumber || '986951425',
          whatsappMessage: d.whatsappMessage || '',
          email: d.email || '',
          instagram: d.instagram || '',
          facebook: d.facebook || '',
          tiktok: d.tiktok || '',
          logoUrl: d.logoUrl || '/images/LOGO.jpg',
          faviconUrl: d.faviconUrl || '/images/LOGO.jpg',
          generalTexts: {
            isCanvaCatalogsMode: d.generalTexts?.isCanvaCatalogsMode === true || d.generalTexts?.isCanvaCatalogsMode === 'true',
            canvaCatalogs: d.generalTexts?.canvaCatalogs || [
              {
                id: 'papeleria',
                tag: '🌸 Papelería Bonita & Promesas',
                title: 'Catálogo de Papelería Bonita',
                desc: 'Cuadernos artesanales, devocionales, stickers y planners listos para regalar con dedicatoria.',
                url: 'https://ovejitasorpresas.my.canva.site/ovejitasorpresaspapeleria',
                waMessage: 'Hola Ovejita Sorpresas 🌸📖🎁, vi su Catálogo de Papelería bonita y deseo información de un producto. ¿Me ayudas a elegir? 🎁',
              },
              {
                id: 'paraellos',
                tag: '💁🏻‍♂️ Detalles Masculinos & Fe',
                title: 'Catálogo de Regalos para Él',
                desc: 'Libretas sobrias, tomatodos ejecutivos, bolígrafos premium y sets diseñados para bendecir su día.',
                url: 'https://ovejitasorpresas.my.canva.site/paraellos',
                waMessage: '¡Hola! 💁🏻‍♂️🎁 Vi su Catálogo de Regalos para Él y me interesó un detalle. ¿Me cuentas más detalles? ✨',
              },
              {
                id: 'boxes',
                tag: '🎁🛍️ Fechas Especiales & Sorpresas',
                title: 'Catálogo de Boxes & Fechas Especiales',
                desc: 'Cajas aromáticas temáticas con tazas, espejos flor, dijes y envoltura personalizada lista para entregar.',
                url: 'https://ovejitasorpresas.my.canva.site/boxpersonalizados',
                waMessage: 'Hola Ovejita Sorpresas 🎁🛍️, estuve viendo el Catálogo de Boxes & Fechas Especiales y me gustó un box. ¿Me ayudas a elegir el ideal? ✨',
              },
              {
                id: 'amor-amistad',
                tag: '🎁💖 Aniversarios & Momentos Únicos',
                title: 'Catálogo de Amor & Amistad',
                desc: 'Detalles llenos de significado, cartas caligrafiadas, álbumes de recuerdos y recuerdos perdurables.',
                url: 'https://ovejitasorpresas.my.canva.site/regalos-de-amor-aniversarios',
                waMessage: '¡Hola! 🎁💖 Estuve revisando su Catálogo de Amor & Amistad. ¿Me ayudas con los detalles para pedir uno? ✨',
              },
            ],
            announcementText: d.generalTexts?.announcementText || 'Ediciones con propósito · Dedicatoria & personalización',
            heroTag: d.generalTexts?.heroTag || 'Edición Coleccionable • Primavera con Propósito',
            heroTitle: d.generalTexts?.heroTitle || 'Papelería hecha a mano para atesorar momentos y regalar sonrisas.',
            heroSubtitle: d.generalTexts?.heroSubtitle || 'Cada cuaderno y set de obsequio nace con una promesa.',
            themeColors: {
              primary: d.generalTexts?.themeColors?.primary || '#9A80BD',
              primaryDark: d.generalTexts?.themeColors?.primaryDark || '#7D60A6',
              secondary: d.generalTexts?.themeColors?.secondary || '#F472B6',
              ink: d.generalTexts?.themeColors?.ink || '#2D2235',
              background: d.generalTexts?.themeColors?.background || '#FAF7FC',
            },
            qualityPillars: d.generalTexts?.qualityPillars || {
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
            footer: d.generalTexts?.footer || {
              description: 'Creamos papelería y regalos con intención y devoción. Cada detalle es empacado con amor para edificar y alegrar el corazón de quien lo recibe.',
              locationText: '✦ Sedes de taller creativo en Lima con despachos con amor a todo el Perú.',
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
            socialShowcase: d.generalTexts?.socialShowcase || {
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
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const body = new FormData();
    body.append('image', file);

    try {
      const res = await apiFetch('/admin/images/upload', {
        method: 'POST',
        body,
      });
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          logoUrl: res.data.url,
          faviconUrl: res.data.url,
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir el logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const updateColor = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      generalTexts: {
        ...prev.generalTexts,
        themeColors: {
          ...prev.generalTexts.themeColors,
          [key]: value,
        },
      },
    }));
  };

  const applyPalette = (primary: string, secondary: string, bg: string, ink: string) => {
    setFormData((prev) => ({
      ...prev,
      generalTexts: {
        ...prev.generalTexts,
        themeColors: {
          primary,
          primaryDark: primary,
          secondary,
          background: bg,
          ink,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);
    try {
      await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración');
    }
  };

  const colors = formData.generalTexts?.themeColors || {
    primary: '#9A80BD',
    secondary: '#F472B6',
    ink: '#2D2235',
    background: '#FAF7FC',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 font-['Quicksand',sans-serif]">
          Configuración Global de Marca
        </h2>
        <p className="text-xs text-slate-500">
          Personaliza el logo oficial, paleta de colores, fondo, número de WhatsApp y datos de contacto de la tienda.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>¡Configuración guardada exitosamente! El catálogo público ya refleja los cambios.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 0. MODO CATÁLOGO LINK (CANVA / VIRTUAL) TOGGLE & CONFIGURATION */}
        <div className="bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-purple-200 text-[#9A80BD] flex items-center justify-center shrink-0 shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800 font-['Quicksand',sans-serif]">
                    Modo Catálogo Link (Canva / Enlaces Virtuales)
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    formData.generalTexts?.isCanvaCatalogsMode
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {formData.generalTexts?.isCanvaCatalogsMode ? 'Activo' : 'Desactivado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-light mt-0.5 max-w-xl">
                  Al activar este modo, la tienda mostrará únicamente tus 4 catálogos virtuales (Canva) con visor interactivo y atajo directo para pedir a WhatsApp, ocultando el carrito de compra. Al desactivarlo, vuelve al modo tienda tradicional.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="shrink-0 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">
                {formData.generalTexts?.isCanvaCatalogsMode ? 'Modo Canva ON' : 'Modo Canva OFF'}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    generalTexts: {
                      ...prev.generalTexts,
                      isCanvaCatalogsMode: !prev.generalTexts?.isCanvaCatalogsMode,
                    },
                  }))
                }
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  formData.generalTexts?.isCanvaCatalogsMode ? 'bg-[#9A80BD]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    formData.generalTexts?.isCanvaCatalogsMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Catalog Links and WhatsApp message customizer */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A80BD] flex items-center gap-1.5 font-['Quicksand',sans-serif]">
                <Link2 className="w-4 h-4" />
                Enlaces & Mensajes de los 4 Catálogos
              </span>
              <span className="text-[11px] text-slate-400">
                Puedes editar los links de Canva y los textos que llegarán a tu WhatsApp
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.generalTexts?.canvaCatalogs || []).map((cat: any, idx: number) => (
                <div key={cat.id || idx} className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-[#9A80BD] text-[11px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {cat.title}
                    </span>
                    <a
                      href={cat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#9A80BD] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Probar link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Enlace de Canva / Web:
                    </label>
                    <input
                      type="url"
                      value={cat.url || ''}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        setFormData((prev) => {
                          const updated = [...(prev.generalTexts?.canvaCatalogs || [])];
                          updated[idx] = { ...updated[idx], url: newUrl };
                          return {
                            ...prev,
                            generalTexts: { ...prev.generalTexts, canvaCatalogs: updated },
                          };
                        });
                      }}
                      placeholder="https://ovejitasorpresas.my.canva.site/..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:bg-white focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mensaje enviado al WhatsApp del cliente:
                    </label>
                    <textarea
                      rows={2}
                      value={cat.waMessage || ''}
                      onChange={(e) => {
                        const newMsg = e.target.value;
                        setFormData((prev) => {
                          const updated = [...(prev.generalTexts?.canvaCatalogs || [])];
                          updated[idx] = { ...updated[idx], waMessage: newMsg };
                          return {
                            ...prev,
                            generalTexts: { ...prev.generalTexts, canvaCatalogs: updated },
                          };
                        });
                      }}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Modo Catálogo</span>
            </button>
          </div>
        </div>

        {/* 1. Logo & Brand Image Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
            <ImageIcon className="w-4 h-4" />
            Logo Oficial de la Tienda
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-xs shrink-0">
              <img
                src={formData.logoUrl || '/images/LOGO.jpg'}
                alt="Logo Ovejita"
                className="w-full h-full object-cover"
              />
              {uploadingLogo && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                  Subiendo...
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-xs font-bold text-slate-800">Fotografía o Emblema de la Marca</h4>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Aparece en el encabezado, pie de página y favicons del catálogo. Se recomienda imagen cuadrada en JPG o PNG.
              </p>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#9A80BD] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingLogo ? 'Cargando archivo...' : 'Seleccionar Nuevo Logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
              </label>
            </div>
          </div>
        </div>

        {/* 2. Custom Colors & Theme Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              <Palette className="w-4 h-4" />
              Colores & Fondo de la Web
            </div>
            <button
              type="button"
              onClick={() => applyPalette('#9A80BD', '#F472B6', '#FAF7FC', '#2D2235')}
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Restablecer originales
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Ajusta los tonos principales de la tienda. Puedes ingresar el código hexadecimal o hacer clic en el círculo de color.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {/* Primary Color */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Color Primario (Botones)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-full text-xs font-mono p-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Color Acento (Insignias)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="w-full text-xs font-mono p-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Fondo de la Tienda</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={colors.background}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="w-full text-xs font-mono p-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Text Ink Color */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">Color de Textos</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.ink}
                  onChange={(e) => updateColor('ink', e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={colors.ink}
                  onChange={(e) => updateColor('ink', e.target.value)}
                  className="w-full text-xs font-mono p-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Quick Palettes presets */}
          <div className="pt-2">
            <span className="text-[10.5px] uppercase font-bold text-slate-400 block mb-2">
              Paletas Recomendadas de un Clic:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPalette('#9A80BD', '#F472B6', '#FAF7FC', '#2D2235')}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg font-semibold hover:bg-purple-100 border border-purple-200"
              >
                🌸 Original Ovejita (Lavanda & Rosa)
              </button>
              <button
                type="button"
                onClick={() => applyPalette('#059669', '#F59E0B', '#F0FDF4', '#1F2937')}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100 border border-emerald-200"
              >
                🌿 Jardín de Esperanza (Esmeralda & Miel)
              </button>
              <button
                type="button"
                onClick={() => applyPalette('#C05621', '#DD6B20', '#FFFAF0', '#2D3748')}
                className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-semibold hover:bg-amber-100 border border-amber-200"
              >
                🍂 Otoño & Terracota (Cálido)
              </button>
              <button
                type="button"
                onClick={() => applyPalette('#3B82F6', '#EC4899', '#EFF6FF', '#1E293B')}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 border border-blue-200"
              >
                🕊️ Paz Celestial (Azul Pastel)
              </button>
            </div>
          </div>
        </div>

        {/* 3. WhatsApp & Contact Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <MessageSquare className="w-4 h-4" />
            Canal Principal: WhatsApp Business
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp para Pedidos *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="986951425"
                  className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono Secundario / Fijo
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="Opcional"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mensaje Inicial de Saludo en WhatsApp
            </label>
            <textarea
              rows={2}
              value={formData.whatsappMessage}
              onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
              placeholder="Ej. Hola Ovejita Sorpresas, quiero hacer un pedido con dedicatoria gratis"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Identity & Networks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
            <Globe className="w-4 h-4" />
            Identidad & Redes Sociales
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo de Contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción de Marca</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">TikTok</label>
              <input
                type="text"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. Textos de Portada & Etiquetas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
            <Sparkles className="w-4 h-4" />
            Textos de Portada & Etiquetas (Hero Tag)
          </div>
          <p className="text-[11px] text-slate-500">
            Personaliza la etiqueta píldora que aparece justo arriba del título grande en la portada principal.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Etiqueta Superior de Portada (Píldora / Badge)
            </label>
            <input
              type="text"
              value={formData.generalTexts?.heroTag || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  generalTexts: {
                    ...formData.generalTexts,
                    heroTag: e.target.value,
                  },
                })
              }
              placeholder="Ej. Edición Coleccionable • Primavera con Propósito"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Aparece en la portada principal arriba de "Papelería hecha a mano para atesorar momentos y regalar sonrisas."
            </span>
          </div>
        </div>

        {/* 6. Menú "Empaque & Calidad" — Los 4 Cuadros Informativos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              <Package className="w-4 h-4" />
              Menú "Empaque & Calidad" — Los 4 Cuadros de la Web
            </div>
            <span className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold w-fit">
              4 Cuadros Editables
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Esta sección se muestra cuando tus clientes hacen clic en <strong>"Empaque & Calidad"</strong> en el menú superior de la tienda. Puedes cambiar el título principal, subtítulo y el texto de cada uno de los 4 cuadros.
          </p>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etiqueta Pequeña Superior
              </label>
              <input
                type="text"
                value={formData.generalTexts?.qualityPillars?.tag || 'Excelencia en el Detalle'}
                onChange={(e) => {
                  const qp = formData.generalTexts?.qualityPillars || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      qualityPillars: { ...qp, tag: e.target.value },
                    },
                  });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título de la Sección *
              </label>
              <input
                type="text"
                value={formData.generalTexts?.qualityPillars?.title || 'Empaque & Calidad Artesanal'}
                onChange={(e) => {
                  const qp = formData.generalTexts?.qualityPillars || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      qualityPillars: { ...qp, title: e.target.value },
                    },
                  });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtítulo Descriptivo
              </label>
              <input
                type="text"
                value={formData.generalTexts?.qualityPillars?.subtitle || 'Cada pieza es armada y empaquetada a mano con cariño especial.'}
                onChange={(e) => {
                  const qp = formData.generalTexts?.qualityPillars || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      qualityPillars: { ...qp, subtitle: e.target.value },
                    },
                  });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Contenido de los 4 Cuadros Informativos:
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.generalTexts?.qualityPillars?.cards || [
                { num: '01', title: 'Hojas Bond 90 Gramos', desc: 'Gramaje superior resistente a tintas de gel...' },
                { num: '02', title: 'Tapas Resistentes', desc: 'Laminado mate aterciopelado que protege...' },
                { num: '03', title: 'Wire-o Dorado', desc: 'Anillado metálico doble para apertura rotatoria...' },
                { num: '04', title: 'Regalo Completo', desc: 'Dijes metálicos, espejos flor y envoltura...' },
              ]).map((card: any, idx: number) => (
                <div key={idx} className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white text-primary border border-purple-200 flex items-center justify-center text-[10px] font-bold">
                        {card.num || `0${idx + 1}`}
                      </span>
                      Cuadro {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={card.num || `0${idx + 1}`}
                      onChange={(e) => {
                        const newCards = [...(formData.generalTexts?.qualityPillars?.cards || [])];
                        newCards[idx] = { ...newCards[idx], num: e.target.value };
                        setFormData({
                          ...formData,
                          generalTexts: {
                            ...formData.generalTexts,
                            qualityPillars: {
                              ...formData.generalTexts.qualityPillars,
                              cards: newCards,
                            },
                          },
                        });
                      }}
                      className="w-16 text-center text-xs p-1 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-bold text-primary"
                      title="Número o etiqueta del cuadro"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Título del Cuadro {idx + 1} *
                    </label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => {
                        const newCards = [...(formData.generalTexts?.qualityPillars?.cards || [])];
                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          generalTexts: {
                            ...formData.generalTexts,
                            qualityPillars: {
                              ...formData.generalTexts.qualityPillars,
                              cards: newCards,
                            },
                          },
                        });
                      }}
                      placeholder={`Título del cuadro ${idx + 1}`}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Descripción del Cuadro {idx + 1}
                    </label>
                    <textarea
                      rows={2}
                      value={card.desc || ''}
                      onChange={(e) => {
                        const newCards = [...(formData.generalTexts?.qualityPillars?.cards || [])];
                        newCards[idx] = { ...newCards[idx], desc: e.target.value };
                        setFormData({
                          ...formData,
                          generalTexts: {
                            ...formData.generalTexts,
                            qualityPillars: {
                              ...formData.generalTexts.qualityPillars,
                              cards: newCards,
                            },
                          },
                        });
                      }}
                      placeholder={`Descripción del cuadro ${idx + 1}`}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none text-slate-600 text-[11.5px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to categories for the other 4 shortcut cards */}
          <div className="p-3 bg-purple-50/30 border border-purple-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-600">
              📚 ¿Deseas editar los <strong>4 catálogos de atajos directos</strong> (Libretas, Kits con Espejo, Cuadernos A5, Sets de Regalo)?
            </span>
            <a
              href="/categories"
              className="px-3 py-1.5 bg-white border border-purple-200 text-primary hover:bg-purple-50 font-bold rounded-lg transition-colors whitespace-nowrap w-fit shadow-2xs"
            >
              Ir a Administrar Categorías →
            </a>
          </div>
        </div>

        {/* 7. Textos del Pie de Página (Footer) & Club Ovejita */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              <PanelBottom className="w-4 h-4" />
              Textos del Pie de Página (Footer) & Club Ovejita
            </div>
            <span className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold w-fit">
              100% Personalizable
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Modifica las frases, sedes, enlaces de colecciones, opciones de servicio al cliente y el formulario de suscripción del pie de página de la tienda.
          </p>

          {/* Bloque 1: Marca y Sedes */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Columna de Marca & Sedes de Taller
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lema o Descripción de Marca (Footer)
              </label>
              <textarea
                rows={2}
                value={formData.generalTexts?.footer?.description || ''}
                onChange={(e) => {
                  const ft = formData.generalTexts?.footer || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      footer: { ...ft, description: e.target.value },
                    },
                  });
                }}
                placeholder="Ej. Creamos papelería y regalos con intención y devoción..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Texto de Sedes / Despacho / Ubicación
              </label>
              <input
                type="text"
                value={formData.generalTexts?.footer?.locationText || ''}
                onChange={(e) => {
                  const ft = formData.generalTexts?.footer || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      footer: { ...ft, locationText: e.target.value },
                    },
                  });
                }}
                placeholder="Ej. ✦ Sedes de taller creativo en Lima con despachos con amor a todo el Perú."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium text-primary"
              />
            </div>
          </div>

          {/* Bloque 2: Colecciones y Servicio al cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna Colecciones */}
            <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Columna Colecciones
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título de la Columna
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.footer?.collectionsTitle || 'Colecciones'}
                  onChange={(e) => {
                    const ft = formData.generalTexts?.footer || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        footer: { ...ft, collectionsTitle: e.target.value },
                      },
                    });
                  }}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Enlaces o Nombres de Colección:
                </label>
                {(formData.generalTexts?.footer?.collectionsLinks || [
                  { label: 'Cuadernos Salmos & Promesas', url: '/catalogo' },
                  { label: 'Sets con Espejo y Llavero', url: '/catalogo' },
                  { label: 'Devocionales Diarios', url: '/catalogo' },
                  { label: 'Bolígrafos y Papelería Pastel', url: '/catalogo' },
                ]).map((link: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => {
                        const links = [...(formData.generalTexts?.footer?.collectionsLinks || [])];
                        links[idx] = { ...links[idx], label: e.target.value };
                        setFormData({
                          ...formData,
                          generalTexts: {
                            ...formData.generalTexts,
                            footer: { ...formData.generalTexts?.footer, collectionsLinks: links },
                          },
                        });
                      }}
                      placeholder={`Colección ${idx + 1}`}
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Servicio al Cliente */}
            <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Columna Servicio al Cliente
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título de la Columna
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.footer?.customerServiceTitle || 'Servicio al Cliente'}
                  onChange={(e) => {
                    const ft = formData.generalTexts?.footer || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        footer: { ...ft, customerServiceTitle: e.target.value },
                      },
                    });
                  }}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Enlaces o Títulos de Servicio:
                </label>
                {(formData.generalTexts?.footer?.customerServiceLinks || [
                  { label: 'Tiempos de Despacho & Tarifas', url: '/#empaque-calidad' },
                  { label: 'Guía de Cuidado de Papelería', url: '/#empaque-calidad' },
                  { label: 'Garantía de Satisfacción Taller', url: '/#empaque-calidad' },
                  { label: 'Ventas Corporativas & Eventos', url: '/#corporativo' },
                ]).map((link: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => {
                        const links = [...(formData.generalTexts?.footer?.customerServiceLinks || [])];
                        links[idx] = { ...links[idx], label: e.target.value };
                        setFormData({
                          ...formData,
                          generalTexts: {
                            ...formData.generalTexts,
                            footer: { ...formData.generalTexts?.footer, customerServiceLinks: links },
                          },
                        });
                      }}
                      placeholder={`Servicio ${idx + 1}`}
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloque 3: Club Ovejita & Copyright */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              4. Módulo "Club Ovejita" & Copyright
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Club / Newsletter
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.footer?.clubTitle || 'Club Ovejita'}
                  onChange={(e) => {
                    const ft = formData.generalTexts?.footer || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        footer: { ...ft, clubTitle: e.target.value },
                      },
                    });
                  }}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto del Botón de Suscripción
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.footer?.clubButtonText || 'Unirme al Club'}
                  onChange={(e) => {
                    const ft = formData.generalTexts?.footer || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        footer: { ...ft, clubButtonText: e.target.value },
                      },
                    });
                  }}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto de Copyright / Despedida
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.footer?.copyrightText || 'Hecho con amor y bendición.'}
                  onChange={(e) => {
                    const ft = formData.generalTexts?.footer || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        footer: { ...ft, copyrightText: e.target.value },
                      },
                    });
                  }}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtítulo / Promesa del Club Ovejita
              </label>
              <input
                type="text"
                value={formData.generalTexts?.footer?.clubSubtitle || 'Recibe versículos semanales y acceso previo a nuevas colecciones.'}
                onChange={(e) => {
                  const ft = formData.generalTexts?.footer || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      footer: { ...ft, clubSubtitle: e.target.value },
                    },
                  });
                }}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 8. Redes Sociales & Comunidad (Instagram & TikTok) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              <Share2 className="w-4 h-4" />
              Bloque de Redes Sociales: Instagram & TikTok
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.generalTexts?.socialShowcase?.enabled !== false}
                onChange={(e) => {
                  const sc = formData.generalTexts?.socialShowcase || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      socialShowcase: { ...sc, enabled: e.target.checked },
                    },
                  });
                }}
                className="w-4 h-4 text-[#9A80BD] rounded border-slate-300 focus:ring-[#9A80BD]"
              />
              <span className="text-xs font-semibold text-slate-700">Mostrar sección en la tienda</span>
            </label>
          </div>

          <p className="text-[11px] text-slate-500">
            Reemplaza el antiguo cuadro oscuro corporativo por este bloque visual para invitar a tus clientes a ver tu Instagram y TikTok. Puedes cambiar los enlaces, textos y las fotos de la galería.
          </p>

          {/* Títulos y Enlaces principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etiqueta Superior (Badge)
              </label>
              <input
                type="text"
                value={formData.generalTexts?.socialShowcase?.tag || '✨ NUESTRA COMUNIDAD EN REDES'}
                onChange={(e) => {
                  const sc = formData.generalTexts?.socialShowcase || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      socialShowcase: { ...sc, tag: e.target.value },
                    },
                  });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={formData.generalTexts?.socialShowcase?.title || 'Síguenos en Instagram & TikTok'}
                onChange={(e) => {
                  const sc = formData.generalTexts?.socialShowcase || {};
                  setFormData({
                    ...formData,
                    generalTexts: {
                      ...formData.generalTexts,
                      socialShowcase: { ...sc, title: e.target.value },
                    },
                  });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtítulo / Mensaje de Invitación
            </label>
            <textarea
              rows={2}
              value={formData.generalTexts?.socialShowcase?.subtitle || ''}
              onChange={(e) => {
                const sc = formData.generalTexts?.socialShowcase || {};
                setFormData({
                  ...formData,
                  generalTexts: {
                    ...formData.generalTexts,
                    socialShowcase: { ...sc, subtitle: e.target.value },
                  },
                });
              }}
              placeholder="Ej. Acompáñanos en el taller: mira detrás de cámaras cómo armamos cada libreta..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
            />
          </div>

          {/* Cuentas de Instagram y TikTok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Instagram box */}
            <div className="p-4 bg-gradient-to-br from-pink-50/60 to-purple-50/60 rounded-2xl border border-pink-100 space-y-3">
              <span className="text-xs font-bold text-pink-700 flex items-center gap-1.5 uppercase tracking-wider">
                <span>📸</span> Configuración de Instagram
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Enlace Perfil de Instagram
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.socialShowcase?.instagramUrl || ''}
                  onChange={(e) => {
                    const sc = formData.generalTexts?.socialShowcase || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        socialShowcase: { ...sc, instagramUrl: e.target.value },
                      },
                    });
                  }}
                  placeholder="https://instagram.com/tu_cuenta"
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Usuario / Handle (ej. @ovejitasorpresas_)
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.socialShowcase?.instagramHandle || ''}
                  onChange={(e) => {
                    const sc = formData.generalTexts?.socialShowcase || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        socialShowcase: { ...sc, instagramHandle: e.target.value },
                      },
                    });
                  }}
                  placeholder="@ovejitasorpresas_"
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-pink-600"
                />
              </div>
            </div>

            {/* TikTok box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <span>🎵</span> Configuración de TikTok
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Enlace Perfil de TikTok
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.socialShowcase?.tiktokUrl || ''}
                  onChange={(e) => {
                    const sc = formData.generalTexts?.socialShowcase || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        socialShowcase: { ...sc, tiktokUrl: e.target.value },
                      },
                    });
                  }}
                  placeholder="https://tiktok.com/@ovejitasorpresas"
                  className="w-full text-xs p-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Usuario / Handle (ej. @ovejitasorpresas)
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.socialShowcase?.tiktokHandle || ''}
                  onChange={(e) => {
                    const sc = formData.generalTexts?.socialShowcase || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        socialShowcase: { ...sc, tiktokHandle: e.target.value },
                      },
                    });
                  }}
                  placeholder="@ovejitasorpresas"
                  className="w-full text-xs p-2 bg-slate-800 border border-slate-700 rounded-xl font-bold text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* OPCIÓN 1: EMBEDS Y PUBLICACIONES EN VIVO */}
          <div className="p-5 bg-gradient-to-br from-purple-50/60 to-pink-50/40 rounded-2xl border border-purple-200/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              <span>🎬</span>
              Publicaciones & Reproductores Oficiales en Vivo (Embeds)
            </div>
            <p className="text-xs text-slate-600">
              Pega aquí los enlaces directos para mostrar en la web el reproductor oficial de Instagram y TikTok con sus fotos reales, likes, comentarios y botones de reproducción.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  📸 URL Publicación o Reel de Instagram en Vivo:
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.socialShowcase?.instagramPostUrl || ''}
                  onChange={(e) => {
                    const sc = formData.generalTexts?.socialShowcase || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        socialShowcase: { ...sc, instagramPostUrl: e.target.value },
                      },
                    });
                  }}
                  placeholder="https://www.instagram.com/p/DdIXOkLDUIK/"
                  className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 font-mono text-slate-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Ej: https://www.instagram.com/p/DdIXOkLDUIK/ (o cualquier enlace de Reel)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  🎵 URL Perfil o Video de TikTok en Vivo:
                </label>
                <input
                  type="text"
                  value={formData.generalTexts?.socialShowcase?.tiktokEmbedUrl || ''}
                  onChange={(e) => {
                    const sc = formData.generalTexts?.socialShowcase || {};
                    setFormData({
                      ...formData,
                      generalTexts: {
                        ...formData.generalTexts,
                        socialShowcase: { ...sc, tiktokEmbedUrl: e.target.value },
                      },
                    });
                  }}
                  placeholder="https://www.tiktok.com/@ovejitasorpresas"
                  className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 font-mono text-slate-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Ej: https://www.tiktok.com/@ovejitasorpresas (o link de video específico)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            Guardar Configuración de Marca
          </button>
        </div>
      </form>
    </div>
  );
};
