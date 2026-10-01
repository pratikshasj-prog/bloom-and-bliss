/**
 * Bloom & Bliss - Listing Page Filtering, Sorting, and Search Engine
 * Dynamically renders and filters products for Flowers, Gifts, Combos, and Occasions pages.
 */

class ProductCatalogPage {
  constructor(config = {}) {
    this.baseCategory = config.baseCategory || null; // 'flowers', 'gifts', 'combos', or null (all/occasions)
    this.initialOccasion = config.initialOccasion || null;
    this.containerId = config.containerId || 'product-grid';
    this.countId = config.countId || 'product-count';
    this.emptyStateId = config.emptyStateId || 'empty-state';

    // State
    this.activeSubCategory = 'all';
    this.activeOccasion = this.initialOccasion || 'all';
    this.maxPrice = 5000;
    this.minPrice = 0;
    this.searchQuery = '';
    this.sortBy = 'popularity'; // 'popularity', 'price-low', 'price-high', 'rating'

    this.init();
  }

  init() {
    // Check URL parameters (e.g. ?cat=roses or ?occ=birthday or ?search=red)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('cat')) {
      this.activeSubCategory = urlParams.get('cat').toLowerCase();
    }
    if (urlParams.get('occ')) {
      this.activeOccasion = urlParams.get('occ').toLowerCase();
    }
    if (urlParams.get('search')) {
      this.searchQuery = urlParams.get('search');
      const searchBox = document.getElementById('catalog-search');
      if (searchBox) searchBox.value = this.searchQuery;
    }

    this.bindEvents();
    this.applyFilters();
  }

  bindEvents() {
    // Subcategory pill buttons
    const catButtons = document.querySelectorAll('[data-subcat]');
    catButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        catButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeSubCategory = e.currentTarget.getAttribute('data-subcat');
        this.applyFilters();
      });
    });

    // Occasion pill/card buttons
    const occButtons = document.querySelectorAll('[data-occasion]');
    occButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        occButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeOccasion = e.currentTarget.getAttribute('data-occasion');
        this.applyFilters();
      });
    });

    // Price range slider
    const priceSlider = document.getElementById('price-slider');
    const priceDisplay = document.getElementById('price-value');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        if (priceDisplay) priceDisplay.textContent = '₹' + this.maxPrice;
        this.applyFilters();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Search input
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.applyFilters();
      });
    }

    // Clear filters button
    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  resetFilters() {
    this.activeSubCategory = 'all';
    this.activeOccasion = 'all';
    this.maxPrice = 5000;
    this.searchQuery = '';
    this.sortBy = 'popularity';

    // Reset UI controls
    document.querySelectorAll('[data-subcat]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-subcat') === 'all');
    });
    document.querySelectorAll('[data-occasion]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-occasion') === 'all');
    });
    const slider = document.getElementById('price-slider');
    if (slider) slider.value = 5000;
    const priceDisplay = document.getElementById('price-value');
    if (priceDisplay) priceDisplay.textContent = '₹5000';
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = '';
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) sortSelect.value = 'popularity';

    this.applyFilters();
  }

  applyFilters() {
    let list = window.ProductStore ? window.ProductStore.getAll() : [];

    // Filter by base category if specified
    if (this.baseCategory) {
      list = list.filter(p => p.category === this.baseCategory);
    }

    // Filter by subcategory
    if (this.activeSubCategory && this.activeSubCategory !== 'all') {
      list = list.filter(p => p.subCategory === this.activeSubCategory);
    }

    // Filter by occasion
    if (this.activeOccasion && this.activeOccasion !== 'all') {
      list = list.filter(p => p.occasions && p.occasions.includes(this.activeOccasion));
    }

    // Filter by price
    list = list.filter(p => p.price <= this.maxPrice);

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: popularity / bestsellers first
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    this.render(list);
  }

  render(products) {
    const grid = document.getElementById(this.containerId);
    const countEl = document.getElementById(this.countId);
    const emptyState = document.getElementById(this.emptyStateId);

    if (countEl) {
      countEl.textContent = `${products.length} Product${products.length === 1 ? '' : 's'}`;
    }

    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = products.map(p => window.createProductCard(p)).join('');
    }
  }
}

window.ProductCatalogPage = ProductCatalogPage;
