import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';


interface Review {
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ fontSize: size, color: s <= rating ? '#f59e0b' : '#e2e8f0' }}>★</span>
    ))}
  </div>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.product || response);
    } catch {
      setError('Failed to load product.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) { setReviewError('Please write a comment'); return; }
    setReviewLoading(true); setReviewError(''); setReviewSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setReviewSuccess('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct(); // reload to show the new review
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360 }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (error || !product) return (
    <div style={{ textAlign: 'center', padding: '64px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>😕</div>
      <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{error || 'Product not found'}</p>
      <button onClick={() => navigate('/products')} style={{ background: '#6366f1', color: '#fff', padding: '12px 28px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        Back to products
      </button>
    </div>
  );

  const reviews: Review[] = product.reviews || [];
  const avgRating = reviews.length > 0
    ? Math.round(reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length)
    : 0;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 980, margin: '0 auto', padding: '0 16px' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700&display=swap" rel="stylesheet" />

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, fontSize: 13 }}>
        <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontWeight: 600, fontSize: 13, padding: 0 }}>Products</button>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#94a3b8' }}>{product.category}</span>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#475569', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="pd-grid">

        {/* Image */}
        <div style={{ position: 'sticky', top: 96 }}>
          <div style={{ background: '#f8fafc', borderRadius: 22, overflow: 'hidden', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', position: 'relative' }}>
            {product.image ? (
              <img src={product.image} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 28, transition: 'transform 0.4s ease' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              />
            ) : (
              <div style={{ fontSize: 80, opacity: 0.15 }}>🛍</div>
            )}
            {product.stock === 0 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}>
                <span style={{ background: '#fff', color: '#0f172a', padding: '8px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>Out of stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{ display: 'inline-block', background: '#eef2ff', color: '#6366f1', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 14, alignSelf: 'flex-start', textTransform: 'capitalize' }}>
            {product.category}
          </span>

          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: 10 }}>
            {product.name}
          </h1>

          {/* Rating summary */}
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <StarRating rating={avgRating} />
              <span style={{ fontSize: 13, color: '#64748b' }}>{avgRating}/5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          <div style={{ fontSize: 30, fontWeight: 700, color: '#059669', marginBottom: 16, fontFamily: "'Fraunces', serif" }}>
            LKR {product.price?.toLocaleString()}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#10b981' : '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: product.stock > 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Currently unavailable'}
            </span>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 14, padding: '14px 16px', marginBottom: 22, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: 0 }}>
              {product.description || 'No description provided.'}
            </p>
          </div>

          {product.stock > 0 && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quantity</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#0f172a', userSelect: 'none' }}>{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}>+</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              style={{ padding: '14px', borderRadius: 14, background: added ? '#059669' : (product.stock === 0 ? '#e2e8f0' : '#6366f1'), color: product.stock === 0 ? '#94a3b8' : '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.25s' }}>
              {added ? '✓ Added to cart!' : product.stock === 0 ? 'Out of stock' : `Add to cart — LKR ${(product.price * quantity).toLocaleString()}`}
            </button>
            {product.stock > 0 && (
              <button onClick={handleBuyNow}
                style={{ padding: '14px', borderRadius: 14, background: '#0f172a', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.background = '#1e293b'}
                onMouseOut={e => e.currentTarget.style.background = '#0f172a'}>
                Buy now →
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            {[['🔒', 'Secure checkout'], ['↩️', '30-day returns'], ['📦', 'Fast delivery']].map(([icon, label]) => (
              <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                <span style={{ fontSize: 14 }}>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews section ─────────────────────────────── */}
      <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid #e2e8f0' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
          Customer reviews {reviews.length > 0 && <span style={{ fontSize: 16, color: '#64748b', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>({reviews.length})</span>}
        </h2>

        {reviews.length === 0 ? (
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', marginBottom: 32 }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {reviews.map((review, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#6366f1' }}>
                      {(review.userName || 'U')[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{review.userName || 'Customer'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating rating={review.rating} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, margin: 0 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write a review — only show if logged in */}
        {user ? (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Write a review</h3>

            {reviewSuccess && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#15803d' }}>{reviewSuccess}</div>}
            {reviewError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>{reviewError}</div>}

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your rating</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)}
                      style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: s <= reviewRating ? '#f59e0b' : '#e2e8f0', transition: 'color 0.15s', padding: 2 }}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your comment</label>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..." rows={3} required
                  style={{ width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", resize: 'none', transition: 'border-color 0.15s' } as React.CSSProperties}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <button type="submit" disabled={reviewLoading}
                style={{ padding: '12px', borderRadius: 12, background: reviewLoading ? '#a5b4fc' : '#6366f1', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: reviewLoading ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', minWidth: 140 }}>
                {reviewLoading ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              <a href="/auth" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign in</a> to write a review
            </p>
          </div>
        )}
      </div>

      <style>{`@media (max-width: 640px) { .pd-grid { grid-template-columns: 1fr !important; gap: 24px !important; } }`}</style>
    </div>
  );
};

export default ProductDetail;
