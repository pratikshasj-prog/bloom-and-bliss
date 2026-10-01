/**
 * Bloom & Bliss - Main JavaScript File
 * Handles Navbar, Mobile Drawer, Cart Slide-over, Search Autocomplete,
 * Quick View Modal, Reusable Product Cards, Newsletter, and UI interactions.
 */

// Fallback image SVG for any image loading error
const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20fill%3D%22%23FFF7F8%22%20width%3D%22400%22%20height%3D%22400%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22180%22%20r%3D%2260%22%20fill%3D%22%23F3C5C5%22%2F%3E%3Cpath%20d%3D%22M200%20140%20C210%20100%2C%20240%20120%2C%20220%20150%20C250%20140%2C%20260%20170%2C%20230%20180%20C250%20200%2C%20230%20230%2C%20200%20210%20C170%20230%2C%20150%20200%2C%20170%20180%20C140%20170%2C%20150%20140%2C%20180%20150%20Z%22%20fill%3D%22%23E07A7A%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22180%22%20r%3D%2220%22%20fill%3D%22%23FFFDF9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%22290%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22600%22%20fill%3D%22%236A5A58%22%20text-anchor%3D%22middle%22%3EBloom%20%26%20Bliss%3C%2Ftext%3E%3C%2Fsvg%3E';

// Helper to format Indian Currency
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Render standard reusable Product Card
 */
