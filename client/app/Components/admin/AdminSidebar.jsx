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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-taupe-200 shadow-soft z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-taupe-200 bg-gradient-to-br from-cream-50 to-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading text-charcoal-800">Adorn Steps</h2>
            <p className="text-xs text-taupe-600 mt-1 font-body">Administrative Panel</p>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-cream-100 active:bg-cream-200 text-charcoal-600 focus:outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); onClose(); }}
                    style={isActive ? { backgroundColor: '#1a1a2e', color: '#ffffff' } : {}}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none ${
                      isActive
                        ? 'shadow-md'
                        : 'text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-800 active:bg-cream-200'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      style={isActive ? { color: '#ffffff' } : {}}
                      className={!isActive ? 'text-charcoal-600' : ''}
                    />
                    <span 
                      style={isActive ? { color: '#ffffff' } : {}}
                      className={`font-medium text-sm ${!isActive ? 'text-charcoal-600' : ''}`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-taupe-200 bg-cream-50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-taupe-400 to-taupe-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal-800 truncate">{admin?.username}</p>
              <p className="text-xs text-taupe-600 truncate">{admin?.email || 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}