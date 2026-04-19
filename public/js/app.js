import { checkAuth, login, logout, updateUserUI, getCurrentUser } from './auth.js';
import { showToast } from './utils.js';
import { loadDashboard, refreshDashboard } from './dashboard.js';
import { loadTickets, initTicketsModule } from './tickets.js';
import { loadUsers } from './users.js';

// Global navigation handler
async function gotoView(viewName) {
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    }
  });
  
  // Update page title
  const pageTitle = document.getElementById('page-title');
  const titleMap = {
    dashboard: 'Dashboard',
    tickets: 'Tickets',
    users: 'Users',
    properties: 'Properties',
    pm: 'Preventive Maintenance',
    vendors: 'Vendors',
    finance: 'Finance',
    reports: 'Reports',
    performance: 'Performance',
    sla: 'SLA Tracker',
    companies: 'Companies',
    inventory: 'Inventory',
    settings: 'Settings'
  };
  if (pageTitle) pageTitle.textContent = titleMap[viewName] || viewName;
  
  // Hide all views, show selected
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  const activeView = document.getElementById(`view-${viewName}`);
  if (activeView) activeView.classList.add('active');
  
  // Load data for the view
  if (viewName === 'dashboard') {
    await loadDashboard();
  } else if (viewName === 'tickets') {
    await loadTickets();
  } else if (viewName === 'users') {
    await loadUsers();
  }
  // Other views will be implemented later
}

// Setup event listeners
function setupEventListeners() {
  // Navigation clicks
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      gotoView(view);
    });
  });
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
    });
  }
  
  // Refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const activeView = document.querySelector('.view.active')?.id;
      if (activeView === 'view-dashboard') refreshDashboard();
      else if (activeView === 'view-tickets') loadTickets();
      else if (activeView === 'view-users') loadUsers();
      showToast('Refreshed', 'success');
    });
  }
  
  // Collapse sidebar
  const collapseBtn = document.getElementById('collapse-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });
  }
  
  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });
  }
  
  // Close mobile sidebar when clicking outside (optional)
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (sidebar && sidebar.classList.contains('mobile-open') && 
        !sidebar.contains(e.target) && e.target !== mobileBtn) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

// Initialize app after login
async function initApp() {
  const user = await checkAuth();
  if (user) {
    // Show main app, hide login screen
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    updateUserUI(user);
    setupEventListeners();
    initTicketsModule();
    await gotoView('dashboard');
    startClock();
  } else {
    // Show login screen, hide app
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    setupLoginHandler();
  }
}

function setupLoginHandler() {
  const loginBtn = document.getElementById('login-btn');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorDiv = document.getElementById('login-error');
  
  const doLogin = async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      errorDiv.textContent = 'Please enter email and password';
      errorDiv.style.display = 'block';
      return;
    }
    try {
      await login(email, password);
      errorDiv.style.display = 'none';
      initApp();
    } catch (err) {
      errorDiv.textContent = err.message || 'Login failed';
      errorDiv.style.display = 'block';
    }
  };
  
  loginBtn.addEventListener('click', doLogin);
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doLogin();
  });
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doLogin();
  });
}

function startClock() {
  const updateClock = () => {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString();
    }
  };
  updateClock();
  setInterval(updateClock, 1000);
}

// Start the app
initApp();