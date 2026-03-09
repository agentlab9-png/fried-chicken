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
    about: 'من نحن', contactUs: 'اتصل بنا', aboutTitle: 'من نحن', aboutDesc: 'فرايد تشكين - مجموعة مطاعم الدجاج المقرمش الاولى في العراق. نقدم أجود أنواع الدجاج المقرمش بوصفة خاصة ومذاق لا يُنسى.',
    ourMission: 'رسالتنا', missionDesc: 'تقديم أفضل تجربة طعام للدجاج المقرمش بجودة عالية وأسعار مناسبة مع خدمة سريعة ومميزة.',
    ourBranches: 'فروعنا', branchCount: '12 فرع في بغداد', followUs: 'تابعنا', phone: 'الهاتف',
    reports: 'التقارير', weeklyRevenue: 'إيرادات الأسبوع', topItems: 'الأكثر مبيعاً', revenue: 'الإيرادات',
    addMenuItem: 'إضافة عنصر', editMenuItem: 'تعديل عنصر', deleteMenuItem: 'حذف عنصر', confirmDelete: 'هل أنت متأكد من الحذف؟',
    addBranch: 'إضافة فرع', editBranch: 'تعديل فرع', deleteBranch: 'حذف فرع',
    itemName: 'اسم العنصر', itemNameEn: 'الاسم بالإنجليزي', itemNameKu: 'الاسم بالكردي',
    descAr: 'الوصف بالعربي', descEn: 'الوصف بالإنجليزي', descKu: 'الوصف بالكردي',
    category: 'التصنيف', icon: 'الأيقونة', badge: 'الشارة', available: 'متوفر', notAvailable: 'غير متوفر',
    branchNameAr: 'اسم الفرع بالعربي', branchNameEn: 'اسم الفرع بالإنجليزي', branchNameKu: 'اسم الفرع بالكردي',
    areaAr: 'المنطقة بالعربي', areaEn: 'المنطقة بالإنجليزي', areaKu: 'المنطقة بالكردي',
    openTime: 'وقت الفتح', closeTime: 'وقت الإغلاق', isOpen: 'مفتوح الآن',
    newOrderNotif: 'طلب جديد!', enableNotifications: 'تفعيل الإشعارات', none: 'بدون',
    todayRevenueLabel: 'إيرادات اليوم', orderCount: 'عدد الطلبات',
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
    about: 'About Us', contactUs: 'Contact Us', aboutTitle: 'About Us', aboutDesc: 'Fried Chicken - The first crispy chicken restaurant chain in Iraq. We serve the finest crispy chicken with a special recipe and unforgettable taste.',
    ourMission: 'Our Mission', missionDesc: 'To provide the best crispy chicken dining experience with high quality, affordable prices, and fast, outstanding service.',
    ourBranches: 'Our Branches', branchCount: '12 branches in Baghdad', followUs: 'Follow Us', phone: 'Phone',
    reports: 'Reports', weeklyRevenue: 'Weekly Revenue', topItems: 'Top Selling', revenue: 'Revenue',
    addMenuItem: 'Add Item', editMenuItem: 'Edit Item', deleteMenuItem: 'Delete Item', confirmDelete: 'Are you sure you want to delete?',
    addBranch: 'Add Branch', editBranch: 'Edit Branch', deleteBranch: 'Delete Branch',
    itemName: 'Item Name', itemNameEn: 'Name (English)', itemNameKu: 'Name (Kurdish)',
    descAr: 'Description (Arabic)', descEn: 'Description (English)', descKu: 'Description (Kurdish)',
    category: 'Category', icon: 'Icon', badge: 'Badge', available: 'Available', notAvailable: 'Not Available',
    branchNameAr: 'Branch Name (Arabic)', branchNameEn: 'Branch Name (English)', branchNameKu: 'Branch Name (Kurdish)',
    areaAr: 'Area (Arabic)', areaEn: 'Area (English)', areaKu: 'Area (Kurdish)',
    openTime: 'Opening Time', closeTime: 'Closing Time', isOpen: 'Currently Open',
    newOrderNotif: 'New Order!', enableNotifications: 'Enable Notifications', none: 'None',
    todayRevenueLabel: "Today's Revenue", orderCount: 'Order Count',
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
    about: 'دەربارەی ئێمە', contactUs: 'پەیوەندیمان پێوە بکە', aboutTitle: 'دەربارەی ئێمە', aboutDesc: 'فرایەد چیکن - یەکەمین چەینی چێشتخانەی مریشکی کریسپی لە عێراق. باشترین مریشکی کریسپی پێشکەش دەکەین بە ڕەچەتەیەکی تایبەت و تامێکی نەبیرکراو.',
    ourMission: 'ئەرکی ئێمە', missionDesc: 'پێشکەشکردنی باشترین ئەزموونی خواردنی مریشکی کریسپی بە کوالیتی بەرز و نرخی گونجاو و خزمەتگوزاری خێرا و جیاواز.',
    ourBranches: 'لقەکانمان', branchCount: '١٢ لق لە بەغدا', followUs: 'شوێنمان بکەوە', phone: 'تەلەفۆن',
    reports: 'ڕاپۆرتەکان', weeklyRevenue: 'داهاتی هەفتانە', topItems: 'زۆرترین فرۆش', revenue: 'داهات',
    addMenuItem: 'زیادکردنی بەرهەم', editMenuItem: 'دەستکاری بەرهەم', deleteMenuItem: 'سڕینەوەی بەرهەم', confirmDelete: 'دڵنیایت لە سڕینەوە؟',
    addBranch: 'زیادکردنی لق', editBranch: 'دەستکاری لق', deleteBranch: 'سڕینەوەی لق',
    itemName: 'ناوی بەرهەم', itemNameEn: 'ناو (ئینگلیزی)', itemNameKu: 'ناو (کوردی)',
    descAr: 'وەسف (عەرەبی)', descEn: 'وەسف (ئینگلیزی)', descKu: 'وەسف (کوردی)',
    category: 'جۆر', icon: 'ئایکۆن', badge: 'نیشانە', available: 'بەردەستە', notAvailable: 'بەردەست نییە',
    branchNameAr: 'ناوی لق (عەرەبی)', branchNameEn: 'ناوی لق (ئینگلیزی)', branchNameKu: 'ناوی لق (کوردی)',
    areaAr: 'ناوچە (عەرەبی)', areaEn: 'ناوچە (ئینگلیزی)', areaKu: 'ناوچە (کوردی)',
    openTime: 'کاتی کردنەوە', closeTime: 'کاتی داخستن', isOpen: 'ئێستا کراوەیە',
    newOrderNotif: 'داواکاری نوێ!', enableNotifications: 'چالاککردنی ئاگاداری', none: 'هیچ',
    todayRevenueLabel: 'داهاتی ئەمڕۆ', orderCount: 'ژمارەی داواکارییەکان',
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

  const navItems = ['home', 'menu', 'branches', 'track', 'about'];

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
              {p === 'home' ? '🏠' : p === 'menu' ? '🍗' : p === 'branches' ? '📍' : p === 'about' ? 'ℹ️' : '📦'} {t[p]}
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

