import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />

      {/* Hero */}
      <section style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
        borderRadius: 24, marginBottom: 20, padding: '60px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 60, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', borderRadius: 24, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
            <span style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 500 }}>Sri Lanka's favourite online store</span>
          </div>

          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 5.5vw, 70px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 22, letterSpacing: '-1.5px' }}>
            Shop smarter,<br />
            <span style={{ color: '#818cf8', fontStyle: 'italic' }}>live better.</span>
          </h1>

          <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.75, marginBottom: 40, maxWidth: 460 }}>
            Thousands of products. Unbeatable prices. Fast delivery across Sri Lanka. Secure checkout every time.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6366f1', color: '#fff', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.2px' }}>
              Browse Products →
            </Link>

            {!user ? (
              <Link to="/auth" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                Sign in free
              </Link>
            ) : (
              <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                My Orders
              </Link>
            )}
          </div>

          {user && (
            <p style={{ marginTop: 22, fontSize: 14, color: '#475569' }}>
              Welcome back, <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{user.name}</span> 👋
            </p>
          )}
        </div>

        {/* Floating stat cards — hidden on small screens via style tag below */}
        <div className="hero-stats" style={{ position: 'absolute', right: 52, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { value: '500+', label: 'Products', color: '#818cf8' },
            { value: '2k+', label: 'Customers', color: '#34d399' },
            { value: '24h', label: 'Delivery', color: '#38bdf8' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '14px 22px', backdropFilter: 'blur(12px)', minWidth: 140 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Fraunces', serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '⚡', title: 'Fast checkout', desc: 'Done in under 60 seconds' },
          { icon: '🔒', title: 'Secure & safe', desc: 'Your data always encrypted' },
          { icon: '↩️', title: 'Easy returns', desc: '30-day return policy' },
          { icon: '📦', title: 'Order tracking', desc: 'Know where your order is' },
        ].map(f => (
          <div key={f.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 20px', cursor: 'default', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', borderRadius: 20, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Ready to start shopping?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>Thousands of products waiting for you.</p>
        </div>
        <Link to="/products" style={{ background: '#fff', color: '#6366f1', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
          Shop now →
        </Link>
      </section>

      <style>{`.hero-stats { display: flex; } @media (max-width: 900px) { .hero-stats { display: none !important; } }`}</style>
    </div>
  );
};

export default Home;
