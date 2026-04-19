import { apiFetch } from './api.js';
import { showToast } from './utils.js';

export async function loadUsers() {
  const container = document.getElementById('view-users');
  if (!container) return;
  
  // Placeholder until backend /api/users endpoint is ready
  container.innerHTML = `
    <div class="table-container">
      <p style="padding: 40px; text-align: center; color: var(--text-muted);">
        User management coming soon.<br>
        Backend endpoint <code>/api/users</code> is required.
      </p>
    </div>
  `;
  
  // Uncomment when backend is ready:
  /*
  try {
    const users = await apiFetch('/users');
    renderUsersTable(users);
  } catch (err) {
    showToast('Failed to load users: ' + err.message, 'error');
    container.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-muted)">Error loading users</p>';
  }
  */
}

function renderUsersTable(users) {
  // Will implement when backend is ready
  const container = document.getElementById('view-users');
  if (!container) return;
  
  if (users.length === 0) {
    container.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-muted)">No users found</p>';
    return;
  }
  
  const table = `
    <div class="table-container">
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Access Level</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${escapeHtml(u.name)}</td>
              <td>${escapeHtml(u.email)}</td>
              <td>${escapeHtml(u.role || '—')}</td>
              <td><span class="pill ${u.access_level}">${u.access_level}</span></td>
              <td>
                <button class="action-btn edit-user" data-id="${u.id}">✏️</button>
                <button class="action-btn delete-user" data-id="${u.id}">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = table;
  
  // Attach event listeners (to be implemented)
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}