import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/products/ProductList';
import { CategoryList } from './pages/categories/CategoryList';
import { CampaignList } from './pages/campaigns/CampaignList';
import { PublicationList } from './pages/publications/PublicationList';
import { BannerList } from './pages/banners/BannerList';
import { CanvaCatalogManager } from './pages/canva/CanvaCatalogManager';
import { BusinessSettings } from './pages/settings/BusinessSettings';

const AdminLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#9A80BD] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Cargando Atelier...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
      <main className="flex-1 p-8 max-w-7xl overflow-y-auto">
        {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
        {currentTab === 'canva' && <CanvaCatalogManager />}
        {currentTab === 'products' && <ProductList />}
        {currentTab === 'categories' && <CategoryList />}
        {currentTab === 'campaigns' && <CampaignList />}
        {currentTab === 'publications' && <PublicationList />}
        {currentTab === 'banners' && <BannerList onNavigate={setCurrentTab} />}
        {currentTab === 'settings' && <BusinessSettings />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AdminLayout />
    </AuthProvider>
  );
};

export default App;
