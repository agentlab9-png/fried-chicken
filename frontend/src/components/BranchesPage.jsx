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

export default BranchesPage;
