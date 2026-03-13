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

export default HomePage;
