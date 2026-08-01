import React, { useState } from 'react';

import { ShoppingCart, Pill, Activity, Heart, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import useAppStore from '../../store/appStore';
import CouponManager from '../CouponManager/CouponManager';
import './MedicineTab.css';

const mockMedicines = [
  {
    id: 'm1',
    name: 'Panadol Advance 500mg',
    composition: 'Paracetamol',
    manufacturer: 'GSK',
    type: 'Tablet',
    genericSuggestion: { name: 'Crocin 500mg', diff: '30% cheaper' },
    platforms: [
      { name: 'Tata 1mg', originalPrice: 60, discount: '10%', coupon: 'HEALTH10', finalPrice: 48, cheapest: false },
      { name: 'PharmEasy', originalPrice: 60, discount: '15%', coupon: 'EASY15', finalPrice: 43, cheapest: false },
      { name: 'Netmeds', originalPrice: 60, discount: '20%', coupon: 'NET20', finalPrice: 38, cheapest: true }
    ]
  },
  {
    id: 'm2',
    name: 'Augmentin 625 Duo',
    composition: 'Amoxicillin + Clavulanic Acid',
    manufacturer: 'GSK',
    type: 'Tablet',
    genericSuggestion: { name: 'Moxikind-CV 625', diff: '45% cheaper' },
    platforms: [
      { name: 'Apollo Pharmacy', originalPrice: 201, discount: '5%', coupon: 'NONE', finalPrice: 190, cheapest: false },
      { name: 'Truemeds', originalPrice: 201, discount: '22%', coupon: 'TRUE22', finalPrice: 156, cheapest: true },
      { name: 'MedPlus', originalPrice: 201, discount: '15%', coupon: 'PLUS15', finalPrice: 170, cheapest: false }
    ]
  },
  {
    id: 'm3',
    name: 'Shelcal 500',
    composition: 'Calcium + Vitamin D3',
    manufacturer: 'Torrent Pharma',
    type: 'Tablet',
    genericSuggestion: null,
    platforms: [
      { name: 'Flipkart Health+', originalPrice: 119, discount: '25%', coupon: 'FLIP25', finalPrice: 89, cheapest: true },
      { name: 'Amazon Pharmacy', originalPrice: 119, discount: '20%', coupon: 'AMZ20', finalPrice: 95, cheapest: false },
      { name: 'JioMart Pharmacy', originalPrice: 119, discount: '18%', coupon: 'JIO18', finalPrice: 97, cheapest: false }
    ]
  }
];

const categories = [
  { name: 'OTC Medicines', icon: <Pill size={20} />, color: '#3b82f6' },
  { name: 'Supplements', icon: <Sparkles size={20} />, color: '#8b5cf6' },
  { name: 'Medical Devices', icon: <Activity size={20} />, color: '#ef4444' },
  { name: 'Home Healthcare', icon: <Heart size={20} />, color: '#10b981' }
];

const MedicineTab = ({ searchQuery }) => {
  const { couponMode, appliedManualCoupons, setGlobalRedirectData } = useAppStore();

  const filteredMedicines = mockMedicines.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    med.composition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [expandedMeds, setExpandedMeds] = useState({});

  const toggleMed = (medId) => {
    setExpandedMeds(prev => ({ ...prev, [medId]: !prev[medId] }));
  };


  const getPlatformFinalPrice = (medId, platform) => {
    if (couponMode === 'auto') return platform.finalPrice;
    
    const manualCode = appliedManualCoupons[medId];
    if (manualCode && platform.coupon === manualCode) {
      return platform.finalPrice;
    }
    // No code or invalid code -> revert to original price
    return platform.originalPrice;
  };

  const handleBuy = async (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  return (
    <div className="medicine-tab">
      
      {!searchQuery && (
        <div className="medicine-categories">
          {categories.map(cat => (
            <div key={cat.name} className="med-cat-card">
              <div className="med-cat-icon" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                {cat.icon}
              </div>
              <span className="med-cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="medicines-list">
        <h3 className="section-title">
          {searchQuery ? 'Search Results' : 'Trending Medicines'}
        </h3>
        
        {filteredMedicines.length === 0 ? (
          <div className="no-results">No medicines found for this query.</div>
        ) : (
          filteredMedicines.map(med => (
            <div key={med.id} className="medicine-card">
              <div className="medicine-header">
                <div className="medicine-info">
                  <div className="medicine-title-row">
                    <h4 className="medicine-name">{med.name}</h4>
                    <span className="medicine-type">{med.type}</span>
                  </div>
                  <p className="medicine-composition">{med.composition}</p>
                  <p className="medicine-manufacturer">By {med.manufacturer}</p>
                </div>
              </div>
              
              {med.genericSuggestion && (
                <div className="generic-alert">
                  <TrendingDown size={16} className="generic-icon" />
                  <div className="generic-text">
                    <strong>Generic Alternative:</strong> {med.genericSuggestion.name} ({med.genericSuggestion.diff})
                  </div>
                </div>
              )}

                <div style={{ marginTop: '12px' }}>
                  <button 
                    onClick={() => toggleMed(med.id)}
                    style={{ 
                      width: '100%', padding: '12px', background: '#f8fafc', 
                      border: '1px solid #e2e8f0', borderRadius: '8px', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', fontWeight: '600', color: '#334155'
                    }}
                  >
                    <span>Check Deals across {med.platforms.length} Platforms</span>
                    <span>{expandedMeds[med.id] ? '▲' : '▼'}</span>
                  </button>
                </div>

                {expandedMeds[med.id] && (
                  <div className="platforms-comparison" style={{ marginTop: '12px' }}>
                    <CouponManager 
                      itemId={med.id} 
                      validCoupons={med.platforms.map(p => p.coupon).filter(c => c !== 'NONE')} 
                    />
                    
                    <div className="comparison-header-row">
                      <div className="col-platform">Platform</div>
                      <div className="col-price">Original</div>
                      <div className="col-discount">Discount</div>
                      <div className="col-final">Final Price</div>
                    </div>

                    {med.platforms.map((platform, idx) => {
                      const calculatedPrice = getPlatformFinalPrice(med.id, platform);
                      const isDiscountApplied = calculatedPrice < platform.originalPrice;
                      const allPrices = med.platforms.map(p => getPlatformFinalPrice(med.id, p));
                      const isCheapest = calculatedPrice === Math.min(...allPrices);

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
          ))
        )}
      </div>
    </div>
  );
};

export default MedicineTab;
