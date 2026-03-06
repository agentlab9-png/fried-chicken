import React, { useState, useEffect, useCallback } from 'react';

// API Configuration
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  get: (url, token) => fetch(API_BASE + url, { headers: token ? { Authorization: 'Bearer ' + token } : {} }).then(r => r.json()),
  post: (url, data, token) => fetch(API_BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  put: (url, data, token) => fetch(API_BASE + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  delete: (url, token) => fetch(API_BASE + url, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  }).then(r => r.json()),
};

// Translations
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
    lang: 'اللغة', search: 'بحث', close: 'إغلاق', open: 'مفتوح',
    closed: 'مغلق', workingHours: 'ساعات العمل', branch: 'الفرع', selectBranch: 'اختر الفرع',
    quantity: 'الكمية', price: 'السعر', remove: 'حذف', empty: 'السلة فارغة',
    orderSent: 'تم إرسال طلبك', trackOrder: 'تتبع الطلب', enterOrderNumber: 'أدخل رقم الطلب',
    noResults: 'لا توجد نتائج', loading: 'جاري التحميل...', error: 'حدث خطأ',
    save: 'حفظ', cancel: 'إلغاء', edit: 'تعديل', delete: 'حذف', add: 'إضافة',
    welcome: 'أهلاً بكم في فرايد تشكين', tagline: 'أشهى الدجاج المقلي في العراق',
    iqd: 'د.ع',
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
    lang: 'Language', search: 'Search', close: 'Close', open: 'Open', closed: 'Closed',
    workingHours: 'Working Hours', branch: 'Branch', selectBranch: 'Select Branch',
    quantity: 'Qty', price: 'Price', remove: 'Remove', empty: 'Cart is empty',
    orderSent: 'Order placed!', trackOrder: 'Track Order', enterOrderNumber: 'Enter order number',
    noResults: 'No results', loading: 'Loading...', error: 'An error occurred',
    save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', add: 'Add',
    welcome: 'Welcome to Fried Chicken', tagline: 'The Best Fried Chicken in Iraq',
    iqd: 'IQD',
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
    totalRevenue: 'کۆی داهات', lang: 'زمان', search: 'گەڕان',
    close: 'داخستن', open: 'كراوەیە', closed: 'داخراوە',
    workingHours: 'كاتی كار', branch: 'لق', selectBranch: 'لق هەڵبژێرە',
    quantity: 'بڕ', price: 'نرخ', remove: 'سڕینەوە', empty: 'سەبەت بەتاڵە',
    orderSent: 'داواكاریەكەت نێردرا!', trackOrder: 'شوێنكەوتن',
    enterOrderNumber: 'ژمارەی داواكاری بنووسە', noResults: 'ئەنجامێك نییە',
    loading: 'بارکردن...', error: 'هەڵەیەك روویدا',
    save: 'پاشەکەوتكردن', cancel: 'هەڵوەشاندنەوە', edit: 'دەستکاری', delete: 'سڕینەوە', add: 'زیادكردن',
    welcome: 'بەخێربێن بۆ فرایەد چیكن', tagline: 'باشترین مریشكی قەیمەكراو لە عێراق',
    iqd: 'د.ع',
  }
};

// Status Colors
const statusColors = {
  pending: '#f59e0b', confirmed: '#3b82f6', preparing: '#8b5cf6',
  ready: '#10b981', delivering: '#06b6d4', delivered: '#22c55e', cancelled: '#ef4444'
};

// ─── Components ───────────────────────────────────────────────────────────────

