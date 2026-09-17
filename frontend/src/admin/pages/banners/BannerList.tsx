import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Image as ImageIcon,
  Upload,
  Megaphone,
  Sparkles,
  Layout,
  ExternalLink,
  Layers,
  HelpCircle,
  Eye,
  Info,
  Package,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface BannerListProps {
  onNavigate?: (tab: string) => void;
}

interface BannerItem {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  type: 'hero' | 'promotional' | 'announcement';
  position: 'top' | 'middle' | 'bottom';
  order: number;
  active: boolean;
  bannerStyle?: 'product' | 'event';
  productId?: string | null;
  product?: any;
  startDate?: string | null;
  endDate?: string | null;
}

export const BannerList: React.FC<BannerListProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = {
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    type: 'hero' as 'hero' | 'promotional' | 'announcement',
    position: 'top' as 'top' | 'middle' | 'bottom',
    order: 1,
    active: true,
    bannerStyle: 'product' as 'product' | 'event',
    productId: '',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadBanners();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await apiFetch('/products');
      if (res.success) setProductList(res.data || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/banners');
      if (res.success) setBanners(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (b: BannerItem) => {
    try {
      await apiFetch(`/admin/banners/${b.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !b.active }),
      });
      loadBanners();
    } catch (err) {
      alert('Error al actualizar banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este banner?')) return;
    try {
      await apiFetch(`/admin/banners/${id}`, { method: 'DELETE' });
      loadBanners();
    } catch (err) {
      alert('Error al eliminar banner');
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({
      title: b.title || '',
      subtitle: b.subtitle || '',
      imageUrl: b.imageUrl || '',
      linkUrl: b.linkUrl || '',
      linkText: b.linkText || '',
      type: b.type || 'hero',
      position: b.position || 'top',
      order: b.order || 1,
      active: b.active ?? true,
      bannerStyle: (b.bannerStyle as any) || 'product',
      productId: b.productId || '',
    });
    setIsModalOpen(true);
  };

  const handleSelectProduct = (id: string) => {
    const p = productList.find((item) => item.id === id);
    if (p) {
      setFormData((prev) => ({
        ...prev,
        productId: p.id,
        imageUrl: p.images?.[0]?.url || prev.imageUrl,
        linkUrl: `/producto/${p.slug}`,
        linkText: prev.linkText || 'Explorar Producto',
      }));
    } else {
      setFormData((prev) => ({ ...prev, productId: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
          imageUrl: res.data.url,
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await apiFetch(`/admin/banners/${editingBanner.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/admin/banners', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      loadBanners();
    } catch (err: any) {
      alert(err.message || 'Error al guardar el banner');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'announcement':
        return { label: 'Aviso Superior', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Megaphone };
      case 'hero':
        return { label: 'Hero / Cabecera Principal', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Sparkles };
      case 'promotional':
        return { label: 'Promocional / Intermedio', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: Layout };
      default:
        return { label: type, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Layers };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-['Quicksand',sans-serif]">
            Banners & Contenido Visual
          </h2>
          <p className="text-xs text-slate-500">
            Personaliza los avisos superiores, la cabecera (Hero) y los banners promocionales de toda tu tienda web.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Crear Nuevo Banner
        </button>
      </div>

      {/* Notice about Canva Mode vs Normal Store Mode */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50/40 to-white border border-purple-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#9A80BD] border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              ¿Deseas gestionar los Catálogos Virtuales (Modo Canva)?
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Los banners de esta sección corresponden a la tienda web tradicional. Para añadir nuevos catálogos Canva, subir fotos o cambiar enlaces, entra a la sección Catálogos Canva.
            </p>
          </div>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('canva')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9A80BD] hover:bg-[#856BA8] text-white text-xs font-bold rounded-xl shrink-0 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <span>Ir a Catálogos Canva →</span>
          </button>
        )}
      </div>

      {/* Guide Card: What does each banner change? */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
          <HelpCircle className="w-4 h-4" />
          ¿Qué cambia cada tipo de banner en tu página web?
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Announcement Card */}
          <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-[#7D60A6] rounded-lg">
                <Megaphone className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-slate-800">1. Aviso Superior (Barra Superior)</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Ubicación:</strong> Arriba del todo, sobre el logo.
              <br />
              <strong>Qué cambia:</strong> Modifica el anuncio principal de la tienda (ej. <em>"✨ Ediciones con propósito · Dedicatoria & personalización"</em>).
            </p>
          </div>

          {/* Hero Card */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-slate-800">2. Hero (Portada Principal)</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Ubicación:</strong> Cabecera principal al abrir la web.
              <br />
              <strong>Qué cambia:</strong> Modifica el titular gigante, la descripción, la foto de presentación y el botón de acción hacia el catálogo.
            </p>
          </div>

          {/* Promotional Card */}
          <div className="p-3.5 bg-pink-50/50 rounded-xl border border-pink-100/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-pink-100 text-pink-700 rounded-lg">
                <Layout className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-slate-800">3. Banner Promocional</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Ubicación:</strong> A mitad de página o sobre el pie de página.
              <br />
              <strong>Qué cambia:</strong> Destaca ofertas de temporada, colecciones especiales o pedidos corporativos con foto y botón directo.
            </p>
          </div>
        </div>
      </div>

      {/* Banner Cards List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Cargando banners...</div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No hay banners configurados</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Crea tu primer banner para mostrar avisos o promociones destacadas en la tienda.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#9A80BD] text-white text-xs font-bold rounded-xl hover:bg-[#7D60A6]"
          >
            Crear Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((b) => {
            const badge = getTypeLabel(b.type);
            const Icon = badge.icon;
            return (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left: Image & Main details */}
                <div className="flex items-start gap-4 flex-1">
                  {b.imageUrl ? (
                    <img
                      src={b.imageUrl}
                      alt={b.title || 'Banner'}
                      className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <Icon className="w-5 h-5 mb-1 opacity-60" />
                      <span className="text-[9px] font-bold uppercase">Sin foto</span>
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Posición: <strong className="text-slate-600">{b.position}</strong>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Orden: <strong className="text-slate-600">{b.order}</strong>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                      {b.title || <span className="italic text-slate-400">Sin título principal</span>}
                    </h4>

                    {b.subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-2">{b.subtitle}</p>
                    )}

                    {b.type === 'hero' && (
                      <div className="pt-0.5 flex flex-wrap items-center gap-2">
                        {b.product ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg">
                            <Package className="w-3 h-3 text-[#9A80BD]" />
                            Producto: <strong>{b.product.name}</strong> ({b.product.images?.length || 0} fotos carrusel)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-lg">
                            <Calendar className="w-3 h-3 text-pink-500" />
                            Anuncio / Evento Libre
                          </span>
                        )}
                      </div>
                    )}

                    {(b.linkUrl || b.linkText) && (
                      <div className="pt-1 flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Botón/Enlace:</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md text-[11px] flex items-center gap-1">
                          {b.linkText || 'Ver más'} → <span className="text-slate-400 font-mono">{b.linkUrl}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      b.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${b.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {b.active ? 'Activo en web' : 'Inactivo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(b)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 border border-slate-200 hover:border-[#9A80BD] rounded-xl transition-colors shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#9A80BD]" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Eliminar banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit & Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800 font-['Quicksand',sans-serif]">
                  {editingBanner ? 'Editar Banner / Contenido' : 'Crear Nuevo Banner'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configura el texto, foto y enlace que se mostrarán en la tienda.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tipo de Banner *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'announcement', position: 'top' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.type === 'announcement'
                        ? 'border-[#9A80BD] bg-purple-50 text-[#7D60A6] font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Megaphone className="w-4 h-4 mx-auto mb-1 text-[#9A80BD]" />
                    <span className="text-xs block">Aviso Superior</span>
                    <span className="text-[10px] text-slate-400 font-normal">Barra superior</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'hero', position: 'top' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.type === 'hero'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <span className="text-xs block">Hero / Portada</span>
                    <span className="text-[10px] text-slate-400 font-normal">Cabecera web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'promotional', position: 'middle' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.type === 'promotional'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Layout className="w-4 h-4 mx-auto mb-1 text-pink-500" />
                    <span className="text-xs block">Promocional</span>
                    <span className="text-[10px] text-slate-400 font-normal">Mitad / Destacado</span>
                  </button>
                </div>
              </div>

              {/* Hero Specific Mode: Producto con Carrusel vs Anuncio / Evento */}
              {formData.type === 'hero' && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#9A80BD]" />
                      ¿Qué mostrar en la tarjeta derecha de la portada?
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerStyle: 'product' })}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        formData.bannerStyle === 'product'
                          ? 'bg-white border-[#9A80BD] text-[#7D60A6] shadow-xs ring-1 ring-[#9A80BD]'
                          : 'bg-white/60 border-slate-200 text-slate-500 hover:bg-white'
                      }`}
                    >
                      <Package className="w-4 h-4 text-[#9A80BD]" />
                      <span>🎁 Producto Destacado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerStyle: 'event' })}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        formData.bannerStyle === 'event'
                          ? 'bg-white border-[#9A80BD] text-[#7D60A6] shadow-xs ring-1 ring-[#9A80BD]'
                          : 'bg-white/60 border-slate-200 text-slate-500 hover:bg-white'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-pink-500" />
                      <span>📢 Anuncio / Evento Libre</span>
                    </button>
                  </div>

                  {formData.bannerStyle === 'product' ? (
                    <div className="space-y-2 pt-2 border-t border-purple-200/60">
                      <label className="block text-xs font-semibold text-slate-700">
                        Selecciona el Producto para la Portada *
                      </label>
                      <select
                        value={formData.productId || ''}
                        onChange={(e) => handleSelectProduct(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] font-medium text-slate-800"
                      >
                        <option value="">-- Elige un producto del catálogo --</option>
                        {productList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — S/ {Number(p.price).toFixed(2)} ({p.images?.length || 0} fotos)
                          </option>
                        ))}
                      </select>

                      {(() => {
                        const sel = productList.find((p) => p.id === formData.productId);
                        if (!sel) return null;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
                            <div className="flex -space-x-2 overflow-hidden shrink-0">
                              {sel.images?.slice(0, 4).map((img: any, idx: number) => (
                                <img
                                  key={idx}
                                  src={img.url}
                                  alt=""
                                  className="inline-block h-10 w-10 rounded-lg object-cover ring-2 ring-white shadow-xs"
                                />
                              ))}
                            </div>
                            <div className="text-xs min-w-0">
                              <span className="font-bold text-slate-800 block truncate">{sel.name}</span>
                              <span className="text-[11px] text-emerald-600 font-semibold">
                                S/ {Number(sel.price).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                ✨ {sel.images?.length || 0} fotos • Se activará el carrusel interactivo en la portada
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 pt-1">
                      💡 En modo <strong>Anuncio / Evento</strong>, puedes subir una foto libre de tu afiche, fecha de evento o anuncio especial con su propio enlace.
                    </p>
                  )}
                </div>
              )}

              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Principal *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={
                    formData.type === 'announcement'
                      ? 'Ej. ✨ Ediciones con propósito · Dedicatoria & personalización'
                      : 'Ej. Papelería hecha a mano para atesorar momentos y regalar sonrisas.'
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                />
              </div>

              {formData.type !== 'announcement' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtítulo / Texto Descriptivo
                  </label>
                  <textarea
                    rows={2}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ej. Cada cuaderno y set de obsequio nace con una promesa: inspirar tu cotidianidad..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                  />
                </div>
              )}

              {/* Image Upload for Hero / Promotional */}
              {formData.type !== 'announcement' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
                    <ImageIcon className="w-4 h-4" />
                    Imagen del Banner / Portada
                  </div>
                  {formData.type === 'hero' && (
                    <p className="text-[11px] text-slate-500">
                      📸 <strong>¿Dónde va?</strong> Es la foto grande que aparece en la tarjeta del <strong>lado derecho</strong> de la portada principal (al costado del texto).
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-20 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                        Sin imagen
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-purple-50 text-[#9A80BD] text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Subiendo...' : 'Subir Imagen desde tu dispositivo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="O escribe una URL (ej. /images/libreta3.png)"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Link & Action Button (for Hero & Promotional) */}
              {formData.type !== 'announcement' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      placeholder="Ej. Explorar Catálogo"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enlace de Destino (Link)
                    </label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      placeholder="Ej. #catalogo o /campana/navidad"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Position, Order, Active Status */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Posición
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9A80BD]"
                  >
                    <option value="top">Arriba (Top)</option>
                    <option value="middle">Medio (Middle)</option>
                    <option value="bottom">Abajo (Bottom / Footer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado
                  </label>
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                    />
                    <span className="text-xs font-bold text-slate-700">Activo</span>
                  </label>
                </div>
              </div>

              {/* Modal footer buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {editingBanner ? 'Guardar Cambios' : 'Crear Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

