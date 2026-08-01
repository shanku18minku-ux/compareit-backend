import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import styles from './AffiliateRedirectModal.module.css';

const AffiliateRedirectModal = ({ isOpen, providerName, targetUrl, onClose }) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen && targetUrl) {
      // Simulate API/Affiliate connection delay
      const timer = setTimeout(() => {
        window.open(targetUrl, '_system');
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetUrl, onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
          <ExternalLink className={styles.centerIcon} size={24} color="#2563eb" />
        </div>
        
        <h3 className={styles.title}>Connecting to {providerName}</h3>
        
        <p className={styles.subtitle}>
          Securely redirecting you to the official partner platform to complete your transaction.
        </p>

        <div className={styles.disclaimerBox}>
          <ShieldCheck size={16} color="#059669" />
          <span className={styles.disclaimerText}>
            <strong>Transparency Note:</strong> CompareIt is a discovery engine. We may earn an affiliate commission on purchases made through this link at no extra cost to you.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AffiliateRedirectModal;
