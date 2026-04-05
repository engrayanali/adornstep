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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taupe-200 border-t-charcoal-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-taupe-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-800">Categories</h2>
          <p className="text-sm text-taupe-600 mt-1">{categories.length} total categories</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-taupe-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '520px' }}>
            <thead>
              <tr className="bg-gradient-to-r from-cream-50 to-blush-50 border-b border-taupe-200">
                {['Order', 'Name', 'Slug', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 sm:px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider ${i === 4 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium text-charcoal-800">{category.order}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-semibold text-charcoal-800 text-sm">{category.name}</div>
                    {category.description && <div className="text-xs text-taupe-600 mt-1 line-clamp-1">{category.description}</div>}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-taupe-700 font-mono">{category.slug}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(category)} 
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        aria-label="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)} 
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        aria-label="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-8 mx-auto">
            <div className="border-b border-taupe-200 px-5 sm:px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blush-50 to-cream-50 rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-charcoal-800">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => { setShowModal(false); resetForm(); }} 
                className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {[['Category Name *', 'name', 'text', true], ['Slug *', 'slug', 'text', true], ['Display Order', 'order', 'number', false]].map(([label, field, type, required]) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{label}</label>
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
                    className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows="3" 
                  className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm resize-vertical bg-white"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} 
                  className="w-4 h-4 text-blush-500 rounded focus:ring-2 focus:ring-blush-400"
                />
                <span className="text-sm font-medium text-charcoal-700">Active</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-blush-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="px-4 py-2.5 bg-taupe-100 hover:bg-taupe-200 text-charcoal-700 rounded-xl font-semibold transition-all duration-200 active:scale-95"
                >
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