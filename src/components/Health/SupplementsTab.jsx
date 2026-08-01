import { useTranslation } from 'react-i18next';
import React from 'react';
import useAppStore from '../../store/appStore';
import './HealthTabsShared.css';

const mockSupplements = [
  {
    id: 's1',
    name: 'Gold Standard 100% Whey Protein',
    brand: 'Optimum Nutrition (ON)',
    flavor: 'Double Rich Chocolate',
    size: '2 lbs (907g)',
    platforms: [
      { name: 'HealthKart', price: 3099, mrp: 3899, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Amazon', price: 3150, mrp: 3899, tag: 'Fastest', tagClass: 'tag-fast' },
      { name: 'Nutrabay', price: 3120, mrp: 3899, tag: 'Best Rated', tagClass: 'tag-rated' }
    ]
  },
  {
    id: 's2',
    name: 'Fish Oil (1000mg Omega 3)',
    brand: 'MuscleBlaze',
    flavor: 'Unflavored',
    size: '60 Capsules',
    platforms: [
      { name: 'MuscleBlaze', price: 449, mrp: 899, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'HealthKart', price: 479, mrp: 899, tag: '', tagClass: '' },
      { name: 'Flipkart', price: 499, mrp: 899, tag: 'Fastest', tagClass: 'tag-fast' }
    ]
  },
  {
    id: 's3',
    name: 'Multivitamin for Men & Women',
    brand: 'Centrum',
    flavor: 'Vegetarian',
    size: '50 Tablets',
    platforms: [
      { name: 'Tata 1mg', price: 405, mrp: 450, tag: 'Best Rated', tagClass: 'tag-rated' },
      { name: 'PharmEasy', price: 382, mrp: 450, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Apollo Pharmacy', price: 420, mrp: 450, tag: '', tagClass: '' }
    ]
  }
];

const SupplementsTab = ({ searchQuery }) => {
  const { t } = useTranslation();
  const setGlobalRedirectData = useAppStore(state => state.setGlobalRedirectData);

  const filtered = mockSupplements.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    
    // Generic terms show all
    if (q.includes('supplement') || q.includes('health')) return true;
    
    // Specific terms
    if (q.includes('protein') && s.name.toLowerCase().includes('whey')) return true;
    if (q.includes('vitamin') && s.name.toLowerCase().includes('vitamin')) return true;
    if (q.includes('fish') && s.name.toLowerCase().includes('fish')) return true;
    
    return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q);
  });

  const handleBuy = (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  return (
    <div className="shared-tab-container">
      <div className="shared-tab-intro">
        <h3>{t('auto_supplements_nutritio_19c9', 'Supplements & Nutrition')}</h3>
        <p>Compare whey protein, vitamins, and wellness products across top stores.</p>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">{t('auto_no_supplements_found_c281', 'No supplements found.')}</div>
      ) : (
        filtered.map(item => (
          <div key={item.id} className="shared-card">
            <div className="shared-card-header">
              <div className="shared-title-group">
                <h4>{item.name}</h4>
                <span className="shared-brand">By {item.brand}</span>
              </div>
            </div>
            
            <div className="shared-specs">
              <span className="spec-badge">{item.size}</span>
              <span className="spec-badge">{item.flavor}</span>
            </div>

            <div className="shared-platforms-list">
              {item.platforms.sort((a, b) => a.price - b.price).map((plat, idx) => (
                <div key={idx} className={`platform-row ${idx === 0 ? 'recommended' : ''}`}>
                  <div className="plat-info">
                    <span className="plat-name">{plat.name}</span>
                    {plat.tag && <span className={`plat-tag ${plat.tagClass}`}>{plat.tag}</span>}
                  </div>
                  <div className="plat-price-group">
                    <span className="plat-price">₹{plat.price}</span>
                    <span className="plat-mrp">₹{plat.mrp}</span>
                    <button className="shared-buy-btn" onClick={() => handleBuy(plat.name)}>{t('auto_buy_831a', 'Buy')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SupplementsTab;
