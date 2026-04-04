import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect away if already logged in — fixes "login shown after login" bug
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  const reset = () => { setError(''); setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); };
  const toggle = () => { setIsLogin(v => !v); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isLogin && password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        // Navigate based on role — read from localStorage since state update is async
        const saved = JSON.parse(localStorage.getItem('user') || '{}');
        navigate(saved.role === 'admin' ? '/admin' : '/', { replace: true });
      } else {
        await register(name, email, password, confirmPassword);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || (isLogin ? 'Invalid email or password.' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 820, width: '100%', background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}
        className="auth-card">

        {/* Left panel */}
        <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #312e81)', padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
          className="auth-left">
          <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 44 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>S</span>
              </div>
              <span style={{ color: '#fff', fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700 }}>ShopEasy</span>
            </Link>

            <h2 style={{ color: '#fff', fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, marginBottom: 14, whiteSpace: 'pre-line' }}>
              {isLogin ? 'Good to\nsee you again.' : 'Join us\ntoday.'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>
              {isLogin
                ? 'Sign in to access your orders, wishlist, and personalised experience.'
                : 'Create your free account and start discovering thousands of products.'}
            </p>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Free account, always', 'Secure checkout', 'Track your orders live'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#a5b4fc', fontSize: 9 }}>✓</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 6, fontFamily: "'Fraunces', serif" }}>
              {isLogin ? 'Sign in' : 'Create account'}
            </h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={toggle} style={{ color: '#6366f1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, textDecoration: 'underline' }}>
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#dc2626', lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && <AuthField label="Full name" type="text" value={name} onChange={setName} placeholder="John Silva" />}
            <AuthField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            {!isLogin && <AuthField label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />}

            <button type="submit" disabled={loading}
              style={{ marginTop: 6, padding: '13px', borderRadius: 12, background: loading ? '#a5b4fc' : '#6366f1', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Please wait...' : isLogin ? 'Sign in →' : 'Create account →'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 620px) {
          .auth-card { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const AuthField: React.FC<{ label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, type, value, onChange, placeholder }) => (
  <div>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
    <input type={type} value={value} placeholder={placeholder} required onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s' }}
      onFocus={e => e.target.style.borderColor = '#6366f1'}
      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
    />
  </div>
);

export default AuthPage;
