import React, { useState, useEffect } from 'react';
import { ExternalLink, Briefcase, ShoppingCart, Users, Truck } from 'lucide-react';
import useAppStore from '../../store/appStore';
import EmptyState from '../Global/EmptyState';
import './SupplyTab.css';

const CATEGORIES = [
  { id: 'grocery', name: 'Grocery Supply', icon: <ShoppingCart size={18} /> },
  { id: 'catering', name: 'Catering', icon: <Users size={18} /> },
  { id: 'tiffin', name: 'Tiffin Service', icon: <Briefcase size={18} /> },
  { id: 'wholesale', name: 'Wholesale', icon: <Truck size={18} /> }
];

const MOCK_PLATFORMS = [
  { id: 'p1', name: 'Ninjacart', category: 'grocery', bestFor: 'Fresh Produce (B2B)', pricing: 'Dynamic Wholesale', link: 'https://ninjacart.in' },
  { id: 'p2', name: 'WayCool', category: 'grocery', bestFor: 'Agri-Supply Chain', pricing: 'Bulk Pricing', link: 'https://waycool.in' },
  { id: 'p3', name: 'BigBasket B2B', category: 'grocery', bestFor: 'FMCG & Staples', pricing: 'Fixed Wholesale', link: 'https://bbcorporate.com' },
  
  { id: 'p4', name: 'WeddingWire', category: 'catering', bestFor: 'Wedding Catering', pricing: 'Per Plate (₹1500+)', link: 'https://weddingwire.in' },
  { id: 'p5', name: 'WedMeGood', category: 'catering', bestFor: 'Premium Events', pricing: 'Custom Quotes', link: 'https://wedmegood.com' },
  
  { id: 'p6', name: 'Homely', category: 'tiffin', bestFor: 'Home-cooked Meals', pricing: 'Monthly Subscription', link: 'https://homely.com' },
  { id: 'p7', name: 'Lunchbox', category: 'tiffin', bestFor: 'Corporate Lunch', pricing: '₹150 - ₹250 / meal', link: 'https://eatsure.com/lunchbox' },
  
  { id: 'p8', name: 'Udaan', category: 'wholesale', bestFor: 'FMCG & Staples', pricing: 'B2B Trade Prices', link: 'https://udaan.com' },
  { id: 'p9', name: 'Jumbotail', category: 'wholesale', bestFor: 'Kirana Stores', pricing: 'Wholesale Margins', link: 'https://jumbotail.com' },
  { id: 'p10', name: 'Amazon Business', category: 'wholesale', bestFor: 'Pantry Supplies', pricing: 'GST Invoice & Bulk Discounts', link: 'https://amazon.in/business' }
];

const SupplyTab = ({ globalSearchQuery = '' }) => {
  const [activeCategory, setActiveCategory] = useState('grocery');
  const [filteredPlatforms, setFilteredPlatforms] = useState([]);
  const { setGlobalRedirectData } = useAppStore();

  useEffect(() => {
    let results = MOCK_PLATFORMS;
    
    if (globalSearchQuery) {
      const q = globalSearchQuery.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || p.bestFor.toLowerCase().includes(q)
      );
      // If searching, ignore category filter to show all matches
    } else {
      results = results.filter(p => p.category === activeCategory);
    }
    
    setFilteredPlatforms(results);
  }, [activeCategory, globalSearchQuery]);

  const handleVisit = (link, providerName) => {
    setGlobalRedirectData({ providerName: providerName || 'Partner', targetUrl: link });
  };

  return (
    <div className="supply-tab-container fade-in">
      {!globalSearchQuery && (
        <div className="supply-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {filteredPlatforms.length === 0 ? (
        <EmptyState 
          icon="Package"
          title="No Suppliers Found"
          message="We couldn't find any suppliers matching your criteria."
        />
      ) : (
        <div className="supply-list">
          {filteredPlatforms.map(plat => (
            <div key={plat.id} className="supply-card glass-card">
              <div className="sup-info">
                <div className="sup-header">
                  <h3 className="sup-name">{plat.name}</h3>
                  {globalSearchQuery && (
                    <span className="sup-cat-badge">{CATEGORIES.find(c => c.id === plat.category)?.name}</span>
                  )}
                </div>
                
                <div className="sup-details">
                  <div className="detail-row">
                    <span className="label">Best For:</span>
                    <span className="value">{plat.bestFor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Pricing:</span>
                    <span className="value text-highlight">{plat.pricing}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="sup-visit-btn"
                onClick={() => handleVisit(plat.link, plat.name)}
              >
                Visit <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplyTab;
