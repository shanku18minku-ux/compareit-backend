import { useTranslation } from 'react-i18next';
import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import useAppStore from '../../store/appStore';
import CouponManager from '../CouponManager/CouponManager';
import { injectLocalPlatforms } from '../../utils/locationEngine';
import { buildRedirectPayloadFromPlatform, getCapabilityLabel } from '../../services/deepLinkService';
import './PlatformComparison.css';

export default function PlatformComparison({ product }) {
  const { t } = useTranslation();
  const { couponMode, appliedManualCoupons, setGlobalRedirectData, userLocation } = useAppStore();

  if (!product || !product.platforms || product.platforms.length === 0) {
    return null;
  }

  const getFinalPrice = (platform) => {
    // If auto mode, assume platform.price already has the best discount
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

  // Inject local platform dynamically
  const basePrice = product.price || product.platforms[0]?.price || 100;
  const enrichedPlatforms = injectLocalPlatforms(product.platforms, userLocation?.city, 'ecommerce', basePrice);

  // Sort platforms by adjusted price
  const platformsWithPrices = enrichedPlatforms.map(p => ({ ...p, finalPrice: getFinalPrice(p) }));
  const sortedPlatforms = platformsWithPrices.sort((a, b) => a.finalPrice - b.finalPrice);

  // ── Handle platform open click ───────────────────────────────────────────
  const handlePlatformOpen = (platform) => {
    // Use deepLinkService to build the enriched redirect payload
    const payload = buildRedirectPayloadFromPlatform(platform, product);
    setGlobalRedirectData(payload);
  };

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
          const capLabel = getCapabilityLabel(platform.name);

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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="platform-name">{platform.name}</span>
                    {/* Capability badge — shows what level of navigation is available */}
                    <span className="platform-capability-label">{capLabel}</span>
                  </div>
                </div>
              </div>

              <div className="platform-price-cta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="platform-price-group" style={{ textAlign: 'right' }}>
                  {couponMode === 'manual' && (!appliedManualCoupons[product.id] || !platform.offers?.some(o => o.includes(appliedManualCoupons[product.id]))) && (
                    <span className="platform-old-price">₹{Math.round(platform.price * 1.1).toLocaleString()}</span>
                  )}
                  <span className="platform-price">₹{platform.finalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handlePlatformOpen(platform)}
                  className="goto-app-btn"
                  style={{ padding: '8px 16px', fontSize: '14px', width: 'auto', border: 'none', cursor: 'pointer' }}
                  aria-label={`Open ${platform.name} to buy this product`}
                >
                  <ExternalLink size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
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
