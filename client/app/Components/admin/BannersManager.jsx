'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import api from '../../lib/api';

export default function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    is_active: true,
    order: 0,
  });
  const [mobileImage, setMobileImage] = useState(null);
  const [desktopImage, setDesktopImage] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await api.getBanners(null);
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      alert('Error loading banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For edit mode, images are optional (only update if new ones are selected)
    // For create mode, images are required
    if (!editingBanner && (!mobileImage || !desktopImage)) {
      alert('Please select both mobile and desktop images');
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('button_text', formData.button_text);
      formDataToSend.append('button_link', formData.button_link);
      
      // Only append images if they were selected
      if (mobileImage) {
        formDataToSend.append('mobile_image', mobileImage);
      }
      if (desktopImage) {
        formDataToSend.append('desktop_image', desktopImage);
      }
      
      formDataToSend.append('is_active', formData.is_active);
      formDataToSend.append('order', formData.order);

      if (editingBanner) {
        // Update existing banner
        await api.updateBanner(editingBanner.id, formDataToSend);
        alert('Banner updated successfully!');
      } else {
        // Create new banner
        await api.uploadBanner(formDataToSend);
        alert('Banner created successfully!');
      }

      setShowModal(false);
      resetForm();
      loadBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error.message || 'Error saving banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await api.deleteBanner(id);
      loadBanners();
      alert('Banner deleted!');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Error deleting banner');
    }
  };

  const toggleActive = async (banner) => {
    try {
      await api.updateBanner(banner.id, { is_active: !banner.is_active });
      loadBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Error updating banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      is_active: banner.is_active,
      order: banner.order,
    });
    setMobileImage(null);
    setDesktopImage(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      is_active: true,
      order: 0,
    });
    setMobileImage(null);
    setDesktopImage(null);
    setEditingBanner(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hero Banners ({banners.length})</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Mobile View</p>
                <img 
                  src={banner.mobile_image_url}
                  alt="Mobile banner"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Desktop View</p>
                <img 
                  src={banner.desktop_image_url}
                  alt="Desktop banner"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{banner.title || 'Untitled Banner'}</h3>
                  <p className="text-sm text-gray-600">{banner.subtitle}</p>
                  {banner.button_text && (
                    <p className="text-xs text-gray-500 mt-1">
                      Button: {banner.button_text} → {banner.button_link}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Order: {banner.order}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(banner)}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  {banner.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            No banners yet. Click "Add Banner" to create one.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Summer Collection 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Discover our latest designs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="e.g., Shop Now"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="e.g., /new-arrivals"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Image {!editingBanner && '*'} (Recommended: 768x1024px)
                </label>
                {editingBanner && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <img 
                      src={editingBanner.mobile_image_url}
                      alt="Current mobile banner"
                      className="w-32 h-32 object-cover rounded border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a new image to replace it (optional)</p>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMobileImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    required={!editingBanner}
                  />
                  {mobileImage && (
                    <p className="mt-2 text-sm text-green-600">✓ {mobileImage.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desktop Image {!editingBanner && '*'} (Recommended: 1920x600px)
                </label>
                {editingBanner && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <img 
                      src={editingBanner.desktop_image_url}
                      alt="Current desktop banner"
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
                    onChange={(e) => setDesktopImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    required={!editingBanner}
                  />
                  {desktopImage && (
                    <p className="mt-2 text-sm text-green-600">✓ {desktopImage.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
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
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {uploading ? (editingBanner ? 'Updating...' : 'Uploading...') : (editingBanner ? 'Update Banner' : 'Create Banner')}
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
