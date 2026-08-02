const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Helper to get user-friendly error messages
 */
const getErrorMessage = (error) => {
  return error.message || 'An unexpected error occurred.';
};

/**
 * Common Headers
 */
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * 1. Sign up with Email and Password
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');

    // Save JWT token
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 2. Sign in with Email and Password
 */
export const signInWithEmail = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    // Save JWT token
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 3. Log out
 */
export const logOut = async () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 4. Get Current User (Used for restoring session on app load)
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      // Token might be expired, clear it
      localStorage.removeItem('token');
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Failed to restore session:', error);
    return null;
  }
};

/**
 * Dummy implementations for unsupported/mocked features 
 * to prevent breaking the existing UI
 */
export const signInWithGoogle = async () => {
  throw new Error('Google Sign-In is disabled on the local backend.');
};

export const signInAsGuest = async () => {
  // Guest login can just bypass auth or use a hardcoded mock user
  return { id: 'guest', email: 'guest@compareit.com', displayName: 'Guest User' };
};

export const resetPassword = async (email) => {
  throw new Error('Password reset is not implemented on the local backend.');
};

export const updateUserProfile = async (userId, profileData) => {
  throw new Error('Profile updates not implemented yet.');
};

export const uploadProfilePhoto = async (userId, file) => {
  throw new Error('Photo uploads not implemented yet.');
};

export const onAuthChange = (callback) => {
  // We can just call it once initially for the current session.
  // In a robust React app, you'd handle this via React Context, not a subscription.
  getCurrentUser().then(user => {
    callback(user, 'INITIAL_SESSION');
  });
  return () => {}; // Return dummy unsubscribe
};

/**
 * getUserProfile — alias for getCurrentUser.
 * Exported for backward-compatibility with App.jsx imports.
 */
export const getUserProfile = getCurrentUser;
