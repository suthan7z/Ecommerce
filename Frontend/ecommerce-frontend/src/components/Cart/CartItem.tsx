import React from 'react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 0) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '16px 0', borderBottom: '1px solid #f1f5f9',
    }}>
      {/* Image */}
      <div style={{
        width: 80, height: 80, flexShrink: 0,
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid #e2e8f0', background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: '#0f172a',
          marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.name}</h3>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#059669', fontFamily: "'Fraunces', serif" }}>
          LKR {(item.price * item.quantity).toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          LKR {item.price.toLocaleString()} each
        </div>
      </div>

      {/* Qty + Remove */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: '#f1f5f9', borderRadius: 10,
          border: '1px solid #e2e8f0', overflow: 'hidden',
        }}>
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
            style={{
              width: 36, height: 36, background: 'none', border: 'none',
              fontSize: 16, cursor: 'pointer', color: '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >−</button>
          <span style={{
            width: 32, textAlign: 'center', fontSize: 14,
            fontWeight: 700, color: '#0f172a', userSelect: 'none',
          }}>{item.quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            style={{
              width: 36, height: 36, background: 'none', border: 'none',
              fontSize: 16, cursor: 'pointer', color: '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >+</button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          style={{
            padding: '7px 14px', borderRadius: 8,
            border: '1px solid #fecaca', background: '#fef2f2',
            color: '#dc2626', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#fee2e2')}
          onMouseOut={e => (e.currentTarget.style.background = '#fef2f2')}
        >Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
