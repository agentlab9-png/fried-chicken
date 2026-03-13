import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { VALID_STATUSES, sanitize } from '../helpers';

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

export default TrackPage;
