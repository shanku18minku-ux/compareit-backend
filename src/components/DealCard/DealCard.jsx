import React, { useState } from 'react';
import { Heart, Star, ChevronRight, Tag } from 'lucide-react';
import './DealCard.css';

const DealCard = ({ deal }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const t = (str) => str;

  // Mock deal data if none provided
  const data = deal || {
    id: 1,
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    image: "https://via.placeholder.com/300x200?text=Product+Image",
    originalPrice: 399.99,
    bestPrice: 298.00,
    bestPlatform: "Amazon",
    platforms: [
      { name: "Amazon", price: 298.00, logo: "A" },
      { name: "Flipkart", price: 310.00, logo: "F" },
      { name: "BestBuy", price: 320.00, logo: "B" }
    ],
    dealScore: 85,
    discount: 25,
    category: "Electronics",
    rating: 4.8,
    reviewCount: 12450
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Calculate final price with auto-applied generic coupon
  const autoCouponDiscount = Math.floor(data.bestPrice * 0.05);
  const finalPrice = data.bestPrice - autoCouponDiscount;

  return (
    <div className="deal-card">
      <div className="deal-image-container">
        <img src={data.image} alt={data.title} className="deal-image" />
        
        <div className="discount-badge">
          {data.discount}% OFF
        </div>
        
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
        >
          <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#6b7280'} />
        </button>

        <div 
          className="deal-score" 
          style={{ backgroundColor: getScoreColor(data.dealScore) }}
        >
          {data.dealScore}
        </div>
      </div>

      <div className="deal-content">
        <div className="deal-meta">
          <span className="deal-category">{t(data.category)}</span>
          <div className="deal-rating">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{data.rating}</span>
            <span className="review-count">({data.reviewCount})</span>
          </div>
        </div>

        <h3 className="deal-title">{data.title}</h3>

        <div className="deal-price-row">
          <div className="price-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="best-price">₹{finalPrice.toLocaleString()}</span>
              <span className="original-price" style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.875rem' }}>₹{data.bestPrice.toLocaleString()}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} /> Auto-applied: SAVE5
            </span>
          </div>
        </div>

        <div className="platform-comparison">
          {data.platforms.map((platform, idx) => (
            <div key={idx} className={`platform-item ${platform.name === data.bestPlatform ? 'best' : ''}`}>
              <div className="platform-logo">
                {platform.logo?.startsWith('http') ? (
                  <img src={platform.logo} alt={platform.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  platform.logo || platform.name[0]
                )}
              </div>
              <span className="platform-price">₹{platform.price}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DealCard;
