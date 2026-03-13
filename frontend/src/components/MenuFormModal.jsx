import { useState } from 'react';

const MenuFormModal = ({ t, item, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(item ? {
    nameAr: item.name?.ar || '', nameEn: item.name?.en || '', nameKu: item.name?.ku || '',
    descAr: item.description?.ar || '', descEn: item.description?.en || '', descKu: item.description?.ku || '',
    category: item.category || 'crispy', price: item.price || '', icon: item.icon || '🍗',
    badge: item.badge || '', isAvailable: item.isAvailable !== false,
  } : {
    nameAr: '', nameEn: '', nameKu: '', descAr: '', descEn: '', descKu: '',
    category: 'crispy', price: '', icon: '🍗', badge: '', isAvailable: true,
  });

  const handleSubmit = () => {
    if (!form.nameAr.trim() || !form.price) return;
    onSave({
      name: { ar: form.nameAr.trim(), en: form.nameEn.trim(), ku: form.nameKu.trim() },
      description: { ar: form.descAr.trim(), en: form.descEn.trim(), ku: form.descKu.trim() },
      category: form.category, price: Number(form.price), icon: form.icon,
      badge: form.badge || null, isAvailable: form.isAvailable,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h3>{item ? t.editMenuItem : t.addMenuItem}</h3>
        <div className="form-grid">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.itemName} <span className="required">*</span></label>
              <input className="form-input" value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.itemNameEn}</label>
              <input className="form-input" value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.itemNameKu}</label>
            <input className="form-input" value={form.nameKu} onChange={e => setForm({...form, nameKu: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.descAr}</label>
            <textarea className="form-textarea" value={form.descAr} onChange={e => setForm({...form, descAr: e.target.value})} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.descEn}</label>
              <textarea className="form-textarea" value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.descKu}</label>
              <textarea className="form-textarea" value={form.descKu} onChange={e => setForm({...form, descKu: e.target.value})} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.price} <span className="required">*</span></label>
              <input className="form-input" type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.category}</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="crispy">{t.crispy}</option>
                <option value="family">{t.family}</option>
                <option value="sides">{t.sides}</option>
              </select>
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.icon}</label>
              <input className="form-input" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={{ fontSize: '1.5rem', textAlign: 'center' }} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.badge}</label>
              <select className="form-select" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}>
                <option value="">{t.none}</option>
                <option value="popular">{t.popular}</option>
                <option value="new">{t.new}</option>
                <option value="spicy">{t.spicy}</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="item-avail" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} />
            <label htmlFor="item-avail" className="form-label" style={{ margin: 0 }}>{t.available}</label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.nameAr.trim() || !form.price}>
            {loading ? <span className="spinner" /> : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuFormModal;
