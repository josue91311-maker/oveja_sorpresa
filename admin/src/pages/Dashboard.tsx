import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { Package, Layers, Sparkles, Eye, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export const Dashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    activeCampaigns: 0,
    featuredProducts: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [prodRes, catRes, campRes] = await Promise.all([
        apiFetch('/admin/products').catch(() => ({ success: false, data: [] })),
        apiFetch('/admin/categories').catch(() => ({ success: false, data: [] })),
        apiFetch('/admin/campaigns').catch(() => ({ success: false, data: [] })),
      ]);

      const products = prodRes.data || [];
      const categories = catRes.data || [];
      const campaigns = campRes.data || [];

      setStats({
        totalProducts: products.length,
        publishedProducts: products.filter((p: any) => p.published).length,
        featuredProducts: products.filter((p: any) => p.featured).length,
        totalCategories: categories.length,
        activeCampaigns: campaigns.filter((c: any) => c.status === 'active').length,
      });
      setRecentProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      subtitle: `${stats.publishedProducts} publicados`,
      icon: Package,
      color: 'bg-purple-50 text-[#9A80BD]',
      tab: 'products',
    },
    {
      title: 'Categorías Activas',
      value: stats.totalCategories,
      subtitle: 'En catálogo',
      icon: Layers,
      color: 'bg-pink-50 text-[#F472B6]',
      tab: 'categories',
    },
    {
      title: 'Campañas Activas',
      value: stats.activeCampaigns,
      subtitle: 'Promociones vigentes',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600',
      tab: 'campaigns',
    },
    {
      title: 'Destacados Catálogo',
      value: stats.featuredProducts,
      subtitle: 'Con insignia especial',
      icon: Eye,
      color: 'bg-emerald-50 text-emerald-600',
      tab: 'publications',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#9A80BD] to-[#7D60A6] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-purple-200">
            Centro de Control
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Quicksand',sans-serif]">
            ¡Bienvenido al Atelier de Ovejita Sorpresas! 🌸
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 font-light leading-relaxed">
            Desde este panel puedes controlar el catálogo en tiempo real: productos, fotografías, precios, descuentos y el número de WhatsApp.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.tab)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-500">{card.title}</span>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                <span className="text-[10px] text-slate-400 block">{card.subtitle}</span>
              </div>
              <div className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Productos Recientes</h3>
            <p className="text-xs text-slate-400">Últimos artículos registrados en el maestro</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[#9A80BD] hover:underline"
          >
            Ver todos →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 font-semibold">Producto</th>
                <th className="pb-3 font-semibold">SKU</th>
                <th className="pb-3 font-semibold">Precio Base</th>
                <th className="pb-3 font-semibold">Precio Final</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-semibold text-slate-800 flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url || '/images/LOGO.jpg'}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                    />
                    <span>{p.name}</span>
                  </td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{p.sku}</td>
                  <td className="py-3 text-slate-500">S/ {Number(p.price).toFixed(2)}</td>
                  <td className="py-3 font-bold text-[#9A80BD]">
                    S/ {Number(p.finalPrice).toFixed(2)}
                  </td>
                  <td className="py-3 text-slate-600">{p.stock} unid.</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.published
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {p.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
