// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginError = document.getElementById('loginError');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = loginForm.querySelector('button[type="submit"]');

// Check if already logged in
if (localStorage.getItem('isLoggedIn') === '1') {
  window.location.href = 'index.html';
}

// Password toggle functionality
togglePasswordBtn.addEventListener('click', function() {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  const icon = this.querySelector('i');
  icon.classList.toggle('bi-eye');
  icon.classList.toggle('bi-eye-slash');
});

// Form submission
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  hideError();

  if (!loginForm.checkValidity()) {
    e.stopPropagation();
    loginForm.classList.add('was-validated');
    return;
  }

  showLoading();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch('https://fastapi-login-system-8286388439.us-central1.run.app/login', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      // Login success
      localStorage.setItem('isLoggedIn', '1');
      localStorage.setItem('username', username);
      window.location.href = 'index.html';
    } else {
      // Login failed
      const data = await response.json().catch(() => ({}));
      showError(data.detail || 'Login failed. Please check your username and password.');
      hideLoading();
    }
  } catch (err) {
    showError('Network error. Please try again.');
    hideLoading();
  }
});

// Input focus effects
[usernameInput, passwordInput].forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
  });
  
  // Real-time validation
  input.addEventListener('input', function() {
    if (this.checkValidity()) {
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
    } else {
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');
    }
  });
});

// Error handling functions
function showError(message) {
  errorMessage.textContent = message;
  loginError.classList.remove('d-none');
  loginError.classList.add('show');
  
  // Auto-hide error after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  loginError.classList.add('d-none');
  loginError.classList.remove('show');
}

// Loading state functions
function showLoading() {
  submitBtn.classList.add('btn-loading');
  submitBtn.disabled = true;
}

function hideLoading() {
  submitBtn.classList.remove('btn-loading');
  submitBtn.disabled = false;
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Add entrance animation
  const loginCard = document.querySelector('.login-card');
  loginCard.style.opacity = '0';
  loginCard.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    loginCard.style.transition = 'all 0.6s ease-out';
    loginCard.style.opacity = '1';
    loginCard.style.transform = 'translateY(0)';
  }, 100);
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (document.activeElement === usernameInput || document.activeElement === passwordInput)) {
      loginForm.dispatchEvent(new Event('submit'));
    }
  });
}); 