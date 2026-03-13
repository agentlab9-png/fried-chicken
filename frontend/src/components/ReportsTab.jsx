import { useState, useEffect } from 'react';
import api from '../api';

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

export default ReportsTab;
