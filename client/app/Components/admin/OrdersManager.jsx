'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Trash2 } from 'lucide-react';
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
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-800">Orders</h2>
        <p className="text-sm text-taupe-600 mt-1">{orders.length} total orders</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-taupe-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '720px' }}>
            <thead>
              <tr className="bg-gradient-to-r from-cream-50 to-blush-50 border-b border-taupe-200">
                {['Order #', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 sm:px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>
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
                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-charcoal-800 whitespace-nowrap font-mono">{order.order_number}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-charcoal-800 text-sm">{order.customer_name}</div>
                      <div className="text-xs text-taupe-600 mt-1 truncate max-w-[200px]">{order.customer_email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-emerald-700 whitespace-nowrap">Rs {order.total_amount.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-full border-none cursor-pointer focus:ring-2 focus:ring-blush-400 transition-all"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-taupe-700 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="View details"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id, order.order_number)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete order"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-16 px-4">
              <Eye size={48} className="mx-auto mb-4 text-taupe-300" />
              <p className="text-taupe-600">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-taupe-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-blush-50 to-cream-50 rounded-t-2xl">
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-charcoal-800">Order Details</h3>
                <p className="text-sm text-taupe-600 mt-1 font-mono">{selectedOrder.order_number}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Delete button inside modal */}
                <button
                  onClick={() => handleDelete(selectedOrder.id, selectedOrder.order_number)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontSize: 13 }}
                >
                  <Trash2 size={15} /> Delete Order
                </button>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-cream-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-charcoal-800 mb-3 text-sm uppercase tracking-wide">Customer Information</h4>
                <div className="bg-gradient-to-br from-cream-50 to-blush-50 border border-taupe-200 rounded-xl p-4 space-y-2">
                  {[['Name', selectedOrder.customer_name], ['Email', selectedOrder.customer_email], ['Phone', selectedOrder.customer_phone]].map(([label, value]) => (
                    <p key={label} className="text-sm m-0">
                      <span className="font-semibold text-charcoal-700">{label}: </span>
                      <span className="text-charcoal-600">{value}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h4 className="font-semibold text-charcoal-800 mb-3 text-sm uppercase tracking-wide">Shipping Address</h4>
                <div className="bg-gradient-to-br from-cream-50 to-blush-50 border border-taupe-200 rounded-xl p-4 text-sm text-charcoal-600 space-y-1">
                  <p className="m-0">{selectedOrder.shipping_address}</p>
                  <p className="m-0">{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                  <p className="m-0">{selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-charcoal-800 mb-3 text-sm uppercase tracking-wide">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="bg-white border border-taupe-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <p className="font-semibold text-charcoal-800 m-0 text-sm flex-1">{item.product_name}</p>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-charcoal-800 m-0 text-base">Rs {item.product_price.toFixed(2)}</p>
                          <p className="text-xs text-taupe-600 m-0">per item</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 m-0">Customer Preferences:</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div><p className="text-xs text-taupe-600 m-0 mb-1">Quantity</p><p className="font-bold text-charcoal-800 text-lg m-0">{item.quantity}</p></div>
                          {item.size && <div><p className="text-xs text-taupe-600 m-0 mb-1">Size</p><p className="font-bold text-charcoal-800 text-lg m-0">{item.size}</p></div>}
                          {item.color && <div><p className="text-xs text-taupe-600 m-0 mb-1">Color</p><p className="font-bold text-charcoal-800 text-lg m-0">{item.color}</p></div>}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-taupe-200">
                        <p className="text-sm font-medium text-charcoal-700 m-0">Item Total:</p>
                        <p className="text-lg font-bold text-emerald-600 m-0">Rs {(item.product_price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-blush-50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-emerald-200">
                <div>
                  <p className="text-sm text-charcoal-700 m-0 mb-1">Order Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-charcoal-800 m-0">Rs {selectedOrder.total_amount.toFixed(2)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-charcoal-700 m-0 mb-2">Status</p>
                  <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                    style={{ backgroundColor: statusColors[selectedOrder.status]?.bg || '#fee2e2', color: statusColors[selectedOrder.status]?.color || '#991b1b' }}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}