import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import { useTranslation } from 'react-i18next';
import styles from './GlobalAffiliateRedirectModal.module.css';
import useAppStore from '../../store/appStore';

import { buildDeepLink } from '../../utils/deepLinkEngine';

const GlobalAffiliateRedirectModal = () => {
  const { globalRedirectData, setGlobalRedirectData, couponMode } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (globalRedirectData && globalRedirectData.targetUrl) {
      // Simulate API/Affiliate connection delay
      const timer = setTimeout(async () => {
        let finalUrl = globalRedirectData.targetUrl;
        
        // Auto-Apply Coupon & Redirect to Checkout logic
        if (couponMode === 'auto') {
          const separator = finalUrl.includes('?') ? '&' : '?';
          finalUrl = `${finalUrl}${separator}checkout=true&auto_apply=1&promo=BESTDEAL`;
        }

        const currentLang = i18n.language || 'en';

        // Translate if needed (only for web links, avoid modifying intent URIs later)
        if (currentLang !== 'en' && (finalUrl.startsWith('http://') || finalUrl.startsWith('https://'))) {
          if (finalUrl.includes('amazon.in') || finalUrl.includes('flipkart.com')) {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}hl=${currentLang}&lang=${currentLang}`;
          } else {
            finalUrl = `https://translate.google.com/translate?sl=auto&tl=${currentLang}&u=${encodeURIComponent(finalUrl)}`;
          }
        }

        try {
          // In Capacitor, the absolute best way to trigger Android App Links (Deep Links)
          // is to pass the standard HTTPS URL to App.openUrl().
          // Android OS natively intercepts this ACTION_VIEW intent and opens the installed partner app
          // (Amazon, Zomato, etc.). If not installed, it opens their external mobile browser (where they are logged in).
          const { App } = await import('@capacitor/app');
          const result = await App.openUrl({ url: finalUrl });
          
          if (result && result.completed === false) {
             await Browser.open({ url: finalUrl });
          }
        } catch (e) {
          console.error("Deep Link failed:", e);
          try {
            await Browser.open({ url: finalUrl });
          } catch(err) {
            window.location.href = finalUrl;
          }
        }
        setGlobalRedirectData(null);
      }, 1500); // reduced delay for better UX
      return () => clearTimeout(timer);
    }
  }, [globalRedirectData, setGlobalRedirectData, i18n.language, couponMode]);

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
          {couponMode === 'auto' 
            ? 'Auto-applying best coupon and redirecting to secure checkout...'
            : 'Securely redirecting you to the official partner platform to complete your transaction.'}
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
