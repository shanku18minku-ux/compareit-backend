import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './AffiliateRedirectModal.module.css';
import useAppStore from '../../store/appStore';

const AffiliateRedirectModal = ({ isOpen, providerName, targetUrl, onClose }) => {
  const { couponMode } = useAppStore();
  const { i18n } = useTranslation();

  // ✅ useEffect MUST come before any early return to follow Rules of Hooks
  useEffect(() => {
    if (isOpen && targetUrl) {
      const timer = setTimeout(() => {
        let finalUrl = targetUrl;
        
        // Auto-Apply Coupon & Redirect to Checkout logic
        if (couponMode === 'auto') {
          const separator = finalUrl.includes('?') ? '&' : '?';
          finalUrl = `${finalUrl}${separator}checkout=true&auto_apply=1&promo=BESTDEAL`;
        }

        const currentLang = i18n.language || 'en';

        if (currentLang !== 'en' && (finalUrl.startsWith('http://') || finalUrl.startsWith('https://'))) {
          if (finalUrl.includes('amazon.in') || finalUrl.includes('flipkart.com')) {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}hl=${currentLang}&lang=${currentLang}`;
          } else {
            finalUrl = `https://translate.google.com/translate?sl=auto&tl=${currentLang}&u=${encodeURIComponent(finalUrl)}`;
          }
        }

        window.open(finalUrl, '_system');
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetUrl, onClose, i18n.language, couponMode]);

  // ✅ Early return AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
          <ExternalLink className={styles.centerIcon} size={24} color="#2563eb" />
        </div>
        
        <h3 className={styles.title}>Connecting to {providerName}</h3>
        
        <p className={styles.subtitle}>
          {couponMode === 'auto' 
            ? 'Auto-applying best coupon and redirecting to secure checkout...'
            : 'Securely redirecting you to the official partner platform to complete your transaction.'}
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
