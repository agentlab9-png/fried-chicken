import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';
import api from './api';
import translations from './translations';
import { getCartFromStorage, saveCartToStorage } from './helpers';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import BranchesPage from './components/BranchesPage';
import TrackPage from './components/TrackPage';
import LoginPage from './components/LoginPage';
import AboutPage from './components/AboutPage';
import AdminDashboard from './components/AdminDashboard';

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

  useEffect(() => { saveCartToStorage(cart); }, [cart]);
  useEffect(() => { localStorage.setItem('fc_lang', lang); }, [lang]);

  useEffect(() => {
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  useEffect(() => {
    const dismissed = localStorage.getItem('fc_install_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isIOS && !isStandalone) {
      setShowInstallBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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
