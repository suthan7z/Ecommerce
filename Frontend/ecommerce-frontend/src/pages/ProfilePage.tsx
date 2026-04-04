import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const stored = localStorage.getItem('user');
      if (stored) localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), name }));
      setSuccess('Profile updated!');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 560, margin: '0 auto', padding: '0 16px' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700&display=swap" rel="stylesheet" />

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>My Profile</h1>

      {/* Header card */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 20, padding: '28px 24px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0, border: '2px solid rgba(255,255,255,0.18)' }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: "'Fraunces', serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        </div>
        <span style={{ background: user?.role === 'admin' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)', color: user?.role === 'admin' ? '#a5b4fc' : 'rgba(255,255,255,0.65)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
          {user?.role}
        </span>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[{ to: '/orders', icon: '📦', label: 'My Orders', desc: 'View history' }, { to: '/cart', icon: '🛒', label: 'My Cart', desc: 'Current items' }].map(l => (
          <Link key={l.to} to={l.to} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.label}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{l.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Edit form */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '24px', marginBottom: 14 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Edit details</h2>

        {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#15803d' }}>{success}</div>}
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>{error}</div>}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Full name', value: name, set: setName, type: 'text', disabled: false },
            { label: 'Phone (optional)', value: phone, set: setPhone, type: 'tel', disabled: false, placeholder: '+94 77 000 0000' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
              <input type={f.type} value={f.value} placeholder={(f as any).placeholder} onChange={e => f.set(e.target.value)}
                style={{ width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input type="email" value={user?.email || ''} disabled
              style={{ width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #f1f5f9', fontSize: 14, background: '#f8fafc', color: '#94a3b8', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '13px', borderRadius: 12, background: loading ? '#a5b4fc' : '#6366f1', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: 16, padding: '18px 24px' }}>
        <button onClick={() => setShowLogout(true)}
          style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Log out of account
        </button>
      </div>

      {/* Logout modal */}
      {showLogout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowLogout(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', maxWidth: 320, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>🚪</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Log out?</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22, lineHeight: 1.6 }}>You'll be signed out of your account.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#dc2626', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
