import React from 'react';
import useAppStore from '../../store/appStore';
import './HealthTabsShared.css';

const mockHomeCare = [
  {
    id: 'h1',
    name: 'Home Nursing Services',
    brand: 'Professional ICU Trained Nurses',
    specs: '12 Hours/Day',
    type: 'Nursing',
    platforms: [
      { name: 'Portea', price: 1500, mrp: 2000, tag: 'Best Rated', tagClass: 'tag-rated' },
      { name: 'Care24', price: 1400, mrp: 1800, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Apollo HomeCare', price: 1800, mrp: 2200, tag: 'Fastest', tagClass: 'tag-fast' }
    ]
  },
  {
    id: 'h2',
    name: 'Physiotherapist Home Visit',
    brand: 'Certified Ortho/Neuro Experts',
    specs: '45 Mins Session',
    type: 'Physiotherapy',
    platforms: [
      { name: 'Portea', price: 600, mrp: 800, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Nightingales', price: 750, mrp: 1000, tag: 'Best Rated', tagClass: 'tag-rated' }
    ]
  },
  {
    id: 'h3',
    name: 'Oxygen Concentrator Rental',
    brand: 'Philips Respironics 5L',
    specs: 'Monthly Rental, Setup Included',
    type: 'Equipment Rental',
    platforms: [
      { name: 'Portea', price: 4500, mrp: 5500, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Care24', price: 4800, mrp: 6000, tag: '', tagClass: '' }
    ]
  }
];

const HomeCareTab = ({ searchQuery }) => {
  const setGlobalRedirectData = useAppStore(state => state.setGlobalRedirectData);

  const filtered = mockHomeCare.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.specs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  return (
    <div className="shared-tab-container">
      <div className="shared-tab-intro">
        <h3>Home Healthcare Services</h3>
        <p>Compare nursing, physiotherapy, and medical rentals for your loved ones.</p>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">No homecare services found.</div>
      ) : (
        filtered.map(item => (
          <div key={item.id} className="shared-card">
            <div className="shared-card-header">
              <div className="shared-title-group">
                <h4>{item.name}</h4>
                <span className="shared-brand">{item.brand}</span>
              </div>
            </div>
            
            <div className="shared-specs">
              <span className="spec-badge">{item.type}</span>
              <span className="spec-badge">{item.specs}</span>
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
                    <button className="shared-buy-btn" onClick={() => handleBook(plat.name)}>Book</button>
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

export default HomeCareTab;
