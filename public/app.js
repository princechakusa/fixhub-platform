const API_BASE = '/api';
let tickets = [], users = [], inventory = [];
let currentView = 'dashboard';

const contentEl = document.getElementById('content');
const pageTitle = document.getElementById('pageTitle');
const ticketBadge = document.getElementById('ticketBadge');
const dbStatus = document.getElementById('dbStatus');

const views = {
  dashboard: `
    <div class='stats-grid'>
      <div class='stat-card'><div class='stat-icon'><i data-feather='clipboard'></i></div><div class='stat-value' id='statActive'>—</div><div class='stat-label'>Active Tickets</div></div>
      <div class='stat-card'><div class='stat-icon'><i data-feather='check-circle'></i></div><div class='stat-value' id='statResolved'>—</div><div class='stat-label'>Resolved Today</div></div>
      <div class='stat-card'><div class='stat-icon'><i data-feather='alert-triangle'></i></div><div class='stat-value' id='statAlerts'>—</div><div class='stat-label'>Stock Alerts</div></div>
      <div class='stat-card'><div class='stat-icon'><i data-feather='target'></i></div><div class='stat-value' id='statSLA'>—</div><div class='stat-label'>SLA Rate</div></div>
    </div>
    <div class='dash-grid'>
      <div class='panel'>
        <div class='panel-header'><span class='panel-title'>Recent Tickets</span><button class='btn-icon' data-goto='tickets'><i data-feather='arrow-right'></i></button></div>
        <table><thead><tr><th>ID</th><th>Title</th><th>Tech</th><th>Status</th></tr></thead><tbody id='recentTicketsBody'></tbody></table>
      </div>
      <div class='panel'>
        <div class='panel-header'><span class='panel-title'>Live Activity</span><span class='live-badge'>● LIVE</span></div>
        <div class='activity-feed' id='activityFeed'></div>
      </div>
    </div>
  `,
  tickets: `
    <div class='panel'>
      <div class='panel-header'><span class='panel-title'>All Tickets</span><button class='btn-primary' id='newTicketViewBtn'><i data-feather='plus'></i> New Ticket</button></div>
      <table><thead><tr><th>ID</th><th>Title</th><th>Tech</th><th>Priority</th><th>Status</th></tr></thead><tbody id='allTicketsBody'></tbody></table>
    </div>
  `,
  users: `
    <div class='panel'>
      <div class='panel-header'><span class='panel-title'>Team Members</span></div>
      <div class='users-grid' id='usersGrid'></div>
    </div>
  `,
  inventory: `
    <div class='panel'>
      <div class='panel-header'><span class='panel-title'>Inventory</span></div>
      <div class='inventory-grid' id='inventoryGrid'></div>
    </div>
  `
};

async function init() {
  await loadData();
  renderView('dashboard');
  setupEvents();
  startClock();
  feather.replace();
}

async function loadData() {
  try {
    const [tRes, uRes, iRes] = await Promise.all([
      fetch(API_BASE + '/tickets'),
      fetch(API_BASE + '/users'),
      fetch(API_BASE + '/inventory')
    ]);
    tickets = await tRes.json();
    users = await uRes.json();
    inventory = await iRes.json();
    dbStatus.textContent = '● Connected';
    dbStatus.style.color = 'var(--success)';
  } catch (e) {
    dbStatus.textContent = '● Offline';
    dbStatus.style.color = 'var(--danger)';
  }
}

function renderView(view) {
  currentView = view;
  pageTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
  contentEl.innerHTML = views[view] || '<p>Coming soon</p>';
  document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.view === view));
  
  if (view === 'dashboard') renderDashboard();
  else if (view === 'tickets') renderTickets();
  else if (view === 'users') renderUsers();
  else if (view === 'inventory') renderInventory();
  
  feather.replace();
}

function renderDashboard() {
  const open = tickets.filter(t => t.status !== 'resolved').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const alerts = inventory.filter(i => i.quantity < i.min_quantity).length;
  const sla = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0;
  
  document.getElementById('statActive').textContent = open;
  document.getElementById('statResolved').textContent = resolved;
  document.getElementById('statAlerts').textContent = alerts;
  document.getElementById('statSLA').textContent = sla + '%';
  ticketBadge.textContent = open;

  const recent = tickets.slice(0, 8);
  document.getElementById('recentTicketsBody').innerHTML = recent.map(t => `
    <tr><td>${t.id}</td><td>${t.title}</td><td>${t.technician || '—'}</td><td><span class='pill ${t.status}'>${t.status}</span></td></tr>
  `).join('');
  
  document.getElementById('activityFeed').innerHTML = recent.map(t => `
    <div class='activity-item'><div class='activity-dot'></div><div><div class='activity-title'><strong>${t.id}</strong> ${t.title}</div><div class='activity-time'>${t.created_at ? new Date(t.created_at).toLocaleDateString() : 'just now'}</div></div></div>
  `).join('') || '<p>No recent activity</p>';
}

function renderTickets() {
  document.getElementById('allTicketsBody').innerHTML = tickets.map(t => `
    <tr><td>${t.id}</td><td>${t.title}</td><td>${t.technician || '—'}</td><td><span class='prio-tag ${t.priority}'>${t.priority}</span></td><td><span class='pill ${t.status}'>${t.status}</span></td></tr>
  `).join('');
}

function renderUsers() {
  const grid = document.getElementById('usersGrid');
  grid.innerHTML = users.map(u => `
    <div class='user-card'>
      <div class='avatar' style='background:${u.color || '#319795'}'>${u.name.split(' ').map(w=>w[0]).join('')}</div>
      <div class='user-name'>${u.name}</div>
      <div class='user-role'>${u.role}</div>
    </div>
  `).join('');
}

function renderInventory() {
  const grid = document.getElementById('inventoryGrid');
  grid.innerHTML = inventory.map(i => `
    <div class='inventory-item'>
      <strong>${i.name}</strong> — ${i.quantity} ${i.unit}
      ${i.quantity < i.min_quantity ? '<span class="warning">Low stock</span>' : ''}
    </div>
  `).join('');
}

function startClock() {
  const update = () => {
    const now = new Date();
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    document.getElementById('liveClock').textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  };
  update(); setInterval(update, 1000);
}

function setupEvents() {
  document.querySelectorAll('.nav-item[data-view]').forEach(i => i.addEventListener('click', () => renderView(i.dataset.view)));
  document.getElementById('refreshBtn').addEventListener('click', async () => { await loadData(); renderView(currentView); showToast('Refreshed', 'success'); });
  document.getElementById('sidebarToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('collapsed'));
  document.getElementById('mobileMenuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.add('mobile-open'));
  document.addEventListener('click', e => { if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-btn')) document.getElementById('sidebar').classList.remove('mobile-open'); });
  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => renderView(b.dataset.goto)));
  
  const newTicket = () => showToast('Ticket form coming soon', 'info');
  document.getElementById('newTicketBtn').addEventListener('click', newTicket);
  document.getElementById('topNewTicketBtn').addEventListener('click', newTicket);
}

function showToast(msg, type='') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

init();
