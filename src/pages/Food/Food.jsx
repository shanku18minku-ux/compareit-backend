import React, { useState } from 'react';
import { Search, MapPin, Navigation, Bike, Utensils, Package } from 'lucide-react';
import useAppStore from '../../store/appStore';
import DeliveryTab from '../../components/Food/DeliveryTab';
import DineInTab from '../../components/Food/DineInTab';
import SupplyTab from '../../components/Food/SupplyTab';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';
import './Food.css';

const Food = () => {
  const [activeTab, setActiveTab] = useState('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Try to use appStore if available, otherwise fallback
  let userLocation = 'Mumbai, India';
  try {
    const store = useAppStore();
    if (store.userLocation) {
      userLocation = store.userLocation.address || store.userLocation.city || 'Mumbai, India';
    }
  } catch (e) {
    // Ignore store errors
  }

  return (
    <div className="food-page-container fade-in">
      <GlobalDisclaimer />
      {/* Header section */}
      <div className="food-header">
        <div className="food-location">
          <MapPin size={18} className="text-blue-500" />
          <span className="location-text">{userLocation}</span>
          <Navigation size={14} className="location-icon" />
        </div>
        
        <h1 className="food-title">Compare & Crave</h1>
        
        <div className="food-search-bar">
          <Search size={20} className="food-search-icon" />
          <input
            type="text"
            placeholder={
              activeTab === 'delivery' ? "Search for dishes (e.g. Biryani, Pizza)..." :
              activeTab === 'dinein' ? "Search restaurants or cuisines..." :
              "Search B2B supply & catering..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <div className="food-tabs">
          <button 
            className={`food-tab ${activeTab === 'delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            <Bike size={16} /> Delivery
          </button>
          <button 
            className={`food-tab ${activeTab === 'dinein' ? 'active' : ''}`}
            onClick={() => setActiveTab('dinein')}
          >
            <Utensils size={16} /> Dine-In
          </button>
          <button 
            className={`food-tab ${activeTab === 'supply' ? 'active' : ''}`}
            onClick={() => setActiveTab('supply')}
          >
            <Package size={16} /> Supply
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="food-content">
        {activeTab === 'delivery' && <DeliveryTab globalSearchQuery={searchQuery} />}
        {activeTab === 'dinein' && <DineInTab globalSearchQuery={searchQuery} />}
        {activeTab === 'supply' && <SupplyTab globalSearchQuery={searchQuery} />}
      </div>
    </div>
  );
};

export default Food;
