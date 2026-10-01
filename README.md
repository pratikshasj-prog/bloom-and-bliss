# 🌸 Bloom & Bliss - Flowers & Gifts E-Commerce Store

> *“Flowers, Gifts & Moments Made Special”*

**Bloom & Bliss** is a complete, modern, attractive, and responsive e-commerce web platform for an artisanal flower and luxury gift boutique. Built with pure HTML5, CSS3, and vanilla JavaScript without heavy external framework bloat, this project delivers a commercial-grade user experience with soft pastel aesthetics, interactive catalogs, persistent shopping cart & wishlist management, dynamic filtering & sorting, and complete checkout flows with Indian Rupees (₹).

---

## 📁 Project Structure

```
bloom-and-bliss/
├── index.html            # Home page with hero, categories, featured items, occasions, reviews, newsletter
├── flowers.html          # Flowers catalog with live category pills, price range slider, sort & search
├── gifts.html            # Thoughtful gifts catalog (personalized, chocolates, soft toys, plants, decor)
├── combos.html           # Curated flower + gift hampers and celebration boxes
├── occasions.html        # Interactive occasion selector (Birthday, Anniversary, Valentine's, Wedding, etc.)
├── about.html            # Brand story, farm-direct sourcing, master florists, and core values
├── contact.html          # Contact form, store address, phone/email, business hours, map card & FAQs
├── cart.html             # Full-page shopping cart with delivery progress bar, coupons, and subtotal
├── checkout.html         # Checkout form with delivery date picker, gift message, UPI/Card/COD, receipt modal
├── wishlist.html         # Saved items catalog with "Move to Cart" and "Add All to Cart"
├── README.md             # Project documentation & GitHub Pages deployment guide
│
├── css/
│   ├── style.css         # Color tokens, typography (Playfair & Plus Jakarta Sans), header, footer, buttons
│   ├── components.css    # Product cards, quick view modal, search modal, slide-over cart drawer, toasts
│   └── responsive.css    # Media queries for tablets & mobile, off-canvas navigation menu
│
├── js/
│   ├── products.js       # Master catalog database (~36 products) with tags, prices in ₹, ratings, features
│   ├── cart.js           # Cart & Wishlist state manager with localStorage persistence, coupons & toast alerts
│   ├── main.js           # Header scroll, mobile drawer, quick view modal, live search, cart drawer slide-over
│   └── filters.js        # Dynamic category filtering, price slider, real-time search, and sorting engine
│
├── images/
│   └── fallback-flower.svg # High-fidelity botanical vector SVG fallback
│
└── assets/
    └── images/
        └── fallback-flower.svg # Redundant fallback asset ensuring 100% path compatibility
```

---

## ✨ Key Features & Highlights

### 1. Visual Aesthetics & Design
- **Soft Pastel Color Palette**: Cream white (`#FCF9F6`), Blush pink (`#D96B75`), Soft lavender (`#8878BE`), Sage green accents (`#568266`), and warm gold touches.
- **Editorial Typography**: Pairing serif font *Playfair Display* for romantic, luxury headings with *Plus Jakarta Sans* for clean, legible UI text.
- **Card Micro-interactions**: Hover lifts, smooth image zoom, wishlist heart animation, and quick view overlays.
- **Fail-safe Images**: All flower and gift images include automated inline SVG fallback handlers (`onerror`) ensuring no broken image icons ever show up.

### 2. Header & Navigation
- **Sticky Glassmorphic Navbar**: Frosted backdrop blur with active link indicator.
- **Live Search Modal**: Typeahead autocomplete search with quick filter tags (`Red Rose`, `Lilies`, `Hamper`, `Teddy`).
- **Wishlist & Cart Badges**: Live dynamic item count chips synchronized across all pages.
- **Slide-over Cart Drawer**: Accessible from the cart icon on any page without leaving the current view.
- **Responsive Mobile Navigation**: Touch-friendly slide-in drawer for smartphones and tablets.

### 3. Shopping Cart & Wishlist
- **Persistent Storage**: Uses browser `localStorage` (`bloom_cart_items` & `bloom_wishlist_items`) so items remain intact upon page refresh.
- **Dynamic Cart Math**: Calculates Subtotal, Free Delivery above ₹999 (or standard ₹99), and coupon discounts.
- **Active Promo Codes**:
  - `BLOOM10`: 10% discount on entire order.
  - `FIRST150`: ₹150 discount on orders above ₹1,200.
  - `FREEDEL`: Free express delivery on any amount.
- **Free Shipping Tracker**: Real-time progress bar showing amount remaining to unlock free delivery.

