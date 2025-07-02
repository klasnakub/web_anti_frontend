// Static page: No dynamic data for now
// You can add interactivity here if needed in the future

// --- Auth check ---
if (localStorage.getItem('isLoggedIn') !== '1') {
  window.location.href = 'login.html';
}

// Logout handler
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  });
} 