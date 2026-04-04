'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../lib/api';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', is_active: true, order: 0 });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories(null);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, order: parseInt(formData.order) };
      if (editingCategory) { await api.updateCategory(editingCategory.id, data); }
      else { await api.createCategory(data); }
      setShowModal(false);
      resetForm();
      loadCategories();
      alert(editingCategory ? 'Category updated!' : 'Category created!');
    } catch (error) {
      alert(error.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, description: category.description || '', is_active: category.is_active, order: category.order });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await api.deleteCategory(id); loadCategories(); alert('Deleted!'); }
    catch (error) { alert('Error deleting category'); }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', is_active: true, order: 0 });
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (loading) return <div style={{ textAlign: 'center', padding: '32px' }}>Loading...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Categories ({categories.length})</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'linear-gradient(to right, #ec4899, #a855f7)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Table — FIX: overflowX scroll directly on wrapper, no parent overflow:hidden */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ minWidth: 520, width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Order', 'Name', 'Slug', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{ padding: '12px 24px', textAlign: i === 4 ? 'right' : 'left', fontSize: 12, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#111827' }}>{category.order}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, color: '#111827', fontSize: 14 }}>{category.name}</div>
                  {category.description && <div style={{ fontSize: 13, color: '#6b7280' }}>{category.description}</div>}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#111827' }}>{category.slug}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 12, backgroundColor: category.is_active ? '#dcfce7' : '#fee2e2', color: category.is_active ? '#166534' : '#991b1b' }}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={() => handleEdit(category)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(category.id)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 560 }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={{ padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Category Name *', 'name', 'text', true], ['Slug *', 'slug', 'text', true], ['Display Order', 'order', 'number', false]].map(([label, field, type, required]) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>{label}</label>
                  <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (field === 'name') {
                        setFormData(prev => ({ ...prev, name: val, ...(!editingCategory && { slug: generateSlug(val) }) }));
                      } else {
                        setFormData(prev => ({ ...prev, [field]: val }));
                      }
                    }}
                    required={required}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                <span style={{ fontSize: 14, color: '#374151' }}>Active</span>
              </label>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button type="submit" style={{ flex: 1, padding: '10px 16px', background: 'linear-gradient(to right, #ec4899, #a855f7)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}>
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={{ padding: '10px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}