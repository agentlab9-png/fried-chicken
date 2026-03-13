import { useState } from 'react';
import api from '../api';

const LoginPage = ({ t, onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) { setError(t.fillRequired); return; }
    setLoading(true); setError('');
    try {
      const result = await api.post('/auth/login', { username: form.username.trim(), password: form.password });
      if (result.success) onLogin(result.token, result.user);
      else setError(result.error || t.error);
    } catch { setError(t.error); }
    setLoading(false);
  };

  return (
    <main className="login-page">
      <h1 className="section-title">🔐 {t.login}</h1>
      <form onSubmit={handleLogin} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-user">{t.username}</label>
          <input id="login-user" className="form-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required autoComplete="username" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-pass">{t.password}</label>
          <input id="login-pass" className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required autoComplete="current-password" onKeyDown={e => e.key === 'Enter' && handleLogin(e)} />
        </div>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? <span className="spinner" /> : t.login}
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
