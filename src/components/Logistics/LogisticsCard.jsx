import React from 'react';
import { Star, Clock, MapPin, Truck } from 'lucide-react';
import './LogisticsCard.css';

const LogisticsCard = ({ provider, onBook }) => {
  return (
    <div className="logistics-card">
      <div className="lc-header">
        <div className="lc-brand-info">
          <div className="lc-logo-placeholder">
            {provider.name.charAt(0)}
          </div>
          <div className="lc-name-container">
            <h3 className="lc-name">{provider.name}</h3>
            <div className="lc-rating">
              <Star className="lc-star-icon" size={14} />
              <span>{provider.rating}</span>
            </div>
          </div>
        </div>
        <div className="lc-price-container">
          {provider.discountAmount > 0 && (
            <span className="lc-original-price">₹{provider.originalCost}</span>
          )}
          <span className="lc-price">₹{provider.calculatedCost || provider.cost}</span>
          {provider.discountAmount > 0 && (
            <div className="lc-discount-tag">Save ₹{provider.discountAmount}</div>
          )}
        </div>
      </div>
      
      <div className="lc-details">
        <div className="lc-detail-item">
          <Clock className="lc-detail-icon" size={16} />
          <span>{provider.deliveryTime} Days</span>
        </div>
        <div className="lc-detail-item">
          <MapPin className="lc-detail-icon" size={16} />
          <span>{provider.pickupAvailable ? 'Pickup Available' : 'Drop-off Only'}</span>
        </div>
      </div>

      <div className="lc-features">
        {provider.features && provider.features.map((feature, idx) => (
          <span key={idx} className="lc-feature-badge">{feature}</span>
        ))}
      </div>

      <button className="lc-book-button" onClick={() => onBook(provider)}>
        <Truck size={18} />
        <span>Book Now</span>
      </button>
    </div>
  );
};

export default LogisticsCard;
