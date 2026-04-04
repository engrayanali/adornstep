'use client';

import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Image, 
  ShoppingCart,
  Sparkles,
  X
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'banners', label: 'Hero Banners', icon: Image },
  { id: 'lifestyle', label: 'Lifestyle Sections', icon: Sparkles },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
];

export default function AdminSidebar({ activeTab, setActiveTab, admin, onLogout, isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-taupe-200 shadow-xl z-40 transition-transform duration-300 ease-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Logo Section */}
        <div className="p-5 sm:p-6 border-b border-taupe-200 bg-gradient-to-br from-blush-50 via-cream-50 to-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-heading text-charcoal-800 truncate">Adorn Steps</h2>
              <p className="text-xs text-taupe-600 mt-1 font-body">Admin Panel</p>
            </div>
            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-cream-100 active:bg-cream-200 text-charcoal-700 focus:outline-none transition-all flex-shrink-0 ml-2"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 sm:p-4 pb-24">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); onClose(); }}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blush-400 focus:ring-offset-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-charcoal-800 to-charcoal-700 text-white shadow-lg transform scale-[1.02]'
                        : 'text-charcoal-600 hover:bg-gradient-to-r hover:from-cream-100 hover:to-blush-50 hover:text-charcoal-800 active:bg-cream-200'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={isActive ? 'text-white' : 'text-charcoal-600'}
                    />
                    <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-charcoal-700'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-blush-300 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-taupe-200 bg-gradient-to-b from-white to-cream-50 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blush-400 via-taupe-400 to-terracotta-500 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-charcoal-800 truncate">{admin?.username}</p>
              <p className="text-xs text-taupe-600 truncate">{admin?.email || 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}