'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Trash2, Truck, MapPin, CreditCard, User, MessageSquare, Palette } from 'lucide-react';
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
   * FIX: Prioritize saved data from checkout.
   * If the backend has a shipping_price, we use it directly.
   */
const getShippingCharge = (order) => {
  // If the database has the price we sent during checkout, use it.
  if (order.shipping_price) return Number(order.shipping_price);
  
  // Fallback if looking at old orders that didn't have the price saved
  const city = (order.shipping_city || '').toLowerCase();
  return city === 'karachi' ? 200 : 300;
};

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      loadOrders();
    } catch (error) {
      alert('Error updating order');
    }
  };

  const handleDelete = async (orderId, orderNumber) => {
    if (!confirm(`Delete order ${orderNumber}?`)) return;
    try {
      await api.deleteOrder(orderId);
      setShowModal(false);
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

  if (loading) return <div className="py-24 text-center">Loading Orders...</div>;

  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <p className="text-sm text-gray-500">{orders.length} orders total</p>
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
                      className="text-[10px] font-bold px-3 py-1.5 rounded-full border-none cursor-pointer"
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

      {/* MOBILE LIST (logic identical to desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between mb-3">
              <div>
                <p className="text-[10px] font-mono font-bold text-rose-600">{order.order_number}</p>
                <p className="font-bold text-gray-900">{order.customer_name}</p>
              </div>
              <p className="font-bold text-gray-900">Rs {(order.total_amount + getShippingCharge(order)).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">View Order</button>
              <button onClick={() => handleDelete(order.id, order.order_number)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
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
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Shipping & Order Note */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <MapPin size={16}/><span className="text-[10px] font-bold uppercase tracking-widest">Shipping Address</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedOrder.shipping_address}<br/>
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}
                  </div>
                </div>

                {/* FIX: Order Note Section */}
                {(selectedOrder.order_note || selectedOrder.notes) && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        Customer Note
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 italic leading-relaxed">
                      "{selectedOrder.order_note || selectedOrder.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1 text-gray-400">
                  <Truck size={16}/><span className="text-[10px] font-bold uppercase tracking-widest">Items Ordered</span>
                </div>
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-2xl flex justify-between items-start gap-4 bg-gray-50/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                      {/* FIX: Showing Color alongside Size */}
                      <div className="flex flex-wrap gap-3 mt-1">
                        <p className="text-[10px] text-gray-500 uppercase font-medium">Qty: {item.quantity}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">Size: {item.size || 'N/A'}</p>
                        <p className="text-[10px] text-rose-500 uppercase font-bold flex items-center gap-1">
                          <Palette size={10}/> Color: {item.color || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-gray-900">Rs {item.product_price?.toLocaleString()}</p>
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
              <button 
                onClick={() => handleDelete(selectedOrder.id, selectedOrder.order_number)}
                className="w-full py-3 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all border border-red-100"
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