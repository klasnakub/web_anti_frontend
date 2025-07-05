// Authentication Utility Functions

// Function to decode JWT token (without verification - for client-side expiration check only)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

// Function to check if JWT token is expired
function isTokenExpired(token) {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

// Function to validate authentication and token
function validateAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const accessToken = localStorage.getItem('access_token');
  
  // Check if user is logged in
  if (isLoggedIn !== '1') {
    redirectToLogin();
    return false;
  }
  
  // Check if token exists and is not expired
  if (!accessToken || isTokenExpired(accessToken)) {
    // Clear invalid/expired data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    redirectToLogin();
    return false;
  }
  
  return true;
}

// Function to redirect to login page
function redirectToLogin() {
  window.location.href = 'login.html';
}

// Function to get valid access token for API calls
function getValidAccessToken() {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken || isTokenExpired(accessToken)) {
    // Token is invalid or expired, redirect to login
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    redirectToLogin();
    return null;
  }
  
  return accessToken;
}

// Function to make authenticated API calls
async function makeAuthenticatedRequest(url, options = {}) {
  const token = getValidAccessToken();
  if (!token) {
    throw new Error('No valid access token available');
  }
  
  // Prepare headers - only add Authorization and Content-Type if not already provided
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  // Only add Content-Type if not already provided and if there's a body
  if (!headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const finalOptions = {
    ...options,
    headers: headers
  };
  
  try {
    console.log('Making authenticated request to:', url);
    console.log('Request options:', finalOptions);
    
    const response = await fetch(url, finalOptions);
    
    console.log('Response status:', response.status);
    
    // If we get 401 Unauthorized, token might be invalid
    if (response.status === 401) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      redirectToLogin();
      throw new Error('Token is invalid or expired');
    }
    
    // If we get 403 Forbidden, log the error but don't redirect
    if (response.status === 403) {
      console.error('403 Forbidden - Access denied. This might be a server-side permission issue.');
      const errorText = await response.text();
      console.error('Response body:', errorText);
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Function to display token information
function displayTokenInfo() {
  const accessToken = localStorage.getItem('access_token');
  const userDisplay = document.getElementById('userDisplay');
  
  if (accessToken) {
    const decoded = decodeJWT(accessToken);
    if (decoded) {
      const expirationDate = new Date(decoded.exp * 1000);
      const currentDate = new Date();
      const timeLeft = Math.floor((decoded.exp * 1000 - currentDate.getTime()) / 1000);
      
      // Update user display
      if (userDisplay) {
        userDisplay.textContent = decoded.sub || localStorage.getItem('username') || 'Admin User';
      }
      
      console.log('Token Info:', {
        username: decoded.sub || 'Unknown',
        issuedAt: new Date(decoded.iat * 1000).toLocaleString(),
        expiresAt: expirationDate.toLocaleString(),
        timeLeft: `${Math.floor(timeLeft / 60)} minutes ${timeLeft % 60} seconds`
      });
      
      // Show warning if token expires in less than 10 minutes
      if (timeLeft < 600) { // 10 minutes
        console.warn('Token will expire soon!');
      }
    }
  } else {
    if (userDisplay) {
      userDisplay.textContent = localStorage.getItem('username') || 'Admin User';
    }
  }
}

// Function to logout user
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
  redirectToLogin();
}

// Function to debug token (for troubleshooting)
function debugToken() {
  const accessToken = localStorage.getItem('access_token');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');
  
  console.log('=== Token Debug Info ===');
  console.log('isLoggedIn:', isLoggedIn);
  console.log('username:', username);
  console.log('accessToken exists:', !!accessToken);
  
  if (accessToken) {
    console.log('accessToken length:', accessToken.length);
    console.log('accessToken preview:', accessToken.substring(0, 50) + '...');
    
    const decoded = decodeJWT(accessToken);
    if (decoded) {
      console.log('Decoded token:', decoded);
      console.log('Token subject (sub):', decoded.sub);
      console.log('Token issued at (iat):', new Date(decoded.iat * 1000).toLocaleString());
      console.log('Token expires at (exp):', new Date(decoded.exp * 1000).toLocaleString());
      console.log('Token is expired:', isTokenExpired(accessToken));
    } else {
      console.log('Failed to decode token');
    }
  }
  
  console.log('========================');
}

// Function to test API connection
async function testAPIConnection() {
  console.log('=== Testing API Connection ===');
  
  try {
    // Test without authentication first
    console.log('Testing API without authentication...');
    const response1 = await fetch('https://web-anti-backend-8286388439.asia-southeast1.run.app/leagues', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    
    console.log('Response without auth - Status:', response1.status);
    console.log('Response without auth - Headers:', Object.fromEntries(response1.headers.entries()));
    
    if (response1.status === 200) {
      const data1 = await response1.json();
      console.log('Response without auth - Data:', data1);
    }
    
    // Test with authentication
    console.log('Testing API with authentication...');
    const response2 = await makeAuthenticatedRequest('https://web-anti-backend-8286388439.asia-southeast1.run.app/leagues', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    
    console.log('Response with auth - Status:', response2.status);
    console.log('Response with auth - Headers:', Object.fromEntries(response2.headers.entries()));
    
    if (response2.status === 200) {
      const data2 = await response2.json();
      console.log('Response with auth - Data:', data2);
    }
    
  } catch (error) {
    console.error('API test failed:', error);
  }
  
  console.log('=== End API Test ===');
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    decodeJWT,
    isTokenExpired,
    validateAuth,
    redirectToLogin,
    getValidAccessToken,
    makeAuthenticatedRequest,
    displayTokenInfo,
    logout
  };
} 