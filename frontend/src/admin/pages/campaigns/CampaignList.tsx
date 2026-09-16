import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  Plus,
  Trash2,
  Edit2,
  Share2,
  ExternalLink,
  Check,
  X,
  Palette,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Boxes,
  Search,
  Filter,
  Package,
  ArrowRight,
  FolderCheck,
} from 'lucide-react';

export const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'design' | 'products'>('products');
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Filters for "Jalar y Poner" left inventory panel
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('');

  const initialForm = {
    name: '',
    description: '',
    bannerUrl: '',
    priority: 10,
    productIds: [] as string[],
    categoryIds: [] as string[],
    themeConfig: {
      primaryColor: '#9A80BD',
      secondaryColor: '#F472B6',
      backgroundColor: '#FAF7FC',
      textColor: '#2D2235',
      announcementText: '',
      whatsappMessage: '',
      badgeText: 'Catálogo de Temporada',
    },
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campRes, prodRes, catRes] = await Promise.all([
        apiFetch('/admin/campaigns').catch(() => ({ success: false, data: [] })),
        apiFetch('/admin/products').catch(() => ({ success: false, data: [] })),
        apiFetch('/admin/categories').catch(() => ({ success: false, data: [] })),
      ]);
      if (campRes.success) setCampaigns(campRes.data || []);
      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (c: any) => {
    const newStatus = c.status === 'active' ? 'draft' : 'active';
    try {
      await apiFetch(`/admin/campaigns/${c.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      alert('Error al actualizar campaña');
    }
  };

  const handleCopyLink = (c: any) => {
    const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321';
    const url = `${frontendUrl}/campana/${c.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openCreateModal = (tab: 'design' | 'products' = 'design') => {
    setEditingCampaign(null);
    setFormData(initialForm);
    setModalTab(tab);
    setInventorySearch('');
    setInventoryCategory('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: any, tab: 'design' | 'products' = 'design') => {
    setEditingCampaign(c);
    const cfg = c.themeConfig || {};
    setFormData({
      name: c.name,
      description: c.description || '',
      bannerUrl: c.bannerUrl || '',
      priority: c.priority || 10,
      productIds: c.products?.map((p: any) => p.id) || [],
      categoryIds: c.categoryIds || c.categories?.map((cat: any) => cat.id) || [],
      themeConfig: {
        primaryColor: cfg.primaryColor || '#9A80BD',
        secondaryColor: cfg.secondaryColor || '#F472B6',
        backgroundColor: cfg.backgroundColor || '#FAF7FC',
        textColor: cfg.textColor || '#2D2235',
        announcementText: cfg.announcementText || '',
        whatsappMessage: cfg.whatsappMessage || '',
        badgeText: cfg.badgeText || 'Catálogo de Temporada',
      },
    });
    setModalTab(tab);
    setInventorySearch('');
    setInventoryCategory('');
    setIsModalOpen(true);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
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
          bannerUrl: res.data.url,
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir la imagen');
    } finally {
      setUploadingBanner(false);
    }
  };

  const setPresetPalette = (primary: string, secondary: string, bg: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      themeConfig: {
        ...prev.themeConfig,
        primaryColor: primary,
        secondaryColor: secondary,
        backgroundColor: bg,
        textColor: text,
      },
    }));
  };

  // Product management actions ("Jalar y Poner")
  const addProductToCatalog = (productId: string) => {
    setFormData((prev) => {
      if (prev.productIds.includes(productId)) return prev;
      return {
        ...prev,
        productIds: [...prev.productIds, productId],
      };
    });
  };

  const removeProductFromCatalog = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((id) => id !== productId),
    }));
  };

  const addAllFilteredToCatalog = (ids: string[]) => {
    setFormData((prev) => {
      const set = new Set([...prev.productIds, ...ids]);
      return {
        ...prev,
        productIds: Array.from(set),
      };
    });
  };

  const clearCatalogProducts = () => {
    if (!confirm('¿Deseas quitar todos los productos de este catálogo? (Nota: Sus categorías originales no se verán afectadas)')) return;
    setFormData((prev) => ({
      ...prev,
      productIds: [],
    }));
  };

  const toggleCategorySelection = (id: string) => {
    setFormData((prev) => {
      const exists = prev.categoryIds.includes(id);
      return {
        ...prev,
        categoryIds: exists ? prev.categoryIds.filter((cid) => cid !== id) : [...prev.categoryIds, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await apiFetch(`/admin/campaigns/${editingCampaign.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/admin/campaigns', {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            status: 'active',
          }),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al guardar catálogo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este catálogo temático?')) return;
    try {
      await apiFetch(`/admin/campaigns/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Error al eliminar catálogo');
    }
  };

  // Filter available products for left inventory panel
  const filteredAvailableProducts = products.filter((p) => {
    const matchesSearch =
      inventorySearch === '' ||
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(inventorySearch.toLowerCase()));
    const matchesCategory = inventoryCategory === '' || p.categoryId === inventoryCategory;
    return matchesSearch && matchesCategory;
  });

  // Selected products for right catalog panel
  const catalogProductsList = formData.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-['Quicksand',sans-serif]">
            Campañas & Catálogos Temáticos
          </h2>
          <p className="text-xs text-slate-500">
            Crea colecciones independientes para compartir por enlace. Un mismo producto puede pertenecer a varios catálogos a la vez sin cambiar su categoría.
          </p>
        </div>
        <button
          onClick={() => openCreateModal('design')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Campaña / Catálogo
        </button>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => {
          const cfg = c.themeConfig || {};
          const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campana/${c.slug}`;
          const primaryColor = cfg.primaryColor || '#9A80BD';
          const bgColor = cfg.backgroundColor || '#FAF7FC';
          const productCount = c.products?.length || 0;

          return (
            <div
              key={c.id}
              className="rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              style={{ backgroundColor: bgColor }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {cfg.badgeText || 'Catálogo de Temporada'}
                  </span>

                  <span className="text-[11px] font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-full border border-black/5">
                    Prioridad: {c.priority}
                  </span>
                </div>

                {c.bannerUrl && (
                  <div className="h-32 rounded-2xl overflow-hidden shadow-2xs border border-black/5">
                    <img src={c.bannerUrl} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-base text-slate-800 font-['Quicksand',sans-serif]">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {c.description || 'Catálogo exclusivo con dedicatoria y detalles preparados con amor.'}
                  </p>
                </div>

                {/* Products Count Indicator */}
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 text-[#7D60A6] rounded-lg">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {productCount} {productCount === 1 ? 'producto incluido' : 'productos incluidos'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {c.categories?.length ? `+ ${c.categories.length} categorías completas` : 'Colección personalizada'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openEditModal(c, 'products')}
                    className="text-[11px] font-bold text-[#7D60A6] hover:text-[#5c4083] flex items-center gap-1"
                  >
                    <span>Jalar / Quitar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* WhatsApp Link Box */}
                <div className="p-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-black/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      Enlace para WhatsApp:
                    </span>
                    <button
                      onClick={() => handleCopyLink(c)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7D60A6] hover:text-[#5c4083] shrink-0"
                    >
                      {copiedId === c.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-black/5 truncate select-all">
                    {publicUrl}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      c.status === 'active'
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                  >
                    {c.status === 'active' ? 'Pausar' : 'Activar'}
                  </button>

                  <button
                    onClick={() => openEditModal(c, 'products')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#7D60A6] bg-white hover:bg-purple-50 border border-purple-200 rounded-xl transition-colors shadow-2xs"
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    Jalar Productos ({productCount})
                  </button>

                  <button
                    onClick={() => openEditModal(c, 'design')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-black/10 rounded-xl transition-colors shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Diseño
                  </button>

                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-black/10 rounded-xl transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Eliminar catálogo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Customization Modal with Tabs */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800 font-['Quicksand',sans-serif]">
                  {editingCampaign ? `Catálogo: ${editingCampaign.name}` : 'Crear Nuevo Catálogo Temático'}
                </h3>
                <p className="text-xs text-slate-500">
                  Organiza qué productos contiene este catálogo y personaliza su portada y colores.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 gap-6">
              <button
                type="button"
                onClick={() => setModalTab('products')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  modalTab === 'products'
                    ? 'border-[#9A80BD] text-[#7D60A6]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>1. Jalar y Poner Productos</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-[#7D60A6] font-bold">
                  {formData.productIds.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('design')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  modalTab === 'design'
                    ? 'border-[#9A80BD] text-[#7D60A6]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>2. Portada, Textos & Colores</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* TAB 1: JALAR Y PONER PRODUCTOS */}
              {modalTab === 'products' && (
                <div className="space-y-4">
                  {/* Informative Explanation Banner */}
                  <div className="bg-purple-50/80 border border-purple-200 p-4 rounded-2xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#9A80BD] shrink-0 mt-0.5" />
                    <div className="text-xs text-purple-950 space-y-1">
                      <p className="font-bold">
                        Organizador Visual: Jalar y Poner Productos al Catálogo
                      </p>
                      <p className="text-[11px] text-purple-900 leading-relaxed">
                        Cada producto tiene su propia <strong>Categoría</strong> (ej. Libretas, Kits, etc.). 
                        Aquí puedes <strong>jalar el mismo producto a múltiples catálogos</strong> (ej. añadir un cuaderno a Navidad, Día de la Madre y Libretas). 
                        Agregar un producto a este catálogo <em>nunca cambia ni afecta su categoría original</em>.
                      </p>
                    </div>
                  </div>

                  {/* Dual-Panel Selector */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Panel: Available Inventory */}
                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span>📦 Inventario General</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({filteredAvailableProducts.length} disponibles)
                            </span>
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            Haz clic en <strong>➕ Jalar</strong> para agregar al catálogo
                          </span>
                        </div>

                        {filteredAvailableProducts.length > 0 && (
                          <button
                            type="button"
                            onClick={() => addAllFilteredToCatalog(filteredAvailableProducts.map((p) => p.id))}
                            className="px-2.5 py-1 bg-white hover:bg-purple-50 text-[#7D60A6] border border-purple-200 rounded-lg text-[10px] font-bold transition-colors shadow-2xs"
                          >
                            ➕ Jalar todos ({filteredAvailableProducts.length})
                          </button>
                        )}
                      </div>

                      {/* Filters: Search + Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Buscar producto o SKU..."
                            value={inventorySearch}
                            onChange={(e) => setInventorySearch(e.target.value)}
                            className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9A80BD]"
                          />
                        </div>

                        <select
                          value={inventoryCategory}
                          onChange={(e) => setInventoryCategory(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9A80BD]"
                        >
                          <option value="">Todas las categorías</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              📂 {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Products List */}
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {filteredAvailableProducts.map((p) => {
                          const isAlreadyInCatalog = formData.productIds.includes(p.id);
                          const productCategory = categories.find((c) => c.id === p.categoryId);
                          const imgUrl = p.images?.[0]?.url || '/images/LOGO.jpg';

                          return (
                            <div
                              key={p.id}
                              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                isAlreadyInCatalog
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-white border-slate-200 hover:border-[#9A80BD] shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={imgUrl}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0 space-y-0.5">
                                  <h5 className="text-xs font-bold text-slate-800 truncate">
                                    {p.name}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[10px]">
                                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                                      📂 {productCategory?.name || 'Sin categoría'}
                                    </span>
                                    <span className="font-mono text-slate-400">
                                      S/ {Number(p.finalPrice || p.price).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {isAlreadyInCatalog ? (
                                <span className="px-2.5 py-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-100/60 rounded-lg flex items-center gap-1 shrink-0">
                                  <Check className="w-3 h-3" />
                                  <span>En catálogo</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addProductToCatalog(p.id)}
                                  className="px-3 py-1.5 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 shadow-2xs"
                                >
                                  <span>➕ Jalar</span>
                                </button>
                              )}
                            </div>
                          );
                        })}

                        {filteredAvailableProducts.length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-400">
                            No se encontraron productos con estos filtros.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Products in this Catalog */}
                    <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-200/80 space-y-3 flex flex-col">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#7D60A6] flex items-center gap-1.5">
                            <span>✨ Productos en este Catálogo</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 font-bold">
                              {formData.productIds.length}
                            </span>
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            Estos productos se mostrarán a tus clientes en este link
                          </span>
                        </div>

                        {formData.productIds.length > 0 && (
                          <button
                            type="button"
                            onClick={clearCatalogProducts}
                            className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
                          >
                            Vaciar catálogo
                          </button>
                        )}
                      </div>

                      {/* Selected Items List */}
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {catalogProductsList.map((p: any) => {
                          const productCategory = categories.find((c) => c.id === p.categoryId);
                          const imgUrl = p.images?.[0]?.url || '/images/LOGO.jpg';

                          return (
                            <div
                              key={p.id}
                              className="p-2.5 bg-white rounded-xl border border-purple-100 shadow-2xs flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={imgUrl}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0 space-y-0.5">
                                  <h5 className="text-xs font-bold text-slate-800 truncate">
                                    {p.name}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[10px]">
                                    <span className="px-1.5 py-0.2 rounded bg-purple-50 text-[#7D60A6] font-medium">
                                      📂 {productCategory?.name || 'Sin categoría'}
                                    </span>
                                    <span className="font-mono text-[#7D60A6] font-bold">
                                      S/ {Number(p.finalPrice || p.price).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeProductFromCatalog(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                title="Quitar de este catálogo"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}

                        {formData.productIds.length === 0 && (
                          <div className="h-64 border-2 border-dashed border-purple-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                            <Package className="w-10 h-10 text-purple-300" />
                            <p className="text-xs font-bold text-slate-600">
                              Catálogo aún sin productos asignados
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-xs">
                              Usa el panel de la izquierda para jalar productos desde tu inventario general hacia este catálogo.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category Bulk Inclusion Shortcut */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <FolderCheck className="w-4 h-4 text-[#9A80BD]" />
                          Atajo: Incluir todos los productos de estas Categorías completas
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Si marcas una categoría, todos los productos que pertenezcan a ella se incluirán automáticamente en este catálogo.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#7D60A6] bg-purple-50 px-2 py-0.5 rounded-full">
                        {formData.categoryIds.length} categorías marcadas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                      {categories.map((cat) => {
                        const isChecked = formData.categoryIds.includes(cat.id);
                        const catProductCount = products.filter((p) => p.categoryId === cat.id).length;
                        return (
                          <label
                            key={cat.id}
                            className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all text-xs ${
                              isChecked
                                ? 'bg-white border-[#9A80BD] shadow-2xs text-[#7D60A6] font-bold'
                                : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCategorySelection(cat.id)}
                                className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                              />
                              <span className="truncate">{cat.name}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 shrink-0">
                              {catProductCount}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INFORMACIÓN, PORTADA & COLORES */}
              {modalTab === 'design' && (
                <div className="space-y-4">
                  {/* General Information */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nombre del Catálogo / Ocasión *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej. Especial Navidad, Día de la Madre, Regalos Amor & Amistad..."
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Prioridad
                        </label>
                        <input
                          type="number"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Descripción / Mensaje de Bienvenida del Catálogo
                      </label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Dedicatoria especial que describe esta colección para los clientes..."
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 🎨 Theme Colors for this Campaign */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
                      <Palette className="w-4 h-4" />
                      Colores Exclusivos de este Catálogo
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-600 block">Color Primario</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={formData.themeConfig.primaryColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, primaryColor: e.target.value },
                              })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                          />
                          <input
                            type="text"
                            value={formData.themeConfig.primaryColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, primaryColor: e.target.value },
                              })
                            }
                            className="w-full text-[11px] font-mono p-1 border border-slate-200 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-600 block">Color Acento</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={formData.themeConfig.secondaryColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, secondaryColor: e.target.value },
                              })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                          />
                          <input
                            type="text"
                            value={formData.themeConfig.secondaryColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, secondaryColor: e.target.value },
                              })
                            }
                            className="w-full text-[11px] font-mono p-1 border border-slate-200 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-600 block">Fondo del Catálogo</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={formData.themeConfig.backgroundColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, backgroundColor: e.target.value },
                              })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                          />
                          <input
                            type="text"
                            value={formData.themeConfig.backgroundColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, backgroundColor: e.target.value },
                              })
                            }
                            className="w-full text-[11px] font-mono p-1 border border-slate-200 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-600 block">Color Textos</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={formData.themeConfig.textColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, textColor: e.target.value },
                              })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                          />
                          <input
                            type="text"
                            value={formData.themeConfig.textColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeConfig: { ...formData.themeConfig, textColor: e.target.value },
                              })
                            }
                            className="w-full text-[11px] font-mono p-1 border border-slate-200 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preset Themes */}
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                        Paletas Rápidas para Temporadas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPresetPalette('#C53030', '#D69E2E', '#FFF5F5', '#1A202C')}
                          className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[11px] font-bold"
                        >
                          🎄 Navidad (Rojo & Oro)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetPalette('#D53F8C', '#F687B3', '#FDF2F8', '#2D2235')}
                          className="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-lg text-[11px] font-bold"
                        >
                          🌸 Día de la Madre (Rosa Pastel)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetPalette('#1E3A8A', '#3B82F6', '#F8FAFC', '#0F172A')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold"
                        >
                          👔 Día del Padre (Azul Marino)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetPalette('#9A80BD', '#F472B6', '#FAF7FC', '#2D2235')}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold"
                        >
                          🌿 Original Ovejita (Lavanda)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Banner / Header Image Upload */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
                      <ImageIcon className="w-4 h-4" />
                      Banner / Portada del Catálogo
                    </div>

                    <div className="flex items-center gap-4">
                      {formData.bannerUrl ? (
                        <img
                          src={formData.bannerUrl}
                          alt=""
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
                          <span>{uploadingBanner ? 'Subiendo...' : 'Subir Banner'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBannerUpload}
                            disabled={uploadingBanner}
                          />
                        </label>
                        <input
                          type="text"
                          value={formData.bannerUrl}
                          onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                          placeholder="O escribe la URL de la imagen (ej. /images/libreta3.png)"
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specific WhatsApp message & announcement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Aviso Superior Exclusivo de este Catálogo
                      </label>
                      <input
                        type="text"
                        value={formData.themeConfig.announcementText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            themeConfig: { ...formData.themeConfig, announcementText: e.target.value },
                          })
                        }
                        placeholder="Ej. ✨ Edición Navidad · Dedicatoria dorada gratis"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mensaje Inicial de WhatsApp para este Catálogo
                      </label>
                      <input
                        type="text"
                        value={formData.themeConfig.whatsappMessage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            themeConfig: { ...formData.themeConfig, whatsappMessage: e.target.value },
                          })
                        }
                        placeholder="Ej. Hola Ovejita, vi el catálogo navideño y quiero pedir..."
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal footer buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {formData.productIds.length} {formData.productIds.length === 1 ? 'producto en el catálogo' : 'productos en el catálogo'}
                </span>

                <div className="flex gap-2">
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
                    {editingCampaign ? 'Guardar Cambios del Catálogo' : 'Crear Catálogo'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
