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
  const [selectedSection, setSelectedSection] = useState('all');
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
  }, [selectedSection]);

  const loadImages = async () => {
    try {
      const section = selectedSection === 'all' ? null : selectedSection;
      const data = await api.getLifestyleImages(section, null);
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
    return <div className="text-center py-8">Loading...</div>;
  }

  const shopByStyleImages = images.filter(img => img.section === 'shop_by_style');
  const liveBeautifullyImages = images.filter(img => img.section === 'live_beautifully');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lifestyle Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Manage "Shop by Style" and "Live Beautifully" section images</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
        >
          <Plus size={20} />
          Add Image
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedSection('all')}
          className={`px-4 py-2 rounded-lg transition-colors focus:outline-none ${
            selectedSection === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          All ({images.length})
        </button>
        <button
          onClick={() => setSelectedSection('shop_by_style')}
          className={`px-4 py-2 rounded-lg transition-colors focus:outline-none ${
            selectedSection === 'shop_by_style' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          Shop by Style ({shopByStyleImages.length})
        </button>
        <button
          onClick={() => setSelectedSection('live_beautifully')}
          className={`px-4 py-2 rounded-lg transition-colors focus:outline-none ${
            selectedSection === 'live_beautifully' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          Live Beautifully ({liveBeautifullyImages.length})
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-64">
              <img 
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  image.section === 'shop_by_style' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {image.section === 'shop_by_style' ? 'Shop by Style' : 'Live Beautifully'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  image.layout === 'large' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.layout}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                  )}
                  {image.link && (
                    <p className="text-xs text-gray-500 mt-1">Link: {image.link}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Order: {image.order}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {image.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(image)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 rounded-lg transition-colors focus:outline-none"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors focus:outline-none"
                >
                  Delete
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

      {/* Modal */}
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
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
