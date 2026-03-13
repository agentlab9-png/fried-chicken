import { useState } from 'react';

const BranchFormModal = ({ t, branch, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(branch ? {
    nameAr: branch.name?.ar || '', nameEn: branch.name?.en || '', nameKu: branch.name?.ku || '',
    areaAr: branch.area?.ar || '', areaEn: branch.area?.en || '', areaKu: branch.area?.ku || '',
    phone: branch.phone || '', address: branch.address || '',
    openTime: branch.workingHours?.open || '11:00', closeTime: branch.workingHours?.close || '23:00',
    isOpen: branch.isOpen !== false,
  } : {
    nameAr: '', nameEn: '', nameKu: '', areaAr: '', areaEn: '', areaKu: '',
    phone: '', address: '', openTime: '11:00', closeTime: '23:00', isOpen: true,
  });

  const handleSubmit = () => {
    if (!form.nameAr.trim() || !form.phone.trim()) return;
    onSave({
      name: { ar: form.nameAr.trim(), en: form.nameEn.trim(), ku: form.nameKu.trim() },
      area: { ar: form.areaAr.trim(), en: form.areaEn.trim(), ku: form.areaKu.trim() },
      phone: form.phone.trim(), address: form.address.trim(),
      workingHours: { open: form.openTime, close: form.closeTime },
      isOpen: form.isOpen,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h3>{branch ? t.editBranch : t.addBranch}</h3>
        <div className="form-grid">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.branchNameAr} <span className="required">*</span></label>
              <input className="form-input" value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.branchNameEn}</label>
              <input className="form-input" value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.branchNameKu}</label>
            <input className="form-input" value={form.nameKu} onChange={e => setForm({...form, nameKu: e.target.value})} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.areaAr}</label>
              <input className="form-input" value={form.areaAr} onChange={e => setForm({...form, areaAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.areaEn}</label>
              <input className="form-input" value={form.areaEn} onChange={e => setForm({...form, areaEn: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.phone} <span className="required">*</span></label>
              <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.address}</label>
              <input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">{t.openTime}</label>
              <input className="form-input" type="time" value={form.openTime} onChange={e => setForm({...form, openTime: e.target.value})} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">{t.closeTime}</label>
              <input className="form-input" type="time" value={form.closeTime} onChange={e => setForm({...form, closeTime: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="branch-open" checked={form.isOpen} onChange={e => setForm({...form, isOpen: e.target.checked})} />
            <label htmlFor="branch-open" className="form-label" style={{ margin: 0 }}>{t.isOpen}</label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.nameAr.trim() || !form.phone.trim()}>
            {loading ? <span className="spinner" /> : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchFormModal;
