import { useState } from 'react';

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

export default MenuPage;
