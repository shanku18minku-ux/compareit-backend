import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../../services/authService';
import './ForgotPassword.css';

const ForgotPassword = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('auth.pleaseEnterEmail', 'Please enter your email'));
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('auth.resetFailed', 'Failed to send reset email.'));
    } finally {
      setLoading(false);
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
        <div className="auth-card forgot-password-card">
          {success ? (
            <div className="success-state">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={64} className="success-icon" />
              </div>
              <h2 className="success-title">{t('auth.emailSent', 'Email Sent!')}</h2>
              <p className="success-message">
                {t('auth.emailSentDesc', "We've sent a password reset link to")} <strong>{email}</strong>. {t('auth.checkSpam', 'Please check your inbox (and spam folder).')}
              </p>
              <button 
                onClick={() => onNavigate('login')} 
                className="primary-btn mt-6"
              >
                {t('auth.backToLogin', 'Back to Login')}
              </button>
            </div>
          ) : (
            <>
              <div className="lock-icon-container">
                <Lock size={32} className="lock-icon-large" />
              </div>
              
              <div className="header reset-header">
                <h1 className="reset-title">{t('auth.resetPassword', 'Reset Password')}</h1>
                <p className="reset-subtitle">
                  {t('auth.resetSubtitle', "Enter your email and we'll send you a link to reset your password.")}
                </p>
              </div>

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

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? <Loader2 className="spinner" size={20} /> : t('auth.sendResetLink', 'Send Reset Link')}
                </button>
              </form>

              <button 
                type="button" 
                onClick={() => onNavigate('login')}
                className="back-btn"
              >
                <ArrowLeft size={16} />
                {t('auth.backToLogin', 'Back to Login')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
