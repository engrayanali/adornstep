'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
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
      const sizesArray = formData.sizes
        ? formData.sizes.split(',').map(s => s.trim()).filter(s => s)
        : [];
      const colorsArray = formData.colors
        ? formData.colors.split(',').map(c => c.trim()).filter(c => c)
        : [];

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
    
    const sizesStr = product.sizes ? (() => {
      try {
        const parsed = JSON.parse(product.sizes);
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch (e) {
        return product.sizes;
      }
    })() : '';
    
    const colorsStr = product.colors ? (() => {
      try {
        const parsed = JSON.parse(product.colors);
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch (e) {
        return product.colors;
      }
    })() : '';
    
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      discount_price: product.discount_price ? product.discount_price.toString() : '',
      category_id: product.category_id.toString(),
      sizes: sizesStr,
      colors: colorsStr,
      material: product.material || '',
      stock: product.stock.toString(),
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      is_limited_edition: product.is_limited_edition,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
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

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const isPrimary = productImages.length === 0;
      const order = productImages.length;
      await api.uploadProductImage(productId, file, isPrimary, order);
      
      const images = await api.getProductImages(productId);
      setProductImages(images);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (productId, imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await api.deleteProductImage(productId, imageId);
      const images = await api.getProductImages(productId);
      setProductImages(images);
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      loadData();
      alert('Product deleted!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
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
    setNewProductImages([]);
    setProductImages([]);
  };

  const handleNewImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    setNewProductImages(prev => [...prev, ...validFiles]);
  };

  const removeNewImage = (index) => {
    setNewProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taupe-200 border-t-charcoal-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-taupe-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-800">Products</h2>
          <p className="text-sm text-taupe-600 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-blush-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-taupe-200 shadow-card overflow-hidden">
        {/* FIX: overflow-x-auto with min-width wrapper for mobile scroll */}
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: '600px' }}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cream-50 to-taupe-50 border-b border-taupe-200">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-charcoal-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe-100">
                {products.map((product) => {
                  const category = categories.find(c => c && c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cream-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.images && product.images.length > 0 && product.images[0].image_url ? (
                              <img src={product.images[0].image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={20} className="text-taupe-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-charcoal-800 text-sm sm:text-base truncate">{product.name}</div>
                            <div className="text-xs text-taupe-500 truncate">{category?.name || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-charcoal-700">{category?.name || 'N/A'}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-semibold text-charcoal-800">Rs {product.price}</div>
                        {product.discount_price && (
                          <div className="text-xs text-emerald-600 font-medium">Rs {product.discount_price}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleManageImages(product)}
                            className="p-1.5 sm:p-2 text-purple-600 hover:bg-purple-50 active:bg-purple-100 rounded-lg transition-all focus:outline-none"
                            title="Manage Images"
                          >
                            <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all focus:outline-none"
                            title="Edit"
                          >
                            <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all focus:outline-none"
                            title="Delete"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
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

        {products.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-taupe-100 to-blush-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={32} className="text-taupe-400" />
            </div>
            <p className="text-taupe-700 font-semibold mb-2">No products yet</p>
            <p className="text-sm text-taupe-500 mb-6">Get started by adding your first product</p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blush-500 to-blush-600 text-white rounded-lg hover:from-blush-600 hover:to-blush-700 transition-all shadow-md font-medium"
            >
              Create your first product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-3xl my-4 shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">

            <div className="sticky top-0 bg-gradient-to-r from-blush-50 to-cream-50 border-b border-taupe-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl sm:rounded-t-2xl z-10">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-charcoal-800 truncate">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs sm:text-sm text-taupe-600 mt-1">
                  {editingProduct ? 'Update product information' : 'Fill in the product details below'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-cream-200 rounded-lg transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} className="text-charcoal-700" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (!editingProduct) {
                          setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white font-mono"
                      placeholder="product-slug"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Price (Rs) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Discount Price (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_price}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                      placeholder="Leather, Canvas, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                      Sizes <span className="text-xs text-taupe-500 font-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="5, 6, 7, 8, 9"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                      Colors <span className="text-xs text-taupe-500 font-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Red, Blue, Pink, Black"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2.5 border border-taupe-300 rounded-xl focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all text-sm bg-white resize-vertical"
                    placeholder="Describe your product..."
                  ></textarea>
                </div>

                {/* Product Images Upload Section */}
                <div className="border-t border-taupe-200 pt-5">
                  <label className="block text-sm font-semibold text-charcoal-700 mb-3">
                    Product Images {!editingProduct && <span className="text-xs text-taupe-500 font-normal">(Upload after creating or select now)</span>}
                  </label>
                  
                  {editingProduct && productImages.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-xs font-semibold text-blue-700 mb-2">Current Images ({productImages.length}):</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {productImages.slice(0, 4).map((img, idx) => (
                          <div key={img.id} className="relative flex-shrink-0">
                            <img 
                              src={img.image_url} 
                              alt={`Product ${idx + 1}`}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                            />
                            {img.is_primary && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">1st</span>
                            )}
                          </div>
                        ))}
                        {productImages.length > 4 && (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-taupe-100 rounded-lg border-2 border-taupe-200 flex items-center justify-center text-xs font-semibold text-taupe-600">
                            +{productImages.length - 4}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          handleManageImages(editingProduct);
                        }}
                        className="text-xs text-blush-600 hover:text-blush-700 font-semibold mt-2 inline-flex items-center gap-1"
                      >
                        <ImageIcon size={14} />
                        Manage all images
                      </button>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-taupe-300 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-cream-50 to-white hover:border-blush-400 transition-colors">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-taupe-100 to-blush-100 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-taupe-500" />
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImagesSelect}
                      className="block w-full text-xs sm:text-sm text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blush-500 file:to-blush-600 file:text-white hover:file:from-blush-600 hover:file:to-blush-700 file:cursor-pointer file:transition-all"
                    />
                    <p className="text-xs text-taupe-600 mt-3 text-center">
                      Upload multiple images (Max 5MB each). <span className="font-semibold">First image = Primary</span>
                    </p>
                  </div>

                  {newProductImages.length > 0 && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-700 mb-3">
                        Selected Images ({newProductImages.length}):
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                        {newProductImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-taupe-100 rounded-xl border-2 border-white overflow-hidden shadow-sm">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {index === 0 && (
                              <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                Primary
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-1.5 -right-1.5 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                            >
                              <X size={14} />
                            </button>
                            <p className="text-[10px] text-taupe-600 mt-1 truncate font-medium">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-taupe-200 pt-5">
                  <p className="text-sm font-semibold text-charcoal-700 mb-3">Product Settings</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl border border-taupe-200 hover:bg-cream-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded text-blush-500 focus:ring-2 focus:ring-blush-400"
                      />
                      <span className="text-sm text-charcoal-700 font-medium">Active</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-taupe-200 hover:bg-cream-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-blush-500 focus:ring-2 focus:ring-blush-400"
                      />
                      <span className="text-sm text-charcoal-700 font-medium">Featured</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-taupe-200 hover:bg-cream-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.is_new_arrival}
                        onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                        className="w-4 h-4 rounded text-blush-500 focus:ring-2 focus:ring-blush-400"
                      />
                      <span className="text-sm text-charcoal-700 font-medium">New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-taupe-200 hover:bg-cream-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.is_limited_edition}
                        onChange={(e) => setFormData({ ...formData, is_limited_edition: e.target.checked })}
                        className="w-4 h-4 rounded text-blush-500 focus:ring-2 focus:ring-blush-400"
                      />
                      <span className="text-sm text-charcoal-700 font-medium">Limited</span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="border-t border-taupe-200 pt-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-blush-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base"
                    >
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-3 bg-taupe-100 hover:bg-taupe-200 text-charcoal-700 rounded-xl font-semibold transition-all duration-200 active:scale-95 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Manager Modal */}
      {showImageManager && editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl my-4 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 text-white flex justify-between items-center flex-shrink-0 rounded-t-xl sm:rounded-t-2xl">
              <div>
                <h3 className="text-xl sm:text-2xl font-heading">Manage Images</h3>
                <p className="text-xs sm:text-sm opacity-90 mt-1">{editingProduct.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowImageManager(false);
                  setEditingProduct(null);
                  setProductImages([]);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, editingProduct.id)}
                    disabled={uploadingImage}
                    className="flex-1 w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:cursor-pointer"
                  />
                  {uploadingImage && (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 5MB. Accepted formats: JPG, PNG, WebP
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {productImages.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm sm:text-base">No images uploaded yet</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Upload your first image above</p>
                  </div>
                ) : (
                  productImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                        <img
                          src={image.image_url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {image.is_primary && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteImage(editingProduct.id, image.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Delete image"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Order: {image.order + 1}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}