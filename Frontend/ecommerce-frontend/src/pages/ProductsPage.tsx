import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '../components/Products/ProductCard';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import { Product } from '../types';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'price_asc',  label: 'Price: low → high' },
  { value: 'price_desc', label: 'Price: high → low' },
  { value: 'rating',     label: 'Top rated' },
];

const inputBase: React.CSSProperties = {
  padding: '9px 13px', borderRadius: 10, border: '1.5px solid #e2e8f0',
  fontSize: 13, color: '#0f172a', background: '#fff', outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s',
};

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort,
      });
      setProducts(data);
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput(''); setSearch('');
    setCategory('All'); setMinPrice(''); setMaxPrice('');
    setSort('newest');
  };

  const hasFilters = search || category !== 'All' || minPrice || maxPrice || sort !== 'newest';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700&display=swap"
        rel="stylesheet"
      />

      {/* Search */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: '#94a3b8', fontSize: 18, pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{
              ...inputBase, width: '100%', paddingLeft: 42, paddingRight: 40,
              borderRadius: 12, fontSize: 14, boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setSearch(''); }}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#94a3b8', fontSize: 18,
                cursor: 'pointer', lineHeight: 1,
              }}
            >×</button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: 'none', fontFamily: "'DM Sans', sans-serif",
              background: category === cat ? '#6366f1' : '#fff',
              color: category === cat ? '#fff' : '#64748b',
              boxShadow: category === cat ? 'none' : '0 0 0 1px #e2e8f0',
              transition: 'all 0.15s',
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Price + Sort */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Price</span>
          <input
            type="number" placeholder="Min" value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{ ...inputBase, width: 80 }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
          <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
          <input
            type="number" placeholder="Max" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{ ...inputBase, width: 80 }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Sort</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ ...inputBase, cursor: 'pointer' }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '7px 14px', borderRadius: 10, border: '1px solid #fecaca',
              background: '#fef2f2', color: '#dc2626', fontSize: 12,
              fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >Clear all</button>
        )}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
          color: '#0f172a', letterSpacing: '-0.3px',
        }}>
          {category !== 'All' ? category : 'All Products'}
        </h1>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {loading ? 'Searching...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 20, padding: '64px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            No products found
          </p>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            Try different filters or clear your search
          </p>
          <button
            onClick={clearFilters}
            style={{
              background: '#6366f1', color: '#fff', padding: '12px 28px',
              borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >Clear filters</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              borderRadius: 16, border: '1px solid #e2e8f0',
              background: '#fff', height: 280, overflow: 'hidden',
            }}>
              <div style={{ height: 180, background: '#f1f5f9', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '70%' }} />
                <div style={{ height: 10, background: '#f1f5f9', borderRadius: 6, width: '50%' }} />
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {products.map(product => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
