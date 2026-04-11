'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Trash2, Truck, MapPin, CreditCard, User, MessageSquare } from 'lucide-react';
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
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HELPER: Shipping Calculation
   * Prioritizes the saved 'shipping_price' from backend.
   * Fallback: Dynamic Karachi vs Standard check.
   */
  const getShippingCharge = (order) => {
    if (order.shipping_price !== undefined && order.shipping_price !== null) {
      return Number(order.shipping_price);
    }
    const city = (order.shipping_city || '').toLowerCase();
    const address = (order.shipping_address || '').toLowerCase();
    return (city.includes('karachi') || address.includes('karachi')) ? 200 : 300;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      loadOrders();
      alert('Order status updated!');
    } catch (error) {
      alert('Error updating order');
    }
  };

  const handleDelete = async (orderId, orderNumber) => {
    if (!confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return;
    try {
      await api.deleteOrder(orderId);
      setShowModal(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (error) {
      alert('Error deleting order');
    }
  };

  const statusColors = {
    pending:   { bg: '#fef3c7', color: '#92400e' },
    confirmed: { bg: '#dbeafe', color: '#1e40af' },
    shipped:   { bg: '#ede9fe', color: '#5b21b6' },
    delivered: { bg: '#d1fae5', color: '#065f46' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <p className="text-sm text-gray-500">{orders.length} orders total</p>
      </div>

      {/* MOBILE LIST */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => {
          const ship = getShippingCharge(order);
          const total = (order.total_amount || 0) + ship;
          return (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-mono font-bold text-rose-600">{order.order_number}</p>
                  <p className="font-bold text-gray-900">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">Rs {total.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="flex-1 text-[11px] font-bold h-9 rounded-lg border-none"
                  style={{ backgroundColor: statusColors[order.status]?.bg, color: statusColors[order.status]?.color }}
                >
                  {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
                <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Eye size={20}/></button>
                <button onClick={() => handleDelete(order.id, order.order_number)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={20}/></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">City</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total (Incl. Ship)</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const ship = getShippingCharge(order);
              return (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm">{order.customer_name}</div>
                    <div className="text-[10px] text-rose-600 font-mono">{order.order_number}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.shipping_city || '---'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">Rs {(order.total_amount + ship).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-full border-none"
                      style={{ backgroundColor: statusColors[order.status]?.bg, color: statusColors[order.status]?.color }}
                    >
                      {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Eye size={18}/></button>
                    <button onClick={() => handleDelete(order.id, order.order_number)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center sm:justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                <p className="text-xs font-mono font-bold text-rose-600">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Customer Info */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <User size={16}/><span className="text-[10px] font-bold uppercase tracking-widest">Customer Details</span>
                </div>
                <p className="font-bold text-gray-900">{selectedOrder.customer_name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
              </div>

              {/* Shipping & Order Note */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-gray-400">
                    <MapPin size={16}/><span className="text-[10px] font-bold uppercase tracking-widest">Shipping Address</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                    {selectedOrder.shipping_address}<br/>
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}
                  </div>
                </div>

                {/* ADDED: Order Note Section */}
                {selectedOrder.order_note && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                      <MessageSquare size={16}/><span className="text-[10px] font-bold uppercase tracking-widest">Order Note</span>
                    </div>
                    <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-xl italic border border-amber-100">
                      "{selectedOrder.order_note}"
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1 text-gray-400">
                  <Truck size={16}/><span className="text-[10px] font-bold uppercase tracking-widest">Items Ordered</span>
                </div>
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-2xl flex justify-between items-start gap-4 bg-gray-50/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase">Qty: {item.quantity} | Size: {item.size || 'N/A'}</p>
                    </div>
                    <p className="font-bold text-sm whitespace-nowrap text-gray-900">Rs {item.product_price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTALS SECTION */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items Subtotal</span>
                  <span className="font-bold text-gray-900">Rs {selectedOrder.total_amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Charges</span>
                  <span className="font-bold text-blue-600">Rs {getShippingCharge(selectedOrder).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-dashed">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-rose-600 whitespace-nowrap">
                    Rs {(selectedOrder.total_amount + getShippingCharge(selectedOrder)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center">
                   <CreditCard size={16} className="text-emerald-600 mb-1"/>
                   <span className="text-[10px] font-bold text-emerald-700 uppercase">{selectedOrder.payment_method || 'COD'}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-center text-center">
                   <span className="text-[10px] font-bold text-amber-700 uppercase">{selectedOrder.status}</span>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(selectedOrder.id, selectedOrder.order_number)}
                className="w-full mt-4 py-3 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
              >
                Delete Order Record
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}