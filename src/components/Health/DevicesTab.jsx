import React from 'react';
import useAppStore from '../../store/appStore';
import './HealthTabsShared.css';

const mockDevices = [
  {
    id: 'd1',
    name: 'Automatic Blood Pressure Monitor',
    brand: 'Omron',
    specs: 'HEM-7120, 5 Yrs Warranty',
    type: 'BP Monitor',
    platforms: [
      { name: 'Amazon', price: 1549, mrp: 2160, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Apollo Pharmacy', price: 1620, mrp: 2160, tag: 'Fastest', tagClass: 'tag-fast' },
      { name: 'Tata 1mg', price: 1599, mrp: 2160, tag: 'Best Rated', tagClass: 'tag-rated' }
    ]
  },
  {
    id: 'd2',
    name: 'Accu-Chek Active Glucometer Kit',
    brand: 'Accu-Chek',
    specs: 'With 10 Test Strips',
    type: 'Glucometer',
    platforms: [
      { name: 'PharmEasy', price: 849, mrp: 1099, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Flipkart Health+', price: 899, mrp: 1099, tag: '', tagClass: '' },
      { name: 'Netmeds', price: 875, mrp: 1099, tag: 'Best Rated', tagClass: 'tag-rated' }
    ]
  },
  {
    id: 'd3',
    name: 'Premium Folding Wheelchair',
    brand: 'Karma',
    specs: 'Steel Frame, 100kg Capacity',
    type: 'Wheelchair',
    platforms: [
      { name: 'Amazon', price: 4500, mrp: 6500, tag: 'Lowest Price', tagClass: 'tag-lowest' },
      { name: 'Tata 1mg', price: 4800, mrp: 6500, tag: '', tagClass: '' }
    ]
  }
];

const DevicesTab = ({ searchQuery }) => {
  const setGlobalRedirectData = useAppStore(state => state.setGlobalRedirectData);

  const filtered = mockDevices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuy = (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  return (
    <div className="shared-tab-container">
      <div className="shared-tab-intro">
        <h3>Medical Devices & Equipments</h3>
        <p>Compare BP monitors, glucometers, and rehabilitation aids.</p>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">No medical devices found.</div>
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
                    <button className="shared-buy-btn" onClick={() => handleBuy(plat.name)}>Buy</button>
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

export default DevicesTab;
