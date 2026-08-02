import React, { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, RefreshCw, Smartphone, Globe, CheckCircle } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import { useTranslation } from 'react-i18next';
import styles from './GlobalAffiliateRedirectModal.module.css';
import useAppStore from '../../store/appStore';
import { logDeepLinkOutcome } from '../../services/deepLinkService';

const GlobalAffiliateRedirectModal = () => {
  const { globalRedirectData, setGlobalRedirectData, couponMode } = useAppStore();
  const { i18n } = useTranslation();
  const [phase, setPhase] = useState('connecting'); // 'connecting' | 'opening' | 'failed'
  const [retryCount, setRetryCount] = useState(0);

  // ── Utility: Build the best URL to navigate to ───────────────────────────
  const buildFinalUrl = (data) => {
    // Prefer intentUrl (Android intent://) if available
    // For web fallback, use targetUrl
    let url = data.targetUrl || '';

    // Auto-apply coupon params if in auto mode (only to https URLs, not intent://)
    if (couponMode === 'auto' && url.startsWith('http')) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}checkout=true&auto_apply=1`;
    }

    // Apply language localisation for supported platforms
    const lang = i18n.language || 'en';
    if (lang !== 'en' && url.startsWith('http')) {
      if (url.includes('amazon.in') || url.includes('flipkart.com')) {
        const sep = url.includes('?') ? '&' : '?';
        url = `${url}${sep}hl=${lang}&lang=${lang}`;
      } else {
        url = `https://translate.google.com/translate?sl=auto&tl=${lang}&u=${encodeURIComponent(url)}`;
      }
    }

    return url;
  };

  // ── Core: Execute the redirect ────────────────────────────────────────────
  const executeRedirect = async (data) => {
    setPhase('opening');
    const webUrl = buildFinalUrl(data);
    // Use intentUrl for Android native app opening when available
    const intentUrl = data.intentUrl;
    const useIntent = intentUrl && intentUrl.startsWith('intent://');

    try {
      const { App } = await import('@capacitor/app');

      if (useIntent) {
        // Try Android intent:// URI first — opens native app if installed
        try {
          const result = await App.openUrl({ url: intentUrl });
          if (result && result.completed !== false) {
            logDeepLinkOutcome(data, 'intent_uri', true);
            setGlobalRedirectData(null);
            return;
          }
        } catch {
          // Intent failed, fall through to web URL
        }
      }

      // Try opening the web URL via Capacitor (triggers Android App Links)
      const result = await App.openUrl({ url: webUrl });
      if (result && result.completed !== false) {
        logDeepLinkOutcome(data, 'capacitor_openurl', true);
        setGlobalRedirectData(null);
        return;
      }

      // Capacitor returned completed=false — open in in-app browser
      await Browser.open({ url: webUrl, windowName: '_blank' });
      logDeepLinkOutcome(data, 'browser', true);
      setGlobalRedirectData(null);

    } catch (err) {
      console.error('[DeepLink] Navigation error:', err);
      try {
        // Last resort: in-app browser
        await Browser.open({ url: webUrl, windowName: '_blank' });
        logDeepLinkOutcome(data, 'browser_fallback', true);
        setGlobalRedirectData(null);
      } catch {
        // Absolute last resort: window.location
        try {
          window.location.href = webUrl;
          logDeepLinkOutcome(data, 'window_href', true);
          setGlobalRedirectData(null);
        } catch (finalErr) {
          logDeepLinkOutcome(data, 'all_failed', false, String(finalErr));
          setPhase('failed');
        }
      }
    }
  };

  // ── Effect: Trigger on new redirect data ──────────────────────────────────
  useEffect(() => {
    if (globalRedirectData && globalRedirectData.targetUrl) {
      setPhase('connecting');
      const timer = setTimeout(() => {
        executeRedirect(globalRedirectData);
      }, 1200); // 1.2s UX delay — shows connecting state
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalRedirectData, retryCount]);

  if (!globalRedirectData) return null;

  const providerName    = globalRedirectData.providerName || 'Partner';
  const capability      = globalRedirectData.capability || 'search';
  const capabilityLabel = globalRedirectData.capabilityLabel || '🔗 Opening Platform';
  const supportsApp     = globalRedirectData.supportsApp;

  // ── UI Messages per phase ─────────────────────────────────────────────────
  const getMessage = () => {
    if (phase === 'failed')     return `Could not open ${providerName}. Please try again.`;
    if (phase === 'opening')    return supportsApp
      ? `Opening ${providerName} app...`
      : `Opening ${providerName} in browser...`;
    if (couponMode === 'auto')  return `Auto-applying best coupon & heading to checkout...`;
    return `Securely connecting to ${providerName}...`;
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={`Connecting to ${providerName}`}>
      <div className={styles.modal}>

        {/* ── Spinner / Icon ─────────────────────────────────────────── */}
        <div className={styles.spinnerWrapper}>
          {phase === 'failed' ? (
            <RefreshCw size={32} color="#EF4444" />
          ) : (
            <>
              <div className={styles.spinner}></div>
              {supportsApp
                ? <Smartphone className={styles.centerIcon} size={22} color="#2563eb" />
                : <Globe      className={styles.centerIcon} size={22} color="#2563eb" />
              }
            </>
          )}
        </div>

        {/* ── Title ─────────────────────────────────────────────────── */}
        <h3 className={styles.title}>
          {phase === 'failed' ? 'Redirect Failed' : `Connecting to ${providerName}`}
        </h3>

        {/* ── Capability Badge ──────────────────────────────────────── */}
        {phase !== 'failed' && (
          <div className={styles.capabilityBadge} data-capability={capability}>
            <CheckCircle size={13} />
            <span>{capabilityLabel}</span>
          </div>
        )}

        {/* ── Status Message ────────────────────────────────────────── */}
        <p className={styles.subtitle}>{getMessage()}</p>

        {/* ── Retry Button (only on failure) ────────────────────────── */}
        {phase === 'failed' && (
          <button
            className={styles.retryBtn}
            onClick={() => {
              setPhase('connecting');
              setRetryCount(c => c + 1);
            }}
          >
            <RefreshCw size={16} /> Try Again
          </button>
        )}

        {/* ── Cancel Link ──────────────────────────────────────────── */}
        <button
          className={styles.cancelBtn}
          onClick={() => setGlobalRedirectData(null)}
          aria-label="Cancel redirect"
        >
          Cancel
        </button>

        {/* ── Transparency Disclaimer ───────────────────────────────── */}
        <div className={styles.disclaimerBox}>
          <ShieldCheck size={15} color="#059669" style={{ flexShrink: 0 }} />
          <span className={styles.disclaimerText}>
            <strong>Transparency Note:</strong> CompareIt is a discovery engine. We may earn an
            affiliate commission on purchases at no extra cost to you.
          </span>
        </div>

      </div>
    </div>
  );
};

export default GlobalAffiliateRedirectModal;
