import React, { useState, useEffect, useCallback, Component } from 'react';
import './styles.css';

// ─── API Configuration ───────────────────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  get: (url, token) => fetch(API_BASE + url, {
    headers: token ? { Authorization: 'Bearer ' + token } : {},
    credentials: 'include',
  }).then(r => {
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  }),
  post: (url, data, token) => fetch(API_BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(r => r.json()),
  put: (url, data, token) => fetch(API_BASE + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(r => r.json()),
  delete: (url, token) => fetch(API_BASE + url, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
    credentials: 'include',
  }).then(r => r.json()),
};

// ─── Translations ────────────────────────────────────────────────────────────
const translations = {
  ar: {
    appName: 'فرايد تشكين', home: 'الرئيسية', menu: 'القائمة', order: 'اطلب الآن',
    cart: 'السلة', admin: 'الإدارة', login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج', branches: 'الفروع', orders: 'الطلبات',
    track: 'تتبع طلبك', addToCart: 'أضف للسلة', checkout: 'إتمام الطلب',
    name: 'الاسم', phone: 'الهاتف', address: 'العنوان', total: 'المجموع',
    delivery: 'توصيل', pickup: 'استلام من الفرع', orderType: 'نوع الطلب',
    notes: 'ملاحظات', submit: 'إرسال الطلب', orderNumber: 'رقم الطلب',
    status: 'الحالة', pending: 'قيد الانتظار', confirmed: 'مؤكد',
    preparing: 'جاري التحضير', ready: 'جاهز', delivering: 'جاري التوصيل',
    delivered: 'تم التوصيل', cancelled: 'ملغي', crispy: 'كريسبي',
    family: 'عائلي', sides: 'إضافات', popular: 'الأكثر طلباً',
    new: 'جديد', spicy: 'حار', username: 'اسم المستخدم', password: 'كلمة المرور',
    dashboard: 'لوحة التحكم', todayOrders: 'طلبات اليوم', totalRevenue: 'إجمالي الإيرادات',
    lang: 'اللغة', search: 'بحث...', close: 'إغلاق', open: 'مفتوح',
    closed: 'مغلق', workingHours: 'ساعات العمل', branch: 'الفرع', selectBranch: 'اختر الفرع',
    quantity: 'الكمية', price: 'السعر', remove: 'حذف', empty: 'السلة فارغة',
    orderSent: 'تم إرسال طلبك بنجاح!', trackOrder: 'تتبع الطلب',
    enterOrderNumber: 'أدخل رقم الطلب', noResults: 'لا توجد نتائج',
    loading: 'جاري التحميل...', error: 'حدث خطأ', save: 'حفظ',
    cancel: 'إلغاء', edit: 'تعديل', delete: 'حذف', add: 'إضافة',
    welcome: 'أهلاً بكم في فرايد تشكين', tagline: 'أشهى الدجاج المقلي في العراق',
    iqd: 'د.ع', all: 'الكل', fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
    invalidPhone: 'رقم الهاتف غير صحيح', confirmOrder: 'تأكيد الطلب',
    orderReview: 'مراجعة الطلب', yes: 'نعم', no: 'لا',
    confirmStatusChange: 'هل تريد تغيير حالة الطلب؟', addedToCart: 'تمت الإضافة للسلة',
    pendingOrders: 'طلبات قيد الانتظار', totalOrdersLabel: 'إجمالي الطلبات',
    noOrders: 'لا توجد طلبات', action: 'الإجراء', users: 'المستخدمين',
    loadError: 'فشل تحميل البيانات. يرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة', menuNav: 'قائمة التنقل',
    prev: 'السابق', next: 'التالي', page: 'صفحة',
    installApp: 'تنصيب التطبيق', installPrompt: 'نصّب فرايد تشكين على شاشتك الرئيسية!', install: 'تنصيب', dismiss: 'لاحقاً',
  },
  en: {
    appName: 'Fried Chicken', home: 'Home', menu: 'Menu', order: 'Order Now',
    cart: 'Cart', admin: 'Admin', login: 'Login', logout: 'Logout',
    branches: 'Branches', orders: 'Orders', track: 'Track Order', addToCart: 'Add to Cart',
    checkout: 'Checkout', name: 'Name', phone: 'Phone', address: 'Address',
    total: 'Total', delivery: 'Delivery', pickup: 'Pickup', orderType: 'Order Type',
    notes: 'Notes', submit: 'Place Order', orderNumber: 'Order #', status: 'Status',
    pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
    ready: 'Ready', delivering: 'Delivering', delivered: 'Delivered', cancelled: 'Cancelled',
    crispy: 'Crispy', family: 'Family', sides: 'Sides', popular: 'Popular',
    new: 'New', spicy: 'Spicy', username: 'Username', password: 'Password',
    dashboard: 'Dashboard', todayOrders: "Today's Orders", totalRevenue: 'Total Revenue',
    lang: 'Language', search: 'Search...', close: 'Close', open: 'Open', closed: 'Closed',
    workingHours: 'Working Hours', branch: 'Branch', selectBranch: 'Select Branch',
    quantity: 'Qty', price: 'Price', remove: 'Remove', empty: 'Cart is empty',
    orderSent: 'Order placed successfully!', trackOrder: 'Track Order',
    enterOrderNumber: 'Enter order number', noResults: 'No results',
    loading: 'Loading...', error: 'An error occurred', save: 'Save',
    cancel: 'Cancel', edit: 'Edit', delete: 'Delete', add: 'Add',
    welcome: 'Welcome to Fried Chicken', tagline: 'The Best Fried Chicken in Iraq',
    iqd: 'IQD', all: 'All', fillRequired: 'Please fill all required fields',
    invalidPhone: 'Invalid phone number', confirmOrder: 'Confirm Order',
    orderReview: 'Order Review', yes: 'Yes', no: 'No',
    confirmStatusChange: 'Change order status?', addedToCart: 'Added to cart',
    pendingOrders: 'Pending Orders', totalOrdersLabel: 'Total Orders',
    noOrders: 'No orders', action: 'Action', users: 'Users',
    loadError: 'Failed to load data. Please try again.',
    retry: 'Retry', menuNav: 'Navigation menu',
    prev: 'Previous', next: 'Next', page: 'Page',
    installApp: 'Install App', installPrompt: 'Install Fried Chicken on your home screen!', install: 'Install', dismiss: 'Later',
  },
  ku: {
    appName: 'فرایەد چیكن', home: 'سەرەكی', menu: 'مێنیو', order: 'داواكاری',
    cart: 'سەبەت', admin: 'بەڕێوەبردن', login: 'چوونەژووەوە', logout: 'چوونەدەرەوە',
    branches: 'لقەكان', orders: 'داواكارییەكان', track: 'شوێنكەوتنی داواكاری',
    addToCart: 'زیادكردنی سەبەت', checkout: 'تەواوكردنی داواكاری',
    name: 'ناو', phone: 'تەلەفۆن', address: 'ناونیشان', total: 'کۆی گشتی',
    delivery: 'گەیاندن', pickup: 'وەرگرتن', orderType: 'جۆری داواكاری',
    notes: 'تێبینی', submit: 'ناردنی داواكاری', orderNumber: 'ژمارەی داواكاری',
    status: 'دۆخ', pending: 'چاوەڕوان', confirmed: 'دڵنیاكراو',
    preparing: 'ئامادەكردن', ready: 'ئامادەیە', delivering: 'گەیاندن',
    delivered: 'گەیشتووە', cancelled: 'هەڵوەشاندراو', crispy: 'كریسپی',
    family: 'خێزانی', sides: 'زیادەكان', popular: 'باوترین', new: 'نوێ', spicy: 'تووند',
    username: 'ناوی بەكارهێنەر', password: 'ووشەی نهێنی',
    dashboard: 'داشبۆرد', todayOrders: 'داواكارییەكانی ئەمڕۆ',
    totalRevenue: 'کۆی داهات', lang: 'زمان', search: 'گەڕان...',
    close: 'داخستن', open: 'كراوەیە', closed: 'داخراوە',
    workingHours: 'كاتی كار', branch: 'لق', selectBranch: 'لق هەڵبژێرە',
    quantity: 'بڕ', price: 'نرخ', remove: 'سڕینەوە', empty: 'سەبەت بەتاڵە',
    orderSent: 'داواكاریەكەت نێردرا!', trackOrder: 'شوێنكەوتن',
    enterOrderNumber: 'ژمارەی داواكاری بنووسە', noResults: 'ئەنجامێك نییە',
    loading: 'بارکردن...', error: 'هەڵەیەك روویدا',
    save: 'پاشەکەوتكردن', cancel: 'هەڵوەشاندنەوە', edit: 'دەستکاری', delete: 'سڕینەوە', add: 'زیادكردن',
    welcome: 'بەخێربێن بۆ فرایەد چیكن', tagline: 'باشترین مریشكی قەیمەكراو لە عێراق',
    iqd: 'د.ع', all: 'هەموو', fillRequired: 'تكایە هەموو خانەكان پڕ بكەرەوە',
    invalidPhone: 'ژمارەی تەلەفۆن هەڵەیە', confirmOrder: 'دڵنیاكردنەوە',
    orderReview: 'پێداچوونەوەی داواكاری', yes: 'بەڵێ', no: 'نەخێر',
    confirmStatusChange: 'دۆخی داواكاری بگۆڕیت؟', addedToCart: 'زیادکرا بۆ سەبەت',
    pendingOrders: 'داواكارییە چاوەڕوانەكان', totalOrdersLabel: 'کۆی داواكارییەكان',
    noOrders: 'داواكاری نییە', action: 'كردار', users: 'بەكارهێنەران',
    loadError: 'داتاكان بارنەبوون. تكایە دووبارە هەوڵبدەرەوە.',
    retry: 'دووبارە', menuNav: 'مێنیوی ڕێنیشاندەر',
    prev: 'پێشوو', next: 'دواتر', page: 'لاپەڕە',
    installApp: 'دابەزاندنی ئەپ', installPrompt: 'فرایەد چیکن دابەزێنە بۆ شاشەی سەرەكی!', install: 'دابەزاندن', dismiss: 'دواتر',
  }
};

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const validatePhone = (phone) => /^[\d\s+()-]{7,15}$/.test(phone.trim());

const getCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('fc_cart');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveCartToStorage = (cart) => {
  try { localStorage.setItem('fc_cart', JSON.stringify(cart)); } catch {}
};

// ─── Error Boundary ──────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="icon" aria-hidden="true">⚠️</div>
          <h2>حدث خطأ غير متوقع</h2>
          <p>يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
          <button className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>
            تحديث الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Toast Component ─────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;
  return <div className="toast" role="status" aria-live="polite">{message}</div>;
};

// ─── Confirmation Modal ──────────────────────────────────────────────────────
const ConfirmModal = ({ title, children, onConfirm, onCancel, confirmText, cancelText, loading }) => (
  <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-label={title}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h3>{title}</h3>
      {children}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>{cancelText}</button>
        <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>
          {loading ? <span className="spinner" /> : confirmText}
        </button>
      </div>
    </div>
  </div>
);

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = ({ lang, setLang, page, setPage, cartCount, user, onLogout, t }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ['home', 'menu', 'branches', 'track'];

  const handleNav = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className="navbar" role="navigation" aria-label={t.menuNav}>
      <button className="navbar-brand" onClick={() => handleNav('home')} aria-label={t.appName + ' - ' + t.home}>
        <span className="icon" aria-hidden="true">🍗</span>
        <span className="name">{t.appName}</span>
      </button>

      {/* Desktop Navigation */}
      <div className="navbar-desktop">
        {navItems.map(p => (
          <button key={p} className={`nav-link ${page === p ? 'active' : ''}`} onClick={() => setPage(p)} aria-current={page === p ? 'page' : undefined}>
            {t[p]}
          </button>
        ))}
        <button className="cart-btn" onClick={() => setPage('cart')} aria-label={`${t.cart} (${cartCount})`}>
          🛒 {t.cart}
          {cartCount > 0 && <span className="cart-badge" aria-hidden="true">{cartCount}</span>}
        </button>
        {user ? (
          <>
            <button className="nav-link" onClick={() => setPage('admin')} aria-current={page === 'admin' ? 'page' : undefined}>{t.admin}</button>
            <button className="nav-link" onClick={onLogout} style={{ border: '1px solid rgba(255,255,255,0.5)' }}>{t.logout}</button>
          </>
        ) : (
          <button className="nav-link" onClick={() => setPage('login')}>{t.login}</button>
        )}
        <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)} aria-label={t.lang}>
          <option value="ar">عربي</option>
          <option value="en">En</option>
          <option value="ku">کوردی</option>
        </select>
      </div>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label={t.menuNav} aria-expanded={menuOpen}>
        ☰
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-menu-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t.menuNav}>
          <div className="mobile-menu-header">
            <h3>🍗 {t.appName}</h3>
            <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label={t.close}>✕</button>
          </div>
          {navItems.map(p => (
            <button key={p} className={`mobile-nav-link ${page === p ? 'active' : ''}`} onClick={() => handleNav(p)} aria-current={page === p ? 'page' : undefined}>
              {p === 'home' ? '🏠' : p === 'menu' ? '🍗' : p === 'branches' ? '📍' : '📦'} {t[p]}
            </button>
          ))}
          <button className={`mobile-nav-link ${page === 'cart' ? 'active' : ''}`} onClick={() => handleNav('cart')}>
            🛒 {t.cart} {cartCount > 0 && `(${cartCount})`}
          </button>
          {user ? (
            <>
              <button className={`mobile-nav-link ${page === 'admin' ? 'active' : ''}`} onClick={() => handleNav('admin')}>⚙️ {t.admin}</button>
              <button className="mobile-nav-link" onClick={() => { onLogout(); setMenuOpen(false); }}>🚪 {t.logout}</button>
            </>
          ) : (
            <button className={`mobile-nav-link ${page === 'login' ? 'active' : ''}`} onClick={() => handleNav('login')}>🔐 {t.login}</button>
          )}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <label htmlFor="mobile-lang" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>{t.lang}</label>
            <select id="mobile-lang" className="form-select" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="ar">عربي</option>
              <option value="en">English</option>
              <option value="ku">کوردی</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ─── HomePage ────────────────────────────────────────────────────────────────
