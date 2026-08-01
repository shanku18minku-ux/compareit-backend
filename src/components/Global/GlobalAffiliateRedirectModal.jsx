import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import { useTranslation } from 'react-i18next';
import styles from './GlobalAffiliateRedirectModal.module.css';
import useAppStore from '../../store/appStore';

const GlobalAffiliateRedirectModal = () => {
  const { globalRedirectData, setGlobalRedirectData } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (globalRedirectData && globalRedirectData.targetUrl) {
      // Simulate API/Affiliate connection delay
      const timer = setTimeout(async () => {
        let finalUrl = globalRedirectData.targetUrl;
        const currentLang = i18n.language || 'en';

        // If language is not English and it's a web URL, wrap in Google Translate
        if (currentLang !== 'en' && (finalUrl.startsWith('http://') || finalUrl.startsWith('https://'))) {
          // Some platforms accept hl=lang parameter natively, but Google Translate is more universal for web
          // To avoid breaking deep links, only wrap standard web links
          if (finalUrl.includes('amazon.in') || finalUrl.includes('flipkart.com')) {
            // Append native language parameter if possible
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}hl=${currentLang}&lang=${currentLang}`;
          } else {
            // Use Google Translate Proxy
            finalUrl = `https://translate.google.com/translate?sl=auto&tl=${currentLang}&u=${encodeURIComponent(finalUrl)}`;
          }
        }

        try {
          await Browser.open({ url: finalUrl });
        } catch (e) {
          // Fallback if browser fails
          window.open(finalUrl, '_system');
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
