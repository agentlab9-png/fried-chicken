const API_BASE = process.env.REACT_APP_API_URL || '/api';

const handleResponse = async (r) => {
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }
  return r.json();
};

const api = {
  get: (url, token) => fetch(API_BASE + url, {
    headers: token ? { Authorization: 'Bearer ' + token } : {},
    credentials: 'include',
  }).then(handleResponse),
  post: (url, data, token) => fetch(API_BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(handleResponse),
  put: (url, data, token) => fetch(API_BASE + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (url, token) => fetch(API_BASE + url, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
    credentials: 'include',
  }).then(handleResponse),
};

export default api;
