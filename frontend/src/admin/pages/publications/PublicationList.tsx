import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { Eye, EyeOff, Save, Check } from 'lucide-react';

export const PublicationList: React.FC = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/publications');
      if (res.success) setPublications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (pub: any) => {
    try {
      const res = await apiFetch(`/admin/publications/${pub.id}`, {
        method: 'PUT',
        body: JSON.stringify(pub),
      });
      if (res.success) {
        setSavedId(pub.id);
        setTimeout(() => setSavedId(null), 2000);
      }
    } catch (err) {
      alert('Error al guardar publicación');
    }
  };

  const handleChange = (id: string, field: string, value: any) => {
    setPublications((prev) =>
      prev.map((pub) => (pub.id === id ? { ...pub, [field]: value } : pub))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 font-['Quicksand',sans-serif]">
          Control de Publicaciones del Catálogo
        </h2>
        <p className="text-xs text-slate-500">
          Personaliza los títulos públicos, orden de aparición y visibilidad sin alterar el maestro del producto.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Producto Maestro</th>
              <th className="py-3 px-4">Título Público (Override)</th>
              <th className="py-3 px-4">Subtítulo / Etiqueta Pública</th>
              <th className="py-3 px-4">Posición / Orden</th>
              <th className="py-3 px-4 text-center">Visible</th>
              <th className="py-3 px-4 text-center">Destacado</th>
              <th className="py-3 px-4 text-right">Guardar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {publications.map((pub) => (
              <tr key={pub.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800">{pub.product?.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{pub.product?.sku}</div>
                </td>

                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={pub.publicTitle || ''}
                    onChange={(e) => handleChange(pub.id, 'publicTitle', e.target.value)}
                    placeholder={pub.product?.name}
                    className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg w-48 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9A80BD]"
                  />
                </td>

                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={pub.publicDescription || ''}
                    onChange={(e) => handleChange(pub.id, 'publicDescription', e.target.value)}
                    placeholder="Subtítulo para el catálogo..."
                    className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg w-48 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9A80BD]"
                  />
                </td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={pub.order || 0}
                    onChange={(e) => handleChange(pub.id, 'order', Number(e.target.value))}
                    className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg w-16 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9A80BD]"
                  />
                </td>

                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={pub.visible}
                    onChange={(e) => handleChange(pub.id, 'visible', e.target.checked)}
                    className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                  />
                </td>

                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={pub.featured}
                    onChange={(e) => handleChange(pub.id, 'featured', e.target.checked)}
                    className="rounded text-[#9A80BD] focus:ring-[#9A80BD]"
                  />
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleUpdate(pub)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      savedId === pub.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-50 text-[#9A80BD] hover:bg-purple-100'
                    }`}
                  >
                    {savedId === pub.id ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {savedId === pub.id ? 'Guardado' : 'Guardar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
