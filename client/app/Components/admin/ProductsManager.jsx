'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload, Star } from 'lucide-react';
import api from '../../lib/api';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    sizes: '',
    colors: '',
    material: '',
    stock: '',
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    is_limited_edition: false,
    meta_title: '',
    meta_description: '',
  });
  const [productImages, setProductImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [newProductImages, setNewProductImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts({ limit: 1000 }),
        api.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sizesArray = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
      const colorsArray = formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : [];
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        category_id: parseInt(formData.category_id),
        stock: parseInt(formData.stock),
        sizes: JSON.stringify(sizesArray),
        colors: JSON.stringify(colorsArray),
      };
      let productId;
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
        productId = editingProduct.id;
      } else {
        const newProduct = await api.createProduct(data);
        productId = newProduct.id;
      }
      if (newProductImages.length > 0) {
        for (let i = 0; i < newProductImages.length; i++) {
          const file = newProductImages[i];
          const isPrimary = i === 0 && (!editingProduct || productImages.length === 0);
          await api.uploadProductImage(productId, file, isPrimary, i);
        }
      }
      setShowModal(false);
      resetForm();
      loadData();
      alert(editingProduct ? 'Product updated!' : 'Product created!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const sizesStr = product.sizes ? (() => { try { const p = JSON.parse(product.sizes); return Array.isArray(p) ? p.join(', ') : ''; } catch { return product.sizes; } })() : '';
    const colorsStr = product.colors ? (() => { try { const p = JSON.parse(product.colors); return Array.isArray(p) ? p.join(', ') : ''; } catch { return product.colors; } })() : '';
    setFormData({
      name: product.name, slug: product.slug, description: product.description || '',
      price: product.price.toString(), discount_price: product.discount_price ? product.discount_price.toString() : '',
      category_id: product.category_id.toString(), sizes: sizesStr, colors: colorsStr,
      material: product.material || '', stock: product.stock.toString(),
      is_active: product.is_active, is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival, is_limited_edition: product.is_limited_edition,
      meta_title: product.meta_title || '', meta_description: product.meta_description || '',
    });
    setProductImages(product.images || []);
    setShowModal(true);
  };

  const handleManageImages = async (product) => {
    setEditingProduct(product);
    try {
      const images = await api.getProductImages(product.id);
      setProductImages(images);
      setShowImageManager(true);
    } catch (error) {
      console.error('Error loading images:', error);
      alert('Error loading product images');
    }
  };

  const handleImageUpload = async (e, productId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return; }
    setUploadingImage(true);
    try {
      const isPrimary = productImages.length === 0;
      await api.uploadProductImage(productId, file, isPrimary, productImages.length);
      const images = await api.getProductImages(productId);
      setProductImages(images);
    } catch (error) {
      alert(error.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (productId, imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.deleteProductImage(productId, imageId);
      const images = await api.getProductImages(productId);
      setProductImages(images);
    } catch (error) {
      alert('Error deleting image');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      loadData();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', slug: '', description: '', price: '', discount_price: '', category_id: '', sizes: '', colors: '', material: '', stock: '', is_active: true, is_featured: false, is_new_arrival: false, is_limited_edition: false, meta_title: '', meta_description: '' });
    setNewProductImages([]);
    setProductImages([]);
  };

  const handleNewImagesSelect = (e) => {
    const files = Array.from(e.target.files || []).filter(file => {
      if (!file.type.startsWith('image/')) { alert(`${file.name} is not an image file`); return false; }
      if (file.size > 5 * 1024 * 1024) { alert(`${file.name} is larger than 5MB`); return false; }
      return true;
    });
    setNewProductImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => setNewProductImages(prev => prev.filter((_, i) => i !== index));

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-taupe-200 border-t-charcoal-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-taupe-600 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  /* ─── Shared modal styles ─── */
  const inputCls = "w-full px-3 py-2.5 border border-taupe-300 rounded-lg focus:ring-2 focus:ring-charcoal-400 focus:border-charcoal-400 outline-none transition-all text-sm bg-white text-charcoal-800 placeholder:text-taupe-400";
  const labelCls = "block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1.5";

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-800">Products</h2>
          <p className="text-sm text-taupe-600 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900  text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-sm"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

            {/* ── Products Table ── */}
      <div className="bg-white rounded-xl border border-taupe-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: '700px' }}> {/* Slightly increased min-width to prevent crowding */}
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-taupe-200">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                    <th 
                      key={i} 
                      className={`px-4 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider 
                        ${i === 5 ? 'text-right min-w-[140px]' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe-100">
                {products.map((product) => {
                  const category = categories.find(c => c && c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {product.images?.[0]?.image_url
                              ? <img src={product.images[0].image_url} alt={product.name} className="w-full h-full object-cover" />
                              : <ImageIcon size={18} className="text-taupe-400" />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-charcoal-800 text-sm truncate">{product.name}</div>
                            <div className="text-xs text-taupe-500 truncate">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 text-sm text-charcoal-700">
                        {category?.name || '—'}
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-charcoal-800">Rs {product.price}</div>
                        {product.discount_price && (
                          <div className="text-xs text-emerald-600">Rs {product.discount_price}</div>
                        )}
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${
                          product.stock > 10 ? 'text-emerald-600' : 
                          product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* ── MOBILE FRIENDLY ACTION BUTTONS ── */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 sm:gap-1">
                          <button 
                            onClick={() => handleManageImages(product)} 
                            className="p-3 sm:p-2 text-taupe-500 hover:text-charcoal-800 hover:bg-cream-100 rounded-lg transition-all" 
                            title="Manage Images"
                          >
                            <ImageIcon size={20} className="sm:w-4 sm:h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleEdit(product)} 
                            className="p-3 sm:p-2 text-taupe-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                            title="Edit"
                          >
                            <Edit size={20} className="sm:w-4 sm:h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="p-3 sm:p-2 text-taupe-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            title="Delete"
                          >
                            <Trash2 size={20} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          ADD / EDIT PRODUCT MODAL
      ════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white w-full sm:max-w-3xl sm:mx-4 sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl" style={{ maxHeight: '92vh' }}>

            {/* Modal Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-taupe-200 flex-shrink-0">
              <div>
                <h3 className="text-lg font-heading font-bold text-charcoal-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-taupe-500 mt-0.5">
                  {editingProduct ? 'Update product information' : 'Fill in the product details below'}
                </p>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors flex-shrink-0 mt-0.5"
              >
                <X size={18} className="text-charcoal-600" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <form onSubmit={handleSubmit} className="p-5 space-y-4">

                {/* Name + Slug */}
                <div>
                  <label className={labelCls}>Product Name *</label>
                  <input type="text" value={formData.name} placeholder="Enter product name" required
                    className={inputCls}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData(prev => ({ ...prev, name, ...(!editingProduct && { slug: generateSlug(name) }) }));
                    }}
                  />
                </div>

                <div>
                  <label className={labelCls}>Slug *</label>
                  <input type="text" value={formData.slug} placeholder="product-slug" required
                    className={`${inputCls} font-mono`}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Price (Rs) *</label>
                    <input type="number" step="0.01" value={formData.price} placeholder="0.00" required className={inputCls}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Discount Price</label>
                    <input type="number" step="0.01" value={formData.discount_price} placeholder="0.00" className={inputCls}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} />
                  </div>
                </div>

                {/* Category + Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Category *</label>
                    <select value={formData.category_id} required className={inputCls}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Stock *</label>
                    <input type="number" value={formData.stock} placeholder="0" required className={inputCls}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                </div>

                {/* Material + Sizes */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Material</label>
                    <input type="text" value={formData.material} placeholder="Leather, Canvas…" className={inputCls}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Sizes <span className="normal-case font-normal text-taupe-400">(comma-sep)</span></label>
                    <input type="text" value={formData.sizes} placeholder="5, 6, 7, 8" className={inputCls}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className={labelCls}>Colors <span className="normal-case font-normal text-taupe-400">(comma-sep)</span></label>
                  <input type="text" value={formData.colors} placeholder="Red, Blue, Black" className={inputCls}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })} />
                </div>

                {/* Description */}
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={formData.description} rows={3} placeholder="Describe your product…"
                    className={`${inputCls} resize-none`}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                {/* ── Images section ── */}
                <div className="border-t border-taupe-200 pt-4">
                  <label className={labelCls}>Product Images</label>

                  {/* Existing images preview (edit mode) */}
                  {editingProduct && productImages.length > 0 && (
                    <div className="mb-3 p-3 bg-cream-50 rounded-lg border border-taupe-200">
                      <p className="text-xs font-semibold text-charcoal-600 mb-2">Current images ({productImages.length})</p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {productImages.slice(0, 5).map((img, idx) => (
                          <div key={img.id} className="relative flex-shrink-0">
                            <img src={img.image_url} alt={`img-${idx}`}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm" />
                            {img.is_primary && (
                              <span className="absolute -top-1 -right-1 bg-charcoal-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">1st</span>
                            )}
                          </div>
                        ))}
                        {productImages.length > 5 && (
                          <div className="w-16 h-16 bg-taupe-100 rounded-lg flex items-center justify-center text-xs font-semibold text-taupe-600 flex-shrink-0">
                            +{productImages.length - 5}
                          </div>
                        )}
                      </div>
                      <button type="button"
                        onClick={() => { setShowModal(false); handleManageImages(editingProduct); }}
                        className="text-xs text-charcoal-600 hover:text-charcoal-800 font-semibold mt-2 inline-flex items-center gap-1 underline underline-offset-2">
                        <ImageIcon size={12} /> Manage all images
                      </button>
                    </div>
                  )}

                  {/* Upload zone */}
                  <label className="block border-2 border-dashed border-taupe-300 hover:border-charcoal-400 rounded-lg p-4 text-center cursor-pointer transition-colors bg-cream-50 hover:bg-cream-100">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-white border border-taupe-200 rounded-lg flex items-center justify-center shadow-sm">
                        <Upload size={18} className="text-taupe-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal-700">Choose images</p>
                        <p className="text-xs text-taupe-500 mt-0.5">JPG, PNG, WebP · Max 5MB each · First = primary</p>
                      </div>
                    </div>
                    <input type="file" accept="image/*" multiple onChange={handleNewImagesSelect} className="hidden" />
                  </label>

                  {/* Selected new images */}
                  {newProductImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {newProductImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-cream-100 rounded-lg overflow-hidden border border-taupe-200">
                            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                          </div>
                          {index === 0 && (
                            <span className="absolute top-1 left-1 bg-charcoal-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-tight">Primary</span>
                          )}
                          <button type="button" onClick={() => removeNewImage(index)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Settings toggles ── */}
                <div className="border-t border-taupe-200 pt-4">
                  <label className={labelCls}>Product Settings</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'is_active', label: 'Active' },
                      { key: 'is_featured', label: 'Featured' },
                      { key: 'is_new_arrival', label: 'New Arrival' },
                      { key: 'is_limited_edition', label: 'Limited' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2.5 p-3 rounded-lg border border-taupe-200 hover:bg-cream-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="w-4 h-4 rounded accent-charcoal-800" />
                        <span className="text-sm text-charcoal-700 font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-taupe-200 pt-4 pb-1">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button type="submit"
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold shadow-md transition-all active:scale-95 text-sm">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                      className="px-5 py-3 bg-cream-100 hover:bg-taupe-200 text-charcoal-700 rounded-xl font-semibold transition-all text-sm">
                      Cancel
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          IMAGE MANAGER MODAL  
          — same shell as product form —
      ════════════════════════════════════ */}
      {showImageManager && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white w-full sm:max-w-2xl sm:mx-4 sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl" style={{ maxHeight: '92vh' }}>

            {/* Header — matches product modal exactly */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-taupe-200 flex-shrink-0">
              <div>
                <h3 className="text-lg font-heading font-bold text-charcoal-800">Manage Images</h3>
                <p className="text-xs text-taupe-500 mt-0.5 truncate max-w-[220px] sm:max-w-none">{editingProduct.name}</p>
              </div>
              <button
                onClick={() => { setShowImageManager(false); setEditingProduct(null); setProductImages([]); }}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors flex-shrink-0 mt-0.5"
              >
                <X size={18} className="text-charcoal-600" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 overscroll-contain p-5 space-y-5">

              {/* Upload new image */}
              <div>
                <label className={labelCls}>Upload New Image</label>
                <label className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${uploadingImage ? 'border-taupe-200 bg-taupe-50 opacity-60 pointer-events-none' : 'border-taupe-300 hover:border-charcoal-400 bg-cream-50 hover:bg-cream-100'}`}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-white border border-taupe-200 rounded-lg flex items-center justify-center shadow-sm">
                      {uploadingImage
                        ? <div className="w-5 h-5 border-2 border-taupe-300 border-t-charcoal-600 rounded-full animate-spin" />
                        : <Upload size={18} className="text-taupe-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">{uploadingImage ? 'Uploading…' : 'Choose an image'}</p>
                      <p className="text-xs text-taupe-500 mt-0.5">JPG, PNG, WebP · Max 5MB</p>
                    </div>
                  </div>
                  <input type="file" accept="image/*" disabled={uploadingImage}
                    onChange={(e) => handleImageUpload(e, editingProduct.id)} className="hidden" />
                </label>
              </div>

              {/* Current images grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelCls}>Current Images ({productImages.length})</label>
                </div>

                {productImages.length === 0 ? (
                  <div className="text-center py-12 bg-cream-50 rounded-lg border border-taupe-200">
                    <div className="w-12 h-12 bg-white border border-taupe-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <ImageIcon size={22} className="text-taupe-400" />
                    </div>
                    <p className="text-sm font-medium text-charcoal-600">No images yet</p>
                    <p className="text-xs text-taupe-400 mt-1">Upload your first image above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {productImages.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-cream-100 border border-taupe-200">
                          <img src={image.image_url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                        </div>

                        {/* Primary badge */}
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-charcoal-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                            <Star size={9} fill="currentColor" /> Primary
                          </div>
                        )}

                        {/* Order badge */}
                        <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                          #{image.order + 1}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteImage(editingProduct.id, image.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 sm:transition-opacity active:opacity-100 shadow-sm"
                          title="Delete image"
                        >
                          <Trash2 size={13} />
                        </button>

                        {/* On mobile: always show delete (no hover) */}
                        <button
                          onClick={() => handleDeleteImage(editingProduct.id, image.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg items-center justify-center flex sm:hidden shadow-sm"
                          title="Delete image"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-taupe-200 flex-shrink-0">
              <button
                onClick={() => { setShowImageManager(false); setEditingProduct(null); setProductImages([]); }}
                className="w-full py-3 bg-charcoal-800 hover:bg-charcoal-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}