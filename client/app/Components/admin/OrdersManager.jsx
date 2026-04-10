'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Trash2, Truck } from 'lucide-react'; // Added Truck icon
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
      alert('Error loading orders');
    } finally {
      setLoading(false);
    }
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
      alert('Order deleted!');
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
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taupe-200 border-t-charcoal-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-taupe-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-heading font-bold text-charcoal-800">Orders</h2>
        <p className="text-sm text-taupe-600 mt-1">{orders.length} total orders</p>
      </div>

      {/* Desktop Table / Mobile Cards Toggle */}
      <div className="bg-white rounded-2xl border border-taupe-200 shadow-card overflow-hidden">
        
        {/* MOBILE VIEW: Hidden on md+ screens */}
        <div className="block md:hidden divide-y divide-taupe-100">
          {orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-cream-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono font-bold text-taupe-500">{order.order_number}</span>
                  <div className="font-bold text-charcoal-800">{order.customer_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-700 font-bold">Rs {order.total_amount.toFixed(2)}</div>
                  <div className="text-[10px] text-taupe-400">{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-2 mt-4">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-bold rounded-lg border-none"
                  style={{ backgroundColor: statusColors[order.status]?.bg || '#eee', color: statusColors[order.status]?.color || '#333' }}
                >
                  {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
                
                <div className="flex gap-1">
                  <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Eye size={20} />
                  </button>
                  <button onClick={() => handleDelete(order.id, order.order_number)} className="p-3 bg-red-50 text-red-500 rounded-xl">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-cream-50 to-blush-50 border-b border-taupe-200">
                {['Order #', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-left text-xs font-bold text-charcoal-700 uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-100">
              {orders.map((order) => {
                const sc = statusColors[order.status] || statusColors.cancelled;
                return (
                  <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold font-mono">{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm">{order.customer_name}</div>
                      <div className="text-xs text-taupe-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-700">Rs {order.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 text-xs font-bold rounded-full border-none cursor-pointer"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-taupe-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-lg"><Eye size={18} /></button>
                        <button onClick={() => handleDelete(order.id, order.order_number)} className="p-2.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && <div className="text-center py-20 text-taupe-400">No orders found</div>}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-taupe-100 flex items-center justify-between bg-cream-50">
              <div>
                <h3 className="text-xl font-bold text-charcoal-800">Order Details</h3>
                <p className="text-xs font-mono text-taupe-500">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-taupe-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Shipping & Payment Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-taupe-50 p-4 rounded-2xl border border-taupe-100">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-taupe-400 mb-2">Shipping To</h4>
                  <p className="text-sm font-bold text-charcoal-800">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-taupe-600 leading-relaxed mt-1">
                    {selectedOrder.shipping_address}<br/>
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mb-2">Payment</h4>
                  <p className="text-sm font-bold text-emerald-800">{selectedOrder.payment_method || 'Cash on Delivery'}</p>
                  <p className="text-xs text-emerald-600 mt-1 italic">
                    {selectedOrder.payment_method === 'COD' ? 'Collect payment at doorstep' : 'Check bank transaction records'}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-sm font-bold text-charcoal-800 mb-3 flex items-center gap-2">
                  Items <span className="px-2 py-0.5 bg-taupe-100 rounded text-[10px]">{selectedOrder.order_items.length}</span>
                </h4>
                <div className="space-y-3">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="p-4 border border-taupe-100 rounded-2xl bg-white shadow-sm">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-charcoal-800">{item.product_name}</p>
                          <div className="flex gap-3 mt-2">
                             <div className="text-[10px]"><span className="text-taupe-400 uppercase">Qty:</span> <span className="font-bold">{item.quantity}</span></div>
                             {item.size && <div className="text-[10px]"><span className="text-taupe-400 uppercase">Size:</span> <span className="font-bold">{item.size}</span></div>}
                             {item.color && <div className="text-[10px]"><span className="text-taupe-400 uppercase">Color:</span> <span className="font-bold">{item.color}</span></div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-charcoal-800">Rs {(item.product_price * item.quantity).toFixed(2)}</p>
                          <p className="text-[10px] text-taupe-400">Rs {item.product_price.toFixed(2)} ea</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Totals Section - FIXED CALCULATIONS */}
              <div className="border-t border-taupe-100 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-taupe-500">Items Subtotal</span>
                  <span className="font-semibold text-charcoal-800">Rs {(selectedOrder.total_amount - (selectedOrder.shipping_charges || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-taupe-500 flex items-center gap-2"><Truck size={14}/> Delivery Charges</span>
                  <span className="font-bold text-blue-600">Rs {(selectedOrder.shipping_charges || 0).toFixed(2)}</span>
                </div>
                <div className="bg-charcoal-800 p-5 rounded-2xl flex justify-between items-center text-white mt-4 shadow-lg">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-taupe-400 mb-1">Total Amount Payable</p>
                    <p className="text-2xl font-bold">Rs {selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                     <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase" 
                           style={{ backgroundColor: statusColors[selectedOrder.status]?.bg || '#fff', color: statusColors[selectedOrder.status]?.color || '#000' }}>
                       {selectedOrder.status}
                     </span>
                  </div>
                </div>
              </div>

              {/* Dangerous Actions */}
              <div className="pt-4 flex flex-col gap-2">
                <button 
                  onClick={() => handleDelete(selectedOrder.id, selectedOrder.order_number)}
                  className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                >
                  <Trash2 size={18} /> Delete Order Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}