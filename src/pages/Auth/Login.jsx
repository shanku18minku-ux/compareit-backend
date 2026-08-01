import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, UserX, Chrome, Loader2 } from 'lucide-react';
import { signInWithEmail, signInWithGoogle, signInAsGuest } from '../../services/authService';
import useAppStore from '../../store/appStore';
import './Login.css';

const Login = ({ onNavigate, onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('auth.pleaseFillAllFields', 'Please fill all fields'));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || t('auth.loginFailed', 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || t('auth.googleLoginFailed', 'Google login failed'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuest = async () => {
    setError(null);
    setGuestLoading(true);
    try {
      const user = await signInAsGuest();
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || t('auth.guestLoginFailed', 'Guest login failed'));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="background-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>
      
      <div className="auth-card-wrapper">
        <div className="header">
          <h1 className="logo">{t('auto_compare_7eec', 'Compare')}<span>It</span></h1>
          <p className="tagline">{t('auth.tagline', 'Compare Everything. Save Everywhere.')}</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="error-toast shake">{error}</div>}
            
            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder={t('auth.email', 'Email Address')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password', 'Password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-link"
              >
                {t('auth.forgotPassword', 'Forgot Password?')}
              </button>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : t('auth.login', 'Login')}
            </button>
          </form>

          <div className="divider">
            <span>{t('auth.orContinueWith', 'or continue with')}</span>
          </div>

          <div className="social-buttons">
            <button
              type="button"
              onClick={handleGoogle}
              className="google-btn"
              disabled={googleLoading}
            >
              {googleLoading ? <Loader2 className="spinner" size={20} /> : (
                <>
                  <Chrome size={20} className="google-icon" />
                  {t('auth.signInGoogle', 'Sign in with Google')}
                </>
              )}
            </button>
            

          </div>
        </div>

        <p className="footer-text">
          {t('auth.noAccount', "Don't have an account?")}{' '}
          <button onClick={() => onNavigate('signup')} className="text-link-bold">
            {t('auth.signUp', 'Sign Up')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
