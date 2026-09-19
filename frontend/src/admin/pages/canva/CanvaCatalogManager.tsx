import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  Plus,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Palette,
  AlertCircle,
  Megaphone,
  PanelBottom,
  Layers,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface CanvaCatalogItem {
  id: string;
  title: string;
  desc?: string;
  url: string;
  imageUrl?: string;
  waMessage?: string;
  color?: string;
  colors?: any;
  hidden?: boolean;
}

const COLOR_PRESETS = [
  { name: 'Rosa Pastel', hex: '#D96B91' },
  { name: 'Azul Cielo', hex: '#4C96D7' },
  { name: 'Mostaza Cálido', hex: '#E5AA32' },
  { name: 'Lavanda Suave', hex: '#8A5BC4' },
  { name: 'Verde Menta', hex: '#10B981' },
  { name: 'Melocotón', hex: '#F59E0B' },
  { name: 'Frambuesa', hex: '#EC4899' },
  { name: 'Índigo Elegante', hex: '#6366F1' },
];

const DEFAULT_CATALOGS: CanvaCatalogItem[] = [
  {
    id: 'papeleria',
    title: 'Papelería Bonita',
    desc: 'Cuadernos, stickers y planners para tu día a día.',
    url: 'https://ovejitasorpresas.my.canva.site/ovejitasorpresaspapeleria',
    imageUrl: '/images/catalogos/cat_papeleria.png',
    waMessage: 'Hola Ovejita Sorpresas, vi su Catálogo de Papelería bonita y deseo información de un producto. ¿Me ayudas a elegir?',
    color: '#D96B91',
  },
  {
    id: 'paraellos',
    title: 'Regalos para Él',
    desc: 'Detalles prácticos y especiales para cada ocasión.',
    url: 'https://ovejitasorpresas.my.canva.site/paraellos',
    imageUrl: '/images/catalogos/cat_paraellos.png',
    waMessage: '¡Hola! Vi su Catálogo de Regalos para Él y me interesó un detalle. ¿Me cuentas más detalles?',
    color: '#4C96D7',
  },
  {
    id: 'boxes',
    title: 'Boxes & Fechas Especiales',
    desc: 'Cajas temáticas para celebrar y regalar.',
    url: 'https://ovejitasorpresas.my.canva.site/boxpersonalizados',
    imageUrl: '/images/catalogos/cat_boxes.png',
    waMessage: 'Hola Ovejita Sorpresas, estuve viendo el Catálogo de Boxes & Fechas Especiales y me gustó un box. ¿Me ayudas a elegir el ideal?',
    color: '#E5AA32',
  },
  {
    id: 'amor-amistad',
    title: 'Amor & Aniversarios',
    desc: 'Detalles llenos de significado para momentos especiales.',
    url: 'https://ovejitasorpresas.my.canva.site/regalos-de-amor-aniversarios',
    imageUrl: '/images/catalogos/cat_amor.png',
    waMessage: '¡Hola! Estuve revisando su Catálogo de Amor & Amistad. ¿Me ayudas con los detalles para pedir uno?',
    color: '#8A5BC4',
  },
];

