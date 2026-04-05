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
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taupe-200 border-t-charcoal-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-taupe-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-800">Hero Banners</h2>
          <p className="text-sm text-taupe-600 mt-1">{banners.length} total banners</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl sm:rounded-2xl shadow-card border border-taupe-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5">
              <div>
                <p className="text-xs font-semibold text-taupe-600 mb-2 uppercase tracking-wide">Mobile View</p>
                <div className="relative rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={banner.mobile_image_url}
                    alt="Mobile banner"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-taupe-600 mb-2 uppercase tracking-wide">Desktop View</p>
                <div className="relative rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={banner.desktop_image_url}
                    alt="Desktop banner"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-taupe-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mt-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-charcoal-800 text-base sm:text-lg truncate">{banner.title || 'Untitled Banner'}</h3>
                  <p className="text-sm text-taupe-600 mt-1 line-clamp-2">{banner.subtitle}</p>
                  {banner.button_text && (
                    <p className="text-xs text-taupe-500 mt-2 truncate">
                      <span className="font-medium">Button:</span> {banner.button_text} → {banner.button_link}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-taupe-600 bg-taupe-100 px-2 py-1 rounded-lg">Order: {banner.order}</span>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    banner.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleEdit(banner)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-all text-sm font-medium"
                  aria-label="Edit banner"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => toggleActive(banner)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    banner.is_active 
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 active:bg-amber-200' 
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:bg-emerald-200'
                  }`}
                >
                  <span>{banner.is_active ? 'Deactivate' : 'Activate'}</span>
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:bg-red-200 transition-all text-sm font-medium sm:ml-auto"
                  aria-label="Delete banner"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
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
