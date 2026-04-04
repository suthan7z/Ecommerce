import React, { useEffect, useState } from 'react';

const token = () => localStorage.getItem('token');

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/auth/users', { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setUsers(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change this user to ${newRole}?`)) return;
    setUpdating(userId);
    await fetch('/api/auth/users/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ userId, role: newRole }),
    });
    await load();
    setUpdating(null);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Users</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{users.length} registered users</p>
        </div>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>⌕</span>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', background: '#f8fafc', outline: 'none', width: 220, fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} style={{ borderTop: '1px solid #f1f5f9' }}
                onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: u.role === 'admin' ? 'rgba(99,102,241,0.1)' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: u.role === 'admin' ? '#6366f1' : '#64748b',
                      fontSize: 13, fontWeight: 700,
                      border: u.role === 'admin' ? '1.5px solid rgba(99,102,241,0.2)' : '1.5px solid #e2e8f0',
                    }}>{u.name?.[0]?.toUpperCase()}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{u.email}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: u.role === 'admin' ? 'rgba(99,102,241,0.1)' : '#f1f5f9',
                    color: u.role === 'admin' ? '#6366f1' : '#64748b',
                    textTransform: 'capitalize',
                    border: u.role === 'admin' ? '1px solid rgba(99,102,241,0.2)' : '1px solid #e2e8f0',
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#94a3b8' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => toggleRole(u._id, u.role)}
                    disabled={updating === u._id}
                    style={{
                      padding: '6px 13px', borderRadius: 8,
                      border: u.role === 'admin' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(99,102,241,0.3)',
                      background: u.role === 'admin' ? 'rgba(239,68,68,0.06)' : 'rgba(99,102,241,0.06)',
                      color: u.role === 'admin' ? '#dc2626' : '#6366f1',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {updating === u._id ? '...' : u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            {search ? 'No users match your search' : 'No users yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
