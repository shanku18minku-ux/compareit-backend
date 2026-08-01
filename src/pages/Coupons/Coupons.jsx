import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Mic, X, Sparkles, SlidersHorizontal, Zap } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { searchCoupons, getBestDeals, COUPON_CATEGORIES, getCategoryCoupons } from '../../services/couponService';
import DealCard from '../../components/Coupons/DealCard';
import PriceBreakdown from '../../components/Coupons/PriceBreakdown';
import './Coupons.css';

const Coupons = () => {
  const { t } = useTranslation();
  const { goToDashboard, activeCouponCategory, setActiveCouponCategory } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setFeaturedDeals(getBestDeals(activeCouponCategory, 20));
  }, [activeCouponCategory]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchCoupons(searchQuery, activeCouponCategory === 'all' ? undefined : activeCouponCategory);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeCouponCategory]);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search not supported on this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setSearchQuery(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleCategoryChange = (catId) => {
    setActiveCouponCategory(catId);
    setSearchQuery('');
    setFeaturedDeals(getBestDeals(catId, 20));
  };

  const displayList = searchQuery.trim().length > 0 ? searchResults : featuredDeals;
  const bestDeal = displayList[0] || null;
  const otherDeals = displayList.slice(1);

  return (
    <div className={`coupons-page ${mounted ? 'coupons-mounted' : ''}`}>
      {/* Header */}
      <div className="coupons-header">
        <div className="coupons-header-top">
          <button className="coupons-back-btn" onClick={goToDashboard}>
            <ArrowLeft size={20} />
          </button>
          <div className="coupons-header-titles">
            <h1 className="coupons-title">{t('auto_deals_coupons_aef7', 'Deals & Coupons')}</h1>
            <p className="coupons-subtitle">{t('auto_ai_powered_savings_e_bebf', 'AI-powered savings engine')}</p>
          </div>
          <div className="coupons-header-icon">
            <Sparkles size={22} color="#fbbf24" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="coupons-search-wrap">
          <Search size={16} className="coupons-search-icon" />
          <input
            ref={searchRef}
            type="text"
            className="coupons-search-input"
            placeholder={t('auto_search_amazon_swiggy_c8ed', 'Search Amazon, Swiggy, HDFC...')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button className="coupons-clear-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          ) : (
            <button className={`coupons-mic-btn ${isListening ? 'listening' : ''}`} onClick={handleVoiceSearch}>
              <Mic size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="coupons-categories">
          {COUPON_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`coupon-cat-pill ${activeCouponCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="coupons-body">
        {/* Results count */}
        {searchQuery && (
          <div className="coupons-results-info">
            <Zap size={14} color="#2563eb" />
            <span><strong>{searchResults.length}</strong> deals found for "{searchQuery}"</span>
          </div>
        )}

        {displayList.length === 0 ? (
          <div className="coupons-empty">
            <div className="empty-icon">🎟️</div>
            <h3>{t('auto_no_deals_found_6c28', 'No deals found')}</h3>
            <p>Try searching for Amazon, Swiggy, Zomato, HDFC, or Netflix</p>
          </div>
        ) : (
          <>
            {/* AI Best Deal */}
            {bestDeal && (
              <div className="coupons-section">
                <div className="coupons-section-header">
                  <span className="section-tag ai-tag"><Sparkles size={12} /> AI Best Pick</span>
                  <span className="section-count">{displayList.length} total deals</span>
                </div>
                <DealCard
                  coupon={bestDeal}
                  isHighlighted={true}
                  onCalculate={setSelectedCoupon}
                />
              </div>
            )}

            {/* Other Deals */}
            {otherDeals.length > 0 && (
              <div className="coupons-section">
                <div className="coupons-section-header">
                  <span className="section-tag">{t('auto_more_deals_e56f', 'More Deals')}</span>
                </div>
                <div className="coupons-deals-list">
                  {otherDeals.map(coupon => (
                    <DealCard
                      key={coupon.id}
                      coupon={coupon}
                      onCalculate={setSelectedCoupon}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ height: '40px' }} />
      </div>

      {/* Price Breakdown Modal */}
      {selectedCoupon && (
        <PriceBreakdown
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  );
};

export default Coupons;
