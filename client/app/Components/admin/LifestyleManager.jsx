'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/api';

export default function LifestyleManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  // REMOVED: selectedSection state
  const [formData, setFormData] = useState({
    section: 'shop_by_style',
    title: '',
    description: '',
    link: '',
    layout: 'small',
    order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadImages();
  }, []); // REMOVED: dependency on selectedSection

  const loadImages = async () => {
    try {
      // Changed to always fetch all images
      const data = await api.getLifestyleImages(null, null);
      setImages(data);
    } catch (error) {
      console.error('Error loading lifestyle images:', error);
      alert('Error loading lifestyle images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingImage && !imageFile) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('section', formData.section);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('layout', formData.layout);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('is_active', formData.is_active);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingImage) {
        await api.updateLifestyleImage(editingImage.id, formDataToSend);
        alert('Image updated successfully!');
      } else {
        await api.createLifestyleImage(formDataToSend);
        alert('Image created successfully!');
      }

      setShowModal(false);
      resetForm();
      loadImages();
    } catch (error) {
      console.error('Error saving image:', error);
      alert(error.message || 'Error saving image');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      section: image.section,
      title: image.title,
      description: image.description || '',
      link: image.link || '',
      layout: image.layout,
      order: image.order,
      is_active: image.is_active,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await api.deleteLifestyleImage(id);
      loadImages();
      alert('Image deleted!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const resetForm = () => {
    setFormData({
      section: 'shop_by_style',
      title: '',
      description: '',
      link: '',
      layout: 'small',
      order: 0,
      is_active: true,
    });
    setImageFile(null);
    setEditingImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taupe-200 border-t-charcoal-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-taupe-600">Loading lifestyle images...</p>
        </div>
      </div>
    );
  }

  // REMOVED: shopByStyleImages and liveBeautifullyImages filters

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-800">Lifestyle Sections</h2>
          <p className="text-sm text-taupe-600 mt-1">Manage "Shop by Style" and "Live Beautifully" section images</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Image</span>
        </button>
      </div>

      {/* REMOVED: Filter Tabs Section */}

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-xl sm:rounded-2xl shadow-card border border-taupe-200 overflow-hidden hover:shadow-lg transition-all group">
            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
              <img 
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${
                  image.section === 'shop_by_style' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {image.section === 'shop_by_style' ? 'Shop by Style' : 'Live Beautifully'}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${
                  image.layout === 'large' ? 'bg-blush-100 text-blush-700' : 'bg-taupe-100 text-taupe-700'
                }`}>
                  {image.layout}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-charcoal-800 text-base truncate">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-taupe-600 mt-1 line-clamp-2">{image.description}</p>
                  )}
                  {image.link && (
                    <p className="text-xs text-taupe-500 mt-1 truncate">Link: {image.link}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-taupe-600 bg-taupe-100 px-2 py-1 rounded-lg">Order: {image.order}</span>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    image.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {image.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(image)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-all text-sm font-medium"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 rounded-lg transition-all text-sm font-medium"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            No lifestyle images yet. Click "Add Image" to create one.
          </div>
        )}
      </div>

      {/* Modal remains unchanged to allow categorization during creation/edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingImage ? 'Edit Lifestyle Image' : 'Add New Lifestyle Image'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="shop_by_style">Shop by Style</option>
                  <option value="live_beautifully">Live Beautifully</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Everyday Elegance"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Discover slippers that transition seamlessly..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., /category/casual"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                  <select
                    value={formData.layout}
                    onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {!editingImage && '*'}
                </label>
                {editingImage && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <img 
                      src={editingImage.image_url}
                      alt="Current"
                      className="w-48 h-32 object-cover rounded border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a new image to replace it (optional)</p>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    required={!editingImage}
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {imageFile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white transition-all disabled:opacity-50"
                >
                  {uploading ? (editingImage ? 'Updating...' : 'Creating...') : (editingImage ? 'Update Image' : 'Create Image')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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