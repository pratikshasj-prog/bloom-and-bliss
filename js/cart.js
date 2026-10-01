/**
 * Bloom & Bliss - Shopping Cart & Wishlist State Management
 * Handles localStorage persistence, quantity manipulation, discount coupons,
 * delivery fee calculation, toast alerts, and real-time UI synchronization.
 */

// Toast notification function
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-in`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
  } else if (type === 'info') {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <p class="toast-text">${message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close notification">&times;</button>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after 3.8 seconds
  setTimeout(() => {
    toast.classList.add('animate-slide-out');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

// Master Cart Manager
const Cart = {
  STORAGE_KEY: 'bloom_cart_items',
  COUPON_KEY: 'bloom_applied_coupon',

  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.notifyUpdate();
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  },

  addItem(productId, quantity = 1, options = {}) {
    const product = window.ProductStore ? window.ProductStore.getById(productId) : null;
    if (!product) {
      showToast('Product not found', 'error');
      return false;
    }

    let items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
      if (options.giftWrap !== undefined) items[existingIndex].giftWrap = options.giftWrap;
      if (options.message !== undefined) items[existingIndex].message = options.message;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity: Math.max(1, quantity),
        giftWrap: options.giftWrap || false,
        message: options.message || ''
      });
    }

    this.saveItems(items);
    showToast(`Added "${product.name}" to cart!`, 'success');
    return true;
  },

  updateQuantity(productId, deltaOrExact, isExact = false) {
    let items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (!item) return;

    if (isExact) {
      item.quantity = Math.max(1, parseInt(deltaOrExact, 10) || 1);
    } else {
      item.quantity += deltaOrExact;
    }

    if (item.quantity <= 0) {
      this.removeItem(productId, false);
      return;
    }

    this.saveItems(items);
  },

  removeItem(productId, showNotification = true) {
    let items = this.getItems();
    const item = items.find(i => i.id === productId);
    items = items.filter(i => i.id !== productId);
    this.saveItems(items);
    if (showNotification && item) {
      showToast(`Removed "${item.name}" from cart`, 'info');
    }
  },

  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.COUPON_KEY);
    this.notifyUpdate();
    showToast('Cart cleared', 'info');
  },

  getCount() {
    return this.getItems().reduce((acc, item) => acc + item.quantity, 0);
  },

  getSubtotal() {
    return this.getItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  },

  getDeliveryCharge() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    // Free delivery above ₹999, else ₹99 standard express delivery
    return subtotal >= 999 ? 0 : 99;
  },

  getCoupon() {
    try {
      const saved = localStorage.getItem(this.COUPON_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  applyCoupon(code) {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const clean = code.trim().toUpperCase();
    const subtotal = this.getSubtotal();

    if (subtotal === 0) {
      return { success: false, message: 'Your cart is empty!' };
    }

    if (clean === 'BLOOM10') {
      const discount = Math.round(subtotal * 0.10);
      const couponObj = { code: 'BLOOM10', discount, description: '10% Off Everything' };
      localStorage.setItem(this.COUPON_KEY, JSON.stringify(couponObj));
      this.notifyUpdate();
      return { success: true, message: 'Coupon BLOOM10 applied! You saved 10%.' };
    } else if (clean === 'FIRST150') {
      if (subtotal < 1200) {
        return { success: false, message: 'Code FIRST150 requires a minimum order of ₹1,200.' };
      }
      const couponObj = { code: 'FIRST150', discount: 150, description: '₹150 Off First Order' };
      localStorage.setItem(this.COUPON_KEY, JSON.stringify(couponObj));
      this.notifyUpdate();
      return { success: true, message: 'Coupon FIRST150 applied! ₹150 discount applied.' };
    } else if (clean === 'FREEDEL') {
      const couponObj = { code: 'FREEDEL', discount: 99, description: 'Free Express Delivery' };
      localStorage.setItem(this.COUPON_KEY, JSON.stringify(couponObj));
      this.notifyUpdate();
      return { success: true, message: 'Free Delivery coupon applied!' };
    }

    return { success: false, message: 'Invalid or expired coupon code. Try BLOOM10.' };
  },

  removeCoupon() {
    localStorage.removeItem(this.COUPON_KEY);
    this.notifyUpdate();
    showToast('Coupon removed', 'info');
  },

  getDiscount() {
    const coupon = this.getCoupon();
    if (!coupon) return 0;
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return Math.min(coupon.discount, subtotal);
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    const delivery = this.getDeliveryCharge();
    const discount = this.getDiscount();
    return Math.max(0, subtotal + delivery - discount);
  },

  notifyUpdate() {
    window.dispatchEvent(new CustomEvent('bloom:cart-updated', {
      detail: {
        count: this.getCount(),
        subtotal: this.getSubtotal(),
        total: this.getTotal(),
        items: this.getItems()
      }
    }));
    this.updateBadges();
  },

  updateBadges() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }
};

// Master Wishlist Manager
const Wishlist = {
  STORAGE_KEY: 'bloom_wishlist_items',

  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveItems(ids) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
      this.notifyUpdate();
    } catch (e) {
      console.error(e);
    }
  },

  has(productId) {
    return this.getItems().includes(productId);
  },

  toggle(productId) {
    let ids = this.getItems();
    const product = window.ProductStore ? window.ProductStore.getById(productId) : null;
    const prodName = product ? product.name : 'Item';

    if (ids.includes(productId)) {
      ids = ids.filter(id => id !== productId);
      this.saveItems(ids);
      showToast(`Removed "${prodName}" from wishlist`, 'info');
      return false;
    } else {
      ids.push(productId);
      this.saveItems(ids);
      showToast(`Saved "${prodName}" to wishlist!`, 'success');
      return true;
    }
  },

  moveToCart(productId) {
    Cart.addItem(productId, 1);
    this.remove(productId);
  },

  remove(productId) {
    let ids = this.getItems().filter(id => id !== productId);
    this.saveItems(ids);
  },

  getCount() {
    return this.getItems().length;
  },

  notifyUpdate() {
    window.dispatchEvent(new CustomEvent('bloom:wishlist-updated', {
      detail: { count: this.getCount(), items: this.getItems() }
    }));
    this.updateBadges();
  },

  updateBadges() {
    const badges = document.querySelectorAll('.wishlist-badge');
    const count = this.getCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }
};

// Global exports
window.Cart = Cart;
window.Wishlist = Wishlist;
window.showToast = showToast;

// Initialize badges on page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadges();
  Wishlist.updateBadges();
});
