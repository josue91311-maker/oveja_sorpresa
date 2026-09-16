import React, { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { ArrowLeft, Save, Eye, Upload, Trash2, Check } from 'lucide-react';

interface ProductFormProps {
  product?: any;
  categories: any[];
  onCancel: () => void;
  onSaved: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onCancel,
  onSaved,
}) => {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    price: product?.price || 35.00,
    previousPrice: product?.previousPrice || '',
    status: product?.status || 'active',
    published: product?.published ?? true,
    featured: product?.featured ?? false,
    isNew: product?.isNew ?? false,
    stock: product?.stock ?? 10,
  });

  const [images, setImages] = useState<any[]>(product?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      price: Number(formData.price),
      previousPrice: formData.previousPrice ? Number(formData.previousPrice) : null,
      stock: Number(formData.stock),
      categoryId: formData.categoryId || null,
    };

    try {
      if (isEditing) {
        await apiFetch(`/admin/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);
    if (product?.id) {
      body.append('productId', product.id);
    }

    try {
      const res = await apiFetch('/admin/images/upload', {
        method: 'POST',
        body,
      });
      if (res.success && res.data) {
        setImages((prev) => [...prev, res.data]);
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir imagen');
    }
  };

  const handleSetPrimary = async (imgId: string) => {
    try {
      await apiFetch(`/admin/images/${imgId}/primary`, { method: 'PATCH' });
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imgId,
        }))
      );
    } catch (err) {
      alert('Error al marcar imagen principal');
    }
  };

  const handleDeleteImage = async (imgId: string) => {
    try {
      await apiFetch(`/admin/images/${imgId}`, { method: 'DELETE' });
      setImages((prev) => prev.filter((img) => img.id !== imgId));
    } catch (err) {
      alert('Error al eliminar imagen');
    }
  };

  const primaryImage = images.find((i) => i.isPrimary) || images[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </button>
        <h2 className="text-lg font-bold text-slate-800 font-['Quicksand',sans-serif]">
          {isEditing ? `Editar: ${product.name}` : 'Nuevo Producto'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              Datos Generales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Cuaderno Floral A5 'Deléitate'"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Código / SKU *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ej. CUAD-FLOR-01"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Corta</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Breve frase que acompaña al producto en el catálogo"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Completa</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalles sobre hojas, anillado, versículo y dedicatoria..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
              >
                <option value="">Selecciona una categoría...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
              Precios y Existencias
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Base (S/ Soles) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Anterior / Tachado (S/)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.previousPrice}
                  onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value })}
                  placeholder="Opcional"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Disponible *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                />
                <span className="font-semibold text-slate-700">Publicado en catálogo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                />
                <span className="font-semibold text-slate-700">Producto Destacado ⭐</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                />
                <span className="font-semibold text-slate-700">Etiqueta "Nuevo Ingreso"</span>
              </label>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A80BD]">
                Galería de Imágenes
              </h3>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-[#9A80BD] hover:bg-purple-100 text-xs font-bold rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Subir Imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group border border-slate-200 rounded-xl overflow-hidden aspect-square bg-slate-50">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-1.5 left-1.5 bg-[#9A80BD] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      Principal
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="p-1.5 bg-white text-slate-700 rounded-lg text-[10px] font-bold hover:bg-purple-50"
                        title="Marcar como principal"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No hay imágenes subidas aún. Sube al menos una fotografía.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>

        {/* Live Catalog Preview Column (Requirement 24: Preview!) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-6 bg-white p-5 rounded-3xl border border-purple-100 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#9A80BD] uppercase tracking-wider pb-2 border-b border-slate-100">
              <Eye className="w-4 h-4" />
              Vista Previa en Catálogo
            </div>

            {/* Rendered exact Stitch-style Product Card */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100/80 shadow-xs space-y-3">
              <div className="relative overflow-hidden rounded-xl aspect-[4/4.8] bg-purple-50/40">
                <img
                  src={primaryImage?.url || '/images/LOGO.jpg'}
                  alt={formData.name}
                  className="w-full h-full object-cover object-center"
                />
                {formData.featured && (
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#7D60A6] border border-purple-200/60 shadow-xs">
                    ⭐ Destacado
                  </span>
                )}
                {formData.isNew && (
                  <span className="absolute top-2.5 right-2.5 bg-[#F472B6] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs">
                    Nuevo
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm text-[#2D2235] font-['Quicksand',sans-serif] leading-tight line-clamp-1">
                    {formData.name || 'Título del Producto'}
                  </h4>
                  <span className="font-bold text-xs text-[#7D60A6] whitespace-nowrap ml-2">
                    S/ {Number(formData.price || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {formData.shortDescription || 'Descripción breve del producto para la vitrina.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2 bg-[#9A80BD] text-white rounded-xl text-[11px] font-bold tracking-wide shadow-xs"
                  >
                    Añadir a mi pedido
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Esta es una representación exacta de cómo los visitantes verán el producto en la web pública de Ovejita Sorpresas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
