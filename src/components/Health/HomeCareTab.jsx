import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import useAppStore from '../../store/appStore';
import { filterByLocation } from '../../utils/locationEngine.js';
import './MedicineTab.css';

const mockHomeCare = [
  {
    id: 'hc1',
    name: 'Full Body Massage at Home',
    brand: 'Urban Company',
    type: 'Home Service',
    composition: '60 Mins Relaxation',
    platforms: [
      { name: 'Urban Company', originalPrice: 1499, discount: '20%', coupon: 'RELAX20', finalPrice: 1199, cheapest: true },
      { name: 'YesMadam', originalPrice: 1499, discount: '10%', coupon: 'YES10', finalPrice: 1349, cheapest: false },
      { name: 'NoBroker', originalPrice: 1499, discount: '15%', coupon: 'NOB15', finalPrice: 1274, cheapest: false }
    ]
  },
  {
    id: 'hc2',
    name: 'Elderly Care Nursing (12 Hrs)',
    brand: 'Portea',
    type: 'Nursing',
    composition: 'Professional Nurse',
    platforms: [
      { name: 'Portea', originalPrice: 2000, discount: '10%', coupon: 'CARE10', finalPrice: 1800, cheapest: true },
      { name: 'Care24', originalPrice: 2000, discount: '5%', coupon: 'CARE5', finalPrice: 1900, cheapest: false },
      { name: 'Apollo HomeCare', originalPrice: 2000, discount: '0%', coupon: 'NONE', finalPrice: 2000, cheapest: false }
    ]
  },
  {
    id: 'hc3',
    name: 'Physiotherapy Session',
    brand: 'Nightingales',
    type: 'Therapy',
    composition: '45 Mins Session',
    platforms: [
      { name: 'Nightingales', originalPrice: 800, discount: '15%', coupon: 'PHY15', finalPrice: 680, cheapest: true },
      { name: 'Portea', originalPrice: 800, discount: '10%', coupon: 'PORT10', finalPrice: 720, cheapest: false },
      { name: 'Practo Care', originalPrice: 800, discount: '5%', coupon: 'PRAC5', finalPrice: 760, cheapest: false }
    ]
  }
];

const HomeCareTab = ({ searchQuery }) => {
  const { t } = useTranslation();
  const { setGlobalRedirectData, userLocation } = useAppStore();
  const [expandedItems, setExpandedItems] = useState({});

  let filtered = filterByLocation(mockHomeCare, userLocation?.city).filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    if (q.includes('care') || q.includes('home') || q.includes('service')) return true;
    return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q);
  });
  
  if (filtered.length === 0 && searchQuery) {
    const capitalizedQuery = searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const basePrice = (searchQuery.length * 50) % 4000 + 1500;
    
    filtered = [{
      id: `dyn_${Date.now()}`,
      name: capitalizedQuery,
      brand: 'Top Service',
      type: 'Home Service',
      composition: 'Standard Package',
      platforms: [
        { name: 'Urban Company', originalPrice: Math.floor(basePrice * 1.2), discount: '10%', coupon: 'URB10', finalPrice: basePrice, cheapest: true },
        { name: 'Portea', originalPrice: Math.floor(basePrice * 1.2), discount: '5%', coupon: 'PORT5', finalPrice: Math.floor(basePrice * 1.1), cheapest: false },
        { name: 'Apollo', originalPrice: Math.floor(basePrice * 1.2), discount: '0%', coupon: 'NONE', finalPrice: Math.floor(basePrice * 1.2), cheapest: false }
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
          {searchQuery ? 'Search Results' : 'Trending Home Care Services'}
        </h3>
        
        {filtered.length === 0 ? (
          <div className="no-results">No home care services found.</div>
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

export default HomeCareTab;
