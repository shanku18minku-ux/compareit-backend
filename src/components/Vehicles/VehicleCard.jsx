import React, { useState } from 'react';
import { Settings, Gauge, Fuel, ExternalLink, ChevronDown, ChevronUp, Trophy, Zap, Tag, CheckCircle2, CarFront, Calendar } from 'lucide-react';
import styles from './VehicleCard.module.css';
import useAppStore from '../../store/appStore';
import AffiliateRedirectModal from './AffiliateRedirectModal';

const VehicleCard = ({ vehicle }) => {
  const [showComparisons, setShowComparisons] = useState(false);
  const [manualCoupon, setManualCoupon] = useState('');
  const [appliedManual, setAppliedManual] = useState(false);
  const [redirectData, setRedirectData] = useState(null);
  const { couponMode, setCouponMode } = useAppStore();

  const handleBook = (e, plat) => {
    e.stopPropagation();
    if (plat.url) {
      setRedirectData({ providerName: plat.name, targetUrl: plat.url });
    }
  };

  const platforms = vehicle.platforms || [];

  // Calculate prices with coupons
  const calculateFinalPrice = (price) => {
    let final = price;
    let discount = 0;
    
    if (couponMode === 'auto') {
      discount = Math.min(price * 0.05, 15000); // 5% up to 15k
    } else if (couponMode === 'manual' && appliedManual) {
      discount = manualCoupon === 'SUPERCAR' ? 20000 : 0;
    }
    
    return { final: final - discount, discount };
  };

  const enhancedPlatforms = platforms.map(p => {
    const calc = calculateFinalPrice(p.price);
    return { ...p, finalPrice: calc.final, discount: calc.discount };
  });

  const bestPlatform = enhancedPlatforms.reduce((min, p) => p.finalPrice < min.finalPrice ? p : min, enhancedPlatforms[0]);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={vehicle.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400'} alt={`${vehicle.brand} ${vehicle.model}`} className={styles.image} />
        <div className={styles.badgesTopLeft}>
          <span className={styles.redBadge}>6% OFF</span>
        </div>
        <div className={styles.badgesTopRight}>
          <span className={styles.aiBadge}><Zap size={12} color="#facc15" fill="#facc15" /> {vehicle.aiScore || 92}/100</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoryBrand}>
          {vehicle.brand.toUpperCase()} • VEHICLE
        </div>
        
        <h3 className={styles.title}>{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
        
        <div className={styles.specsRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap' }}>
            <span className={styles.rating}>⭐ 4.8</span>
            <span className={styles.reviews}>(4,520 reviews)</span>
          </div>
          <span className={styles.specPill}>{vehicle.fuelType}</span>
          <span className={styles.specPill}>{vehicle.transmission}</span>
        </div>

        {bestPlatform && (
          <div className={styles.highlightBox}>
            <div className={styles.highlightIcon}>
              <CheckCircle2 size={14} color="#2563eb" />
            </div>
            <div className={styles.highlightText}>
              <strong>{bestPlatform.name}</strong> is cheapest — ₹{bestPlatform.discount > 0 ? bestPlatform.discount.toLocaleString() : '15,000'} cheaper than others.<br/>
              Used (Local Pickup)
            </div>
          </div>
        )}

        <div className={styles.bottomRow}>
          <div className={styles.priceContainer}>
            {bestPlatform && (
              <>
                <span className={styles.originalPrice}>₹{(bestPlatform.finalPrice + 5000).toLocaleString()}</span>
                <span className={styles.finalPrice}>₹{bestPlatform.finalPrice.toLocaleString()}</span>
              </>
            )}
          </div>
          
          <button 
            className={styles.expandSitesBtn}
            onClick={() => setShowComparisons(!showComparisons)}
          >
            {platforms.length} sites {showComparisons ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showComparisons && (
          <div className={styles.couponSection}>
          <div className={styles.couponToggleRow}>
            <span className={styles.couponTitle}><Tag size={14}/> Offers & Coupons</span>
            <div className={styles.toggleWrap}>
              <button 
                className={`${styles.toggleBtn} ${couponMode === 'auto' ? styles.active : ''}`}
                onClick={() => setCouponMode('auto')}
              >
                Auto Apply
              </button>
              <button 
                className={`${styles.toggleBtn} ${couponMode === 'manual' ? styles.active : ''}`}
                onClick={() => setCouponMode('manual')}
              >
                Manual
              </button>
            </div>
          </div>

          {couponMode === 'auto' ? (
            <div className={styles.autoApplied}>
              <CheckCircle2 size={16} color="#22c55e" />
              <span>AI Auto-applied best deal (Save up to ₹15,000)</span>
            </div>
          ) : (
            <div className={styles.manualInputRow}>
              <input 
                type="text" 
                placeholder="Enter promo code (Try SUPERCAR)"
                className={styles.couponInput}
                value={manualCoupon}
                onChange={(e) => setManualCoupon(e.target.value)}
              />
              <button 
                className={styles.applyBtn}
                onClick={() => setAppliedManual(true)}
              >
                Apply
              </button>
            </div>
          )}
          {couponMode === 'manual' && appliedManual && manualCoupon === 'SUPERCAR' && (
            <div className={styles.autoApplied} style={{ marginTop: '8px' }}>
              <CheckCircle2 size={14} color="#22c55e" /> Valid! ₹20,000 off applied.
            </div>
          )}
        </div>
        )}

        {showComparisons && (
          <div className={styles.comparisonsListWrap}>
            {/* Coupon Engine inside expanded view */}
            <div className={styles.comparisonList}>
              {enhancedPlatforms.map((plat, index) => {
                const isBest = plat.name === bestPlatform?.name;
                return (
                  <div key={index} className={`${styles.comparisonItem} ${isBest ? styles.bestPlatRow : ''}`} style={{ padding: '12px 8px' }}>
                    <div className={styles.platLeft} style={{ flexWrap: 'wrap', maxWidth: '50%' }}>
                      <span className={styles.platform} style={{ fontWeight: '600' }}>{plat.name}</span>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', width: '100%' }}>
                        {isBest && <span className={styles.bestPriceTag}>✨ AI Recommended</span>}
                        {plat.isCertified && <span className={styles.certTag}>✓ Certified</span>}
                      </div>
                    </div>
                    <div className={styles.platRight} style={{ flex: 1, justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {plat.discount > 0 && (
                            <span className={styles.strikePrice}>₹{plat.price.toLocaleString()}</span>
                          )}
                          <span className={`${styles.platformPrice} ${isBest ? styles.bestPrice : ''}`}>
                            ₹{plat.finalPrice.toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleBook(e, plat)} 
                          className={styles.rowBuyBtn}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Buy <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <AffiliateRedirectModal 
        isOpen={!!redirectData}
        providerName={redirectData?.providerName}
        targetUrl={redirectData?.targetUrl}
        onClose={() => setRedirectData(null)}
      />
    </div>
  );
};

export default VehicleCard;
