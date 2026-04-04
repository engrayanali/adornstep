'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingBag, TrendingUp, BadgeDollarSign } from 'lucide-react';
import api from '../../lib/api';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, orders] = await Promise.all([
        api.getProducts({ limit: 1000 }),
        api.getOrders({ limit: 1000 }),
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const newOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        newOrders,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Revenue',
      value: `Rs ${stats.totalRevenue.toFixed(2)}`,
      icon: BadgeDollarSign,
      iconColor: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
    },
    {
      title: 'New Orders',
      value: stats.newOrders,
      icon: TrendingUp,
      iconColor: 'text-blush-600',
      bgColor: 'bg-gradient-to-br from-blush-50 to-blush-100',
      borderColor: 'border-blush-200',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-taupe-200 shadow-card p-5 sm:p-6 animate-pulse">
            <div className="h-20 sm:h-24 bg-cream-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl sm:rounded-2xl border ${stat.borderColor} shadow-card hover:shadow-product transition-all duration-300 p-5 sm:p-6 hover-lift group`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-cream-50 to-taupe-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-taupe-400 rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-taupe-600 font-body mb-1 uppercase tracking-wide">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-heading text-charcoal-800 font-bold truncate">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl border border-taupe-200 shadow-card p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-heading text-charcoal-800 mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'products' }))}
            className="group p-4 sm:p-5 border-2 border-taupe-200 rounded-xl hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300 text-left hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-charcoal-800 mb-1 text-sm sm:text-base">Add New Product</h4>
                <p className="text-xs sm:text-sm text-taupe-600">Create a new product listing</p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'banners' }))}
            className="group p-4 sm:p-5 border-2 border-taupe-200 rounded-xl hover:border-amber-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-white transition-all duration-300 text-left hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-charcoal-800 mb-1 text-sm sm:text-base">Manage Banners</h4>
                <p className="text-xs sm:text-sm text-taupe-600">Update hero banner images</p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'orders' }))}
            className="group p-4 sm:p-5 border-2 border-taupe-200 rounded-xl hover:border-emerald-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white transition-all duration-300 text-left hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-charcoal-800 mb-1 text-sm sm:text-base">View Orders</h4>
                <p className="text-xs sm:text-sm text-taupe-600">Process pending orders</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl border border-taupe-200 shadow-card p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-heading text-charcoal-800 mb-4">Recent Activity</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-cream-50 rounded-lg sm:rounded-xl border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
            <p className="text-sm text-charcoal-700 flex-1 min-w-0 truncate">System running smoothly</p>
            <span className="text-xs text-taupe-500 flex-shrink-0">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cream-50 rounded-lg sm:rounded-xl border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <p className="text-sm text-charcoal-700 flex-1 min-w-0 truncate">Dashboard loaded successfully</p>
            <span className="text-xs text-taupe-500 flex-shrink-0">1m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
