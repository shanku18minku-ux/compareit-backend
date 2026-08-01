import { useTranslation } from 'react-i18next';
import React from 'react';
import { X, Shield } from 'lucide-react';
import './Settings.css';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-content">
        <header className="settings-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} color="#2563EB" />
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{t('auto_privacy_policy_fa2e', 'Privacy Policy')}</h2>
          </div>
          <button onClick={onClose} className="settings-modal-close">
            <X size={24} color="#64748b" />
          </button>
        </header>
        
        <div className="settings-modal-body" style={{ padding: '20px', overflowY: 'auto', maxHeight: '70vh', color: '#475569', lineHeight: '1.6' }}>
          <p><strong>Effective Date:</strong> August 1, 2026</p>
          
          <p>{t('auto_welcome_to_9819', 'Welcome to')}<strong>{t('auto_compareit_9957', 'CompareIt')}</strong>. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application ("App").</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>1. What CompareIt Does</h3>
          <p>CompareIt is an aggregator and recommendation platform. We compare prices, calculate estimated times of arrival (ETAs), and show deals across multiple third-party services (Food, Travel, Health, E-commerce, etc.). <strong>We do not process direct orders, bookings, or payments.</strong> When you click to "Open" a platform, you are redirected to the respective third-party provider's application or website.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>2. Information We Collect</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Authentication Data:</strong> When you sign in using Google Auth or Email, we securely collect basic profile details (Name, Email, Profile Picture) to personalize your experience.</li>
            <li style={{ marginBottom: '8px' }}><strong>Location Data:</strong> With your explicit permission, we access your device's geolocation to provide accurate, hyper-local deals (e.g., local restaurant ETAs, cab availability). This data is used in real-time and not permanently stored.</li>
            <li style={{ marginBottom: '8px' }}><strong>Usage & Preferences:</strong> We store search queries, preferred tabs, and manual coupon selections locally on your device to ensure a seamless experience.</li>
          </ul>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>3. How We Use Your Information</h3>
          <p>We use the collected information solely to:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Calculate and recommend the cheapest and fastest options for your location.</li>
            <li>Apply personalized filters and coupons (both auto and manual).</li>
            <li>{t('auto_maintain_your_login__367e', 'Maintain your login session securely.')}</li>
          </ul>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>4. Authorized APIs & Deep Links</h3>
          <p>CompareIt operates through official APIs, authorized data sharing agreements, and secure deep-link integrations with our partners (e.g., Cars24, GoMechanic, HDFC). <strong>{t('auto_we_do_not_engage_in__8a6f', 'We do not engage in unauthorized data scraping.')}</strong> All data presented on CompareIt is sourced legally and transparently from these authorized integrations.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>5. Affiliate Partnerships</h3>
          <p>When you click on a "Buy," "Book," or "Apply" button to complete a transaction on a partner's platform, CompareIt may earn an affiliate commission at no extra cost to you. During this redirection, we may share basic necessary referral data (such as an affiliate ID) with the partner to track the source of the traffic. We do not share your personal identification information during this handoff unless explicitly authorized by you.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>6. Security</h3>
          <p>We implement industry-standard security measures to protect your account information. Since no payments are handled on our platform, no financial data is ever collected or stored by CompareIt.</p>
          
          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>7. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact our support team in the App.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