const HomePage = ({ t, lang, setPage, menuItems }) => (
  <main>
    <section className="hero" aria-labelledby="hero-title">
      <div className="icon" aria-hidden="true">🍗</div>
      <h1 id="hero-title">{t.welcome}</h1>
      <p>{t.tagline}</p>
      <button className="hero-btn" onClick={() => setPage('menu')} aria-label={t.order}>
        {t.order} 🍗
      </button>
    </section>
    <section className="container" aria-labelledby="popular-title">
      <h2 id="popular-title" className="section-title">⭐ {t.popular}</h2>
      <div className="card-grid">
        {menuItems.filter(i => i.badge === 'popular').slice(0, 4).map(item => (
          <article key={item._id} className="menu-card" aria-label={item.name?.[lang] || item.name?.ar}>
            <div className="menu-card-icon" aria-hidden="true">{item.icon || '🍗'}</div>
            <div className="menu-card-body">
              <h3>{item.name?.[lang] || item.name?.ar}</h3>
              <p className="menu-price">{item.price?.toLocaleString()} {t.iqd}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>
);

// ─── MenuPage ────────────────────────────────────────────────────────────────
const MenuPage = ({ t, lang, menuItems, addToCart }) => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = menuItems.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = !search ||
      (item.name?.ar || '').includes(search) ||
      (item.name?.en || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.name?.ku || '').includes(search);
    return matchCat && matchSearch && item.isAvailable;
  });

  const categories = ['all', 'crispy', 'family', 'sides'];
  const catIcons = { all: '🍽', crispy: '🍗', family: '👨‍👩‍👧‍👦', sides: '🍟' };

  return (
    <main className="container">
      <h1 className="section-title">🍗 {t.menu}</h1>
      <div className="category-filters" role="group" aria-label={t.menu}>
        {categories.map(cat => (
          <button key={cat} className={`chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)} aria-pressed={category === cat}>
            {catIcons[cat]} {cat === 'all' ? t.all : (t[cat] || cat)}
          </button>
        ))}
      </div>
      <div className="search-wrap">
        <label htmlFor="menu-search" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.search}</label>
        <input id="menu-search" className="form-input" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} type="search" />
      </div>
      <div className="card-grid" role="list">
        {filtered.map(item => (
          <article key={item._id} className="menu-card" role="listitem" aria-label={item.name?.[lang] || item.name?.ar}>
            <div className="menu-card-icon" aria-hidden="true">
              {item.badge && (
                <span className={`menu-card-badge badge-${item.badge}`}>{t[item.badge] || item.badge}</span>
              )}
              {item.icon || '🍗'}
            </div>
            <div className="menu-card-body">
              <h3>{item.name?.[lang] || item.name?.ar}</h3>
              <p className="desc">{item.description?.[lang] || item.description?.ar}</p>
              <div className="menu-card-footer">
                <span className="menu-price">{item.price?.toLocaleString()} {t.iqd}</span>
                <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)} aria-label={`${t.addToCart} - ${item.name?.[lang] || item.name?.ar}`}>
                  + {t.addToCart}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>{t.noResults}</p>}
    </main>
  );
};

// ─── CartPage ────────────────────────────────────────────────────────────────
const CartPage = ({ t, lang, cart, setCart, branches, onOrderPlaced }) => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', orderType: 'delivery', notes: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = true;
    if (!form.phone.trim() || !validatePhone(form.phone)) errors.phone = true;
    if (form.orderType === 'delivery' && !form.address.trim()) errors.address = true;
    if (!form.branch) errors.branch = true;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(!form.phone.trim() || !validatePhone(form.phone) ? t.invalidPhone : t.fillRequired);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmitClick = () => {
    if (validateForm()) setShowConfirm(true);
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        customer: { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() },
        items: cart.map(i => ({ menuItem: i._id, name: i.name?.[lang] || i.name?.ar, quantity: i.quantity, price: i.price, subtotal: i.price * i.quantity })),
        total,
        orderType: form.orderType,
        paymentMethod: 'cash',
        branch: form.branch,
        notes: form.notes.trim(),
      };
      const result = await api.post('/orders', orderData);
      if (result.success) {
        setCart([]);
        onOrderPlaced(result.order.orderNumber);
      } else { setError(result.error || t.error); }
    } catch { setError(t.error); }
    setLoading(false);
    setShowConfirm(false);
  };

  if (cart.length === 0) return (
    <main className="empty-state" role="status">
      <div className="icon" aria-hidden="true">🛒</div>
      <p>{t.empty}</p>
    </main>
  );

  return (
    <main className="container-sm">
      <h1 className="section-title">🛒 {t.cart}</h1>
      <div role="list" aria-label={t.cart}>
        {cart.map(item => (
          <div key={item._id} className="cart-item" role="listitem">
            <div className="cart-item-info">
              <span className="icon" aria-hidden="true">{item.icon || '🍗'}</span>
              <div>
                <p className="name">{item.name?.[lang] || item.name?.ar}</p>
                <p className="price">{item.price?.toLocaleString()} {t.iqd}</p>
              </div>
            </div>
            <div className="cart-item-controls">
              <button className="qty-btn" onClick={() => updateQty(item._id, -1)} aria-label={`${t.quantity} -1`}>-</button>
              <span className="qty-value" aria-label={`${t.quantity}: ${item.quantity}`}>{item.quantity}</span>
              <button className="qty-btn plus" onClick={() => updateQty(item._id, 1)} aria-label={`${t.quantity} +1`}>+</button>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)} aria-label={`${t.remove} ${item.name?.[lang] || item.name?.ar}`}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>{t.total}</span>
        <span>{total.toLocaleString()} {t.iqd}</span>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSubmitClick(); }} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="cust-name">{t.name} <span className="required">*</span></label>
            <input id="cust-name" className={`form-input ${fieldErrors.name ? 'invalid' : ''}`} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required minLength={2} maxLength={100} autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cust-phone">{t.phone} <span className="required">*</span></label>
            <input id="cust-phone" className={`form-input ${fieldErrors.phone ? 'invalid' : ''}`} type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required pattern="[\d\s+()-]{7,15}" autoComplete="tel" dir="ltr" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cust-address">{t.address} {form.orderType === 'delivery' && <span className="required">*</span>}</label>
            <input id="cust-address" className={`form-input ${fieldErrors.address ? 'invalid' : ''}`} value={form.address} onChange={e => setForm({...form, address: e.target.value})} required={form.orderType === 'delivery'} maxLength={300} autoComplete="street-address" />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="cust-branch">{t.branch} <span className="required">*</span></label>
              <select id="cust-branch" className={`form-select ${fieldErrors.branch ? 'invalid' : ''}`} value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} required>
                <option value="">{t.selectBranch}</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name?.[lang] || b.name?.ar}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cust-type">{t.orderType}</label>
              <select id="cust-type" className="form-select" value={form.orderType} onChange={e => setForm({...form, orderType: e.target.value})}>
                <option value="delivery">{t.delivery}</option>
                <option value="pickup">{t.pickup}</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cust-notes">{t.notes}</label>
            <textarea id="cust-notes" className="form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} maxLength={500} />
          </div>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : `🍗 ${t.submit}`}
          </button>
        </div>
      </form>

      {showConfirm && (
        <ConfirmModal title={t.orderReview} onConfirm={submitOrder} onCancel={() => setShowConfirm(false)} confirmText={t.confirmOrder} cancelText={t.cancel} loading={loading}>
          <div>
            {cart.map(item => (
              <div key={item._id} className="order-review-item">
                <span>{item.name?.[lang] || item.name?.ar} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()} {t.iqd}</span>
              </div>
            ))}
            <div className="order-review-total">
              <span>{t.total}</span>
              <span>{total.toLocaleString()} {t.iqd}</span>
            </div>
          </div>
        </ConfirmModal>
      )}
    </main>
  );
};

// ─── BranchesPage ────────────────────────────────────────────────────────────
const BranchesPage = ({ t, lang, branches }) => (
  <main className="container" aria-labelledby="branches-title">
    <h1 id="branches-title" className="section-title">📍 {t.branches}</h1>
    <div className="card-grid" role="list">
      {branches.map(branch => (
        <article key={branch._id} className="branch-card" role="listitem" aria-label={branch.name?.[lang] || branch.name?.ar}>
          <div className="branch-header">
            <h2 style={{ fontSize: '1.1rem' }}>{branch.name?.[lang] || branch.name?.ar}</h2>
            <span className={`status-badge ${branch.isOpen ? 'status-open' : 'status-closed'}`} role="status">
              {branch.isOpen ? t.open : t.closed}
            </span>
          </div>
          {branch.area?.[lang] && <p className="branch-detail"><span aria-hidden="true">📍</span> {branch.area[lang]}</p>}
          <p className="branch-detail"><span aria-hidden="true">📞</span> <a href={`tel:${branch.phone}`} dir="ltr">{branch.phone}</a></p>
          <p className="branch-detail"><span aria-hidden="true">⏰</span> {branch.workingHours?.open} - {branch.workingHours?.close}</p>
        </article>
      ))}
    </div>
  </main>
);

// ─── TrackPage ───────────────────────────────────────────────────────────────
const TrackPage = ({ t, defaultOrderNum }) => {
  const [orderNum, setOrderNum] = useState(defaultOrderNum || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = useCallback(async () => {
    if (!orderNum) return;
    setLoading(true); setError('');
    try {
      const result = await api.get('/orders/track/' + encodeURIComponent(orderNum));
      if (result.success) setOrder(result.order);
      else setError(result.error || t.error);
    } catch { setError(t.error); }
    setLoading(false);
  }, [orderNum, t]);

  useEffect(() => {
    if (defaultOrderNum) trackOrder();
  }, [defaultOrderNum, trackOrder]);

  const getStatusClass = (status) => {
    return VALID_STATUSES.includes(status) ? `order-status status-${status}` : 'order-status status-pending';
  };

  const getStatusText = (status) => {
    return VALID_STATUSES.includes(status) ? (t[status] || status) : status;
  };

  return (
    <main className="container-xs">
      <h1 className="section-title">📦 {t.track}</h1>
      <form className="track-form" onSubmit={e => { e.preventDefault(); trackOrder(); }} role="search">
        <label htmlFor="track-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.enterOrderNumber}</label>
        <input id="track-input" className="form-input" placeholder={t.enterOrderNumber} value={orderNum} onChange={e => setOrderNum(e.target.value)} style={{ flex: 1 }} dir="ltr" inputMode="numeric" />
        <button type="submit" className="btn btn-primary" disabled={loading} aria-label={t.trackOrder}>
          {loading ? <span className="spinner" /> : '🔍'}
        </button>
      </form>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {order && (
        <div className="track-result fade-in" aria-live="polite">
          <div className="track-header">
            <h2 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t.orderNumber}: #{order.orderNumber}</h2>
            <span className={getStatusClass(order.status)}>
              {getStatusText(order.status)}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{t.name}: {sanitize(order.customer?.name)}</p>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '0.5rem' }}>{t.total}: {order.total?.toLocaleString()} {t.iqd}</p>
        </div>
      )}
    </main>
  );
};

// ─── LoginPage ───────────────────────────────────────────────────────────────
const LoginPage = ({ t, onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) { setError(t.fillRequired); return; }
    setLoading(true); setError('');
    try {
      const result = await api.post('/auth/login', { username: form.username.trim(), password: form.password });
      if (result.success) onLogin(result.token, result.user);
      else setError(result.error || t.error);
    } catch { setError(t.error); }
    setLoading(false);
  };

  return (
    <main className="login-page">
      <h1 className="section-title">🔐 {t.login}</h1>
      <form onSubmit={handleLogin} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-user">{t.username}</label>
          <input id="login-user" className="form-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required autoComplete="username" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-pass">{t.password}</label>
          <input id="login-pass" className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required autoComplete="current-password" onKeyDown={e => e.key === 'Enter' && handleLogin(e)} />
        </div>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? <span className="spinner" /> : t.login}
        </button>
      </form>
    </main>
  );
};

// ─── AdminDashboard ──────────────────────────────────────────────────────────
const AdminDashboard = ({ t, lang, token, user }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusConfirm, setStatusConfirm] = useState(null);
  const ITEMS_PER_PAGE = 20;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'orders') {
        const r = await api.get(`/orders?page=${currentPage}&limit=${ITEMS_PER_PAGE}`, token);
        if (r.success) { setOrders(r.orders); setTotalPages(r.pages || 1); }
      } else if (activeTab === 'dashboard') {
        const r = await api.get('/stats/dashboard', token);
        if (r.success) setStats(r.stats);
      } else if (activeTab === 'menu') {
        const r = await api.get('/menu', token);
        if (r.success) setMenuItems(r.items);
      } else if (activeTab === 'branches') {
        const r = await api.get('/branches', token);
        if (r.success) setBranches(r.branches);
      }
    } catch {
      setError(t.loadError);
    }
    setLoading(false);
  }, [activeTab, currentPage, token, t.loadError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusConfirm({ orderId, newStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusConfirm) return;
    const { orderId, newStatus } = statusConfirm;
    try {
      const r = await api.put('/orders/' + orderId + '/status', { status: newStatus }, token);
      if (r.success) setOrders(prev => prev.map(o => o._id === orderId ? {...o, status: newStatus} : o));
    } catch {}
    setStatusConfirm(null);
  };

  const tabs = ['dashboard', 'orders', 'menu', 'branches'];

  return (
    <main className="container">
      <h1 className="section-title">⚙️ {t.admin} - {sanitize(user?.name)}</h1>
      <div className="admin-tabs" role="tablist">
        {tabs.map(tab => (
          <button key={tab} role="tab" aria-selected={activeTab === tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}>
            {t[tab] || tab}
          </button>
        ))}
        <button className="btn btn-secondary" onClick={loadData} aria-label={t.retry}>🔄</button>
      </div>

      {error && <div className="alert alert-error" role="alert">{error} <button className="btn btn-sm btn-secondary" onClick={loadData} style={{ marginInlineStart: '0.5rem' }}>{t.retry}</button></div>}
      {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t.loading}</p>}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && !loading && (
        <div className="admin-stat-grid" role="list">
          {[
            { label: t.todayOrders, value: stats.todayOrders || 0, icon: '📦', color: '#3b82f6' },
            { label: t.totalRevenue, value: (stats.totalRevenue || 0).toLocaleString() + ' ' + t.iqd, icon: '💰', color: '#10b981' },
            { label: t.pendingOrders, value: stats.pendingOrders || 0, icon: '⏳', color: '#f59e0b' },
            { label: t.totalOrdersLabel, value: stats.totalOrders || 0, icon: '📊', color: '#8b5cf6' },
          ].map(card => (
            <div key={card.label} className="stat-card" role="listitem" style={{ borderColor: card.color }}>
              <div className="icon" aria-hidden="true">{card.icon}</div>
              <div className="value" style={{ color: card.color }}>{card.value}</div>
              <div className="label">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && !loading && (
        <>
          <div className="orders-table-wrap">
            <table className="orders-table" role="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t.name}</th>
                  <th scope="col">{t.phone}</th>
                  <th scope="col">{t.total}</th>
                  <th scope="col">{t.status}</th>
                  <th scope="col">{t.orderType}</th>
                  <th scope="col">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{order.orderNumber}</td>
                    <td>{sanitize(order.customer?.name)}</td>
                    <td dir="ltr">{sanitize(order.customer?.phone)}</td>
                    <td style={{ fontWeight: 'bold' }}>{order.total?.toLocaleString()}</td>
                    <td>
                      <span className={`order-status ${VALID_STATUSES.includes(order.status) ? `status-${order.status}` : 'status-pending'}`} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                        {t[order.status] || order.status}
                      </span>
                    </td>
                    <td>{t[order.orderType] || order.orderType}</td>
                    <td>
                      <label htmlFor={`status-${order._id}`} style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.status}</label>
                      <select id={`status-${order._id}`} value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className="form-select" style={{ padding: '0.3rem', fontSize: '0.85rem', minWidth: '120px' }}>
                        {VALID_STATUSES.map(s => (
                          <option key={s} value={s}>{t[s] || s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t.noOrders}</p>}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button className="btn btn-sm btn-secondary" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} aria-label={t.prev}>&laquo; {t.prev}</button>
              <span>{t.page} {currentPage} / {totalPages}</span>
              <button className="btn btn-sm btn-secondary" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} aria-label={t.next}>{t.next} &raquo;</button>
            </nav>
          )}
        </>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && !loading && (
        <div className="card-grid-sm" role="list">
          {menuItems.map(item => (
            <div key={item._id} className="admin-card" role="listitem">
              <div className="icon" aria-hidden="true">{item.icon || '🍗'}</div>
              <h4>{item.name?.[lang] || item.name?.ar}</h4>
              <p className="price">{item.price?.toLocaleString()} {t.iqd}</p>
              <p className="meta">{t[item.category] || item.category} | {item.isAvailable ? '✅ ' + t.open : '❌ ' + t.closed}</p>
            </div>
          ))}
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && !loading && (
        <div className="card-grid" role="list">
          {branches.map(branch => (
            <div key={branch._id} className="admin-card" role="listitem">
              <h4>{branch.name?.[lang] || branch.name?.ar}</h4>
              <p className="meta"><span aria-hidden="true">📞</span> {branch.phone}</p>
              <p className="meta"><span aria-hidden="true">⏰</span> {branch.workingHours?.open} - {branch.workingHours?.close}</p>
              <span className={`status-badge ${branch.isOpen ? 'status-open' : 'status-closed'}`} role="status" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                {branch.isOpen ? t.open : t.closed}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Status Change Confirmation */}
      {statusConfirm && (
        <ConfirmModal title={t.confirmStatusChange} onConfirm={confirmStatusUpdate} onCancel={() => setStatusConfirm(null)} confirmText={t.yes} cancelText={t.no}>
          <p>{t.confirmStatusChange}</p>
        </ConfirmModal>
      )}
    </main>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
function AppContent() {
  const [lang, setLang] = useState(() => localStorage.getItem('fc_lang') || 'ar');
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState(getCartFromStorage);
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem('fc_token') || '');
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('fc_user') || 'null'); } catch { return null; } });
  const [lastOrderNum, setLastOrderNum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const t = translations[lang] || translations.ar;
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  // Save cart to localStorage
  useEffect(() => { saveCartToStorage(cart); }, [cart]);

  // Save language preference
  useEffect(() => { localStorage.setItem('fc_lang', lang); }, [lang]);

  // Set direction
  useEffect(() => {
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  }, [lang]);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  // PWA Install Prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('fc_install_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS detection - show custom banner since iOS doesn't fire beforeinstallprompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isIOS && !isStandalone) {
      setShowInstallBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [menuRes, branchRes] = await Promise.all([
          api.get('/menu?available=true'),
          api.get('/branches'),
        ]);
        if (menuRes.success) setMenuItems(menuRes.items);
        if (branchRes.success) setBranches(branchRes.branches);
      } catch {
        setLoadError(true);
      }
      setLoading(false);
    };
    loadInitial();
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setToast(t.addedToCart);
  }, [t.addedToCart]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('fc_token', newToken);
    localStorage.setItem('fc_user', JSON.stringify(newUser));
    setPage('admin');
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('fc_token');
    localStorage.removeItem('fc_user');
    setPage('home');
  };

  const handleOrderPlaced = (orderNum) => {
    setLastOrderNum(orderNum);
    setToast(t.orderSent);
    setPage('track');
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowInstallBanner(false);
        setInstallPrompt(null);
      }
    }
  };

  const dismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('fc_install_dismissed', Date.now().toString());
  };

  if (loading) return (
    <div className="loading-screen" role="status" aria-label={t.loading}>
      <div style={{ textAlign: 'center' }}>
        <div className="icon" aria-hidden="true">🍗</div>
        <p>{t.loading}</p>
      </div>
    </div>
  );

  if (loadError) return (
    <div className="error-boundary" role="alert">
      <div className="icon" aria-hidden="true">⚠️</div>
      <h2>{t.error}</h2>
      <p>{t.loadError}</p>
      <button className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>{t.retry}</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <a href="#main-content" className="sr-only" style={{ position: 'absolute', top: '-100px', left: 0, background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', zIndex: 500 }}>
        Skip to content
      </a>
      <Navbar lang={lang} setLang={setLang} page={page} setPage={setPage} cartCount={cartCount} user={user} onLogout={handleLogout} t={t} />

      {showInstallBanner && (
        <div className="install-banner" role="alert">
          <div className="install-banner-content">
            <div className="install-banner-icon" aria-hidden="true">🍗</div>
            <div className="install-banner-text">
              <strong>{t.installApp}</strong>
              <p>{installPrompt ? t.installPrompt : (lang === 'en' ? 'Tap the share button then "Add to Home Screen"' : lang === 'ku' ? 'دوگمەی هاوبەشکردن دابگرە پاشان "زیادکردن بۆ شاشەی سەرەکی"' : 'اضغط زر المشاركة ثم "أضف للشاشة الرئيسية"')}</p>
            </div>
            <div className="install-banner-actions">
              {installPrompt && <button className="btn btn-primary" onClick={handleInstall}>{t.install}</button>}
              <button className="btn btn-secondary btn-sm" onClick={dismissInstall}>{t.dismiss}</button>
            </div>
          </div>
        </div>
      )}

      <div id="main-content" style={{ flex: 1 }}>
        {page === 'home' && <HomePage t={t} lang={lang} setPage={setPage} menuItems={menuItems} />}
        {page === 'menu' && <MenuPage t={t} lang={lang} menuItems={menuItems} addToCart={addToCart} />}
        {page === 'cart' && <CartPage t={t} lang={lang} cart={cart} setCart={setCart} branches={branches} onOrderPlaced={handleOrderPlaced} />}
        {page === 'branches' && <BranchesPage t={t} lang={lang} branches={branches} />}
        {page === 'track' && <TrackPage t={t} defaultOrderNum={lastOrderNum} />}
        {page === 'login' && <LoginPage t={t} onLogin={handleLogin} />}
        {page === 'admin' && user && <AdminDashboard t={t} lang={lang} token={token} user={user} />}
        {page === 'admin' && !user && <LoginPage t={t} onLogin={handleLogin} />}
      </div>

      <footer className="footer" role="contentinfo">
        <div className="icon" aria-hidden="true">🍗</div>
        <p className="name">{t.appName}</p>
        <p className="copy">&copy; 2026 {t.appName}. All rights reserved.</p>
      </footer>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
