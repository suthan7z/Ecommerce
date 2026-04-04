import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/products', label: 'Products', icon: '◈' },
  { to: '/admin/orders', label: 'Orders', icon: '◎' },
  { to: '/admin/users', label: 'Users', icon: '◉' },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Fraunces:wght@700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
        boxShadow: '1px 0 0 #e2e8f0',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#fff', fontWeight: 700, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}>S</div>
          {!collapsed && (
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 17, color: '#0f172a', letterSpacing: '-0.3px' }}>
              Shop<span style={{ color: '#6366f1' }}>Easy</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 9, marginBottom: 2,
                textDecoration: 'none', fontSize: 13, fontWeight: 500,
                color: isActive ? '#6366f1' : '#64748b',
                background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && n.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={() => setCollapsed(c => !c)} style={{
            width: '100%', padding: '8px 10px', borderRadius: 8,
            border: 'none', background: 'transparent', color: '#94a3b8',
            cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 15 }}>{collapsed ? '→' : '←'}</span>
            {!collapsed && 'Collapse'}
          </button>
          <button onClick={() => setShowLogout(true)} style={{
            width: '100%', padding: '8px 10px', borderRadius: 8,
            border: 'none', background: 'transparent', color: '#ef4444',
            cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
            marginTop: 2,
          }}>
            <span style={{ fontSize: 15 }}>⏻</span>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 28px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', position: 'sticky', top: 0, zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>Admin panel</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(99,102,241,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#6366f1', fontWeight: 700, fontSize: 13,
              border: '1.5px solid rgba(99,102,241,0.2)',
            }}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Administrator</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          <Outlet />
        </div>
      </main>

      {/* Logout modal */}
      {showLogout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogout(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', maxWidth: 320, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>🚪</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Log out?</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22, lineHeight: 1.6 }}>You'll be signed out of the admin panel.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#ef4444', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
