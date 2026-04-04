import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Declare payhere as a global (loaded via script tag in index.html)
declare const payhere: any;

const Checkout: React.FC = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'paid' | 'failed'>('idle');

  const totalAmount = cart.totalAmount;
  const shippingFee = 500; // LKR 500 shipping
  const grandTotal = totalAmount + shippingFee;

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) { setError('Please enter a shipping address'); return; }
    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    if (!city.trim()) { setError('Please enter your city'); return; }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // 1. Create the order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ shippingAddress: `${shippingAddress}, ${city}`, paymentMethod: 'card' }),
      });
      if (!orderRes.ok) throw new Error('Failed to create order');
      const { order } = await orderRes.json();

      // 2. Get payment params (hash etc.) from backend
      const payRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: order._id }),
      });
      if (!payRes.ok) throw new Error('Failed to initiate payment');
      const payData = await payRes.json();

      // 3. Set up PayHere event handlers
      payhere.onCompleted = async (orderId: string) => {
        setPaymentStatus('pending');
        // Poll for payment confirmation (PayHere notifies backend async)
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const statusRes = await fetch(`/api/payments/status/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (statusRes.ok) {
            const status = await statusRes.json();
            if (status.status === 'completed') {
              clearInterval(poll);
              setPaymentStatus('paid');
              setSuccess(true);
              setTimeout(() => navigate('/orders'), 2500);
            }
          }
          if (attempts >= 10) {
            clearInterval(poll);
            // Even if we can't confirm yet, the notify_url will update it async
            setSuccess(true);
            setTimeout(() => navigate('/orders'), 2500);
          }
        }, 2000);
      };

      payhere.onDismissed = () => {
        setLoading(false);
        setError('Payment was cancelled. You can try again.');
      };

      payhere.onError = (error: string) => {
        setLoading(false);
        setError(`Payment error: ${error}`);
      };

      // 4. Build the PayHere payment object and start popup
      const nameParts = (user?.name || 'Customer Name').split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'N/A';

      const payment = {
        sandbox: payData.sandbox,
        merchant_id: payData.merchant_id,
        return_url: undefined,   // Not needed for JS SDK
        cancel_url: undefined,   // Not needed for JS SDK
        notify_url: `${window.location.origin.replace('localhost:3000', 'localhost:5000')}/api/payments/notify`,
        order_id: payData.order_id,
        items: cart.items.map(i => i.name).join(', ').slice(0, 255),
        amount: payData.amount,
        currency: payData.currency,
        hash: payData.hash,
        first_name: firstName,
        last_name: lastName,
        email: user?.email || '',
        phone: phone,
        address: shippingAddress,
        city: city,
        country: 'Sri Lanka',
      };

      payhere.startPayment(payment);
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && !success) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p className="text-slate-600 mb-4">Your cart is empty.</p>
        <button onClick={() => navigate('/products')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">
          Shop now
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✓</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
          {paymentStatus === 'paid' ? 'Payment confirmed!' : 'Order placed!'}
        </h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>
          {paymentStatus === 'paid'
            ? 'Your payment was successful. Redirecting to orders...'
            : 'Your order is placed. Payment confirmation may take a moment.'}
        </p>
        {paymentStatus === 'pending' && (
          <p style={{ color: '#6366f1', fontSize: 13 }}>Confirming payment...</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 24, fontFamily: "'Fraunces', serif" } as React.CSSProperties}>Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="checkout-grid">

        {/* Order summary */}
        <div style={{ background: '#f8fafc', borderRadius: 16, padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Order summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {cart.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#475569' }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>LKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span>LKR {totalAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#64748b' }}>Shipping</span>
              <span>LKR {shippingFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#0f172a', paddingTop: 8, borderTop: '1px solid #e2e8f0', marginTop: 4 }}>
              <span>Total</span>
              <span style={{ color: '#059669' }}>LKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* PayHere accepted methods */}
          <div style={{ marginTop: 16, padding: '12px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accepted payments</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Visa', 'Master', 'Amex', 'eZcash', 'mCash', 'Frimi', 'Genie'].map(m => (
                <span key={m} style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{error}</div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={user?.email || ''} disabled style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} />
          </div>
          <div>
            <label style={labelStyle}>Phone number *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="077 123 4567" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelStyle}>City *</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Colombo" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelStyle}>Shipping address *</label>
            <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)}
              placeholder="No. 123, Galle Road" rows={3} required
              style={{ ...inputStyle, resize: 'none' } as React.CSSProperties}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <button onClick={handleCheckout} disabled={loading}
            style={{ padding: '14px', borderRadius: 14, background: loading ? '#a5b4fc' : '#6366f1', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
            {loading ? 'Opening payment...' : `Pay LKR ${grandTotal.toLocaleString()} →`}
          </button>

          <button onClick={() => navigate('/cart')}
            style={{ padding: '12px', borderRadius: 14, background: '#fff', border: '1.5px solid #e2e8f0', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            ← Back to cart
          </button>

          <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            🔒 Secured by PayHere · Central Bank approved
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 580px) { .checkout-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 10,
  border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s',
};

export default Checkout;
