// Shopping cart management using localStorage

export const CART_STORAGE_KEY = 'adornsteps_cart';

export const getCart = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

export const saveCart = (cart) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const addToCart = (product, quantity = 1, size = null, color = null) => {
  const cart = getCart();
  
  // Check if item already exists with same size and color
  const existingIndex = cart.findIndex(
    item => 
      item.id === product.id && 
      item.size === size && 
      item.color === color
  );
  
  if (existingIndex !== -1) {
    // Update quantity
    cart[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.discount_price || product.price,
      originalPrice: product.price,
      quantity,
      size,
      color,
      image: product.primaryImage || null,
    });
  }
  
  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId, size = null, color = null) => {
  let cart = getCart();
  cart = cart.filter(
    item => !(item.id === productId && item.size === size && item.color === color)
  );
  saveCart(cart);
  return cart;
};

export const updateCartItemQuantity = (productId, quantity, size = null, color = null) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    item => 
      item.id === productId && 
      item.size === size && 
      item.color === color
  );
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }
  
  return cart;
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
