import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string | object;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.1)',   color: '#d97706' },
  confirmed: { bg: 'rgba(99,102,241,0.1)',   color: '#6366f1' },
  shipped:   { bg: 'rgba(56,189,248,0.1)',   color: '#0284c7' },
  delivered: { bg: 'rgba(16,185,129,0.1)',   color: '#059669' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',    color: '#dc2626' },
};

const PAYMENT_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.1)',   color: '#d97706' },
  paid:      { bg: 'rgba(16,185,129,0.1)',   color: '#059669' },
  completed: { bg: 'rgba(16,185,129,0.1)',   color: '#059669' },
  failed:    { bg: 'rgba(239,68,68,0.1)',    color: '#dc2626' },
};

const Badge: React.FC<{ label: string; map: Record<string, { bg: string; color: string }> }> = ({ label, map }) => {
  const s = map[label] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b' };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '4px 12px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
    }}>{label}</span>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        border: '3px solid #e2e8f0', borderTopColor: '#6366f1',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px 0', color: '#dc2626', fontSize: 14 }}>{error}</div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700&display=swap"
        rel="stylesheet"
      />

      <h1 style={{
        fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700,
        color: '#0f172a', marginBottom: 28, letterSpacing: '-0.5px',
      }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 20, padding: '64px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            No orders yet
          </p>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            Start shopping to see your orders here
          </p>
          <Link
            to="/products"
            style={{
              display: 'inline-block', background: '#6366f1', color: '#fff',
              padding: '13px 30px', borderRadius: 12, fontSize: 15,
              fontWeight: 700, textDecoration: 'none',
            }}
          >Browse Products →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => (
            <div key={order._id} style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 16, overflow: 'hidden',
            }}>
              {/* Summary row */}
              <div
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                style={{
                  padding: '16px 20px', display: 'flex', alignItems: 'center',
                  gap: 14, cursor: 'pointer', flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{
                    fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.05em',
                  }}>#{order._id.slice(-10).toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Badge label={order.status} map={STATUS_COLORS} />
                  <Badge label={order.paymentStatus} map={PAYMENT_COLORS} />
                  <span style={{
                    fontSize: 16, fontWeight: 700, color: '#059669',
                    fontFamily: "'Fraunces', serif",
                  }}>LKR {order.totalAmount.toLocaleString()}</span>
                </div>

                <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 4 }}>
                  {expanded === order._id ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded detail */}
              {expanded === order._id && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px' }}>
                  <div style={{
                    fontSize: 11, color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 10,
                  }}>Items</div>
                  <div style={{
                    background: '#f8fafc', borderRadius: 12,
                    border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 14,
                  }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '10px 16px', fontSize: 13,
                        borderBottom: i < order.items.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}>
                        <span style={{ color: '#475569' }}>
                          {item.productName || 'Product'} × {item.quantity}
                        </span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress && (
                    <div>
                      <div style={{
                        fontSize: 11, color: '#94a3b8', textTransform: 'uppercase',
                        letterSpacing: '0.06em', marginBottom: 4,
                      }}>Ships to</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>
                        {typeof order.shippingAddress === 'string'
                          ? order.shippingAddress
                          : Object.values(order.shippingAddress).filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
