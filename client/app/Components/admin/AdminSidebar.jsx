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
  // Determine the initial to display
  const displayInitial = admin?.username?.charAt(0).toUpperCase() || 'A';

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
              // ... inside the menuItems.map function
              <button
                onClick={() => { setActiveTab(item.id); onClose(); }}
                style={isActive ? {
                  backgroundColor: '#1f2937', // This is the hex for Tailwind's gray-800
                  color: '#ffffff',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                  transform: 'scale(1.02)',
                } : {}}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none ${
                  !isActive
                    ? 'text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-800 active:bg-cream-200'
                    : ''
                }`}
              >
                    <Icon
                      size={20}
                      style={{ color: isActive ? '#ffffff' : undefined }}
                      className={!isActive ? 'text-charcoal-600' : ''}
                    />
                    <span
                      style={{ color: isActive ? '#ffffff' : undefined }}
                      className={`font-medium text-sm ${!isActive ? 'text-charcoal-700' : ''}`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <div style={{ marginLeft: 'auto', width: 6, height: 6, background: '#f9a8d4', borderRadius: '50%' }} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-taupe-200 bg-white">
          <div className="flex items-center gap-3 px-2">
            {/* MATCHED SCREENSHOT STYLE: Blue rounded square icon */}
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
              {displayInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-charcoal-900 truncate">
                {admin?.username || 'Admin'}
              </p>
              <p className="text-xs text-taupe-500 truncate">
                {admin?.email || 'admin@adornstep.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}