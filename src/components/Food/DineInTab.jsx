import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Check, ExternalLink, Percent } from 'lucide-react';
import useAppStore from '../../store/appStore';
import EmptyState from '../Global/EmptyState';
import './DineInTab.css';

const MOCK_RESTAURANTS = [
  {
    id: 'di1',
    name: 'Bastian',
    cuisine: 'Seafood, Asian',
    location: 'Bandra West, Mumbai',
    rating: 4.6,
    costForTwo: '₹3,500',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'Zomato Gold', offer: 'Flat 15% OFF on Bill', best: false, link: 'https://zomato.com' },
      { name: 'EazyDiner', offer: '25% OFF on Food + Drinks', best: true, link: 'https://eazydiner.com' },
      { name: 'Swiggy Dineout', offer: '10% OFF', best: false, link: 'https://swiggy.com' }
    ]
  },
  {
    id: 'di2',
    name: 'Global Fusion',
    cuisine: 'Sushi, Asian, North Indian',
    location: 'Saki Naka, Mumbai',
    rating: 4.4,
    costForTwo: '₹2,200',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'Dineout', offer: 'Buffet @ ₹999', best: false, link: 'https://dineout.co.in' },
      { name: 'magicpin', offer: '30% OFF using magicPoints', best: true, link: 'https://magicpin.in' },
      { name: 'Zomato Gold', offer: 'Buy 1 Get 1 on Drinks', best: false, link: 'https://zomato.com' }
    ]
  },
  {
    id: 'di3',
    name: 'Social',
    cuisine: 'Continental, American, Asian',
    location: 'Colaba, Mumbai',
    rating: 4.3,
    costForTwo: '₹1,500',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'Swiggy Dineout', offer: 'Flat ₹500 OFF on ₹2000', best: true, link: 'https://swiggy.com' },
      { name: 'Zomato Gold', offer: '1+1 on Food', best: false, link: 'https://zomato.com' }
    ]
  },
  {
    id: 'di4',
    name: 'Yauatcha',
    cuisine: 'Chinese, Dim Sum',
    location: 'BKC, Mumbai',
    rating: 4.7,
    costForTwo: '₹4,000',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'EazyDiner', offer: 'Prime: 25% OFF', best: true, link: 'https://eazydiner.com' },
      { name: 'Dineout', offer: '10% OFF via HDFC', best: false, link: 'https://dineout.co.in' }
    ]
  },
  {
    id: 'di5',
    name: 'The Irish House',
    cuisine: 'European, American',
    location: 'Lower Parel, Mumbai',
    rating: 4.2,
    costForTwo: '₹2,000',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'Zomato Gold', offer: '2+2 on Drinks', best: true, link: 'https://zomato.com' },
      { name: 'magicpin', offer: '20% OFF', best: false, link: 'https://magicpin.in' },
      { name: 'Swiggy Dineout', offer: '15% OFF', best: false, link: 'https://swiggy.com' }
    ]
  },
  {
    id: 'di6',
    name: 'Tuscan Pizza',
    cuisine: 'Italian, Pizza',
    location: 'Juhu, Mumbai',
    rating: 4.1,
    costForTwo: '₹1,200',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'Swiggy Dineout', offer: 'Flat 20% OFF', best: true, link: 'https://swiggy.com' },
      { name: 'Zomato Gold', offer: '10% OFF', best: false, link: 'https://zomato.com' }
    ]
  }
];

const DineInTab = ({ globalSearchQuery = '' }) => {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const { setGlobalRedirectData } = useAppStore();

  useEffect(() => {
    if (globalSearchQuery) {
      const q = globalSearchQuery.toLowerCase();
      setRestaurants(MOCK_RESTAURANTS.filter(r => 
        r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      ));
    } else {
      setRestaurants(MOCK_RESTAURANTS);
    }
  }, [globalSearchQuery]);

  const handleBook = (link, providerName) => {
    setGlobalRedirectData({ providerName: providerName || 'Partner', targetUrl: link });
  };

  return (
    <div className="dinein-tab-container fade-in">
      {restaurants.length === 0 ? (
        <EmptyState 
          icon="Search"
          title="No Restaurants Found"
          message="Try a different location or cuisine."
        />
      ) : (
        <div className="dinein-list">
          {restaurants.map(rest => {
            const bestPlatform = rest.platforms.find(p => p.best) || rest.platforms[0];

            return (
              <div key={rest.id} className="dinein-card glass-card">
                <div className="di-image-container">
                  <img src={rest.image} alt={rest.name} className="di-image" loading="lazy" />
                  <div className="di-rating"><Star size={14} fill="#FFD700" color="#FFD700" /> {rest.rating}</div>
                </div>
                
                <div className="di-info">
                  <div className="di-header-row">
                    <h3 className="di-name">{rest.name}</h3>
                    <span className="di-cost">{rest.costForTwo} for 2</span>
                  </div>
                  
                  <div className="di-meta">
                    <span>{rest.cuisine}</span>
                    <span className="di-dot">•</span>
                    <span><MapPin size={12} style={{display:'inline', marginBottom:'-2px'}}/> {rest.location}</span>
                  </div>
                  
                  <div className="di-platforms">
                    <h4 className="di-offers-title">{t('auto_best_booking_offers_30d6', 'Best Booking Offers')}</h4>
                    <div className="di-offers-list">
                      {rest.platforms.map((plat, idx) => (
                        <div key={idx} className={`di-offer-row ${plat.best ? 'best-offer' : ''}`}>
                          <div className="di-plat-name">
                            {plat.best && <Check size={12} className="check-icon" />}
                            {plat.name}
                          </div>
                          <div className="di-offer-text">
                            <Percent size={10} /> {plat.offer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    className="di-book-btn"
                    onClick={() => handleBook(bestPlatform.link, bestPlatform.name)}
                  >
                    Book via {bestPlatform.name}
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DineInTab;
