export const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];

export const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export const validatePhone = (phone) => /^[\d\s+()-]{7,15}$/.test(phone.trim());

export const getCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('fc_cart');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

export const saveCartToStorage = (cart) => {
  try { localStorage.setItem('fc_cart', JSON.stringify(cart)); } catch {}
};
