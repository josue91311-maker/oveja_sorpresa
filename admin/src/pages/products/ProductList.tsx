import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Star,
  Upload,
  ExternalLink,
  Check,
} from 'lucide-react';
import { ProductForm } from './ProductForm';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchCategoryId, setBatchCategoryId] = useState<string>('');
  const [movingBatch, setMovingBatch] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch('/admin/products').catch(() => ({ success: false, data: [] })),
        apiFetch('/admin/categories').catch(() => ({ success: false, data: [] })),
      ]);
      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickChangeCategory = async (productId: string, newCategoryId: string) => {
    try {
      const res = await apiFetch(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ categoryId: newCategoryId || null }),
      });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  categoryId: newCategoryId || null,
                  category: categories.find((c) => c.id === newCategoryId) || null,
                }
              : p
          )
        );
      }
    } catch (err) {
      alert('Error al transferir producto de catálogo');
    }
  };

  const handleBatchMoveCategory = async () => {
    if (!batchCategoryId || selectedIds.length === 0) return;
    setMovingBatch(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          apiFetch(`/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ categoryId: batchCategoryId }),
          })
        )
      );
      setSelectedIds([]);
      setBatchCategoryId('');
      await loadData();
    } catch (err) {
      alert('Error al mover productos seleccionados');
    } finally {
      setMovingBatch(false);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await apiFetch(`/admin/products/${id}/publish`, { method: 'PATCH' });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: res.data.published } : p))
        );
      }
    } catch (err) {
      alert('Error al cambiar publicación');
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      const res = await apiFetch(`/admin/products/${id}/feature`, { method: 'PATCH' });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: res.data.featured } : p))
        );
      }
    } catch (err) {
      alert('Error al cambiar destacado');
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!confirm('¿Deseas duplicar este producto?')) return;
    try {
      const res = await apiFetch(`/admin/products/${id}/duplicate`, { method: 'POST' });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert('Error al duplicar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      const res = await apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', productId);

    try {
      const res = await apiFetch('/admin/images/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Error al subir imagen');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? p.categoryId === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (isCreating || editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        categories={categories}
        onCancel={() => {
          setIsCreating(false);
          setEditingProduct(null);
        }}
        onSaved={() => {
          setIsCreating(false);
          setEditingProduct(null);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-['Quicksand',sans-serif]">
            Maestro de Productos
          </h2>
          <p className="text-xs text-slate-500">
            Administra precios, fotos, stock y la categoría base de cada producto. Para organizar productos en múltiples catálogos a la vez, usa la sección <span className="font-semibold text-[#9A80BD]">Campañas & Catálogos</span>.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Crear Producto
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9A80BD]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9A80BD]"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {filtered.length} productos
          </span>
        </div>
      </div>

      {/* Batch Move to Catalog Toolbar (Requirement 2: Fácil opción de pasar productos a los catálogos) */}
      {selectedIds.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9A80BD] animate-ping"></span>
            <span className="text-xs font-bold text-[#7D60A6]">
              {selectedIds.length} {selectedIds.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-600 whitespace-nowrap">Asignar categoría:</span>
            <select
              value={batchCategoryId}
              onChange={(e) => setBatchCategoryId(e.target.value)}
              className="text-xs py-2 px-3 bg-white border border-purple-200 rounded-xl font-medium focus:ring-2 focus:ring-[#9A80BD] focus:outline-none"
            >
              <option value="">Selecciona categoría destino...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  🏷️ {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleBatchMoveCategory}
              disabled={!batchCategoryId || movingBatch}
              className="px-4 py-2 bg-[#9A80BD] hover:bg-[#7D60A6] text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all shadow-xs shrink-0"
            >
              {movingBatch ? 'Asignando...' : 'Asignar a seleccionados'}
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filtered.map((p) => p.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                    title="Seleccionar todos"
                  />
                </th>
                <th className="py-3 px-3">Foto</th>
                <th className="py-3 px-4">Producto & SKU</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio Base</th>
                <th className="py-3 px-4">Precio Final</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Publicado</th>
                <th className="py-3 px-4 text-center">Destacado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const primaryImg = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];
                const isChecked = selectedIds.includes(p.id);
                return (
                  <tr key={p.id} className={`hover:bg-slate-50/70 transition-colors ${isChecked ? 'bg-purple-50/20' : ''}`}>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            isChecked ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                          );
                        }}
                        className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <div className="relative group/thumb w-11 h-11">
                        <img
                          src={primaryImg?.url || '/images/LOGO.jpg'}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-xs"
                        />
                        <label
                          htmlFor={`img-upload-${p.id}`}
                          className="absolute inset-0 bg-black/50 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 cursor-pointer transition-opacity"
                          title="Subir nueva foto"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </label>
                        <input
                          id={`img-upload-${p.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, p.id)}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                    </td>

                    {/* Quick Category Move Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={p.categoryId || ''}
                        onChange={(e) => handleQuickChangeCategory(p.id, e.target.value)}
                        className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-[#9A80BD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9A80BD] cursor-pointer transition-colors max-w-[180px] font-medium text-slate-700 truncate"
                        title="Cambiar categoría de este producto"
                      >
                        <option value="">📂 Sin categoría</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            📂 {c.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      S/ {Number(p.price).toFixed(2)}
                      {p.previousPrice && (
                        <span className="block text-[10px] line-through text-slate-400">
                          S/ {Number(p.previousPrice).toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#9A80BD]">
                      S/ {Number(p.finalPrice).toFixed(2)}
                      {p.discountPercentage && (
                        <span className="inline-block ml-1 text-[9.5px] px-1.5 py-0.2 bg-pink-100 text-pink-700 rounded font-bold">
                          -{p.discountPercentage}%
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock > 0 ? 'text-slate-700' : 'text-rose-500'
                        }`}
                      >
                        {p.stock} unid.
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(p.id)}
                        title={p.published ? 'Clic para despublicar' : 'Clic para publicar'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.published
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeature(p.id)}
                        title={p.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.featured
                            ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-300 hover:text-amber-500'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(p)}
                          title="Editar producto"
                          className="p-1.5 text-slate-500 hover:text-[#9A80BD] hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          title="Duplicar producto"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Eliminar producto"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