// Navbar
const Navbar = ({ lang, setLang, page, setPage, cart, user, onLogout }) => {
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav style={{ background: '#dc2626', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setPage('home')}>
        <span style={{ fontSize: '1.8rem' }}>🍗</span>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{t.appName}</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {['home','menu','branches','track'].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? 'rgba(255,255,255,0.3)' : 'transparent', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: page === p ? 'bold' : 'normal' }}>
            {t[p]}
          </button>
        ))}
        <button onClick={() => setPage('cart')} style={{ background: 'white', color: '#dc2626', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', position: 'relative' }}>
          🛒 {cart.length > 0 && <span style={{ background: '#dc2626', color: 'white', borderRadius: '50%', padding: '0 5px', fontSize: '0.75rem', position: 'absolute', top: -8, right: -8 }}>{cart.reduce((a, i) => a + i.quantity, 0)}</span>}
        </button>
        {user ? (
          <>
            <button onClick={() => setPage('admin')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>{t.admin}</button>
            <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>{t.logout}</button>
          </>
        ) : (
          <button onClick={() => setPage('login')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>{t.login}</button>
        )}
        <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', border: 'none' }}>
          <option value="ar">عر</option>
          <option value="en">En</option>
          <option value="ku">کو</option>
        </select>
      </div>
    </nav>
  );
};

// HomePage
const HomePage = ({ t, setPage, menuItems, branches }) => (
  <div>
    <div style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🍗</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t.welcome}</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>{t.tagline}</p>
      <button onClick={() => setPage('menu')} style={{ background: 'white', color: '#dc2626', padding: '0.8rem 2rem', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
        {t.order} 🍗
      </button>
    </div>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#dc2626' }}>⭐ {t.popular}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {menuItems.filter(i => i.badge === 'popular').slice(0, 4).map(item => (
          <div key={item._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#fef2f2', padding: '2rem', textAlign: 'center', fontSize: '3rem' }}>{item.icon || '🍗'}</div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontWeight: 'bold' }}>{item.name?.ar || item.name?.en}</h3>
              <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{item.price?.toLocaleString()} د.ع</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// MenuPage  
const MenuPage = ({ t, lang, menuItems, addToCart }) => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  const filtered = menuItems.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = !search || 
      (item.name?.ar || '').includes(search) || 
      (item.name?.en || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.isAvailable;
  });
  
  const categories = ['all', 'crispy', 'family', 'sides'];
  
  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#dc2626', fontSize: '1.8rem' }}>🍗 {t.menu}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '2px solid #dc2626', background: category === cat ? '#dc2626' : 'white', color: category === cat ? 'white' : '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>
            {cat === 'all' ? '🍽 الكل' : (t[cat] || cat)}
          </button>
        ))}
      </div>
      <input placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '400px', display: 'block', margin: '0 auto 1.5rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(item => (
          <div key={item._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}>
            {item.badge && <div style={{ background: item.badge === 'popular' ? '#f59e0b' : item.badge === 'spicy' ? '#ef4444' : '#10b981', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block' }}>{t[item.badge] || item.badge}</div>}
            <div style={{ background: '#fef2f2', padding: '2rem', textAlign: 'center', fontSize: '3.5rem' }}>{item.icon || '🍗'}</div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{item.name?.[lang] || item.name?.ar}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{item.description?.[lang] || item.description?.ar}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.price?.toLocaleString()} {t.iqd}</span>
                <button onClick={() => addToCart(item)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ {t.addToCart}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>{t.noResults}</p>}
    </div>
  );
};

// CartPage
const CartPage = ({ t, lang, cart, setCart, branches, onOrderPlaced }) => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', orderType: 'delivery', notes: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };
  
  const removeItem = (id) => setCart(prev => prev.filter(i => i._id !== id));
  
  const submitOrder = async () => {
    if (!form.name || !form.phone || !form.branch) { setError('يرجى ملء جميع الحقول المطلوبة'); return; }
    setLoading(true);
    try {
      const orderData = {
        customer: { name: form.name, phone: form.phone, address: form.address },
        items: cart.map(i => ({ menuItem: i._id, name: i.name?.[lang] || i.name?.ar, quantity: i.quantity, price: i.price, subtotal: i.price * i.quantity })),
        total,
        orderType: form.orderType,
        paymentMethod: 'cash',
        branch: form.branch,
        notes: form.notes,
      };
      const result = await api.post('/orders', orderData);
      if (result.success) {
        setCart([]);
        onOrderPlaced(result.order.orderNumber);
      } else { setError(result.error || t.error); }
    } catch (e) { setError(t.error); }
    setLoading(false);
  };
  
  if (cart.length === 0) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
      <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>{t.empty}</p>
    </div>
  );
  
  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#dc2626', marginBottom: '1.5rem' }}>🛒 {t.cart}</h2>
      {cart.map(item => (
        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{item.icon || '🍗'}</span>
            <div>
              <p style={{ fontWeight: 'bold' }}>{item.name?.[lang] || item.name?.ar}</p>
              <p style={{ color: '#dc2626' }}>{item.price?.toLocaleString()} {t.iqd}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => updateQty(item._id, -1)} style={{ background: '#f3f4f6', border: 'none', padding: '0.2rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
            <span style={{ minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
            <button onClick={() => updateQty(item._id, 1)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.2rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
            <button onClick={() => removeItem(item._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>✕</button>
          </div>
        </div>
      ))}
      <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1.5rem' }}>
        <strong style={{ fontSize: '1.2rem' }}>{t.total}: {total.toLocaleString()} {t.iqd}</strong>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <input placeholder={t.name + ' *'} value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
        <input placeholder={t.phone + ' *'} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
        <input placeholder={t.address} value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
        <select value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
          <option value="">{t.selectBranch + ' *'}</option>
          {branches.map(b => <option key={b._id} value={b._id}>{b.name?.[lang] || b.name?.ar}</option>)}
        </select>
        <select value={form.orderType} onChange={e => setForm({...form, orderType: e.target.value})} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
          <option value="delivery">{t.delivery}</option>
          <option value="pickup">{t.pickup}</option>
        </select>
        <textarea placeholder={t.notes} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px', resize: 'vertical', minHeight: '80px' }} />
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        <button onClick={submitOrder} disabled={loading} style={{ background: '#dc2626', color: 'white', padding: '0.8rem', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          {loading ? t.loading : '🍗 ' + t.submit}
        </button>
      </div>
    </div>
  );
};

// BranchesPage
const BranchesPage = ({ t, lang, branches }) => (
  <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
    <h2 style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>📍 {t.branches}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {branches.map(branch => (
        <div key={branch._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{branch.name?.[lang] || branch.name?.ar}</h3>
            <span style={{ background: branch.isOpen ? '#dcfce7' : '#fee2e2', color: branch.isOpen ? '#166534' : '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {branch.isOpen ? t.open : t.closed}
            </span>
          </div>
          {branch.area?.[lang] && <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>📍 {branch.area[lang]}</p>}
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>📞 {branch.phone}</p>
          <p style={{ color: '#6b7280' }}>⏰ {branch.workingHours?.open} - {branch.workingHours?.close}</p>
        </div>
      ))}
    </div>
  </div>
);

// TrackPage
const TrackPage = ({ t }) => {
  const [orderNum, setOrderNum] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const trackOrder = async () => {
    if (!orderNum) return;
    setLoading(true); setError('');
    try {
      const result = await api.get('/orders/track/' + orderNum);
      if (result.success) setOrder(result.order);
      else setError(result.error || t.error);
    } catch (e) { setError(t.error); }
    setLoading(false);
  };
  
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#dc2626', textAlign: 'center', marginBottom: '2rem' }}>📦 {t.track}</h2>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input placeholder={t.enterOrderNumber} value={orderNum} onChange={e => setOrderNum(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && trackOrder()}
          style={{ flex: 1, padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }} />
        <button onClick={trackOrder} style={{ background: '#dc2626', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? '...' : '🔍'}
        </button>
      </div>
      {error && <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p>}
      {order && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 'bold' }}>{t.orderNumber}: #{order.orderNumber}</h3>
            <span style={{ background: statusColors[order.status] + '20', color: statusColors[order.status], padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}>
              {t[order.status] || order.status}
            </span>
          </div>
          <p style={{ color: '#6b7280' }}>{t.name}: {order.customer?.name}</p>
          <p style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '0.5rem' }}>{t.total}: {order.total?.toLocaleString()} د.ع</p>
        </div>
      )}
    </div>
  );
};

// LoginPage
const LoginPage = ({ t, onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const result = await api.post('/auth/login', form);
      if (result.success) onLogin(result.token, result.user);
      else setError(result.error || t.error);
    } catch (e) { setError(t.error); }
    setLoading(false);
  };
  
  return (
    <div style={{ padding: '3rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#dc2626', textAlign: 'center', marginBottom: '2rem' }}>🔐 {t.login}</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <input placeholder={t.username} value={form.username} onChange={e => setForm({...form, username: e.target.value})}
          style={{ padding: '0.8rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} />
        <input type="password" placeholder={t.password} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ padding: '0.8rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} />
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{ background: '#dc2626', color: 'white', padding: '0.8rem', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? t.loading : t.login}
        </button>
      </div>
    </div>
  );
};

// AdminDashboard
const AdminDashboard = ({ t, lang, token, user }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const r = await api.get('/orders', token);
        if (r.success) setOrders(r.orders);
      } else if (activeTab === 'dashboard') {
        const r = await api.get('/stats/dashboard', token);
        if (r.success) setStats(r.stats);
      } else if (activeTab === 'menu') {
        const r = await api.get('/menu', token);
        if (r.success) setMenuItems(r.items);
      } else if (activeTab === 'branches') {
        const r = await api.get('/branches', token);
        if (r.success) setBranches(r.branches);
      } else if (activeTab === 'users' && user?.role === 'admin') {
        const r = await api.get('/auth/users', token);
        if (r.success) setUsers(r.users);
      }
    } catch (e) {}
    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    const r = await api.put('/orders/' + orderId + '/status', { status }, token);
    if (r.success) setOrders(prev => prev.map(o => o._id === orderId ? {...o, status} : o));
  };

  const tabs = ['dashboard', 'orders', 'menu', 'branches', ...(user?.role === 'admin' ? ['users'] : [])];

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#dc2626', marginBottom: '1.5rem' }}>⚙️ {t.admin} - {user?.name}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '2px solid #dc2626', background: activeTab === tab ? '#dc2626' : 'white', color: activeTab === tab ? 'white' : '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>
            {t[tab] || tab}
          </button>
        ))}
        <button onClick={loadData} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '2px solid #6b7280', background: 'white', color: '#6b7280', cursor: 'pointer' }}>🔄</button>
      </div>
      
      {loading && <p style={{ textAlign: 'center', color: '#6b7280' }}>{t.loading}</p>}
      
      {activeTab === 'dashboard' && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: t.todayOrders, value: stats.todayOrders || 0, icon: '📦', color: '#3b82f6' },
            { label: t.totalRevenue, value: (stats.totalRevenue || 0).toLocaleString() + ' ' + t.iqd, icon: '💰', color: '#10b981' },
            { label: 'طلبات قيد الانتظار', value: stats.pendingOrders || 0, icon: '⏳', color: '#f59e0b' },
            { label: 'إجمالي الطلبات', value: stats.totalOrders || 0, icon: '📊', color: '#8b5cf6' },
          ].map(card => (
            <div key={card.label} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', borderRight: '4px solid ' + card.color }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: card.color }}>{card.value}</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{card.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'orders' && !loading && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['#', t.name, t.phone, t.total, t.status, t.orderType, 'الإجراء'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', fontWeight: 'bold' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#dc2626' }}>#{order.orderNumber}</td>
                  <td style={{ padding: '0.75rem' }}>{order.customer?.name}</td>
                  <td style={{ padding: '0.75rem' }}>{order.customer?.phone}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{order.total?.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ background: statusColors[order.status] + '20', color: statusColors[order.status], padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {t[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{t[order.orderType] || order.orderType}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.85rem' }}>
                      {['pending','confirmed','preparing','ready','delivering','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{t[s] || s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>لا توجد طلبات</p>}
        </div>
      )}
      
      {activeTab === 'menu' && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {menuItems.map(item => (
            <div key={item._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>{item.icon || '🍗'}</div>
              <h4 style={{ fontWeight: 'bold' }}>{item.name?.[lang] || item.name?.ar}</h4>
              <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{item.price?.toLocaleString()} {t.iqd}</p>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.category} | {item.isAvailable ? '✅' : '❌'}</p>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'branches' && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {branches.map(branch => (
            <div key={branch._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
              <h4 style={{ fontWeight: 'bold' }}>{branch.name?.[lang] || branch.name?.ar}</h4>
              <p style={{ color: '#6b7280' }}>📞 {branch.phone}</p>
              <p style={{ color: '#6b7280' }}>⏰ {branch.workingHours?.open} - {branch.workingHours?.close}</p>
              <span style={{ background: branch.isOpen ? '#dcfce7' : '#fee2e2', color: branch.isOpen ? '#166534' : '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                {branch.isOpen ? t.open : t.closed}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState('ar');
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('fc_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('fc_user') || 'null'));
  const [lastOrderNum, setLastOrderNum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[lang];
  
  // Detect RTL/LTR
  useEffect(() => {
    document.dir = lang === 'en' ? 'ltr' : 'rtl';
  }, [lang]);
  
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
      } catch (e) {}
      setLoading(false);
    };
    loadInitial();
  }, []);
  
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  
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
    setPage('track');
  };
  
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fef2f2' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', animation: 'pulse 1s infinite' }}>🍗</div>
        <p style={{ color: '#dc2626', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>{t.loading}</p>
      </div>
    </div>
  );
  
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: lang === 'en' ? '-apple-system, sans-serif' : 'Tajawal, -apple-system, sans-serif' }}>
      <Navbar lang={lang} setLang={setLang} page={page} setPage={setPage} cart={cart} user={user} onLogout={handleLogout} />
      
      <div style={{ minHeight: 'calc(100vh - 60px)' }}>
        {page === 'home' && <HomePage t={t} setPage={setPage} menuItems={menuItems} branches={branches} />}
        {page === 'menu' && <MenuPage t={t} lang={lang} menuItems={menuItems} addToCart={addToCart} />}
        {page === 'cart' && <CartPage t={t} lang={lang} cart={cart} setCart={setCart} branches={branches} onOrderPlaced={handleOrderPlaced} />}
        {page === 'branches' && <BranchesPage t={t} lang={lang} branches={branches} />}
        {page === 'track' && <TrackPage t={t} defaultOrderNum={lastOrderNum} />}
        {page === 'login' && <LoginPage t={t} onLogin={handleLogin} />}
        {page === 'admin' && user && <AdminDashboard t={t} lang={lang} token={token} user={user} />}
        {page === 'admin' && !user && <LoginPage t={t} onLogin={handleLogin} />}
      </div>
      
      <footer style={{ background: '#1f2937', color: 'white', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍗</div>
        <p style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{t.appName}</p>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>© 2026 Fried Chicken. All rights reserved.</p>
      </footer>
    </div>
  );
}
