import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Tag, ChevronRight, Filter } from 'lucide-react';
import useAppStore from '../../store/appStore';
import CouponManager from '../CouponManager/CouponManager';
import { filterByLocation, injectLocalPlatforms } from '../../utils/locationEngine.js';
import './DeliveryTab.css';

// Mock Data
const MOCK_DISHES = [
  {
    id: 'd1',
    name: 'Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'non-veg',
    restaurants: [
      {
        id: 'r1',
        name: 'Behrouz Biryani',
        rating: 4.3,
        time: '35 mins',
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 349, fee: 40, discount: 50, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 339, fee: 45, discount: 40, link: 'https://swiggy.com' },
          { name: 'EatSure', price: 329, fee: 0, discount: 30, link: 'https://eatsure.com' }
        ]
      },
      {
        id: 'r2',
        name: 'Biryani By Kilo',
        rating: 4.1,
        time: '45 mins',
        distance: '4.0 km',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 410, fee: 50, discount: 80, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 390, fee: 60, discount: 70, link: 'https://swiggy.com' }
        ]
      },
      {
        id: 'r3',
        name: 'Lucky Restaurant',
        rating: 4.5,
        time: '25 mins',
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 280, fee: 30, discount: 0, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 280, fee: 25, discount: 0, link: 'https://swiggy.com' }
        ]
      }
    ]
  },
  {
    id: 'd2',
    name: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'veg',
    restaurants: [
      {
        id: 'r4',
        name: 'Domino\'s Pizza',
        rating: 4.0,
        time: '30 mins',
        distance: '1.8 km',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 239, fee: 30, discount: 40, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 239, fee: 35, discount: 50, link: 'https://swiggy.com' },
          { name: 'EatSure', price: 239, fee: 0, discount: 0, link: 'https://eatsure.com' }
        ]
      },
      {
        id: 'r5',
        name: 'Oven Story',
        rating: 4.2,
        time: '35 mins',
        distance: '3.1 km',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 289, fee: 40, discount: 100, link: 'https://zomato.com' },
          { name: 'EatSure', price: 269, fee: 0, discount: 60, link: 'https://eatsure.com' }
        ]
      }
    ]
  },
  {
    id: 'd3',
    name: 'Veg Burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'veg',
    restaurants: [
      {
        id: 'r6',
        name: 'Burger King',
        rating: 4.1,
        time: '25 mins',
        distance: '2.0 km',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 149, fee: 30, discount: 20, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 149, fee: 20, discount: 15, link: 'https://swiggy.com' }
        ]
      },
      {
        id: 'r7',
        name: 'McDonald\'s',
        rating: 4.3,
        time: '20 mins',
        distance: '1.5 km',
        image: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 169, fee: 35, discount: 30, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 159, fee: 30, discount: 20, link: 'https://swiggy.com' }
        ]
      }
    ]
  },
  {
    id: 'd4',
    name: 'Steamed Momos',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'non-veg',
    restaurants: [
      {
        id: 'r8',
        name: 'Wow! Momo',
        rating: 3.9,
        time: '30 mins',
        distance: '2.2 km',
        image: 'https://images.unsplash.com/photo-1645696301019-35adcb18cb5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
        platforms: [
          { name: 'Zomato', price: 159, fee: 30, discount: 40, link: 'https://zomato.com' },
          { name: 'Swiggy', price: 149, fee: 35, discount: 30, link: 'https://swiggy.com' }
        ]
      }
    ]
  }
];

