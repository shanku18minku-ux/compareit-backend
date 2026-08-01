import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Eye, EyeOff, Chrome, Loader2, Check, X } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '../../services/authService';
import PrivacyPolicyModal from '../Settings/PrivacyPolicyModal';
import TermsOfServiceModal from '../Settings/TermsOfServiceModal';
import './Signup.css';

const Signup = ({ onNavigate, onLoginSuccess }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Basic password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Normalize to 0-3 scale for simple weak/medium/strong
    if (password.length === 0) setPasswordStrength(0);
    else if (strength <= 2) setPasswordStrength(1);
    else if (strength <= 4) setPasswordStrength(2);
    else setPasswordStrength(3);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.pleaseFillAllFields', 'Please fill all fields'));
      return;
    }
    if (!termsAccepted) {
      setError(t('auth.acceptTerms', 'You must accept the Terms and Privacy Policy to continue.'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch', 'Passwords do not match'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.passwordTooShort', 'Password must be at least 6 characters'));
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      const user = await signUpWithEmail(email, password, name);
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || t('auth.signupFailed', 'Signup failed. Please try again.'));
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

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return t('auth.strengthWeak', 'Weak');
    if (passwordStrength === 2) return t('auth.strengthMedium', 'Medium');
    return t('auth.strengthStrong', 'Strong');
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
          <h1 className="logo">Compare<span>It</span></h1>
          <p className="tagline">{t('auth.createAccount', 'Create an account to get started')}</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="error-toast shake">{error}</div>}
            
            <div className="input-group">
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder={t('auth.fullName', 'Full Name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="input"
                  required
                />
              </div>
            </div>

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
              
              {password.length > 0 && (
                <div className="password-strength-container">
                  <div className="strength-bars">
                    <div className={`strength-bar ${passwordStrength >= 1 ? 'active weak' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 2 ? 'active medium' : ''}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 3 ? 'active strong' : ''}`}></div>
                  </div>
                  <span className="strength-label">{getStrengthLabel()}</span>
                </div>
              )}
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.confirmPassword', 'Confirm Password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className={`input ${confirmPassword ? (password === confirmPassword ? 'valid' : 'invalid') : ''}`}
                  required
                />
                {confirmPassword && (
                  <div className="validation-icon">
                    {password === confirmPassword ? 
                      <Check size={18} className="text-green-500" /> : 
                      <X size={18} className="text-red-500" />
                    }
                  </div>
                )}
              </div>
            </div>

            <div className="terms-checkbox-group">
              <label className="terms-label">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="terms-text">
                  I agree to the <button type="button" className="text-link-small" onClick={() => setIsTermsOpen(true)}>Terms of Service</button> and <button type="button" className="text-link-small" onClick={() => setIsPrivacyOpen(true)}>Privacy Policy</button>
                </span>
              </label>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : t('auth.createAccountBtn', 'Create Account')}
            </button>
          </form>

          <div className="divider">
            <span>{t('auth.orSignUpWith', 'or sign up with')}</span>
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
                  {t('auth.signUpGoogle', 'Sign up with Google')}
                </>
              )}
            </button>
          </div>
        </div>

        <p className="footer-text">
          {t('auth.haveAccount', "Already have an account?")}{' '}
          <button onClick={() => onNavigate('login')} className="text-link-bold">
            {t('auth.login', 'Login')}
          </button>
        </p>
      </div>
      
      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <TermsOfServiceModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
};

export default Signup;
