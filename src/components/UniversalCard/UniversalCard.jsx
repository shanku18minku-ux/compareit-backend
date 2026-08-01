import React from 'react';
import { Star, Bot, Clock, Tag, Trophy, Gift } from 'lucide-react';
import './UniversalCard.css';

const UniversalCard = ({ 
  coverImage, 
  title, 
  subtitle, 
  price, 
  timeOrDistance, 
  rating, 
  aiScore, 
  badge1, 
  badge2,
  onCompare,
  onBuy
}) => {
  return (
    <div className="universal-card">
      <div className="uc-image-container">
        <img 
          src={coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
          alt={title} 
          className="uc-image"
          loading="lazy"
        />
        <div className="uc-overlay-gradient"></div>
        <div className="uc-badges-top">
          {rating && (
            <div className="uc-rating-badge">
              <Star size={12} fill="currentColor" /> {rating}
            </div>
          )}
          {aiScore && (
            <div className="uc-ai-badge">
              <Bot size={12} /> AI {aiScore}%
            </div>
          )}
        </div>
      </div>
      
      <div className="uc-content">
        <h2 className="uc-title">{title}</h2>
        {subtitle && <p className="uc-subtitle">{subtitle}</p>}
        
        <div className="uc-meta-row">
          {price && (
            <div className="uc-price">
              {price}
            </div>
          )}
          {timeOrDistance && (
            <div className="uc-time">
              <Clock size={14} /> {timeOrDistance}
            </div>
          )}
        </div>
        
        <div className="uc-badges-bottom">
          {badge1 && (
            <div className="uc-pill uc-pill-primary">
              <Trophy size={12} /> {badge1}
            </div>
          )}
          {badge2 && (
            <div className="uc-pill uc-pill-secondary">
              <Gift size={12} /> {badge2}
            </div>
          )}
        </div>
        
        <div className="uc-actions">
          <button className="uc-btn uc-btn-outline" onClick={onCompare || (() => alert('Compare clicked'))}>
            Compare
          </button>
          <button className="uc-btn uc-btn-primary" onClick={onBuy || (() => alert('View Deal clicked'))}>
            View Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalCard;
