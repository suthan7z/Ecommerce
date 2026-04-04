import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const CartView: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleRemove = (id: string) => removeFromCart(id);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity === 0) removeFromCart(id);
    else updateQuantity(id, quantity);
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 500;
  const total = subtotal + shipping;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700&display=swap"
        rel="stylesheet"
      />

      <h1 style={{
        fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700,
        color: '#0f172a', marginBottom: 28, letterSpacing: '-0.5px',
      }}>Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 20, padding: '64px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🛒</div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            Your cart is empty
          </p>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            Discover products you'll love
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}
          className="cart-grid">
          {/* Items */}
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 20, padding: '24px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f1f5f9',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                Items ({cart.items.length})
              </span>
            </div>
            {cart.items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 20, padding: '24px', position: 'sticky', top: 96,
          }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18,
            }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>LKR {shipping.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Tax</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Free</span>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid #e2e8f0', paddingTop: 14, marginBottom: 20,
              display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700,
            }}>
              <span style={{ color: '#0f172a' }}>Total</span>
              <span style={{ color: '#059669', fontFamily: "'Fraunces', serif" }}>
                LKR {total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: '#6366f1', color: '#fff', fontSize: 15,
                fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 10,
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#4f46e5')}
              onMouseOut={e => (e.currentTarget.style.background = '#6366f1')}
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/products"
              style={{
                display: 'block', textAlign: 'center', padding: '12px',
                borderRadius: 12, border: '1.5px solid #e2e8f0',
                color: '#374151', fontSize: 14, fontWeight: 600,
                textDecoration: 'none',
              }}
            >Continue Shopping</Link>

            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 14 }}>
              🔒 Secured by PayHere · Central Bank approved
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CartView;
