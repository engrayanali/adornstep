'use client';

import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
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

  const statusColors = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    confirmed: { bg: '#dbeafe', color: '#1e40af' },
    shipped: { bg: '#ede9fe', color: '#5b21b6' },
    delivered: { bg: '#d1fae5', color: '#065f46' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTopColor: '#374151', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <p style={{ marginTop: 16, color: '#6b7280' }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Orders</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* Table — FIX: overflowX scroll directly on wrapper */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ minWidth: 680, width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Order #', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map((h, i) => (
                <th key={h} style={{ padding: '16px 24px', textAlign: i === 5 ? 'right' : 'left', fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const sc = statusColors[order.status] || statusColors.cancelled;
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{order.order_number}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{order.customer_name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{order.customer_email}</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>Rs {order.total_amount.toFixed(2)}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      style={{ padding: '4px 12px', fontSize: 12, fontWeight: 500, borderRadius: 999, border: 'none', cursor: 'pointer', backgroundColor: sc.bg, color: sc.color }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#6b7280', whiteSpace: 'nowrap' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                      style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 16px' }}>
            <Eye size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
            <p style={{ color: '#6b7280' }}>No orders yet</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Order Details</h3>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Customer Info */}
              <div>
                <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: 12 }}>Customer Information</h4>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[['Name', selectedOrder.customer_name], ['Email', selectedOrder.customer_email], ['Phone', selectedOrder.customer_phone]].map(([label, value]) => (
                    <p key={label} style={{ fontSize: 14, margin: 0 }}>
                      <span style={{ fontWeight: 500, color: '#374151' }}>{label}: </span>
                      <span style={{ color: '#4b5563' }}>{value}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: 12 }}>Shipping Address</h4>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, fontSize: 14, color: '#4b5563', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{ margin: 0 }}>{selectedOrder.shipping_address}</p>
                  <p style={{ margin: 0 }}>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                  <p style={{ margin: 0 }}>{selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: 12 }}>Order Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 15 }}>{item.product_name}</p>
                        <div style={{ textAlign: 'right', marginLeft: 16 }}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 16 }}>Rs {item.product_price.toFixed(2)}</p>
                          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>per item</p>
                        </div>
                      </div>
                      <div style={{ background: 'white', border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, margin: '0 0 8px 0' }}>Customer Preferences:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                          <div><p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px 0' }}>Quantity</p><p style={{ fontWeight: 700, color: '#111827', fontSize: 18, margin: 0 }}>{item.quantity}</p></div>
                          {item.size && <div><p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px 0' }}>Size</p><p style={{ fontWeight: 700, color: '#111827', fontSize: 18, margin: 0 }}>{item.size}</p></div>}
                          {item.color && <div><p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px 0' }}>Color</p><p style={{ fontWeight: 700, color: '#111827', fontSize: 18, margin: 0 }}>{item.color}</p></div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: 0 }}>Item Total:</p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: '#059669', margin: 0 }}>Rs {(item.product_price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{ background: 'linear-gradient(to right, #ecfdf5, #eff6ff)', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 14, color: '#374151', margin: '0 0 4px 0' }}>Order Total</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Rs {selectedOrder.total_amount.toFixed(2)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 12, color: '#374151', margin: '0 0 4px 0' }}>Status</p>
                  <span style={{ padding: '6px 16px', borderRadius: 999, fontSize: 14, fontWeight: 700, backgroundColor: statusColors[selectedOrder.status]?.bg || '#fee2e2', color: statusColors[selectedOrder.status]?.color || '#991b1b' }}>
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