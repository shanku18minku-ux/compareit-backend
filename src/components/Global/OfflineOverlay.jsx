import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Network } from '@capacitor/network';
import './OfflineOverlay.css';

const OfflineOverlay = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initial check
    const checkNetwork = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
      } catch (e) {
        console.warn('Network plugin error', e);
      }
    };
    
    checkNetwork();

    // Listen for status changes
    let networkListener;
    Network.addListener('networkStatusChange', status => {
      setIsOnline(status.connected);
    }).then(listener => {
      networkListener = listener;
    });

    return () => {
      if (networkListener) {
        networkListener.remove();
      }
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-overlay">
      <div className="offline-content">
        <div className="offline-icon-wrapper">
          <WifiOff size={48} className="offline-icon" />
        </div>
        <h2>{t('auto_you_re_offline_425b', "You're Offline")}</h2>
        <p>Please check your internet connection to continue comparing deals and finding the best prices.</p>
        <button className="offline-retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default OfflineOverlay;
