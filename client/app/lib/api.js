// API configuration and helper functions

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to convert relative image URLs to absolute URLs
const normalizeImageUrl = (url) => {
  if (!url || url === '') {
    console.log('[API] normalizeImageUrl: null/empty URL');
    return null; // Return null for empty/missing URLs
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log('[API] normalizeImageUrl: already absolute:', url);
    return url; // Already absolute
  }
  if (url.startsWith('/uploads/')) {
    const normalized = `${API_URL}${url}`;
    console.log('[API] normalizeImageUrl: converted', url, 'to', normalized);
    return normalized; // Convert relative to absolute
  }
  console.log('[API] normalizeImageUrl: returned as-is:', url);
  return url;
};

// Helper function to normalize product data with image URLs
const normalizeProductData = (product) => {
  if (!product) return product;
  const normalizedImages = product.images?.map(img => ({
    ...img,
    image_url: normalizeImageUrl(img.image_url)
  })) || [];
  
  return {
    ...product,
    images: normalizedImages
  };
};

// Helper function to normalize category data
const normalizeCategoryData = (category) => {
  if (!category) return category;
  return {
    ...category,
    image_url: normalizeImageUrl(category.image_url)
  };
};

// Helper function to normalize banner data
const normalizeBannerData = (banner) => {
  if (!banner) return banner;
  const normalized = {
    ...banner,
    mobile_image_url: normalizeImageUrl(banner.mobile_image_url),
    desktop_image_url: normalizeImageUrl(banner.desktop_image_url)
  };
  console.log('[API] Banner normalized:', {
    original_mobile: banner.mobile_image_url,
    normalized_mobile: normalized.mobile_image_url,
    original_desktop: banner.desktop_image_url,
    normalized_desktop: normalized.desktop_image_url
  });
  return normalized;
};

// Helper function to normalize lifestyle image data
const normalizeLifestyleImageData = (image) => {
  if (!image) return image;
  return {
    ...image,
    image_url: normalizeImageUrl(image.image_url)
  };
};

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Don't set Content-Type for FormData, let browser handle it
    const headers = options.isFormData ? {} : {
      'Content-Type': 'application/json',
    };
    
    const config = {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    };
    
    // Remove isFormData from config as it's not a valid fetch option
    delete config.isFormData;

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('[API] Request to:', endpoint, 'with token:', token.substring(0, 20) + '...');
      } else {
        console.log('[API] Request to:', endpoint, 'without token');
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        console.error('[API] Request failed:', {
          endpoint,
          status: response.status,
          error: error.detail,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      console.log('[API] Request successful:', endpoint);
      return data;
    } catch (error) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async verifyToken() {
    return this.request('/api/auth/verify', { method: 'POST' });
  }

  // Categories
  async getCategories(isActive = true) {
    const params = isActive !== null ? `?is_active=${isActive}` : '';
    const data = await this.request(`/api/categories/${params}`);
    return Array.isArray(data) ? data.map(normalizeCategoryData) : data;
  }

  async getCategory(slug) {
    const data = await this.request(`/api/categories/slug/${slug}`);
    return normalizeCategoryData(data);
  }

  async createCategory(data) {
    return this.request('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id, data) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id) {
    return this.request(`/api/categories/${id}`, { method: 'DELETE' });
  }

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    const queryString = params.toString();
    const data = await this.request(`/api/products/${queryString ? '?' + queryString : ''}`);
    return Array.isArray(data) ? data.map(normalizeProductData) : data;
  }

  async getProduct(id) {
    const data = await this.request(`/api/products/${id}`);
    return normalizeProductData(data);
  }

  async getProductBySlug(slug) {
    const data = await this.request(`/api/products/slug/${slug}`);
    return normalizeProductData(data);
  }

  async createProduct(data) {
    return this.request('/api/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id, data) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, { method: 'DELETE' });
  }

  async searchProducts(query) {
    return this.request(`/api/products/search?q=${encodeURIComponent(query)}`);
  }

  async uploadProductImage(productId, file, isPrimary = false, order = 0) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_primary', isPrimary);
    formData.append('order', order);

    return this.request(`/api/products/${productId}/images`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async getProductImages(productId) {
    return this.request(`/api/products/${productId}/images`);
  }

  async deleteProductImage(productId, imageId) {
    return this.request(`/api/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  // Hero Banners
  async getBanners(isActive = true) {
    const params = isActive !== null ? `?is_active=${isActive}` : '';
    const data = await this.request(`/api/banners/${params}`);
    return Array.isArray(data) ? data.map(normalizeBannerData) : data;
  }

  async createBanner(data) {
    return this.request('/api/banners/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadBanner(formData) {
    return this.request('/api/banners/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async updateBanner(id, formData) {
    const data = await this.request(`/api/banners/${id}`, {
      method: 'PUT',
      body: formData,
      isFormData: true,
    });
    return normalizeBannerData(data);
  }

  async deleteBanner(id) {
    return this.request(`/api/banners/${id}`, { method: 'DELETE' });
  }

  // Orders
  async getOrders(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    const queryString = params.toString();
    return this.request(`/api/orders/${queryString ? '?' + queryString : ''}`);
  }

  async getOrder(id) {
    return this.request(`/api/orders/${id}`);
  }

  async getOrderByNumber(orderNumber) {
    return this.request(`/api/orders/number/${orderNumber}`);
  }

  async createOrder(data) {
    return this.request('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id, data) {
    return this.request(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrder(id) {
    return this.request(`/api/orders/${id}`, { method: 'DELETE' });
  }

  // Lifestyle Images
  async getLifestyleImages(section = null, isActive = true) {
    let url = '/api/lifestyle/';
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (isActive !== null) params.append('is_active', isActive);
    if (params.toString()) url += `?${params.toString()}`;
    const data = await this.request(url);
    return Array.isArray(data) ? data.map(normalizeLifestyleImageData) : data;
  }

  async createLifestyleImage(formData) {
    const data = await this.request('/api/lifestyle/', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
    return normalizeLifestyleImageData(data);
  }

  async updateLifestyleImage(imageId, formData) {
    const data = await this.request(`/api/lifestyle/${imageId}`, {
      method: 'PUT',
      body: formData,
      isFormData: true,
    });
    return normalizeLifestyleImageData(data);
  }

  async deleteLifestyleImage(imageId) {
    return this.request(`/api/lifestyle/${imageId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
export default api;