export const CanvaCatalogManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // General settings state
  const [isCanvaMode, setIsCanvaMode] = useState(true);
  const [catalogs, setCatalogs] = useState<CanvaCatalogItem[]>(DEFAULT_CATALOGS);

  // Module visibility states
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [showCanvaHero, setShowCanvaHero] = useState(true);
  const [showCanvaPromo, setShowCanvaPromo] = useState(true);
  const [showWhatsApp, setShowWhatsApp] = useState(true);

  // Top Announcement bar state
  const [announcementText, setAnnouncementText] = useState(
    'Ediciones con propósito · Dedicatoria & personalización'
  );

  // Hero banner state
  const [heroTag, setHeroTag] = useState('✦ Regalos que inspiran ✦');
  const [heroTitle, setHeroTitle] = useState('Explora Nuestras Colecciones');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Descubre nuestros catálogos digitales interactivos en alta resolución. Hojéalos cómodamente y solicita tu detalle personalizado con empaque de regalo.'
  );
  const [heroImageUrl, setHeroImageUrl] = useState('/images/catalogos/hero_gift_box.png');
  const [hideHeroOnMobile, setHideHeroOnMobile] = useState(true);

  // Image uploading indicators
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingCatalogId, setUploadingCatalogId] = useState<string | null>(null);

  // Footer & Brand Words State (from user's screenshot)
  const [hideFooter, setHideFooter] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showLocationText, setShowLocationText] = useState(true);
  const [showCollections, setShowCollections] = useState(true);
  const [showCustomerService, setShowCustomerService] = useState(true);
  const [showClub, setShowClub] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);

  const [footerDescription, setFooterDescription] = useState(
    'Creamos papelería y regalos con intención y devoción. Cada detalle es empacado con amor para edificar y alegrar el corazón de quien lo recibe.'
  );
  const [locationText, setLocationText] = useState(
    '✦ Sedes de taller creativo en Lima con despachos con amor a todo el Perú.'
  );
  const [collectionsTitle, setCollectionsTitle] = useState('Colecciones');
  const [collectionsLinks, setCollectionsLinks] = useState<any[]>([
    { label: 'Cuadernos Salmos & Promesas', url: '/catalogo' },
    { label: 'Sets con Espejo y Llavero', url: '/catalogo' },
    { label: 'Devocionales Diarios', url: '/catalogo' },
    { label: 'Bolígrafos y Papelería Pastel', url: '/catalogo' },
  ]);
  const [customerServiceTitle, setCustomerServiceTitle] = useState('Servicio al Cliente');
  const [customerServiceLinks, setCustomerServiceLinks] = useState<any[]>([
    { label: 'Tiempos de Despacho & Tarifas', url: '/#empaque-calidad' },
    { label: 'Guía de Cuidado de Papelería', url: '/#empaque-calidad' },
    { label: 'Garantía de Satisfacción Taller', url: '/#empaque-calidad' },
    { label: 'Ventas Corporativas & Eventos', url: '/#corporativo' },
  ]);
  const [clubTitle, setClubTitle] = useState('Club Ovejita');
  const [clubSubtitle, setClubSubtitle] = useState(
    'Recibe versículos semanales y acceso previo a nuevas colecciones.'
  );
  const [clubButtonText, setClubButtonText] = useState('Unirme al Club');
  const [copyrightText, setCopyrightText] = useState('Hecho con amor y bendición.');

  // Raw full settings to preserve when saving
  const [rawSettings, setRawSettings] = useState<any>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/admin/settings');
      if (res.success && res.data) {
        const d = res.data;
        setRawSettings(d);
        const gt = d.generalTexts || {};

        setIsCanvaMode(gt.isCanvaCatalogsMode !== false);
        setShowAnnouncementBar(gt.showAnnouncementBar !== false);
        setShowCanvaHero(gt.showCanvaHero !== false);
        setShowCanvaPromo(gt.showCanvaPromo !== false);
        setShowWhatsApp(gt.showWhatsApp !== false);

        setAnnouncementText(
          gt.announcementText || 'Ediciones con propósito · Dedicatoria & personalización'
        );
        setHeroTag(gt.canvaHeroTag || '✦ Regalos que inspiran ✦');
        setHeroTitle(gt.canvaHeroTitle || 'Explora Nuestras Colecciones');
        setHeroSubtitle(
          gt.canvaHeroSubtitle ||
            'Descubre nuestros catálogos digitales interactivos en alta resolución. Hojéalos cómodamente y solicita tu detalle personalizado con empaque de regalo.'
        );
        setHeroImageUrl(gt.canvaHeroImageUrl || '/images/catalogos/hero_gift_box.png');
        setHideHeroOnMobile(gt.hideCanvaHeroOnMobile !== false);

        if (Array.isArray(gt.canvaCatalogs) && gt.canvaCatalogs.length > 0) {
          setCatalogs(
            gt.canvaCatalogs.map((item: any, idx: number) => ({
              id: item.id || `cat_${idx}_${Date.now()}`,
              title: item.title || `Catálogo ${idx + 1}`,
              desc: item.desc || '',
              url: item.url || '',
              imageUrl: item.imageUrl || `/images/catalogos/catalogo_${idx + 1}.png`,
              waMessage:
                item.waMessage ||
                `Hola Ovejita Sorpresas, vi su catálogo de ${item.title || ''} y deseo más información.`,
              color: item.color || item.colors?.primary || COLOR_PRESETS[idx % COLOR_PRESETS.length].hex,
              colors: item.colors,
              hidden: item.hidden === true,
            }))
          );
        } else {
          setCatalogs(DEFAULT_CATALOGS);
        }

        const ft = gt.footer || {};
        setHideFooter(ft.hideFooter === true);
        setShowDescription(ft.showDescription !== false);
        setShowLocationText(ft.showLocationText !== false);
        setShowCollections(ft.showCollections !== false);
        setShowCustomerService(ft.showCustomerService !== false);
        setShowClub(ft.showClub !== false);
        setShowBottomBar(ft.showBottomBar !== false);

        if (ft.description !== undefined) setFooterDescription(ft.description);
        if (ft.locationText !== undefined) setLocationText(ft.locationText);
        if (ft.collectionsTitle !== undefined) setCollectionsTitle(ft.collectionsTitle);
        if (Array.isArray(ft.collectionsLinks) && ft.collectionsLinks.length > 0) {
          setCollectionsLinks(ft.collectionsLinks);
        }
        if (ft.customerServiceTitle !== undefined) setCustomerServiceTitle(ft.customerServiceTitle);
        if (Array.isArray(ft.customerServiceLinks) && ft.customerServiceLinks.length > 0) {
          setCustomerServiceLinks(ft.customerServiceLinks);
        }
        if (ft.clubTitle !== undefined) setClubTitle(ft.clubTitle);
        if (ft.clubSubtitle !== undefined) setClubSubtitle(ft.clubSubtitle);
        if (ft.clubButtonText !== undefined) setClubButtonText(ft.clubButtonText);
        if (ft.copyrightText !== undefined) setCopyrightText(ft.copyrightText);
      }
    } catch (err: any) {
      console.error('Error cargando ajustes:', err);
      setError('No se pudieron cargar los ajustes de catálogos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const updatedGeneralTexts = {
        ...(rawSettings.generalTexts || {}),
        isCanvaCatalogsMode: isCanvaMode,
        showAnnouncementBar,
        showCanvaHero,
        showCanvaPromo,
        showWhatsApp,
        announcementText: announcementText.trim(),
        canvaHeroTag: heroTag.trim(),
        canvaHeroTitle: heroTitle.trim(),
        canvaHeroSubtitle: heroSubtitle.trim(),
        canvaHeroImageUrl: heroImageUrl.trim(),
        hideCanvaHeroOnMobile: hideHeroOnMobile,
        footer: {
          ...(rawSettings.generalTexts?.footer || {}),
          hideFooter,
          showDescription,
          showLocationText,
          showCollections,
          showCustomerService,
          showClub,
          showBottomBar,
          description: footerDescription.trim(),
          locationText: locationText.trim(),
          collectionsTitle: collectionsTitle.trim(),
          collectionsLinks,
          customerServiceTitle: customerServiceTitle.trim(),
          customerServiceLinks,
          clubTitle: clubTitle.trim(),
          clubSubtitle: clubSubtitle.trim(),
          clubButtonText: clubButtonText.trim(),
          copyrightText: copyrightText.trim(),
        },
        canvaCatalogs: catalogs.map((cat, idx) => ({
          id: cat.id || `cat_${idx + 1}`,
          title: (cat.title || '').trim(),
          desc: cat.desc || '',
          url: (cat.url || '').trim(),
          imageUrl: cat.imageUrl || '',
          waMessage: cat.waMessage || '',
          color: cat.color || COLOR_PRESETS[idx % COLOR_PRESETS.length].hex,
          hidden: cat.hidden === true,
        })),
      };

      const payload = {
        ...rawSettings,
        generalTexts: updatedGeneralTexts,
      };

      const res = await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSaved(true);
        setRawSettings(payload);
        setTimeout(() => setSaved(false), 3500);
      } else {
        setError(res.message || 'Error al guardar los catálogos');
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // Catalog item manipulation
  const handleAddCatalog = () => {
    const nextIdx = catalogs.length;
    const colorPreset = COLOR_PRESETS[nextIdx % COLOR_PRESETS.length];
    const newCatalog: CanvaCatalogItem = {
      id: `cat_${Date.now()}`,
      title: `Nuevo Catálogo ${nextIdx + 1}`,
      desc: 'Colección especial y regalos personalizados.',
      url: 'https://ovejitasorpresas.my.canva.site/',
      imageUrl: '/images/catalogos/hero_gift_box.png',
      waMessage: `¡Hola Ovejita Sorpresas! Estuve viendo el catálogo y deseo consultar disponibilidad de un detalle. ✨`,
      color: colorPreset.hex,
    };
    setCatalogs([...catalogs, newCatalog]);
  };

  const handleDeleteCatalog = (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el catálogo "${title}"?`)) {
      setCatalogs(catalogs.filter((c) => c.id !== id));
    }
  };

  const handleMoveCatalog = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === catalogs.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const reordered = [...catalogs];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setCatalogs(reordered);
  };

  const handleAddCollectionLink = () => {
    setCollectionsLinks([...collectionsLinks, { label: 'Nuevo Enlace', url: '/catalogo' }]);
  };

  const handleRemoveCollectionLink = (idx: number) => {
    setCollectionsLinks(collectionsLinks.filter((_, i) => i !== idx));
  };

  const handleAddCustomerServiceLink = () => {
    setCustomerServiceLinks([...customerServiceLinks, { label: 'Nuevo Servicio', url: '/#empaque-calidad' }]);
  };

  const handleRemoveCustomerServiceLink = (idx: number) => {
    setCustomerServiceLinks(customerServiceLinks.filter((_, i) => i !== idx));
  };

  const handleUpdateCatalog = (id: string, field: keyof CanvaCatalogItem, value: any) => {
    setCatalogs((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  // Upload catalog photo
  const handleCatalogPhotoUpload = async (id: string, file: File) => {
    setUploadingCatalogId(id);
    const body = new FormData();
    body.append('image', file);
    body.append('purpose', 'logo');

    try {
      const res = await apiFetch('/admin/images/upload', {
        method: 'POST',
        body,
      });
      if (res.success && res.data?.url) {
        handleUpdateCatalog(id, 'imageUrl', res.data.url);
      } else {
        alert(res.message || 'Error al subir la imagen.');
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir la imagen.');
    } finally {
      setUploadingCatalogId(null);
    }
  };

  // Upload hero banner image
  const handleHeroPhotoUpload = async (file: File) => {
    setUploadingHero(true);
    const body = new FormData();
    body.append('image', file);
    body.append('purpose', 'logo');

    try {
      const res = await apiFetch('/admin/images/upload', {
        method: 'POST',
        body,
      });
      if (res.success && res.data?.url) {
        setHeroImageUrl(res.data.url);
      } else {
        alert(res.message || 'Error al subir imagen del banner.');
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir imagen del banner.');
    } finally {
      setUploadingHero(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-3 border-[#9A80BD] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500">Cargando Gestor de Catálogos Canva...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-24">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 font-['Quicksand',sans-serif]">
              Catálogos Virtuales & Contenido Canva
            </h1>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isCanvaMode
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isCanvaMode ? 'Modo Activo' : 'Desactivado'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra tus catálogos, fotos, aviso superior (top), banner y las palabras del pie de página (footer).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAddCatalog}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#9A80BD] border border-purple-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Catálogo</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#9A80BD] hover:bg-[#856BA8] text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Guardando...' : 'Guardar Todo'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            ¡Configuración guardada correctamente! Todos los textos, banners y catálogos están actualizados en la web pública.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode Activation Switcher Card */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#9A80BD] flex items-center justify-center shrink-0 border border-purple-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              Activar Modo Catálogo Canva en la Tienda
            </h3>
            <p className="text-[11px] text-slate-500">
              Al activarlo, la tienda mostrará tus catálogos interactivos con enlaces directos y atajos a WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">
            {isCanvaMode ? 'Modo Canva ON' : 'Modo Canva OFF'}
          </span>
          <button
            type="button"
            onClick={() => setIsCanvaMode(!isCanvaMode)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              isCanvaMode ? 'bg-[#9A80BD]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                isCanvaMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* GLOBAL MODULES VISIBILITY CONTROLLER */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#9A80BD] flex items-center justify-center border border-purple-100">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Módulos de la Web (Activar / Ocultar Secciones)
              </h3>
              <p className="text-[11px] text-slate-500 font-light">
                Enciende o apaga cualquier módulo de la página con un solo clic.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-purple-50 text-[#9A80BD] font-bold px-2.5 py-0.5 rounded-full border border-purple-100 w-fit">
            Control de Visibilidad
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* 1. Aviso Top */}
          <button
            type="button"
            onClick={() => setShowAnnouncementBar(!showAnnouncementBar)}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
              showAnnouncementBar
                ? 'bg-purple-50/40 border-purple-200 text-slate-800 hover:border-purple-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Megaphone className="w-4 h-4 text-[#9A80BD]" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                showAnnouncementBar ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {showAnnouncementBar ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <span className="text-[11px] font-bold">1. Aviso Top Bar</span>
          </button>

          {/* 2. Banner Hero */}
          <button
            type="button"
            onClick={() => setShowCanvaHero(!showCanvaHero)}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
              showCanvaHero
                ? 'bg-purple-50/40 border-purple-200 text-slate-800 hover:border-purple-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-[#9A80BD]" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                showCanvaHero ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {showCanvaHero ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <span className="text-[11px] font-bold">2. Banner Hero</span>
          </button>

          {/* 3. Banners Promos */}
          <button
            type="button"
            onClick={() => setShowCanvaPromo(!showCanvaPromo)}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
              showCanvaPromo
                ? 'bg-purple-50/40 border-purple-200 text-slate-800 hover:border-purple-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <ImageIcon className="w-4 h-4 text-[#9A80BD]" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                showCanvaPromo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {showCanvaPromo ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <span className="text-[11px] font-bold">3. Banners Promos</span>
          </button>

          {/* 4. WhatsApp Flotante */}
          <button
            type="button"
            onClick={() => setShowWhatsApp(!showWhatsApp)}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
              showWhatsApp
                ? 'bg-purple-50/40 border-purple-200 text-slate-800 hover:border-purple-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                showWhatsApp ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {showWhatsApp ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <span className="text-[11px] font-bold">4. WhatsApp Flotante</span>
          </button>

          {/* 5. Footer Completo */}
          <button
            type="button"
            onClick={() => setHideFooter(!hideFooter)}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
              !hideFooter
                ? 'bg-purple-50/40 border-purple-200 text-slate-800 hover:border-purple-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <PanelBottom className="w-4 h-4 text-[#9A80BD]" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                !hideFooter ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {!hideFooter ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <span className="text-[11px] font-bold">5. Pie de Página</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Top Bar (Aviso Superior) */}
      <div className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 transition-all ${
        !showAnnouncementBar ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#9A80BD]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Aviso Superior (Top Bar de la Web)
            </h3>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Aparece arriba del todo sobre el logo
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAnnouncementBar(!showAnnouncementBar)}
            className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
              showAnnouncementBar
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
            }`}
          >
            {showAnnouncementBar ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
            <span>{showAnnouncementBar ? 'Barra Visible' : 'Barra Oculta'}</span>
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Texto del Aviso Superior (Promoción / Envíos / Dedicatorias):
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            disabled={!showAnnouncementBar}
            placeholder="Ediciones con propósito · Dedicatoria & personalización gratis"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium text-slate-800 disabled:opacity-50"
          />
        </div>
      </div>

      {/* SECTION 2: Hero Header Customizer Card */}
      <div className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 transition-all ${
        !showCanvaHero ? 'opacity-60' : ''
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9A80BD]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Banner de Portada del Catálogo (Hero Header)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCanvaHero(!showCanvaHero)}
              className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                showCanvaHero
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
              }`}
            >
              {showCanvaHero ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
              <span>{showCanvaHero ? 'Hero Visible' : 'Hero Oculto'}</span>
            </button>

            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hideHeroOnMobile}
                onChange={(e) => setHideHeroOnMobile(e.target.checked)}
                className="w-3.5 h-3.5 text-[#9A80BD] rounded border-slate-300 focus:ring-[#9A80BD]"
              />
              <span>📱 Ocultar en celulares</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Hero image preview & upload */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center space-y-2">
            <div className="w-24 h-24 rounded-lg bg-white border border-purple-100 p-1 flex items-center justify-center overflow-hidden relative shadow-2xs">
              <img
                src={heroImageUrl || '/images/catalogos/hero_gift_box.png'}
                alt="Banner Hero"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/catalogos/hero_gift_box.png';
                }}
              />
              {uploadingHero && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[9px] font-bold">
                  Subiendo...
                </div>
              )}
            </div>

            <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-purple-50 text-[#9A80BD] border border-purple-200 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer shadow-2xs">
              <Upload className="w-3 h-3" />
              <span>{uploadingHero ? 'Subiendo...' : 'Cambiar Foto'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingHero}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleHeroPhotoUpload(file);
                }}
              />
            </label>
          </div>

          {/* Hero text fields */}
          <div className="md:col-span-9 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Etiqueta pequeña (Badge)
                </label>
                <input
                  type="text"
                  value={heroTag}
                  onChange={(e) => setHeroTag(e.target.value)}
                  placeholder="✦ Regalos que inspiran ✦"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Título Principal del Banner
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Explora Nuestras Colecciones"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Subtítulo o Breve Descripción
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Descubre nuestros catálogos digitales interactivos en alta resolución..."
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Canva Catalogs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Tus Catálogos de Canva ({catalogs.length})
            </h2>
            <span className="text-[11px] text-slate-400">
              Edita el título, la foto, el enlace y el mensaje de WhatsApp de cada uno
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddCatalog}
            className="text-xs font-bold text-[#9A80BD] hover:text-[#7D60A6] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Agregar otro catálogo</span>
          </button>
        </div>

        {/* Catalogs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {catalogs.map((cat, idx) => {
            const isUploadingThis = uploadingCatalogId === cat.id;
            const currentImg = cat.imageUrl || `/images/catalogos/catalogo_${(idx % 4) + 1}.png`;
            const activeColor = cat.color || COLOR_PRESETS[idx % COLOR_PRESETS.length].hex;

            return (
              <div
                key={cat.id || idx}
                className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs ${
                  cat.hidden ? 'bg-slate-50/70 border-slate-200 opacity-65' : 'bg-white border-slate-200/90 hover:shadow-xs'
                }`}
              >
                {/* Card Top Bar */}
                <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-white text-[10.5px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: activeColor }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                      {cat.title || `Catálogo ${idx + 1}`}
                    </span>
                    {cat.hidden && (
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                        Oculto
                      </span>
                    )}
                  </div>

                  {/* Move Up, Move Down, Test Link, Hide/Show, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateCatalog(cat.id, 'hidden', !cat.hidden)}
                      title={cat.hidden ? 'Activar catálogo' : 'Pausar catálogo (ocultar de la tienda)'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        cat.hidden
                          ? 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {cat.hidden ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3 text-emerald-600" />}
                      <span className="hidden sm:inline">{cat.hidden ? 'Pausado' : 'Activo'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCatalog(idx, 'up')}
                      title="Mover arriba"
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === catalogs.length - 1}
                      onClick={() => handleMoveCatalog(idx, 'down')}
                      title="Mover abajo"
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {cat.url && (
                      <a
                        href={cat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#9A80BD] hover:text-[#7D60A6] transition-colors"
                        title="Probar enlace en nueva pestaña"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteCatalog(cat.id, cat.title)}
                      title="Eliminar catálogo"
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content Form */}
                <div className="p-4 space-y-3.5">
                  {/* Row: Photo Preview + Title & Subtitle */}
                  <div className="flex items-start gap-3.5">
                    {/* Catalog Image Upload Box */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="relative w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-2xs group">
                        <img
                          src={currentImg}
                          alt={cat.title}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/catalogos/hero_gift_box.png';
                          }}
                        />
                        {isUploadingThis && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[9px] font-bold">
                            Subiendo...
                          </div>
                        )}
                      </div>

                      <label className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-purple-50 text-[#9A80BD] border border-purple-200 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-2.5 h-2.5" />
                        <span>{isUploadingThis ? '...' : 'Subir foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingThis}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCatalogPhotoUpload(cat.id, file);
                          }}
                        />
                      </label>
                    </div>

                    {/* Title & Subtitle fields */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">
                          Título del Catálogo *
                        </label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => handleUpdateCatalog(cat.id, 'title', e.target.value)}
                          placeholder="Ej. Papelería Bonita"
                          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-bold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-semibold text-slate-500 mb-0.5">
                          Breve descripción (1 línea)
                        </label>
                        <input
                          type="text"
                          value={cat.desc || ''}
                          onChange={(e) => handleUpdateCatalog(cat.id, 'desc', e.target.value)}
                          placeholder="Ej. Cuadernos, stickers y planners..."
                          className="w-full text-[11px] p-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Canva URL field */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[10.5px] font-bold text-slate-600">
                        Enlace de Canva / Web:
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (Link que se abrirá)
                      </span>
                    </div>
                    <input
                      type="url"
                      value={cat.url || ''}
                      onChange={(e) => handleUpdateCatalog(cat.id, 'url', e.target.value)}
                      placeholder="https://ovejitasorpresas.my.canva.site/..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-mono text-slate-700"
                    />
                  </div>

                  {/* WhatsApp Message */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[10.5px] font-bold text-slate-600 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>Mensaje que enviará el cliente por WhatsApp:</span>
                      </label>
                    </div>
                    <textarea
                      rows={2}
                      value={cat.waMessage || ''}
                      onChange={(e) => handleUpdateCatalog(cat.id, 'waMessage', e.target.value)}
                      placeholder="Hola Ovejita Sorpresas, vi su catálogo y deseo información..."
                      className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#9A80BD] focus:outline-none text-slate-700 resize-none"
                    />
                  </div>

                  {/* Color Preset Selector */}
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">
                      Color de la tarjeta:
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {COLOR_PRESETS.map((preset) => {
                        const isSelected = activeColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => handleUpdateCatalog(cat.id, 'color', preset.hex)}
                            title={preset.name}
                            className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-offset-1 ring-slate-800 scale-110 border-white'
                                : 'border-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          />
                        );
                      })}
                      {/* Custom color input */}
                      <label className="relative cursor-pointer ml-1" title="Color personalizado">
                        <input
                          type="color"
                          value={activeColor}
                          onChange={(e) => handleUpdateCatalog(cat.id, 'color', e.target.value)}
                          className="w-5 h-5 opacity-0 absolute inset-0 cursor-pointer"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-dashed border-slate-400 flex items-center justify-center text-[9px] text-slate-600"
                          style={{ backgroundColor: activeColor }}
                        >
                          +
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Catalog Big Button at Bottom */}
        <button
          type="button"
          onClick={handleAddCatalog}
          className="w-full py-4 border-2 border-dashed border-purple-200 hover:border-[#9A80BD] hover:bg-purple-50/50 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#9A80BD] transition-all cursor-pointer active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Otro Catálogo Virtual</span>
        </button>
      </div>

      {/* SECTION 4: Promotional Banners Info & Visibility */}
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-purple-50/60 to-pink-50/40 border border-purple-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        !showCanvaPromo ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#9A80BD] border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800">
                Banners Promocionales en Modo Canva
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                showCanvaPromo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {showCanvaPromo ? 'Módulo Activo' : 'Módulo Oculto'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Los banners promocionales activos creados en la sección de banners se muestran debajo de tus catálogos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCanvaPromo(!showCanvaPromo)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showCanvaPromo
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
            }`}
          >
            {showCanvaPromo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showCanvaPromo ? 'Visible en Tienda' : 'Oculto en Tienda'}</span>
          </button>
          <a
            href="/banners"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-purple-50 text-[#9A80BD] border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
          >
            <span>Ir a Banners →</span>
          </a>
        </div>
      </div>

      {/* SECTION 4.5: WhatsApp Floating Button Visibility */}
      <div className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        !showWhatsApp ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800">
                Botón Flotante de WhatsApp
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                showWhatsApp ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {showWhatsApp ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Botón verde flotante en la esquina inferior derecha para que los clientes te escriban directamente.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowWhatsApp(!showWhatsApp)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            showWhatsApp
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
          }`}
        >
          {showWhatsApp ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>{showWhatsApp ? 'Botón WhatsApp: Visible' : 'Botón WhatsApp: Oculto'}</span>
        </button>
      </div>

      {/* SECTION 5: Footer & Brand Words Customizer (Editable and Hideable Granularly) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#9A80BD] flex items-center justify-center border border-purple-100">
              <PanelBottom className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Pie de Página (Footer) & Club Ovejita
              </h3>
              <p className="text-[11px] text-slate-500 font-light">
                Personaliza o desactiva cada columna, lema, sedes, enlaces y el formulario del Club.
              </p>
            </div>
          </div>

          {/* Master Footer Visibility Switch */}
          <button
            type="button"
            onClick={() => setHideFooter(!hideFooter)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              hideFooter
                ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {hideFooter ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{hideFooter ? 'Footer: Oculto en la Web' : 'Footer: Visible en la Web'}</span>
          </button>
        </div>

        {hideFooter && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              El pie de página completo está actualmente <strong>oculto</strong> en la tienda. Puedes activar columnas individuales o volver a activarlo arriba.
            </span>
          </div>
        )}

        <div className={`space-y-6 ${hideFooter ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Bloque 1: Marca y Sedes (Columna Izquierda) */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Marca & Sedes de Taller (Columna Izquierda)
            </span>

            {/* Lema o Descripción */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700">
                  Lema / Descripción de Marca:
                </label>
                <button
                  type="button"
                  onClick={() => setShowDescription(!showDescription)}
                  className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    showDescription
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {showDescription ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                  <span>{showDescription ? 'Visible' : 'Oculto'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                disabled={!showDescription}
                placeholder="Creamos papelería y regalos con intención y devoción..."
                className={`w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none ${
                  !showDescription ? 'opacity-40 bg-slate-100' : ''
                }`}
              />
            </div>

            {/* Sedes / Envíos */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700">
                  Texto de Sedes / Envíos a todo el Perú:
                </label>
                <button
                  type="button"
                  onClick={() => setShowLocationText(!showLocationText)}
                  className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    showLocationText
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {showLocationText ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                  <span>{showLocationText ? 'Visible' : 'Oculto'}</span>
                </button>
              </div>
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                disabled={!showLocationText}
                placeholder="✦ Sedes de taller creativo en Lima con despachos con amor a todo el Perú."
                className={`w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-medium text-primary ${
                  !showLocationText ? 'opacity-40 bg-slate-100' : ''
                }`}
              />
            </div>
          </div>

          {/* Bloque 2: Colecciones y Servicio al Cliente (2 Columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Columna Colecciones */}
            <div className={`p-4 bg-purple-50/30 rounded-2xl border transition-all space-y-3.5 ${
              showCollections ? 'border-purple-200' : 'border-slate-200 bg-slate-50/50 opacity-60'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-purple-100/70">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Columna Colecciones
                </span>
                <button
                  type="button"
                  onClick={() => setShowCollections(!showCollections)}
                  className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    showCollections
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {showCollections ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                  <span>{showCollections ? 'Columna Visible' : 'Columna Oculta'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título de la Columna:
                </label>
                <input
                  type="text"
                  value={collectionsTitle}
                  onChange={(e) => setCollectionsTitle(e.target.value)}
                  disabled={!showCollections}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Enlaces de la Columna ({collectionsLinks.length}):
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCollectionLink}
                    disabled={!showCollections}
                    className="text-[10.5px] font-bold text-[#9A80BD] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Enlace</span>
                  </button>
                </div>

                {collectionsLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      disabled={!showCollections}
                      onChange={(e) => {
                        const updated = [...collectionsLinks];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setCollectionsLinks(updated);
                      }}
                      placeholder={`Texto enlace ${idx + 1}`}
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      value={link.url || ''}
                      disabled={!showCollections}
                      onChange={(e) => {
                        const updated = [...collectionsLinks];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setCollectionsLinks(updated);
                      }}
                      placeholder="/catalogo"
                      title="Ruta o enlace web"
                      className="w-28 sm:w-32 text-xs p-2 bg-white border border-slate-200 rounded-xl font-mono text-[10.5px] text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCollectionLink(idx)}
                      disabled={!showCollections}
                      title="Eliminar este enlace"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Servicio al Cliente */}
            <div className={`p-4 bg-purple-50/30 rounded-2xl border transition-all space-y-3.5 ${
              showCustomerService ? 'border-purple-200' : 'border-slate-200 bg-slate-50/50 opacity-60'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-purple-100/70">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Columna Servicio al Cliente
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomerService(!showCustomerService)}
                  className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    showCustomerService
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {showCustomerService ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                  <span>{showCustomerService ? 'Columna Visible' : 'Columna Oculta'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título de la Columna:
                </label>
                <input
                  type="text"
                  value={customerServiceTitle}
                  onChange={(e) => setCustomerServiceTitle(e.target.value)}
                  disabled={!showCustomerService}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Opciones de Servicio ({customerServiceLinks.length}):
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCustomerServiceLink}
                    disabled={!showCustomerService}
                    className="text-[10.5px] font-bold text-[#9A80BD] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Opción</span>
                  </button>
                </div>

                {customerServiceLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      disabled={!showCustomerService}
                      onChange={(e) => {
                        const updated = [...customerServiceLinks];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setCustomerServiceLinks(updated);
                      }}
                      placeholder={`Texto opción ${idx + 1}`}
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      value={link.url || ''}
                      disabled={!showCustomerService}
                      onChange={(e) => {
                        const updated = [...customerServiceLinks];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setCustomerServiceLinks(updated);
                      }}
                      placeholder="/#empaque-calidad"
                      title="Ruta o enlace"
                      className="w-28 sm:w-32 text-xs p-2 bg-white border border-slate-200 rounded-xl font-mono text-[10.5px] text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomerServiceLink(idx)}
                      disabled={!showCustomerService}
                      title="Eliminar esta opción"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloque 3: Club Ovejita & Formulario Newsletter */}
          <div className={`p-4 bg-slate-50/80 rounded-2xl border transition-all space-y-4 ${
            showClub ? 'border-slate-200/70' : 'border-slate-200 bg-slate-100/60 opacity-60'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Columna Club Ovejita (Newsletter)
              </span>
              <button
                type="button"
                onClick={() => setShowClub(!showClub)}
                className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  showClub
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                }`}
              >
                {showClub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                <span>{showClub ? 'Club Visible' : 'Club Oculto'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título del Club:
                </label>
                <input
                  type="text"
                  value={clubTitle}
                  onChange={(e) => setClubTitle(e.target.value)}
                  disabled={!showClub}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Subtítulo / Invitación:
                </label>
                <input
                  type="text"
                  value={clubSubtitle}
                  onChange={(e) => setClubSubtitle(e.target.value)}
                  disabled={!showClub}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Texto del Botón:
                </label>
                <input
                  type="text"
                  value={clubButtonText}
                  onChange={(e) => setClubButtonText(e.target.value)}
                  disabled={!showClub}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-[#9A80BD]"
                />
              </div>
            </div>
          </div>

          {/* Bloque 4: Barra de Derechos de Autor & Legal */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5. Barra Inferior de Derechos de Autor & Enlaces
              </span>
              <button
                type="button"
                onClick={() => setShowBottomBar(!showBottomBar)}
                className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  showBottomBar
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                }`}
              >
                {showBottomBar ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                <span>{showBottomBar ? 'Barra Visible' : 'Barra Oculta'}</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Texto de Derechos / Pie de Firma:
              </label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                disabled={!showBottomBar}
                placeholder="Hecho con amor y bendición."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating / Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-purple-200 shadow-lg flex items-center gap-3">
          <span className="text-xs text-slate-500 pl-2 font-medium">
            {catalogs.length} catálogo(s) · Aviso Top · Footer
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="py-2.5 px-6 bg-[#9A80BD] hover:bg-[#856BA8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
