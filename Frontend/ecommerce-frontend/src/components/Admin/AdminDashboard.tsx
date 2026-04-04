import React, { useEffect, useState } from 'react';

const token = () => localStorage.getItem('token');

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; accent: string; icon: string }> = ({ label, value, sub, accent, icon }) => (
  <div style={{
    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
    padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s',
  }}
    onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
    onMouseOut={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
  >
    <div style={{ width: 42, height: 42, borderRadius: 12, background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  confirmed: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
  shipped:   { bg: 'rgba(6,182,212,0.1)',   color: '#0891b2' },
  delivered: { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
  paid:      { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  failed:    { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
  refunded:  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b' };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
    }}>{status}</span>
  );
};

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token()}` };
        const [o, p, u] = await Promise.all([
          fetch('/api/orders/admin/all', { headers }).then(r => r.json()),
          fetch('/api/products', { headers }).then(r => r.json()),
          fetch('/api/auth/users', { headers }).then(r => r.json()),
        ]);
        setOrders(Array.isArray(o) ? o : []);
        setProducts(Array.isArray(p) ? p : []);
        setUsers(Array.isArray(u) ? u : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const pending = orders.filter(o => o.status === 'pending').length;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>Welcome back! Here's what's happening in your store.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Orders" value={orders.length} icon="📦" accent="#6366f1" />
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} icon="💰" accent="#10b981" />
        <StatCard label="Products" value={products.length} icon="🛍️" accent="#f59e0b" />
        <StatCard label="Pending Orders" value={pending} sub="need attention" icon="⏳" accent="#ef4444" />
      </div>

      {/* Recent orders */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Recent orders</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{orders.length} total</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Order ID', 'Amount', 'Status', 'Payment', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 8).map(o => (
              <tr key={o._id} style={{ borderTop: '1px solid #f1f5f9' }}
                onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '13px 20px', fontSize: 12, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>#{o._id.slice(-8)}</td>
                <td style={{ padding: '13px 20px', fontSize: 13, color: '#0f172a', fontWeight: 600 }}>${o.totalAmount?.toFixed(2)}</td>
                <td style={{ padding: '13px 20px' }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: '13px 20px' }}><StatusBadge status={o.paymentStatus} /></td>
                <td style={{ padding: '13px 20px', fontSize: 12, color: '#94a3b8' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No orders yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