// ─── AboutPage ──────────────────────────────────────────────────────────────
const AboutPage = ({ t, lang }) => (
  <main>
    <section className="hero" style={{ paddingBottom: '3rem' }}>
      <div className="icon" aria-hidden="true">🍗</div>
      <h1>{t.aboutTitle}</h1>
      <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>{t.aboutDesc}</p>
    </section>
    <div className="container">
      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon">🎯</div>
          <h3>{t.ourMission}</h3>
          <p>{t.missionDesc}</p>
        </div>
        <div className="about-card">
          <div className="about-card-icon">📍</div>
          <h3>{t.ourBranches}</h3>
          <p>{t.branchCount}</p>
        </div>
        <div className="about-card">
          <div className="about-card-icon">📞</div>
          <h3>{t.contactUs}</h3>
          <p dir="ltr" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>0773 336 6656</p>
        </div>
        <div className="about-card">
          <div className="about-card-icon">🌐</div>
          <h3>{t.followUs}</h3>
          <a href="https://www.facebook.com/share/1Abj9cJqfg/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Facebook 📘
          </a>
        </div>
      </div>
    </div>
  </main>
);

// ─── MenuFormModal ──────────────────────────────────────────────────────────
const MenuFormModal = ({ t, item, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(item ? {
    nameAr: item.name?.ar || '', nameEn: item.name?.en || '', nameKu: item.name?.ku || '',
    descAr: item.description?.ar || '', descEn: item.description?.en || '', descKu: item.description?.ku || '',
    category: item.category || 'crispy', price: item.price || '', icon: item.icon || '🍗',
    badge: item.badge || '', isAvailable: item.isAvailable !== false,
  } : {
    nameAr: '', nameEn: '', nameKu: '', descAr: '', descEn: '', descKu: '',
    category: 'crispy', price: '', icon: '🍗', badge: '', isAvailable: true,
  });

  const handleSubmit = () => {
    if (!form.nameAr.trim() || !form.price) return;
    onSave({
      name: { ar: form.nameAr.trim(), en: form.nameEn.trim(), ku: form.nameKu.trim() },
      description: { ar: form.descAr.trim(), en: form.descEn.trim(), ku: form.descKu.trim() },
      category: form.category, price: Number(form.price), icon: form.icon,
      badge: form.badge || null, isAvailable: form.isAvailable,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h3>{item ? t.editMenuItem : t.addMenuItem}</h3>
        <div className="form-grid">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.itemName} <span className="required">*</span></label>
              <input className="form-input" value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.itemNameEn}</label>
              <input className="form-input" value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.itemNameKu}</label>
            <input className="form-input" value={form.nameKu} onChange={e => setForm({...form, nameKu: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.descAr}</label>
            <textarea className="form-textarea" value={form.descAr} onChange={e => setForm({...form, descAr: e.target.value})} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.descEn}</label>
              <textarea className="form-textarea" value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.descKu}</label>
              <textarea className="form-textarea" value={form.descKu} onChange={e => setForm({...form, descKu: e.target.value})} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.price} <span className="required">*</span></label>
              <input className="form-input" type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.category}</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="crispy">{t.crispy}</option>
                <option value="family">{t.family}</option>
                <option value="sides">{t.sides}</option>
              </select>
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.icon}</label>
              <input className="form-input" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={{ fontSize: '1.5rem', textAlign: 'center' }} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.badge}</label>
              <select className="form-select" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}>
                <option value="">{t.none}</option>
                <option value="popular">{t.popular}</option>
                <option value="new">{t.new}</option>
                <option value="spicy">{t.spicy}</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="item-avail" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} />
            <label htmlFor="item-avail" className="form-label" style={{ margin: 0 }}>{t.available}</label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.nameAr.trim() || !form.price}>
            {loading ? <span className="spinner" /> : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── BranchFormModal ────────────────────────────────────────────────────────
const BranchFormModal = ({ t, branch, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(branch ? {
    nameAr: branch.name?.ar || '', nameEn: branch.name?.en || '', nameKu: branch.name?.ku || '',
    areaAr: branch.area?.ar || '', areaEn: branch.area?.en || '', areaKu: branch.area?.ku || '',
    phone: branch.phone || '', address: branch.address || '',
    openTime: branch.workingHours?.open || '11:00', closeTime: branch.workingHours?.close || '23:00',
    isOpen: branch.isOpen !== false,
  } : {
    nameAr: '', nameEn: '', nameKu: '', areaAr: '', areaEn: '', areaKu: '',
    phone: '', address: '', openTime: '11:00', closeTime: '23:00', isOpen: true,
  });

  const handleSubmit = () => {
    if (!form.nameAr.trim() || !form.phone.trim()) return;
    onSave({
      name: { ar: form.nameAr.trim(), en: form.nameEn.trim(), ku: form.nameKu.trim() },
      area: { ar: form.areaAr.trim(), en: form.areaEn.trim(), ku: form.areaKu.trim() },
      phone: form.phone.trim(), address: form.address.trim(),
      workingHours: { open: form.openTime, close: form.closeTime },
      isOpen: form.isOpen,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h3>{branch ? t.editBranch : t.addBranch}</h3>
        <div className="form-grid">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.branchNameAr} <span className="required">*</span></label>
              <input className="form-input" value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.branchNameEn}</label>
              <input className="form-input" value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.branchNameKu}</label>
            <input className="form-input" value={form.nameKu} onChange={e => setForm({...form, nameKu: e.target.value})} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.areaAr}</label>
              <input className="form-input" value={form.areaAr} onChange={e => setForm({...form, areaAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.areaEn}</label>
              <input className="form-input" value={form.areaEn} onChange={e => setForm({...form, areaEn: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.phone} <span className="required">*</span></label>
              <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.address}</label>
              <input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.openTime}</label>
              <input className="form-input" type="time" value={form.openTime} onChange={e => setForm({...form, openTime: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.closeTime}</label>
              <input className="form-input" type="time" value={form.closeTime} onChange={e => setForm({...form, closeTime: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="branch-open" checked={form.isOpen} onChange={e => setForm({...form, isOpen: e.target.checked})} />
            <label htmlFor="branch-open" className="form-label" style={{ margin: 0 }}>{t.isOpen}</label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.nameAr.trim() || !form.phone.trim()}>
            {loading ? <span className="spinner" /> : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ReportsTab ─────────────────────────────────────────────────────────────
const ReportsTab = ({ t, token }) => {
  const [weekly, setWeekly] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [wRes, tRes] = await Promise.all([
          api.get('/stats/weekly', token),
          api.get('/stats/top-items', token),
        ]);
        if (wRes.success) setWeekly(wRes.weekly);
        if (tRes.success) setTopItems(tRes.topItems);
      } catch {}
      setLoading(false);
    };
    load();
  }, [token]);

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t.loading}</p>;

  const maxRevenue = Math.max(...weekly.map(d => d.revenue), 1);
  const maxQty = Math.max(...topItems.map(i => i.totalQty), 1);

  return (
    <div className="reports-container">
      <div className="report-section">
        <h3 className="report-title">📊 {t.weeklyRevenue}</h3>
        <div className="chart-container">
          {weekly.map((day, i) => (
            <div key={i} className="chart-bar-wrap">
              <div className="chart-bar-value">{day.revenue > 0 ? (day.revenue / 1000).toFixed(0) + 'K' : '0'}</div>
              <div className="chart-bar-bg">
                <div className="chart-bar" style={{ height: `${(day.revenue / maxRevenue) * 100}%` }} />
              </div>
              <div className="chart-bar-label">{day.date.slice(5)}</div>
              <div className="chart-bar-sub">{day.orders} {t.orders}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="report-section">
        <h3 className="report-title">🏆 {t.topItems}</h3>
        <div className="top-items-list">
          {topItems.map((item, i) => (
            <div key={i} className="top-item">
              <div className="top-item-rank">{i + 1}</div>
              <div className="top-item-info">
                <div className="top-item-name">{item._id}</div>
                <div className="top-item-bar-bg">
                  <div className="top-item-bar" style={{ width: `${(item.totalQty / maxQty) * 100}%` }} />
                </div>
              </div>
              <div className="top-item-stats">
                <span>{item.totalQty}x</span>
                <span className="top-item-rev">{item.totalRevenue?.toLocaleString()} {t.iqd}</span>
              </div>
            </div>
          ))}
          {topItems.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>{t.noResults}</p>}
        </div>
      </div>
    </div>
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
  const [menuFormItem, setMenuFormItem] = useState(undefined); // undefined=closed, null=new, object=edit
  const [branchFormItem, setBranchFormItem] = useState(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [prevOrderCount, setPrevOrderCount] = useState(null);
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

  // Notification polling for new orders
  useEffect(() => {
    if (activeTab !== 'orders' && activeTab !== 'dashboard') return;
    const interval = setInterval(async () => {
      try {
        const r = await api.get('/stats/dashboard', token);
        if (r.success && prevOrderCount !== null && r.stats.totalOrders > prevOrderCount) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(t.newOrderNotif, { body: `${t.orderNumber}: ${r.stats.totalOrders}`, icon: '🍗' });
          }
          try { new Audio('data:audio/wav;base64,UklGRl9vT19teleXBFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU'+Array(300).join('A')).play(); } catch {}
          loadData();
        }
        setPrevOrderCount(r.stats.totalOrders);
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [activeTab, token, prevOrderCount, t.newOrderNotif, t.orderNumber, loadData]);

  const requestNotifications = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  // Menu CRUD
  const handleSaveMenuItem = async (data) => {
    setFormLoading(true);
    try {
      if (menuFormItem && menuFormItem._id) {
        const r = await api.put('/menu/' + menuFormItem._id, data, token);
        if (r.success) { setMenuItems(prev => prev.map(i => i._id === menuFormItem._id ? r.item : i)); setMenuFormItem(undefined); }
      } else {
        const r = await api.post('/menu', data, token);
        if (r.success) { setMenuItems(prev => [...prev, r.item]); setMenuFormItem(undefined); }
      }
    } catch {}
    setFormLoading(false);
  };

  const handleDeleteMenuItem = async () => {
    if (!deleteConfirm) return;
    try {
      const r = await api.delete('/menu/' + deleteConfirm._id, token);
      if (r.success) setMenuItems(prev => prev.filter(i => i._id !== deleteConfirm._id));
    } catch {}
    setDeleteConfirm(null);
  };

  // Branch CRUD
  const handleSaveBranch = async (data) => {
    setFormLoading(true);
    try {
      if (branchFormItem && branchFormItem._id) {
        const r = await api.put('/branches/' + branchFormItem._id, data, token);
        if (r.success) { setBranches(prev => prev.map(b => b._id === branchFormItem._id ? r.branch : b)); setBranchFormItem(undefined); }
      } else {
        const r = await api.post('/branches', data, token);
        if (r.success) { setBranches(prev => [...prev, r.branch]); setBranchFormItem(undefined); }
      }
    } catch {}
    setFormLoading(false);
  };

  const handleDeleteBranch = async () => {
    if (!deleteConfirm) return;
    try {
      const r = await api.delete('/branches/' + deleteConfirm._id, token);
      if (r.success) setBranches(prev => prev.filter(b => b._id !== deleteConfirm._id));
    } catch {}
    setDeleteConfirm(null);
  };

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

  const tabs = ['dashboard', 'orders', 'menu', 'branches', 'reports'];

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
        {'Notification' in window && Notification.permission !== 'granted' && (
          <button className="btn btn-secondary" onClick={requestNotifications} title={t.enableNotifications}>🔔</button>
        )}
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
        <>
          {user?.role === 'admin' || user?.role === 'manager' ? (
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setMenuFormItem(null)}>+ {t.addMenuItem}</button>
            </div>
          ) : null}
          <div className="card-grid-sm" role="list">
            {menuItems.map(item => (
              <div key={item._id} className="admin-card" role="listitem">
                <div className="icon" aria-hidden="true">{item.icon || '🍗'}</div>
                <h4>{item.name?.[lang] || item.name?.ar}</h4>
                <p className="price">{item.price?.toLocaleString()} {t.iqd}</p>
                <p className="meta">{t[item.category] || item.category} | {item.isAvailable ? '✅ ' + t.available : '❌ ' + t.notAvailable}</p>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setMenuFormItem(item)}>✏️ {t.edit}</button>
                    {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm({ ...item, type: 'menu' })}>🗑️</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && !loading && (
        <>
          {user?.role === 'admin' && (
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setBranchFormItem(null)}>+ {t.addBranch}</button>
            </div>
          )}
          <div className="card-grid" role="list">
            {branches.map(branch => (
              <div key={branch._id} className="admin-card" role="listitem">
                <h4>{branch.name?.[lang] || branch.name?.ar}</h4>
                <p className="meta"><span aria-hidden="true">📞</span> {branch.phone}</p>
                <p className="meta"><span aria-hidden="true">⏰</span> {branch.workingHours?.open} - {branch.workingHours?.close}</p>
                <span className={`status-badge ${branch.isOpen ? 'status-open' : 'status-closed'}`} role="status" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                  {branch.isOpen ? t.open : t.closed}
                </span>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setBranchFormItem(branch)}>✏️ {t.edit}</button>
                    {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm({ ...branch, type: 'branch' })}>🗑️</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && !loading && <ReportsTab t={t} token={token} />}

      {/* Status Change Confirmation */}
      {statusConfirm && (
        <ConfirmModal title={t.confirmStatusChange} onConfirm={confirmStatusUpdate} onCancel={() => setStatusConfirm(null)} confirmText={t.yes} cancelText={t.no}>
          <p>{t.confirmStatusChange}</p>
        </ConfirmModal>
      )}

      {/* Menu Form Modal */}
      {menuFormItem !== undefined && (
        <MenuFormModal t={t} item={menuFormItem} onSave={handleSaveMenuItem} onCancel={() => setMenuFormItem(undefined)} loading={formLoading} />
      )}

      {/* Branch Form Modal */}
      {branchFormItem !== undefined && (
        <BranchFormModal t={t} branch={branchFormItem} onSave={handleSaveBranch} onCancel={() => setBranchFormItem(undefined)} loading={formLoading} />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal title={t.confirmDelete} onConfirm={deleteConfirm.type === 'menu' ? handleDeleteMenuItem : handleDeleteBranch} onCancel={() => setDeleteConfirm(null)} confirmText={t.delete} cancelText={t.cancel}>
          <p>{t.confirmDelete}</p>
          <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{deleteConfirm.name?.[lang] || deleteConfirm.name?.ar}</p>
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
        {page === 'about' && <AboutPage t={t} lang={lang} />}
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
