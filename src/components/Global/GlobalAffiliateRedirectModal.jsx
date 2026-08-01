import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import styles from './GlobalAffiliateRedirectModal.module.css';
import useAppStore from '../../store/appStore';

const GlobalAffiliateRedirectModal = () => {
  const { globalRedirectData, setGlobalRedirectData } = useAppStore();

  useEffect(() => {
    if (globalRedirectData && globalRedirectData.targetUrl) {
      // Simulate API/Affiliate connection delay
      const timer = setTimeout(async () => {
        try {
          await Browser.open({ url: globalRedirectData.targetUrl });
        } catch (e) {
          // Fallback if browser fails
          window.open(globalRedirectData.targetUrl, '_system');
        }
        setGlobalRedirectData(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [globalRedirectData, setGlobalRedirectData]);

  if (!globalRedirectData) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
          <ExternalLink className={styles.centerIcon} size={24} color="#2563eb" />
        </div>
        
        <h3 className={styles.title}>Connecting to {globalRedirectData.providerName || 'Partner'}</h3>
        
        <p className={styles.subtitle}>
          Securely redirecting you to the official partner platform to complete your transaction.
        </p>

        <div className={styles.disclaimerBox}>
          <ShieldCheck size={16} color="#059669" style={{flexShrink: 0}} />
          <span className={styles.disclaimerText}>
            <strong>Transparency Note:</strong> CompareIt is a discovery engine. We may earn an affiliate commission on purchases made through this link at no extra cost to you.
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalAffiliateRedirectModal;
