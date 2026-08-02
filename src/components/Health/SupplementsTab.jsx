import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import useAppStore from '../../store/appStore';
import { filterByLocation } from '../../utils/locationEngine.js';
import './MedicineTab.css';

const mockSupplements = [
  {
    id: 's1',
    name: 'Gold Standard 100% Whey Protein',
    brand: 'Optimum Nutrition',
    type: 'Powder',
    composition: 'Double Rich Chocolate (2 lbs)',
    platforms: [
      { name: 'HealthKart', originalPrice: 3899, discount: '20%', coupon: 'HK20', finalPrice: 3099, cheapest: true },
      { name: 'Amazon', originalPrice: 3899, discount: '19%', coupon: 'AMZ19', finalPrice: 3150, cheapest: false },
      { name: 'Nutrabay', originalPrice: 3899, discount: '20%', coupon: 'NTR20', finalPrice: 3120, cheapest: false }
    ]
  },
  {
    id: 's2',
    name: 'Fish Oil (1000mg Omega 3)',
    brand: 'MuscleBlaze',
    type: 'Capsules',
    composition: 'Unflavored (60 Caps)',
    platforms: [
      { name: 'MuscleBlaze', originalPrice: 899, discount: '50%', coupon: 'MB50', finalPrice: 449, cheapest: true },
      { name: 'HealthKart', originalPrice: 899, discount: '46%', coupon: 'HK46', finalPrice: 479, cheapest: false },
      { name: 'Flipkart', originalPrice: 899, discount: '44%', coupon: 'FL44', finalPrice: 499, cheapest: false }
    ]
  },
  {
    id: 's3',
    name: 'Multivitamin for Men & Women',
    brand: 'Centrum',
    type: 'Tablets',
    composition: 'Vegetarian (50 Tabs)',
    platforms: [
      { name: 'Tata 1mg', originalPrice: 450, discount: '10%', coupon: 'TATA10', finalPrice: 405, cheapest: false },
      { name: 'PharmEasy', originalPrice: 450, discount: '15%', coupon: 'EASY15', finalPrice: 382, cheapest: true },
      { name: 'Apollo', originalPrice: 450, discount: '6%', coupon: 'NONE', finalPrice: 420, cheapest: false }
    ]
  }
];

const SupplementsTab = ({ searchQuery }) => {
  const { t } = useTranslation();
  const { setGlobalRedirectData, userLocation } = useAppStore();
  const [expandedItems, setExpandedItems] = useState({});

  let filtered = filterByLocation(mockSupplements, userLocation?.city).filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    if (q.includes('supplement') || q.includes('health')) return true;
    return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q);
  });
  
  if (filtered.length === 0 && searchQuery) {
    const capitalizedQuery = searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const basePrice = (searchQuery.length * 15) % 2000 + 500;
    
    filtered = [{
      id: `dyn_${Date.now()}`,
      name: capitalizedQuery,
      brand: 'Generic Nutrition',
      type: 'Health Supplement',
      composition: 'Standard Size',
      platforms: [
        { name: 'HealthKart', originalPrice: Math.floor(basePrice * 1.2), discount: '10%', coupon: 'FIT10', finalPrice: basePrice, cheapest: true },
        { name: 'Amazon', originalPrice: Math.floor(basePrice * 1.2), discount: '5%', coupon: 'AMZ5', finalPrice: Math.floor(basePrice * 1.05), cheapest: false },
        { name: 'Flipkart', originalPrice: Math.floor(basePrice * 1.2), discount: '0%', coupon: 'NONE', finalPrice: Math.floor(basePrice * 1.1), cheapest: false }
      ]
    }];
  }

  const toggleItem = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBuy = (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  return (
    <div className="medicine-tab">
      <div className="medicines-list">
        <h3 className="section-title">
          {searchQuery ? 'Search Results' : 'Trending Supplements'}
        </h3>
        
        {filtered.length === 0 ? (
          <div className="no-results">No supplements found.</div>
        ) : (
          filtered.map(item => {
            const totalPlatformsCount = item.platforms.length;

            return (
            <div key={item.id} className="medicine-card">
              <div className="medicine-header">
                <div className="medicine-info">
                  <div className="medicine-title-row">
                    <h4 className="medicine-name">{item.name}</h4>
                    <span className="medicine-type">{item.type}</span>
                  </div>
                  <span className="medicine-composition">{item.composition}</span>
                  <span className="medicine-manufacturer">By {item.brand}</span>
                </div>
              </div>

                <div style={{ marginTop: '12px' }}>
                  <button 
                    onClick={() => toggleItem(item.id)}
                    style={{ 
                      width: '100%', padding: '12px', background: '#f8fafc', 
                      border: '1px solid #e2e8f0', borderRadius: '8px', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', fontWeight: '600', color: '#334155'
                    }}
                  >
                    <span>Check Deals across {totalPlatformsCount} Platforms</span>
                    <span>{expandedItems[item.id] ? '▲' : '▼'}</span>
                  </button>
                </div>

                {expandedItems[item.id] && (
                  <div className="platforms-comparison" style={{ marginTop: '12px' }}>
                    
                    <div className="comparison-header-row">
                      <div className="col-platform">{t('auto_platform_419f', 'Platform')}</div>
                      <div className="col-price">{t('auto_original_0a52', 'Original')}</div>
                      <div className="col-discount">{t('auto_discount_104d', 'Discount')}</div>
                      <div className="col-final">{t('auto_final_price_2ba8', 'Final Price')}</div>
                    </div>

                    {item.platforms.map((platform, idx) => {
                      const calculatedPrice = platform.finalPrice;
                      const isDiscountApplied = calculatedPrice < platform.originalPrice;
                      const isCheapest = platform.cheapest;

                      return (
                        <div key={idx} className={`med-platform-row ${isCheapest ? 'cheapest-row' : ''}`} style={{ paddingBottom: '12px' }}>
                          <div className="col-platform" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                            <span className="platform-name">{platform.name}</span>
                            {isCheapest && <span style={{ fontSize: '10px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>✨ Recommended</span>}
                          </div>
                          <div className="col-price">
                            <span className={isDiscountApplied ? "strikethrough" : ""}>₹{platform.originalPrice}</span>
                          </div>
                          <div className="col-discount">
                            {isDiscountApplied ? (
                              <>
                                <span className="discount-tag" style={{ color: '#10b981' }}>{platform.discount}</span>
                              </>
                            ) : (
                              <span className="no-discount">-</span>
                            )}
                          </div>
                          <div className="col-final" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <div className="final-price-value">₹{calculatedPrice}</div>
                            <button className="goto-app-btn" onClick={() => handleBuy(platform.name)} style={{ 
                                display: 'inline-block', background: '#10b981', color: '#fff', padding: '6px 12px', 
                                borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', 
                                border: 'none', cursor: 'pointer', textAlign: 'center' 
                            }}>
                              Open
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupplementsTab;
