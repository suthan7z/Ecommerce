import React, { useState } from 'react';
import { register as registerUser } from '../../services/authService';

interface RegisterProps {
  toggleAuthMode: () => void;
}

const Register: React.FC<RegisterProps> = ({ toggleAuthMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name, email, password, confirmPassword });
      toggleAuthMode();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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

  const fields = [
    { label: 'Full Name',        type: 'text',     val: name,            set: setName },
    { label: 'Email Address',    type: 'email',    val: email,           set: setEmail },
    { label: 'Password',         type: 'password', val: password,        set: setPassword },
    { label: 'Confirm Password', type: 'password', val: confirmPassword, set: setConfirmPassword },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontFamily: "'Fraunces', serif" }}>
          Create an account
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Enter your details to get started</p>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626',
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {fields.map(f => (
          <div key={f.label}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
              marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>{f.label}</label>
            <input
              type={f.type} value={f.val} required
              onChange={e => f.set(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>
        ))}

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
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={toggleAuthMode}
          style={{
            color: '#6366f1', fontWeight: 700, background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 13,
            padding: 0, textDecoration: 'underline',
          }}
        >Sign In</button>
      </p>
    </div>
  );
};

export default Register;
