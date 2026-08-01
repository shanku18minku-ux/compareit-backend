import { useTranslation } from 'react-i18next';
import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import useAppStore from '../../store/appStore';
import CouponManager from '../CouponManager/CouponManager';
import './PlatformComparison.css';

export default function PlatformComparison({ product }) {
  const { couponMode, appliedManualCoupons, setGlobalRedirectData } = useAppStore();
  
  if (!product || !product.platforms || product.platforms.length === 0) {
    return null;
  }

  const getFinalPrice = (platform) => {
    // If auto mode, assume platform.price already has the best discount, or mock a larger discount
    if (couponMode === 'auto') {
      return platform.price;
    }
    
    // If manual mode, remove discount unless manual code matches
    const manualCode = appliedManualCoupons[product.id];
    const isCodeValid = platform.offers && platform.offers.some(o => o.includes(manualCode));
    
    // If no manual code or invalid, revert to original price (simulated as price + 10%)
    if (!manualCode || !isCodeValid) {
      return Math.round(platform.price * 1.1); 
    }
    
    return platform.price;
  };

  // Sort platforms by adjusted price
  const platformsWithPrices = product.platforms.map(p => ({ ...p, finalPrice: getFinalPrice(p) }));
  const sortedPlatforms = platformsWithPrices.sort((a, b) => a.finalPrice - b.finalPrice);

  return (
    <div className="platform-comparison-container">
      <h2 className="comparison-title">{t('auto_compare_find_best_de_3478', 'Compare & Find Best Deal')}</h2>
      
      <CouponManager 
        itemId={product.id} 
        validCoupons={['SAVE20', 'FIRST100', 'SALE50']} 
      />
      
      <div className="comparison-list">
        {sortedPlatforms.map((platform, index) => {
          const isCheapest = index === 0;
          return (
            <div key={platform.name} className={`platform-row ${isCheapest ? 'cheapest-platform' : ''}`}>
              <div className="platform-info">
                {isCheapest && <span className="best-price-badge">✨ Recommended</span>}
                <div className="platform-name-logo">
                  {platform.logo?.startsWith('http') ? (
                    <img src={platform.logo} alt={platform.name} className="platform-logo" />
                  ) : (
                    <div className="platform-logo-placeholder">{platform.logo || platform.name.charAt(0)}</div>
                  )}
                  <span className="platform-name">{platform.name}</span>
                </div>
              </div>
              
              <div className="platform-price-cta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="platform-price-group" style={{ textAlign: 'right' }}>
                  {couponMode === 'manual' && (!appliedManualCoupons[product.id] || !platform.offers?.some(o => o.includes(appliedManualCoupons[product.id]))) && (
                    <span className="platform-old-price">₹{Math.round(platform.price * 1.1).toLocaleString()}</span>
                  )}
                  <span className="platform-price">₹{platform.finalPrice.toLocaleString()}</span>
                </div>
                <button onClick={() => setGlobalRedirectData({ providerName: platform.name, targetUrl: platform.url })} className="goto-app-btn" style={{ padding: '8px 16px', fontSize: '14px', width: 'auto', border: 'none', cursor: 'pointer' }}>
                  Open {platform.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
