import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, Star, ShieldCheck, Truck } from 'lucide-react';
import useAppStore from '../../store/appStore';
import PlatformComparison from '../../components/Ecommerce/PlatformComparison';
import PriceHistoryChart from '../../components/Ecommerce/PriceHistoryChart';
import './ProductDetail.css';

export default function ProductDetail() {
  const { activeProduct, goToDashboard, goToPLP, searchQuery, setGlobalRedirectData } = useAppStore();
  const [activeImage, setActiveImage] = useState(0);

  if (!activeProduct) {
    return <div className="product-detail-empty">{t('auto_no_product_selected_663f', 'No product selected.')}</div>;
  }

  // Assuming activeProduct has images, title, brand, rating, reviews, dealScore, specs, platforms, priceHistory
  const images = activeProduct.images || [activeProduct.image, activeProduct.image, activeProduct.image]; // Fallback
  
  const handleBack = () => {
    if (searchQuery) {
      goToPLP(searchQuery);
    } else {
      goToDashboard();
    }
  };

  const getDealScoreColor = (score) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 70) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const bestPlatform = activeProduct.platforms?.sort((a, b) => a.price - b.price)[0];

  return (
    <div className="product-detail-page">
      {/* Top Bar */}
      <header className="pdp-header">
        <button className="icon-btn" onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="pdp-header-actions">
          <button className="icon-btn">
            <Share2 size={24} />
          </button>
          <button className="icon-btn">
            <Heart size={24} />
          </button>
        </div>
      </header>

      <main className="pdp-main">
        <div className="pdp-container">
          {/* Top Section - Image & Info */}
          <div className="pdp-top-section">
            {/* Left: Image Gallery */}
            <div className="pdp-gallery">
              <div className="pdp-main-image-container">
                <img src={images[activeImage]} alt={activeProduct.title} className="pdp-main-image" />
              </div>
              <div className="pdp-thumbnails">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`pdp-thumbnail ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="pdp-info">
              <div className="pdp-brand-badge">{activeProduct.brand || 'Brand'}</div>
              <h1 className="pdp-title">{activeProduct.title}</h1>
              
              <div className="pdp-rating-score-row">
                <div className="pdp-rating">
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  <span className="rating-value">{activeProduct.rating || '4.5'}</span>
                  <span className="rating-count">({activeProduct.reviews || '1.2k'} reviews)</span>
                </div>
                {activeProduct.dealScore && (
                  <div 
                    className="pdp-deal-score" 
                    style={{ backgroundColor: `${getDealScoreColor(activeProduct.dealScore)}20`, color: getDealScoreColor(activeProduct.dealScore) }}
                  >
                    Deal Score: {activeProduct.dealScore}/100
                  </div>
                )}
              </div>

              <div className="pdp-key-specs">
                <h3>{t('auto_key_specifications_d23e', 'Key Specifications')}</h3>
                <ul>
                  {activeProduct.specs?.map((spec, idx) => (
                    <li key={idx}><strong>{spec.name}:</strong> {spec.value}</li>
                  )) || (
                    <>
                      <li><strong>Display:</strong> 6.7" OLED, 120Hz</li>
                      <li><strong>Processor:</strong> Snapdragon 8 Gen 2</li>
                      <li><strong>Camera:</strong> 50MP + 12MP + 10MP</li>
                      <li><strong>Battery:</strong> 4700mAh, 45W Fast Charging</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="pdp-trust-badges">
                <div className="trust-badge"><ShieldCheck size={20} /> 1 Year Warranty</div>
                <div className="trust-badge"><Truck size={20} /> Free Delivery</div>
              </div>
            </div>
          </div>

          {/* Middle Section - Platform Comparison */}
          <div className="pdp-section pdp-comparison-section">
            <PlatformComparison product={activeProduct} />
          </div>

          {/* Bottom Section - Price History */}
          <div className="pdp-section pdp-history-section">
            <PriceHistoryChart data={activeProduct.priceHistory} />
          </div>
        </div>
      </main>

      {/* Sticky Mobile Bottom Bar */}
      {bestPlatform && (
        <div className="pdp-sticky-bar">
          <div className="sticky-price-info">
            <span className="sticky-label">Best Price on {bestPlatform.name}</span>
            <span className="sticky-price">₹{bestPlatform.price.toLocaleString()}</span>
          </div>
          <button className="btn-buy-now" onClick={() => setGlobalRedirectData({ providerName: bestPlatform.name, targetUrl: bestPlatform.url || 'https://amazon.in' })}>{t('auto_buy_now_c1f5', 'Buy Now')}</button>
        </div>
      )}
    </div>
  );
}
