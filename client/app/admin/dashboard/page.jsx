'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import AdminSidebar from '../../Components/admin/AdminSidebar';
import DashboardStats from '../../Components/admin/DashboardStats';
import ProductsManager from '../../Components/admin/ProductsManager';
import CategoriesManager from '../../Components/admin/CategoriesManager';
import BannersManager from '../../Components/admin/BannersManager';
import OrdersManager from '../../Components/admin/OrdersManager';
import LifestyleManager from '../../Components/admin/LifestyleManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      console.log('[Dashboard] Checking auth, token exists:', !!token);
      
      if (!token) {
        console.log('[Dashboard] No token found, redirecting to login');
        router.push('/admin');
        return;
      }

      try {
        console.log('[Dashboard] Verifying token...');
        const adminData = await api.verifyToken();
        console.log('[Dashboard] Token verified, admin:', adminData);
        setAdmin(adminData);
      } catch (error) {
        console.error('[Dashboard] Token verification failed:', error);
        localStorage.removeItem('admin_token');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for tab switch events from quick actions
    const handleTabSwitch = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('switchAdminTab', handleTabSwitch);
    return () => window.removeEventListener('switchAdminTab', handleTabSwitch);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 animate-pulse">
            <img 
              src="/logo.png" 
              alt="Adorn Steps" 
              className="h-24 md:h-32 w-auto mx-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="mt-6 text-taupe-600 font-body">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        admin={admin}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-soft border-b border-taupe-200 sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading text-charcoal-800">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'products' && 'Products Management'}
                {activeTab === 'categories' && 'Categories Management'}
                {activeTab === 'banners' && 'Hero Banners'}
                {activeTab === 'orders' && 'Orders Management'}
                {activeTab === 'lifestyle' && 'Lifestyle Sections'}
              </h1>
              <p className="text-sm text-taupe-600 mt-1">
                {activeTab === 'dashboard' && 'Monitor your store performance'}
                {activeTab === 'products' && 'Manage your product catalog'}
                {activeTab === 'categories' && 'Organize your collections'}
                {activeTab === 'banners' && 'Customize homepage banners'}
                {activeTab === 'orders' && 'Track and fulfill orders'}
                {activeTab === 'lifestyle' && 'Manage Shop by Style & Live Beautifully sections'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-taupe-500">Signed in as</p>
                <p className="text-sm font-medium text-charcoal-800">{admin?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-cream-100 hover:bg-taupe-200 text-charcoal-700 rounded-lg transition-all font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardStats />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'banners' && <BannersManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'lifestyle' && <LifestyleManager />}
        </div>
      </div>
    </div>
  );
}
