import React, { useState, useEffect } from 'react';

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

export default Navbar;
