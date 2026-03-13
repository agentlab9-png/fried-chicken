import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { VALID_STATUSES, sanitize } from '../helpers';
import ConfirmModal from './ConfirmModal';
import MenuFormModal from './MenuFormModal';
import BranchFormModal from './BranchFormModal';
import ReportsTab from './ReportsTab';

const AdminDashboard = ({ t, lang, token, user }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusConfirm, setStatusConfirm] = useState(null);
  const [menuFormItem, setMenuFormItem] = useState(undefined);
  const [branchFormItem, setBranchFormItem] = useState(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [prevOrderCount, setPrevOrderCount] = useState(null);
  const ITEMS_PER_PAGE = 20;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'orders') {
        const r = await api.get(`/orders?page=${currentPage}&limit=${ITEMS_PER_PAGE}`, token);
        if (r.success) { setOrders(r.orders); setTotalPages(r.pages || 1); }
      } else if (activeTab === 'dashboard') {
        const r = await api.get('/stats/dashboard', token);
        if (r.success) setStats(r.stats);
      } else if (activeTab === 'menu') {
        const r = await api.get('/menu', token);
        if (r.success) setMenuItems(r.items);
      } else if (activeTab === 'branches') {
        const r = await api.get('/branches', token);
        if (r.success) setBranches(r.branches);
      }
    } catch {
      setError(t.loadError);
    }
    setLoading(false);
  }, [activeTab, currentPage, token, t.loadError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab !== 'orders' && activeTab !== 'dashboard') return;
    const interval = setInterval(async () => {
      try {
        const r = await api.get('/stats/dashboard', token);
        if (r.success && prevOrderCount !== null && r.stats.totalOrders > prevOrderCount) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(t.newOrderNotif, { body: `${t.orderNumber}: ${r.stats.totalOrders}`, icon: '🍗' });
          }
          try { new Audio('data:audio/wav;base64,UklGRl9vT19teleXBFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU'+Array(300).join('A')).play(); } catch {}
          loadData();
        }
        setPrevOrderCount(r.stats.totalOrders);
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [activeTab, token, prevOrderCount, t.newOrderNotif, t.orderNumber, loadData]);

  const requestNotifications = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  const handleSaveMenuItem = async (data) => {
    setFormLoading(true);
    try {
      if (menuFormItem && menuFormItem._id) {
        const r = await api.put('/menu/' + menuFormItem._id, data, token);
        if (r.success) { setMenuItems(prev => prev.map(i => i._id === menuFormItem._id ? r.item : i)); setMenuFormItem(undefined); }
      } else {
        const r = await api.post('/menu', data, token);
        if (r.success) { setMenuItems(prev => [...prev, r.item]); setMenuFormItem(undefined); }
      }
    } catch {}
    setFormLoading(false);
  };

  const handleDeleteMenuItem = async () => {
    if (!deleteConfirm) return;
    try {
      const r = await api.delete('/menu/' + deleteConfirm._id, token);
      if (r.success) setMenuItems(prev => prev.filter(i => i._id !== deleteConfirm._id));
    } catch {}
    setDeleteConfirm(null);
  };

  const handleSaveBranch = async (data) => {
    setFormLoading(true);
    try {
      if (branchFormItem && branchFormItem._id) {
        const r = await api.put('/branches/' + branchFormItem._id, data, token);
        if (r.success) { setBranches(prev => prev.map(b => b._id === branchFormItem._id ? r.branch : b)); setBranchFormItem(undefined); }
      } else {
        const r = await api.post('/branches', data, token);
        if (r.success) { setBranches(prev => [...prev, r.branch]); setBranchFormItem(undefined); }
      }
    } catch {}
    setFormLoading(false);
  };

  const handleDeleteBranch = async () => {
    if (!deleteConfirm) return;
    try {
      const r = await api.delete('/branches/' + deleteConfirm._id, token);
      if (r.success) setBranches(prev => prev.filter(b => b._id !== deleteConfirm._id));
    } catch {}
    setDeleteConfirm(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusConfirm({ orderId, newStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusConfirm) return;
    const { orderId, newStatus } = statusConfirm;
    try {
      const r = await api.put('/orders/' + orderId + '/status', { status: newStatus }, token);
      if (r.success) setOrders(prev => prev.map(o => o._id === orderId ? {...o, status: newStatus} : o));
    } catch {}
    setStatusConfirm(null);
  };

  const tabs = ['dashboard', 'orders', 'menu', 'branches', 'reports'];

  return (
    <main className="container">
      <h1 className="section-title">⚙️ {t.admin} - {sanitize(user?.name)}</h1>
      <div className="admin-tabs" role="tablist">
        {tabs.map(tab => (
          <button key={tab} role="tab" aria-selected={activeTab === tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}>
            {t[tab] || tab}
          </button>
        ))}
        <button className="btn btn-secondary" onClick={loadData} aria-label={t.retry}>🔄</button>
        {'Notification' in window && Notification.permission !== 'granted' && (
          <button className="btn btn-secondary" onClick={requestNotifications} title={t.enableNotifications}>🔔</button>
        )}
      </div>

      {error && <div className="alert alert-error" role="alert">{error} <button className="btn btn-sm btn-secondary" onClick={loadData} style={{ marginInlineStart: '0.5rem' }}>{t.retry}</button></div>}
      {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t.loading}</p>}

      {activeTab === 'dashboard' && !loading && (
        <div className="admin-stat-grid" role="list">
          {[
            { label: t.todayOrders, value: stats.todayOrders || 0, icon: '📦', color: '#3b82f6' },
            { label: t.totalRevenue, value: (stats.totalRevenue || 0).toLocaleString() + ' ' + t.iqd, icon: '💰', color: '#10b981' },
            { label: t.pendingOrders, value: stats.pendingOrders || 0, icon: '⏳', color: '#f59e0b' },
            { label: t.totalOrdersLabel, value: stats.totalOrders || 0, icon: '📊', color: '#8b5cf6' },
          ].map(card => (
            <div key={card.label} className="stat-card" role="listitem" style={{ borderColor: card.color }}>
              <div className="icon" aria-hidden="true">{card.icon}</div>
              <div className="value" style={{ color: card.color }}>{card.value}</div>
              <div className="label">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && !loading && (
        <>
          <div className="orders-table-wrap">
            <table className="orders-table" role="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t.name}</th>
                  <th scope="col">{t.phone}</th>
                  <th scope="col">{t.total}</th>
                  <th scope="col">{t.status}</th>
                  <th scope="col">{t.orderType}</th>
                  <th scope="col">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{order.orderNumber}</td>
                    <td>{sanitize(order.customer?.name)}</td>
                    <td dir="ltr">{sanitize(order.customer?.phone)}</td>
                    <td style={{ fontWeight: 'bold' }}>{order.total?.toLocaleString()}</td>
                    <td>
                      <span className={`order-status ${VALID_STATUSES.includes(order.status) ? `status-${order.status}` : 'status-pending'}`} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                        {t[order.status] || order.status}
                      </span>
                    </td>
                    <td>{t[order.orderType] || order.orderType}</td>
                    <td>
                      <label htmlFor={`status-${order._id}`} style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.status}</label>
                      <select id={`status-${order._id}`} value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className="form-select" style={{ padding: '0.3rem', fontSize: '0.85rem', minWidth: '120px' }}>
                        {VALID_STATUSES.map(s => (
                          <option key={s} value={s}>{t[s] || s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t.noOrders}</p>}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button className="btn btn-sm btn-secondary" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} aria-label={t.prev}>&laquo; {t.prev}</button>
              <span>{t.page} {currentPage} / {totalPages}</span>
              <button className="btn btn-sm btn-secondary" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} aria-label={t.next}>{t.next} &raquo;</button>
            </nav>
          )}
        </>
      )}

      {activeTab === 'menu' && !loading && (
        <>
          {user?.role === 'admin' || user?.role === 'manager' ? (
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setMenuFormItem(null)}>+ {t.addMenuItem}</button>
            </div>
          ) : null}
          <div className="card-grid-sm" role="list">
            {menuItems.map(item => (
              <div key={item._id} className="admin-card" role="listitem">
                <div className="icon" aria-hidden="true">{item.icon || '🍗'}</div>
                <h4>{item.name?.[lang] || item.name?.ar}</h4>
                <p className="price">{item.price?.toLocaleString()} {t.iqd}</p>
                <p className="meta">{t[item.category] || item.category} | {item.isAvailable ? '✅ ' + t.available : '❌ ' + t.notAvailable}</p>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setMenuFormItem(item)}>✏️ {t.edit}</button>
                    {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm({ ...item, type: 'menu' })}>🗑️</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'branches' && !loading && (
        <>
          {user?.role === 'admin' && (
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setBranchFormItem(null)}>+ {t.addBranch}</button>
            </div>
          )}
          <div className="card-grid" role="list">
            {branches.map(branch => (
              <div key={branch._id} className="admin-card" role="listitem">
                <h4>{branch.name?.[lang] || branch.name?.ar}</h4>
                <p className="meta"><span aria-hidden="true">📞</span> {branch.phone}</p>
                <p className="meta"><span aria-hidden="true">⏰</span> {branch.workingHours?.open} - {branch.workingHours?.close}</p>
                <span className={`status-badge ${branch.isOpen ? 'status-open' : 'status-closed'}`} role="status" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                  {branch.isOpen ? t.open : t.closed}
                </span>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setBranchFormItem(branch)}>✏️ {t.edit}</button>
                    {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm({ ...branch, type: 'branch' })}>🗑️</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'reports' && !loading && <ReportsTab t={t} token={token} />}

      {statusConfirm && (
        <ConfirmModal title={t.confirmStatusChange} onConfirm={confirmStatusUpdate} onCancel={() => setStatusConfirm(null)} confirmText={t.yes} cancelText={t.no}>
          <p>{t.confirmStatusChange}</p>
        </ConfirmModal>
      )}

      {menuFormItem !== undefined && (
        <MenuFormModal t={t} item={menuFormItem} onSave={handleSaveMenuItem} onCancel={() => setMenuFormItem(undefined)} loading={formLoading} />
      )}

      {branchFormItem !== undefined && (
        <BranchFormModal t={t} branch={branchFormItem} onSave={handleSaveBranch} onCancel={() => setBranchFormItem(undefined)} loading={formLoading} />
      )}

      {deleteConfirm && (
        <ConfirmModal title={t.confirmDelete} onConfirm={deleteConfirm.type === 'menu' ? handleDeleteMenuItem : handleDeleteBranch} onCancel={() => setDeleteConfirm(null)} confirmText={t.delete} cancelText={t.cancel}>
          <p>{t.confirmDelete}</p>
          <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{deleteConfirm.name?.[lang] || deleteConfirm.name?.ar}</p>
        </ConfirmModal>
      )}
    </main>
  );
};

export default AdminDashboard;
