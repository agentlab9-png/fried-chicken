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

export default AboutPage;
