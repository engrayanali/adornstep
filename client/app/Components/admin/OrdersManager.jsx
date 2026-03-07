'use client';

import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import api from '../../lib/api';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

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
      console.error('Error updating order:', error);
      alert('Error updating order');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-taupe-200 border-t-charcoal-800 mx-auto"></div>
        <p className="mt-4 text-taupe-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-heading text-charcoal-800">Orders</h2>
        <p className="text-sm text-taupe-600 mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-xl border border-taupe-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-cream-50 to-taupe-50 border-b border-taupe-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-charcoal-800">{order.order_number}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-charcoal-800">{order.customer_name}</div>
                    <div className="text-xs text-taupe-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-charcoal-800">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border-0 cursor-pointer ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-taupe-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <Eye size={48} className="mx-auto text-taupe-300 mb-4" />
            <p className="text-taupe-600 font-body">No orders yet</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-cream-50 to-white border-b border-taupe-200 px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-heading text-charcoal-800">Order Details</h3>
                <p className="text-sm text-taupe-600 mt-1">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-taupe-100 rounded-lg transition-colors">
                <X size={20} className="text-charcoal-600" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <h4 className="font-heading text-charcoal-800 mb-3">Customer Information</h4>
                <div className="bg-cream-50 border border-taupe-200 p-4 rounded-lg space-y-2">
                  <p className="text-sm"><span className="font-medium text-charcoal-700">Name:</span> <span className="text-charcoal-600">{selectedOrder.customer_name}</span></p>
                  <p className="text-sm"><span className="font-medium text-charcoal-700">Email:</span> <span className="text-charcoal-600">{selectedOrder.customer_email}</span></p>
                  <p className="text-sm"><span className="font-medium text-charcoal-700">Phone:</span> <span className="text-charcoal-600">{selectedOrder.customer_phone}</span></p>
                </div>
              </div>

              <div>
                <h4 className="font-heading text-charcoal-800 mb-3">Shipping Address</h4>
                <div className="bg-cream-50 border border-taupe-200 p-4 rounded-lg text-sm text-charcoal-600">
                  <p>{selectedOrder.shipping_address}</p>
                  <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                  <p>{selectedOrder.shipping_country}</p>
                </div>
              </div>

              <div>
                <h4 className="font-heading text-charcoal-800 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="bg-cream-50 border border-taupe-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal-800 text-base">{item.product_name}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-charcoal-800 text-lg">${item.product_price.toFixed(2)}</p>
                          <p className="text-xs text-taupe-500">per item</p>
                        </div>
                      </div>
                      
                      {/* Customer Preferences - Highlighted */}
                      <div className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Customer Preferences:</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                            <p className="font-bold text-charcoal-800 text-lg">{item.quantity}</p>
                          </div>
                          {item.size && (
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Size</p>
                              <p className="font-bold text-charcoal-800 text-lg">{item.size}</p>
                            </div>
                          )}
                          {item.color && (
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Color</p>
                              <p className="font-bold text-charcoal-800 text-lg">{item.color}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Item Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-taupe-200">
                        <p className="text-sm font-medium text-charcoal-700">Item Total:</p>
                        <p className="text-lg font-bold text-emerald-600">
                          ${(item.product_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-taupe-300 pt-4 bg-gradient-to-r from-emerald-50 to-blue-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-charcoal-600 mb-1">Order Total</p>
                    <p className="text-2xl font-bold text-charcoal-800">${selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-charcoal-600 mb-1">Status</p>
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                      selectedOrder.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      selectedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
