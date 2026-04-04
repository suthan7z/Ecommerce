import React, { useEffect, useState } from 'react';
import { StatusBadge } from './AdminDashboard';

const token = () => localStorage.getItem('token');
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/orders/admin/all', { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setOrders(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Orders</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{orders.length} total orders</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map(o => (
          <div key={o._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
            onMouseOut={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
          >
            {/* Row */}
            <div
              onClick={() => setExpanded(expanded === o._id ? null : o._id)}
              style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
            >
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'DM Mono', monospace", minWidth: 90 }}>#{o._id.slice(-8)}</span>
              <span style={{ fontSize: 14, color: '#059669', fontWeight: 700, fontFamily: "'DM Mono', monospace", minWidth: 80 }}>${o.totalAmount?.toFixed(2)}</span>
              <StatusBadge status={o.status} />
              <StatusBadge status={o.paymentStatus} />
              <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
              <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 700 }}>{expanded === o._id ? '▲' : '▼'}</span>
            </div>

            {/* Expanded */}
            {expanded === o._id && (
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '18px 20px', background: '#fafafa' }}>
                {/* Items */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 10 }}>Items</div>
                  <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    {o.items?.map((item: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '10px 14px', borderBottom: i < o.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <span style={{ color: '#374151' }}>{item.productName || 'Product'} <span style={{ color: '#94a3b8' }}>× {item.quantity}</span></span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                {o.shippingAddress && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 6 }}>Shipping address</div>
                    <div style={{ fontSize: 13, color: '#374151', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '10px 14px' }}>
                      {typeof o.shippingAddress === 'string' ? o.shippingAddress : Object.values(o.shippingAddress).filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}

                {/* Update status */}
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 10 }}>Update status</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        disabled={o.status === s || updating === o._id}
                        onClick={() => updateStatus(o._id, s)}
                        style={{
                          padding: '7px 14px', borderRadius: 9,
                          border: o.status === s ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                          background: o.status === s ? 'rgba(99,102,241,0.08)' : '#fff',
                          color: o.status === s ? '#6366f1' : '#64748b',
                          fontSize: 12, fontWeight: 600, cursor: o.status === s ? 'default' : 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.15s',
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: '48px 0' }}>No orders yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
