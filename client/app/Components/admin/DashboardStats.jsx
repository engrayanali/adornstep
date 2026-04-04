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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-taupe-200 shadow-card p-6 animate-pulse">
            <div className="h-24 bg-cream-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl border ${stat.borderColor} shadow-card hover:shadow-product transition-all duration-300 p-6 hover-lift`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-taupe-600 font-body mb-1">{stat.title}</p>
                <p className="text-3xl font-heading text-charcoal-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl border border-taupe-200 shadow-card p-6">
        <h3 className="text-xl font-heading text-charcoal-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'products' }))}
            className="group p-5 border-2 border-taupe-200 rounded-lg hover:border-charcoal-300 hover:bg-cream-50 transition-all duration-300 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-800 mb-1">Add New Product</h4>
                <p className="text-sm text-taupe-600">Create a new product listing</p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'banners' }))}
            className="group p-5 border-2 border-taupe-200 rounded-lg hover:border-charcoal-300 hover:bg-cream-50 transition-all duration-300 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-800 mb-1">Manage Banners</h4>
                <p className="text-sm text-taupe-600">Update hero banner images</p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'orders' }))}
            className="group p-5 border-2 border-taupe-200 rounded-lg hover:border-charcoal-300 hover:bg-cream-50 transition-all duration-300 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-800 mb-1">View Orders</h4>
                <p className="text-sm text-taupe-600">Process pending orders</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl border border-taupe-200 shadow-card p-6">
        <h3 className="text-xl font-heading text-charcoal-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="text-sm text-charcoal-700">System running smoothly</p>
            <span className="text-xs text-taupe-500 ml-auto">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-charcoal-700">Dashboard loaded successfully</p>
            <span className="text-xs text-taupe-500 ml-auto">1 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
