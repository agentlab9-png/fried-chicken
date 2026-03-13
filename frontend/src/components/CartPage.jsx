import { useState } from 'react';
import api from '../api';
import { validatePhone } from '../helpers';
import ConfirmModal from './ConfirmModal';

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

export default CartPage;
