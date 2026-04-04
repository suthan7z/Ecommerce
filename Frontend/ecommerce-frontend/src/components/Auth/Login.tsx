import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  toggleAuthMode: () => void;
}

const Login: React.FC<LoginProps> = ({ toggleAuthMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      navigate(savedUser.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 13px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontFamily: "'Fraunces', serif" }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Sign in to your account</p>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626',
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>Email Address</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            required autoComplete="email" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        <div>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="current-password" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 6, padding: '13px', borderRadius: 12,
            background: loading ? '#a5b4fc' : '#6366f1',
            color: '#fff', fontSize: 15, fontWeight: 700,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>

      <div style={{ position: 'relative', textAlign: 'center', padding: '4px 0' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '100%', borderTop: '1px solid #e2e8f0' }} />
        </div>
        <span style={{
          position: 'relative', background: '#fff', padding: '0 12px',
          fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase',
        }}>Or</span>
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={toggleAuthMode}
          style={{
            color: '#6366f1', fontWeight: 700, background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 13,
            padding: 0, textDecoration: 'underline',
          }}
        >Create one</button>
      </p>
    </div>
  );
};

export default Login;
