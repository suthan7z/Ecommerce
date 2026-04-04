import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const productId = product._id || product.id;

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: 16, overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: '#f8fafc', height: 180, flexShrink: 0,
      }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'none')}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 40, opacity: 0.2,
          }}>🛍</div>
        )}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: '#fff', color: '#0f172a', padding: '6px 16px',
              borderRadius: 8, fontWeight: 700, fontSize: 13,
            }}>Out of Stock</span>
          </div>
        )}
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(99,102,241,0.9)', color: '#fff',
          padding: '3px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
          backdropFilter: 'blur(4px)',
        }}>{product.category}</div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: '#0f172a',
          marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{product.name}</h3>

        <p style={{
          fontSize: 12, color: '#64748b', lineHeight: 1.55,
          marginBottom: 12, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {product.description || 'No description available.'}
        </p>

        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#059669',
            fontFamily: "'Fraunces', serif",
          }}>
            LKR {product.price ? product.price.toLocaleString() : '0'}
          </div>
          <div style={{
            fontSize: 11, marginTop: 3,
            color: product.stock > 0 ? '#94a3b8' : '#dc2626',
            fontWeight: product.stock === 0 ? 600 : 400,
          }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            to={`/products/${productId}`}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10, textAlign: 'center',
              background: '#f1f5f9', color: '#374151', fontSize: 13,
              fontWeight: 600, textDecoration: 'none',
              border: '1px solid #e2e8f0', transition: 'background 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseOut={e => (e.currentTarget.style.background = '#f1f5f9')}
          >View</Link>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10,
              background: product.stock === 0 ? '#e2e8f0' : '#6366f1',
              color: product.stock === 0 ? '#94a3b8' : '#fff',
              fontSize: 13, fontWeight: 600, border: 'none',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
            }}
            onMouseOver={e => {
              if (product.stock > 0) (e.currentTarget.style.background = '#4f46e5');
            }}
            onMouseOut={e => {
              if (product.stock > 0) (e.currentTarget.style.background = '#6366f1');
            }}
          >Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
