'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Trash2, Truck, MapPin, CreditCard, User, ShoppingBag } from 'lucide-react';
import api from '../../lib/api';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders({ limit: 1000 });
      setOrders(data);
    } catch (error) { console.error('Error loading orders:', error); }
    finally { setLoading(false); }
  };

  // Logic: Karachi = 200, Others = 300
  const getShippingCharge = (order) => {
    const city = (order.shipping_city || '').toLowerCase();
    const address = (order.shipping_address || '').toLowerCase();
    return (city.includes('karachi') || address.includes('karachi')) ? 200 : 300;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      loadOrders();
    } catch (error) { alert('Error updating status'); }
  };

  const handleDelete = async (orderId, orderNumber) => {
    if (!confirm(`Delete order ${orderNumber}?`)) return;
    try {
      await api.deleteOrder(orderId);
      setShowModal(false);
      loadOrders();
    } catch (error) { alert('Error deleting order'); }
  };

  const statusColors = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    confirmed: { bg: '#dbeafe', text: '#1e40af' },
    shipped: { bg: '#ede9fe', text: '#5b21b6' },
    delivered: { bg: '#d1fae5', text: '#065f46' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Loading Orders...</div>;

  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Orders Manager</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{orders.length} Total Entries</p>
      </div>

      {/* MOBILE LIST (Cards) */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const ship = getShippingCharge(order);
          const total = (order.total_amount || 0) + ship;
          return (
            <div key={order.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-rose-600 font-mono">{order.order_number}</p>
                  <h3 className="font-bold text-gray-900">{order.customer_name}</h3>
                </div>
                <div className="text-right">
                   <p className="font-black text-gray-900">Rs {total.toLocaleString()}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">{order.shipping_city}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase border-none ring-1 ring-gray-100"
                  style={{ backgroundColor: statusColors[order.status]?.bg, color: statusColors[order.status]?.text }}
                >
                  {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2.5 bg-gray-50 text-gray-900 rounded-xl"><Eye size={20}/></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Total (Inc. Shipping)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => {
              const ship = getShippingCharge(order);
              return (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{order.customer_name}</p>
                    <p className="text-[10px] font-mono font-bold text-rose-500">{order.order_number}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{order.shipping_city}</td>
                  <td className="px-6 py-4 font-black text-gray-900">Rs {(order.total_amount + ship).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-none"
                      style={{ backgroundColor: statusColors[order.status]?.bg, color: statusColors[order.status]?.text }}
                    >
                      {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg"><Eye size={18}/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex justify-center sm:justify-end">
          <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900">Order Detail</h3>
                <p className="text-[10px] font-black text-rose-600 font-mono tracking-tighter">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Box */}
              <div className="p-5 rounded-3xl border border-gray-100 bg-white">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <User size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Customer Info</span>
                </div>
                <p className="font-bold text-gray-900 text-lg">{selectedOrder.customer_name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
              </div>

              {/* Shipping */}
              <div className="p-5 rounded-3xl border border-gray-100 bg-white">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <MapPin size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Shipping Route</span>
                </div>
                <div className="text-sm text-gray-800 font-medium leading-relaxed break-words whitespace-pre-wrap">
                  {selectedOrder.shipping_address}<br/>
                  {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <ShoppingBag size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Products</span>
                </div>
                {selectedOrder.order_items?.map((item, i) => (
                  <div key={i} className="p-4 border border-gray-50 rounded-2xl bg-gray-50/50 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm font-bold text-gray-900 leading-tight break-words flex-1">{item.product_name}</p>
                      <p className="font-black text-gray-900 whitespace-nowrap">Rs {item.product_price?.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-black text-gray-400 uppercase">
                      <span>Qty: {item.quantity}</span>
                      <span>Size: {item.size || 'STD'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FIXED TOTALS */}
            <div className="p-6 bg-gray-900 text-white rounded-t-[40px] space-y-4">
              <div className="flex justify-between text-xs font-bold opacity-60 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>Rs {selectedOrder.total_amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="opacity-60">Shipping Fee</span>
                <span className="text-rose-400">+ Rs {getShippingCharge(selectedOrder)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-black text-lg">Grand Total</span>
                <span className="text-3xl font-black text-rose-500">
                  Rs {(selectedOrder.total_amount + getShippingCharge(selectedOrder)).toLocaleString()}
                </span>
              </div>
              <button onClick={() => handleDelete(selectedOrder.id, selectedOrder.order_number)} className="w-full py-3 mt-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors">
                Permanently Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}