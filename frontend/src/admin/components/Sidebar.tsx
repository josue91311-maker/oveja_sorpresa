import React from 'react';
import {
  Package,
  Layers,
  Sparkles,
  Settings,
  Eye,
  LogOut,
  LayoutDashboard,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: Layers },
    { id: 'campaigns', label: 'Campañas', icon: Sparkles },
    { id: 'publications', label: 'Catálogo / Publicación', icon: Eye },
    { id: 'banners', label: 'Banners & Hero', icon: ImageIcon },
    { id: 'settings', label: 'Configuración Negocio', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Logo and Brand */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <img src="/images/LOGO.jpg" alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
          <div>
            <h1 className="font-bold text-slate-800 text-sm font-['Quicksand',sans-serif]">Ovejita Sorpresas</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9A80BD]">Panel Admin</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#9A80BD] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User info & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 hover:text-[#9A80BD] hover:bg-purple-50 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Ver Catálogo Público
          </span>
          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Live</span>
        </a>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col truncate pr-2">
            <span className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Administrador'}</span>
            <span className="text-[10px] text-slate-400 truncate">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