### 4. Interactive Product Quick View
- Click **"Quick View"** on any product card across the website to open an interactive modal showing:
  - High-res product photography
  - Star ratings and customer review counts
  - Original price, discounted price, and % savings
  - Key highlights checklist (e.g., *Farm-fresh Dutch roses*, *Vase included*)
  - Add-on options: satin ribbon packaging (+₹99) and custom gift message note
  - Quantity counter (`-` / `+`)
  - **"Add to Cart"** and instant **"Buy Now"** (which adds item and redirects directly to checkout)

### 5. Multi-criteria Filtering & Sorting
- Filters by subcategory (Roses, Lilies, Orchids, Hampers, Plants, etc.)
- Interactive price range slider (e.g. ₹500 to ₹5,000)
- Sort by: *Popularity / Bestsellers*, *Price: Low to High*, *Price: High to Low*, and *Top Rated*
- Real-time catalog search bar

### 6. Seamless Checkout Flow
- Captures sender and recipient details, complete street address, city, state, and 6-digit Pincode.
- **Delivery Date Picker**: Defaults to today with calendar restrictions preventing past dates.
- **Handwritten Gift Note**: Text input for personalized greeting cards.
- **Payment Modes**:
  - **UPI** with simulated ID verification
  - **Credit / Debit Cards** (Visa, MasterCard, RuPay)
  - **Cash on Delivery (COD)**
- **Order Confirmation Receipt Modal**: Generates a unique order ID (e.g., `BNB-2026-89421`), recipient summary, delivery date, total paid, and includes a **"Print Receipt"** button.

---

## 🚀 How to Run the Website Locally

You can run Bloom & Bliss directly in any web browser without needing to install complex dependencies.

### Option A: Open directly in browser
Simply double-click `index.html` in file explorer or right-click and choose **Open with Google Chrome / Microsoft Edge / Safari / Firefox**.

### Option B: Run a local HTTP development server (Recommended)
Using Python (pre-installed):
```bash
# Navigate to the bloom-and-bliss folder
cd bloom-and-bliss

# Start Python's built-in web server
python -m http.server 8000
```
Open your browser and navigate to:
```
http://localhost:8000
```

---

## 🌐 How to Upload to GitHub & Deploy with GitHub Pages

### Method 1: Using the GitHub Web Interface (Easiest)
1. **Create Repository**: Go to [GitHub.com](https://github.com/) and click **New Repository**.
   - Repository name: `bloom-and-bliss` (or your choice).
   - Visibility: **Public** (required for free GitHub Pages).
   - Leave "Add a README file" unchecked (you already have this one).
   - Click **Create repository**.
2. **Upload Files**:
   - Unzip your `Bloom-and-Bliss.zip` folder.
   - On your newly created GitHub repository page, click **uploading an existing file**.
   - Drag and drop all files and folders (`index.html`, all `.html` pages, `css/`, `js/`, `images/`, `assets/`, `README.md`) into GitHub.
   - Click **Commit changes**.
3. **Enable GitHub Pages**:
   - Go to your repository's **Settings** tab.
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and folder `/(root)`, then click **Save**.
   - Wait 1-2 minutes for GitHub to publish your site. Your live URL will appear at the top:
     `https://<your-username>.github.io/bloom-and-bliss/`

---

### Method 2: Using Git CLI (Terminal)
If you have Git installed on your computer:
```bash
# 1. Navigate to the extracted project folder
cd bloom-and-bliss

# 2. Initialize git repository
git init
git add .
git commit -m "Initial commit: Bloom & Bliss complete e-commerce website"

# 3. Rename branch to main
git branch -M main

# 4. Link to your GitHub repository
git remote add origin https://github.com/<your-username>/bloom-and-bliss.git

# 5. Push files to GitHub
git push -u origin main
```
Then follow **Step 3** above to turn on GitHub Pages in repository settings!

---

## 💡 Notes for Students & Developers

- **No framework dependencies**: Everything is written with standard modern JavaScript (ES6+), making it easy to examine and understand.
- **Clean modularity**: Product data is separated in `js/products.js`, cart & wishlist functions in `js/cart.js`, and catalog filtering in `js/filters.js`.
- **Extensibility**: To add new products, simply add a new object to the `PRODUCTS` array in `js/products.js`—it will automatically appear across the website, search modal, category filters, and occasion showcases.
- **100% Relative Asset Paths**: All stylesheets, scripts, and internal page links use relative paths (`css/`, `js/`, `*.html`) so your site functions flawlessly under GitHub Pages subdirectories, custom domains, or offline browser previews.