const DeliveryTab = ({ globalSearchQuery = '' }) => {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState(MOCK_DISHES);
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const [filterRating, setFilterRating] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  
  const { couponMode, appliedManualCoupons, setGlobalRedirectData, userLocation } = useAppStore();

  useEffect(() => {
    let filtered = filterByLocation([...MOCK_DISHES], userLocation?.city);

    if (globalSearchQuery) {
      const q = globalSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(d => d.name.toLowerCase().includes(q));
    }

    if (filterVeg && !filterNonVeg) {
      filtered = filtered.filter(d => d.type === 'veg');
    } else if (filterNonVeg && !filterVeg) {
      filtered = filtered.filter(d => d.type === 'non-veg');
    }

    // Deep clone to sort restaurants per dish
    const processed = filtered.map(dish => {
      let rests = dish.restaurants.map(r => ({
        ...r,
        platforms: injectLocalPlatforms(r.platforms, userLocation?.city, 'food', Math.round(Math.min(...r.platforms.map(p => p.price))))
      }));
      
      if (filterRating) {
        rests = rests.filter(r => r.rating >= 4.0);
      }

      rests.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'time') return parseInt(a.time) - parseInt(b.time);
        
        // Sort by cheapest final price
        const aMin = Math.min(...a.platforms.map(p => p.price + p.fee - p.discount));
        const bMin = Math.min(...b.platforms.map(p => p.price + p.fee - p.discount));
        return aMin - bMin;
      });

      return { ...dish, restaurants: rests };
    }).filter(d => d.restaurants.length > 0);

    setDishes(processed);
  }, [globalSearchQuery, filterVeg, filterNonVeg, filterRating, sortBy, userLocation?.city]);

  // Handle Filters
  const applyFilters = (filtered) => {
    // Basic implementation for now - this would be more complex in real app
    setDishes(filtered);
  };

  const [expandedRests, setExpandedRests] = useState({});

  const toggleRest = (restKey) => {
    setExpandedRests(prev => ({ ...prev, [restKey]: !prev[restKey] }));
  };

  const getFinalPrice = (dishId, p) => {
    // Delivery fee is always added
    const priceWithFee = p.price + p.fee;
    
    if (couponMode === 'auto') {
      return priceWithFee - p.discount;
    }
    
    const manualCode = appliedManualCoupons[dishId];
    if (manualCode === 'SAVE20' || manualCode === 'FIRST100') {
      return priceWithFee - p.discount;
    }
    
    return priceWithFee; // No discount
  };

  return (
    <div className="delivery-tab-container fade-in">
      {/* Filters */}
      <div className="delivery-filters">
        <div className="filter-chips">
          <button 
            className={`filter-chip ${filterVeg ? 'active' : ''}`}
            onClick={() => { setFilterVeg(!filterVeg); setFilterNonVeg(false); }}
          >
            <span className="veg-dot"></span> Veg
          </button>
          <button 
            className={`filter-chip ${filterNonVeg ? 'active' : ''}`}
            onClick={() => { setFilterNonVeg(!filterNonVeg); setFilterVeg(false); }}
          >
            <span className="nonveg-dot"></span> Non-Veg
          </button>
          <button 
            className={`filter-chip ${filterRating ? 'active' : ''}`}
            onClick={() => setFilterRating(!filterRating)}
          >
            Rating 4.0+
          </button>
        </div>
        <div className="sort-dropdown">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="price">Sort by: Price</option>
            <option value="rating">Sort by: Rating</option>
            <option value="time">Sort by: Time</option>
          </select>
        </div>
      </div>

      {dishes.length === 0 ? (
        <div className="no-results">{t('auto_no_dishes_found_matc_c7a5', 'No dishes found matching your criteria.')}</div>
      ) : (
        <div className="dishes-list">
          {dishes.map(dish => (
            <div key={dish.id} className="dish-section">
              <h2 className="dish-title">
                {dish.name}
                <span className={`dish-type-badge ${dish.type}`}>{dish.type === 'veg' ? 'Veg' : 'Non-Veg'}</span>
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <CouponManager 
                  itemId={dish.id} 
                  validCoupons={['SAVE20', 'FIRST100', 'FOODIE50']} 
                />
              </div>
              
              <div className="restaurants-scroll-container">
                {dish.restaurants.map(rest => {
                  // Find cheapest platform
                  const cheapestPlatform = rest.platforms.reduce((min, p) => 
                    getFinalPrice(dish.id, p) < getFinalPrice(dish.id, min) ? p : min
                  , rest.platforms[0]);

                  return (
                    <div key={rest.id} className="restaurant-card glass-card">
                      <div className="rest-image-container">
                        <img src={rest.image} alt={rest.name} className="rest-image" loading="lazy" />
                        <div className="rest-badges">
                          <div className="rest-rating"><Star size={12} fill="#FFD700" color="#FFD700" /> {rest.rating}</div>
                          <div className="rest-time"><Clock size={12} /> {rest.time}</div>
                        </div>
                      </div>
                      
                      <div className="rest-info">
                        <h3 className="rest-name">{rest.name}</h3>
                        <div className="rest-meta">
                          <span><MapPin size={12} /> {rest.distance}</span>
                        </div>
                        
                        <div style={{ marginTop: '12px' }}>
                          <button 
                            onClick={() => toggleRest(`${dish.id}_${rest.id}`)}
                            style={{ 
                              width: '100%', padding: '12px', background: '#f8fafc', 
                              border: '1px solid #e2e8f0', borderRadius: '8px', 
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              cursor: 'pointer', fontWeight: '600', color: '#334155'
                            }}
                          >
                            <span>Check Deals across {rest.platforms.length} Platforms</span>
                            <span>{expandedRests[`${dish.id}_${rest.id}`] ? '▲' : '▼'}</span>
                          </button>
                        </div>
                        
                        {expandedRests[`${dish.id}_${rest.id}`] && (
                          <div className="platform-comparison" style={{ marginTop: '12px' }}>
                            {rest.platforms.map((plat, idx) => {
                              const finalPrice = getFinalPrice(dish.id, plat);
                              const isCheapest = plat === cheapestPlatform;
                              const appliedDiscount = plat.price + plat.fee - finalPrice;
                              return (
                                <div key={idx} className={`plat-row ${isCheapest ? 'cheapest' : ''}`} style={{ paddingBottom: '12px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div className="plat-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {plat.name}
                                      {isCheapest && <span style={{ fontSize: '10px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>✨ Recommended</span>}
                                    </div>
                                    <div className="plat-calc">
                                      <span className="base-price">₹{plat.price}</span>
                                      {plat.fee > 0 && <span className="fee">+₹{plat.fee}</span>}
                                      {appliedDiscount > 0 && <span className="discount">-₹{appliedDiscount}</span>}
                                    </div>
                                  </div>
                                  <div className="plat-final" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                    <span>₹{finalPrice}</span>
                                    <button onClick={() => setGlobalRedirectData({ providerName: plat.name || 'Partner', targetUrl: plat.link })} className="goto-app-btn" style={{ 
                                        display: 'inline-block', background: '#10b981', color: '#fff', padding: '6px 12px', 
                                        borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', 
                                        border: 'none', cursor: 'pointer', textAlign: 'center' 
                                    }}>
                                      Open
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTab;
