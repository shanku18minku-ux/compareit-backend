import React, { useEffect, useState } from 'react';
import { ShieldAlert, Star, Truck, ShieldCheck, IndianRupee, Tag, Flame, Award } from 'lucide-react';
import './GenericAlternatives.css';
import { getGenericAlternatives } from '../../services/medicineAiService';
import useAppStore from '../../store/appStore';

const GenericAlternatives = ({ medicine, originalCheapestPrice }) => {
  const [genericData, setGenericData] = useState(null);
  const setGlobalRedirectData = useAppStore(state => state.setGlobalRedirectData);

  useEffect(() => {
    if (medicine) {
      const data = getGenericAlternatives(medicine);
      if (data && data.alternatives && data.alternatives.length > 0) {
        setGenericData(data);
      }
    }
  }, [medicine]);

  if (!genericData) return null;

  const handleBuy = (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  const getBadgeConfig = (type) => {
    switch (type) {
      case 'Lowest Price': return { icon: <IndianRupee size={12} />, class: 'lowest-price' };
      case 'Best Rated': return { icon: <Star size={12} />, class: 'best-rated' };
      case 'Best Value': return { icon: <Award size={12} />, class: 'best-value' };
      case 'Biggest Savings': return { icon: <Flame size={12} />, class: 'biggest-savings' };
      default: return { icon: <Tag size={12} />, class: 'best-value' };
    }
  };

  return (
    <div className="generic-alternatives-container">
      <div className="generic-header">
        <h4 className="generic-title">
          💊 Generic Alternatives (Same Composition)
        </h4>
        <p className="generic-subtitle">
          AI matched by: {genericData.composition} • {genericData.strength} • {genericData.form}
        </p>
      </div>

      <div className="generic-cards-list">
        {genericData.alternatives.map((alt, idx) => {
          const badge = getBadgeConfig(alt.type);
          const savings = originalCheapestPrice > alt.price 
            ? Math.round(((originalCheapestPrice - alt.price) / originalCheapestPrice) * 100) 
            : 0;

          return (
            <div key={idx} className="generic-card">
              <div className="generic-card-top">
                <div className="generic-name-group">
                  <h5 className="generic-card-title">{alt.name}</h5>
                  <p className="generic-card-brand">By {alt.brand}</p>
                </div>
                <div className={`generic-badge ${badge.class}`}>
                  {badge.icon} {alt.type}
                </div>
              </div>

              <div className="generic-card-middle">
                <div className="generic-platform-info">
                  <span className="generic-platform-name">{alt.platform}</span>
                  <span className="generic-rating">
                    <Star size={12} fill="#eab308" color="#eab308" /> {alt.rating} ({alt.platform === 'Jan Aushadhi' ? 'Govt Verified' : 'Verified'})
                  </span>
                </div>
                
                <div className="generic-price-info">
                  <span className="generic-final-price">₹{alt.price}</span>
                  {savings > 0 && (
                    <span className="generic-savings">Save {savings}%</span>
                  )}
                </div>
              </div>

              <div className="generic-card-bottom">
                <span className="generic-delivery">
                  <Truck size={14} /> Delivery in {alt.deliveryDays} day{alt.deliveryDays > 1 ? 's' : ''}
                </span>
                <button className="generic-buy-btn" onClick={() => handleBuy(alt.platform)}>
                  View Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="generic-disclaimer">
        <ShieldAlert size={16} className="disclaimer-icon" />
        <p className="disclaimer-text">
          Generic alternatives are suggested based on matching active ingredient(s), strength, and dosage form. For prescription medicines, always consult your doctor or pharmacist before switching medicines.
        </p>
      </div>
    </div>
  );
};

export default GenericAlternatives;
