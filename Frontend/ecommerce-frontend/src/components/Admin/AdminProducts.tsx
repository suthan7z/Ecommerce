import React, { useEffect, useState, useRef } from 'react';

const token = () => localStorage.getItem('token');
const emptyForm = { name: '', description: '', price: '', category: '', stock: '', image: '' };

const AdminProducts: React.FC = () => {
  const [products, setProducts]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<any>(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/products', { headers: { Authorization: `Bearer ${token()}` } });
    const d = await r.json();
    setProducts(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImagePreview(''); setShowForm(true); setError(''); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, stock: String(p.stock), image: p.image || '' });
    setImagePreview(p.image || '');
    setShowForm(true); setError('');
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setForm(f => ({ ...f, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => { setForm(f => ({ ...f, image: '' })); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) { setError('Missing required fields'); return; }
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      const url = editing ? `/api/products/${editing._id}` : '/api/products';
      const r = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error('Failed to save');
      setShowForm(false); load();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ color: '#0f172a', fontSize: 24, fontWeight: 700 }}>Inventory</h1>
        <button onClick={openCreate} style={btnStyle('#6366f1')}>+ New Product</button>
      </div>

      {showForm && (
        <div style={modalOverlay} onClick={() => setShowForm(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#0f172a', fontSize: 18, marginBottom: 20 }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {[['name', 'Name'], ['category', 'Category'], ['price', 'Price'], ['stock', 'Stock']].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} type={['price', 'stock'].includes(key) ? 'number' : 'text'} />
                </div>
              ))}
              
              <div>
                <label style={labelStyle}>Product Image</label>
                <div onClick={() => fileInputRef.current?.click()} style={uploadBox}>
                  {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#94a3b8' }}>Click to Upload</span>}
                </div>
                <input ref={fileInputRef} type="file" onChange={handleImageFile} style={{ display: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={handleSave} style={{ ...btnStyle('#6366f1'), flex: 1 }}>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setShowForm(false)} style={{ ...btnStyle('#f1f5f9', false), color: '#475569', flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>{['', 'Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px' }}><div style={thumbBox}>{p.image ? <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}</div></td>
                <td style={tdStyle}><strong>{p.name}</strong></td>
                <td style={tdStyle}>{p.category}</td>
                <td style={{ ...tdStyle, color: '#059669', fontWeight: 600 }}>LKR {p.price?.toLocaleString()}</td>
                <td style={tdStyle}>{p.stock}</td>
                <td style={tdStyle}>
                  <button onClick={() => openEdit(p)} style={actionBtn('#6366f1')}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={actionBtn('#ef4444')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Styles ---
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalContent: React.CSSProperties = { background: '#fff', padding: 24, borderRadius: 16, width: 450, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' };
const btnStyle = (bg: string, isPrimary = true): React.CSSProperties => ({ background: bg, color: isPrimary ? '#fff' : '#475569', padding: '10px 16px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' });
const thStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#64748b', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 14, color: '#334155' };
const thumbBox: React.CSSProperties = { width: 40, height: 40, borderRadius: 6, background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const uploadBox: React.CSSProperties = { height: 100, border: '2px dashed #cbd5e1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' };
const actionBtn = (color: string): React.CSSProperties => ({ background: 'none', border: 'none', color, cursor: 'pointer', marginRight: 10, fontWeight: 500 });

export default AdminProducts;