function createProductCard(product) {
  const isWishlisted = window.Wishlist && window.Wishlist.has(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image-wrap">
        ${product.badge ? `<span class="product-badge badge-${product.badge.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${product.badge}</span>` : ''}
        ${discount > 0 ? `<span class="product-discount-badge">${discount}% OFF</span>` : ''}
        
        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" 
                onclick="handleWishlistClick(event, '${product.id}')" 
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                aria-label="Wishlist">
          <svg viewBox="0 0 24 24" class="icon-heart" fill="${isWishlisted ? '#E07A7A' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <img src="${product.image}" 
             alt="${product.name}" 
             class="product-image" 
             loading="lazy" 
             onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';" />

        <div class="product-overlay">
          <button class="btn-quick-view" onclick="openQuickView('${product.id}')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Quick View
          </button>
        </div>
      </div>

      <div class="product-info">
        <div class="product-rating">
          <div class="stars">
            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span class="rating-num">${product.rating}</span>
          <span class="reviews-count">(${product.reviewsCount})</span>
        </div>

        <h3 class="product-title" onclick="openQuickView('${product.id}')" title="${product.name}">
          ${product.name}
        </h3>

        <p class="product-short-desc">${product.shortDesc}</p>

        <div class="product-price-row">
          <div class="price-container">
            <span class="current-price">${formatINR(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatINR(product.originalPrice)}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="handleAddToCart('${product.id}')" title="Add to Cart">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Global button handlers
function handleAddToCart(productId) {
  if (window.Cart) {
    window.Cart.addItem(productId, 1);
  }
}

function handleWishlistClick(event, productId) {
  event.stopPropagation();
  if (window.Wishlist) {
    const isAdded = window.Wishlist.toggle(productId);
    const btn = event.currentTarget;
    btn.classList.toggle('active', isAdded);
    const heart = btn.querySelector('.icon-heart');
    if (heart) {
      heart.setAttribute('fill', isAdded ? '#E07A7A' : 'none');
    }
  }
}

/**
 * Quick View Modal Logic
 */
function openQuickView(productId) {
  const product = window.ProductStore ? window.ProductStore.getById(productId) : null;
  if (!product) return;

  let modal = document.getElementById('quick-view-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quick-view-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const isWishlisted = window.Wishlist && window.Wishlist.has(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  modal.innerHTML = `
    <div class="modal-dialog modal-quick-view animate-scale-up">
      <button class="modal-close" onclick="closeQuickView()" aria-label="Close modal">&times;</button>
      
      <div class="modal-grid">
        <div class="modal-image-col">
          <img src="${product.image}" 
               alt="${product.name}" 
               class="modal-product-img" 
               onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';" />
          ${product.badge ? `<span class="product-badge modal-badge">${product.badge}</span>` : ''}
        </div>

        <div class="modal-details-col">
          <div class="product-rating">
            <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
            <span class="rating-num">${product.rating}</span>
            <span class="reviews-count">(${product.reviewsCount} customer reviews)</span>
          </div>

          <h2 class="modal-title">${product.name}</h2>
          
          <div class="modal-price-box">
            <span class="modal-price">${formatINR(product.price)}</span>
            ${product.originalPrice ? `<span class="modal-original-price">${formatINR(product.originalPrice)}</span>` : ''}
            ${discount > 0 ? `<span class="modal-savings">Save ${discount}%</span>` : ''}
          </div>

          <p class="modal-desc">${product.description}</p>

          <div class="modal-features">
            <h4 class="features-title">Highlights:</h4>
            <ul>
              ${product.features ? product.features.map(f => `<li><span class="feat-check">✓</span> ${f}</li>`).join('') : '<li>Freshness guaranteed</li>'}
            </ul>
          </div>

          <!-- Options -->
          <div class="modal-options">
            <label class="custom-checkbox">
              <input type="checkbox" id="modal-gift-wrap" />
              <span class="checkmark"></span>
              Add Premium Gift Packaging with Satin Ribbon (+₹99)
            </label>
            <div class="gift-msg-box">
              <input type="text" id="modal-gift-note" class="input-text" placeholder="Add free personalized message note..." maxlength="120" />
            </div>
          </div>

          <!-- Quantity & Actions -->
          <div class="modal-actions-row">
            <div class="qty-counter">
              <button type="button" class="qty-btn" onclick="updateModalQty(-1)">-</button>
              <input type="number" id="modal-qty-input" value="1" min="1" max="15" readonly />
              <button type="button" class="qty-btn" onclick="updateModalQty(1)">+</button>
            </div>

            <button class="btn btn-primary btn-modal-cart" onclick="addModalItemToCart('${product.id}', false)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Cart
            </button>

            <button class="btn btn-secondary btn-modal-buy" onclick="addModalItemToCart('${product.id}', true)">
              Buy Now
            </button>

            <button class="btn-icon-wishlist ${isWishlisted ? 'active' : ''}" onclick="handleWishlistClick(event, '${product.id}')" title="Save to wishlist">
              <svg viewBox="0 0 24 24" class="icon-heart" fill="${isWishlisted ? '#E07A7A' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div class="modal-perks">
            <span>🌸 Same-day express dispatch</span>
            <span>🔒 100% Secure Checkout</span>
            <span>🍃 Farm-Fresh Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Backdrop click closes
  modal.onclick = (e) => {
    if (e.target === modal) closeQuickView();
  };
}

function updateModalQty(delta) {
  const input = document.getElementById('modal-qty-input');
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, Math.min(20, val + delta));
  input.value = val;
}

function addModalItemToCart(productId, buyNow = false) {
  const qtyInput = document.getElementById('modal-qty-input');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
  const wrapCheck = document.getElementById('modal-gift-wrap');
  const noteInput = document.getElementById('modal-gift-note');

  if (window.Cart) {
    window.Cart.addItem(productId, qty, {
      giftWrap: wrapCheck ? wrapCheck.checked : false,
      message: noteInput ? noteInput.value.trim() : ''
    });
  }

  closeQuickView();

  if (buyNow) {
    window.location.href = 'checkout.html';
  }
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Slide-Over Cart Drawer Logic
 */
function toggleCartDrawer() {
  let drawer = document.getElementById('cart-drawer');
  if (!drawer) {
    createCartDrawerDOM();
    drawer = document.getElementById('cart-drawer');
  }
  
  if (drawer.classList.contains('active')) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    renderCartDrawerContent();
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function createCartDrawerDOM() {
  const drawerHTML = `
    <div id="cart-drawer" class="cart-drawer-overlay">
      <div class="cart-drawer-panel">
        <div class="cart-drawer-header">
          <div class="cart-drawer-title">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <h3>Your Shopping Cart</h3>
            <span class="drawer-count-chip">(0 items)</span>
          </div>
          <button class="cart-drawer-close" onclick="toggleCartDrawer()">&times;</button>
        </div>

        <div class="cart-drawer-body" id="cart-drawer-items">
          <!-- Dynamic Cart Items -->
        </div>

        <div class="cart-drawer-footer" id="cart-drawer-footer">
          <!-- Dynamic Footer -->
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', drawerHTML);

  const drawer = document.getElementById('cart-drawer');
  drawer.onclick = (e) => {
    if (e.target === drawer) toggleCartDrawer();
  };
}

function renderCartDrawerContent() {
  const body = document.getElementById('cart-drawer-items');
  const footer = document.getElementById('cart-drawer-footer');
  const countChip = document.querySelector('.drawer-count-chip');
  if (!body || !footer || !window.Cart) return;

  const items = window.Cart.getItems();
  const count = window.Cart.getCount();
  if (countChip) countChip.textContent = `(${count} item${count === 1 ? '' : 's'})`;

  if (items.length === 0) {
    body.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🌸</div>
        <h4>Your basket is feeling empty</h4>
        <p>Explore our fresh blooms & curated gift hampers to share some joy!</p>
        <a href="flowers.html" class="btn btn-primary" onclick="toggleCartDrawer()">Explore Flowers</a>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = items.map(item => `
    <div class="drawer-cart-item">
      <img src="${item.image}" alt="${item.name}" class="drawer-item-img" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';" />
      <div class="drawer-item-details">
        <h4 class="drawer-item-title">${item.name}</h4>
        <div class="drawer-item-price">${formatINR(item.price)}</div>
        <div class="drawer-item-controls">
          <div class="qty-pill">
            <button onclick="window.Cart.updateQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.Cart.updateQuantity('${item.id}', 1)">+</button>
          </div>
          <button class="drawer-btn-remove" onclick="window.Cart.removeItem('${item.id}')" title="Remove item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = window.Cart.getSubtotal();
  const delivery = window.Cart.getDeliveryCharge();
  const discount = window.Cart.getDiscount();
  const total = window.Cart.getTotal();

  footer.innerHTML = `
    <div class="drawer-summary">
      <div class="drawer-summary-row">
        <span>Subtotal</span>
        <span>${formatINR(subtotal)}</span>
      </div>
      <div class="drawer-summary-row">
        <span>Delivery Fee</span>
        <span>${delivery === 0 ? '<span class="text-success">FREE</span>' : formatINR(delivery)}</span>
      </div>
      ${discount > 0 ? `
      <div class="drawer-summary-row text-success">
        <span>Discount Applied</span>
        <span>-${formatINR(discount)}</span>
      </div>` : ''}
      <div class="drawer-summary-total">
        <span>Estimated Total</span>
        <span class="total-price">${formatINR(total)}</span>
      </div>
    </div>
    <div class="drawer-action-buttons">
      <a href="cart.html" class="btn btn-outline" onclick="toggleCartDrawer()">View Cart Page</a>
      <a href="checkout.html" class="btn btn-primary" onclick="toggleCartDrawer()">Proceed to Checkout</a>
    </div>
  `;
}

// Listen to cart updates to refresh drawer if open
window.addEventListener('bloom:cart-updated', () => {
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('active')) {
    renderCartDrawerContent();
  }
});

/**
 * Live Search Modal & Autocomplete
 */
function openSearchModal() {
  let modal = document.getElementById('search-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog modal-search animate-scale-up">
        <div class="search-input-header">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="live-search-input" placeholder="Search roses, lilies, hampers, chocolates, teddy..." autofocus autocomplete="off" />
          <button class="modal-close" onclick="closeSearchModal()">&times;</button>
        </div>
        <div class="search-results-area" id="search-results-area">
          <div class="search-suggestions">
            <p class="suggestions-label">Popular Searches:</p>
            <div class="tags-row">
              <span class="search-tag" onclick="fillSearch('Red Rose')">Red Rose</span>
              <span class="search-tag" onclick="fillSearch('Hamper')">Hamper</span>
              <span class="search-tag" onclick="fillSearch('Teddy')">Teddy</span>
              <span class="search-tag" onclick="fillSearch('Lilies')">Lilies</span>
              <span class="search-tag" onclick="fillSearch('Belgian Chocolate')">Belgian Chocolate</span>
              <span class="search-tag" onclick="fillSearch('Orchid')">Orchid</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) closeSearchModal();
    };

    const input = document.getElementById('live-search-input');
    input.addEventListener('input', (e) => handleSearchInput(e.target.value));
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const inp = document.getElementById('live-search-input');
  if (inp) {
    inp.value = '';
    inp.focus();
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function fillSearch(term) {
  const inp = document.getElementById('live-search-input');
  if (inp) {
    inp.value = term;
    handleSearchInput(term);
  }
}

function handleSearchInput(query) {
  const container = document.getElementById('search-results-area');
  if (!container || !window.ProductStore) return;

  if (!query || query.trim().length === 0) {
    container.innerHTML = `
      <div class="search-suggestions">
        <p class="suggestions-label">Popular Searches:</p>
        <div class="tags-row">
          <span class="search-tag" onclick="fillSearch('Red Rose')">Red Rose</span>
          <span class="search-tag" onclick="fillSearch('Hamper')">Hamper</span>
          <span class="search-tag" onclick="fillSearch('Teddy')">Teddy</span>
          <span class="search-tag" onclick="fillSearch('Lilies')">Lilies</span>
          <span class="search-tag" onclick="fillSearch('Belgian Chocolate')">Belgian Chocolate</span>
          <span class="search-tag" onclick="fillSearch('Orchid')">Orchid</span>
        </div>
      </div>
    `;
    return;
  }

  const results = window.ProductStore.search(query);

  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-empty">
        <p>No floral treasures or gifts matched "<strong>${escapeHTML(query)}</strong>"</p>
        <span class="subtext">Try searching for 'roses', 'cake', 'plant', or 'combo'</span>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="search-results-count">Found ${results.length} item${results.length > 1 ? 's' : ''}:</div>
    <div class="search-results-list">
      ${results.slice(0, 6).map(item => `
        <div class="search-item" onclick="openQuickView('${item.id}'); closeSearchModal();">
          <img src="${item.image}" alt="${item.name}" class="search-thumb" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';" />
          <div class="search-info">
            <span class="search-cat">${item.category.toUpperCase()}</span>
            <h4 class="search-title">${item.name}</h4>
            <span class="search-price">${formatINR(item.price)}</span>
          </div>
          <button class="btn btn-sm btn-outline">View</button>
        </div>
      `).join('')}
    </div>
  `;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/**
 * Mobile Navigation Drawer
 */
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const toggleBtn = document.getElementById('mobile-toggle');
  const overlay = document.getElementById('nav-overlay');

  if (navMenu) {
    navMenu.classList.toggle('active');
  }
  if (toggleBtn) {
    toggleBtn.classList.toggle('active');
  }
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const toggleBtn = document.getElementById('mobile-toggle');
  const overlay = document.getElementById('nav-overlay');

  if (navMenu) navMenu.classList.remove('active');
  if (toggleBtn) toggleBtn.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

/**
 * Newsletter Form Handler
 */
function handleNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input[type="email"]');
  if (!input || !input.value.trim()) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  const email = input.value.trim();
  // Basic email pattern check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  input.value = '';
  showToast(`🌸 Welcome to Bloom & Bliss! A 10% coupon has been sent to ${email}`, 'success');
}

/**
 * Scroll to Top Button & Header Scroll state
 */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.site-header');
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  const scrollTopBtn = document.getElementById('btn-scroll-top');
  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global Exports
window.formatINR = formatINR;
window.createProductCard = createProductCard;
window.handleAddToCart = handleAddToCart;
window.handleWishlistClick = handleWishlistClick;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.updateModalQty = updateModalQty;
window.addModalItemToCart = addModalItemToCart;
window.toggleCartDrawer = toggleCartDrawer;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.fillSearch = fillSearch;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.handleNewsletter = handleNewsletter;
window.scrollToTop = scrollToTop;
