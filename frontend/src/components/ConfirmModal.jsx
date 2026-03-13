const ConfirmModal = ({ title, children, onConfirm, onCancel, confirmText, cancelText, loading }) => (
  <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-label={title}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h3>{title}</h3>
      {children}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>{cancelText}</button>
        <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>
          {loading ? <span className="spinner" /> : confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
