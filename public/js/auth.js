import { apiFetch, setAuthToken } from './api.js';
import { showToast } from './utils.js';

let currentUser = null;

export function getCurrentUser() {
  return currentUser;
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setAuthToken(data.token);
  currentUser = data;
  return data;
}

export async function logout() {
  setAuthToken(null);
  currentUser = null;
  localStorage.removeItem('token');
  showToast('Signed out successfully');
  window.location.reload();
}

export async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const user = await apiFetch('/auth/me');
    currentUser = user;
    setAuthToken(token);
    return user;
  } catch (err) {
    setAuthToken(null);
    localStorage.removeItem('token');
    return null;
  }
}

export function updateUserUI(user) {
  const userNameEl = document.getElementById('user-name');
  const userRoleEl = document.getElementById('user-role');
  const userAvatarEl = document.getElementById('user-avatar');
  if (userNameEl) userNameEl.textContent = user.name || 'User';
  if (userRoleEl) userRoleEl.textContent = user.role || 'Technician';
  if (userAvatarEl) {
    const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase();
    userAvatarEl.textContent = initials.slice(0, 2);
  }
}
