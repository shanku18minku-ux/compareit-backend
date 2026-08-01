import React, { useState } from 'react';
import { Search, Calendar, Users, Star, MapPin, Check, ChevronDown, ChevronUp, Sparkles, Wifi, Coffee, Car, Wind } from 'lucide-react';
import useAppStore from '../../store/appStore';
import './StayTab.css';

const mockHotels = [
  {
    id: 1,
    name: 'Taj Mahal Palace',
    rating: 5,
    reviews: 2841,
    location: 'Colaba, Mumbai',
    category: 'Luxury',
    amenities: ['wifi', 'breakfast', 'parking', 'ac'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'MakeMyTrip', price: 18500, breakfast: true, url: 'https://makemytrip.com' },
      { name: 'Booking.com', price: 18200, breakfast: false, url: 'https://booking.com' },
      { name: 'Agoda', price: 17900, breakfast: true, url: 'https://agoda.com' },
      { name: 'Goibibo', price: 18800, breakfast: true, url: 'https://goibibo.com' },
    ]
  },
  {
    id: 2,
    name: 'ITC Gardenia',
    rating: 5,
    reviews: 1520,
    location: 'Residency Road, Bengaluru',
    category: 'Luxury',
    amenities: ['wifi', 'breakfast', 'ac'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'MakeMyTrip', price: 12500, breakfast: true, url: 'https://makemytrip.com' },
      { name: 'Agoda', price: 11900, breakfast: true, url: 'https://agoda.com' },
      { name: 'Yatra', price: 12800, breakfast: false, url: 'https://yatra.com' },
      { name: 'Booking.com', price: 12200, breakfast: true, url: 'https://booking.com' },
    ]
  },
  {
    id: 3,
    name: 'FabHotel Prime',
    rating: 4,
    reviews: 876,
    location: 'Andheri East, Mumbai',
    category: 'Budget',
    amenities: ['wifi', 'ac'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'FabHotels', price: 3200, breakfast: true, url: 'https://fabhotels.com' },
      { name: 'MakeMyTrip', price: 3500, breakfast: false, url: 'https://makemytrip.com' },
      { name: 'Goibibo', price: 3450, breakfast: true, url: 'https://goibibo.com' },
      { name: 'OYO', price: 3100, breakfast: false, url: 'https://oyorooms.com' },
    ]
  },
  {
    id: 4,
    name: 'Treebo Trend',
    rating: 3.5,
    reviews: 430,
    location: 'Koramangala, Bengaluru',
    category: 'Budget',
    amenities: ['wifi', 'breakfast'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    platforms: [
      { name: 'Treebo', price: 2100, breakfast: true, url: 'https://treebo.com' },
      { name: 'MakeMyTrip', price: 2400, breakfast: true, url: 'https://makemytrip.com' },
      { name: 'Agoda', price: 2200, breakfast: false, url: 'https://agoda.com' },
      { name: 'Airbnb', price: 2600, breakfast: false, url: 'https://airbnb.com' },
    ]
  }
];

const amenityIcons = {
  wifi: { icon: Wifi, label: 'WiFi' },
  breakfast: { icon: Coffee, label: 'Breakfast' },
  parking: { icon: Car, label: 'Parking' },
  ac: { icon: Wind, label: 'AC' },
};

const StayTab = () => {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('12 Aug – 14 Aug');
  const [guests, setGuests] = useState('2 Guests, 1 Room');
  const [expandedHotels, setExpandedHotels] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');
  const { setGlobalRedirectData } = useAppStore();

  const toggleHotel = (id) =>
    setExpandedHotels(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = filterCategory === 'All'
    ? mockHotels
    : mockHotels.filter(h => h.category === filterCategory);

  return (
    <div className="stay-tab">
      {/* Search Widget */}
      <div className="stay-search-widget">
        <div className="stay-input-group">
          <Search size={16} className="stay-input-icon" />
          <input
            type="text"
            placeholder="City, Hotel, or Area"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div className="stay-search-row">
          <div className="stay-input-group half">
            <Calendar size={16} className="stay-input-icon" />
            <input
              type="text"
              value={dates}
              onChange={e => setDates(e.target.value)}
              placeholder="Dates"
            />
          </div>
          <div className="stay-input-group half">
            <Users size={16} className="stay-input-icon" />
            <input
              type="text"
              value={guests}
              onChange={e => setGuests(e.target.value)}
              placeholder="Guests"
            />
          </div>
        </div>
        <button className="stay-search-btn">Search Hotels</button>
      </div>

      {/* Filters */}
      <div className="stay-filter-chips">
        {['All', 'Luxury', 'Budget'].map(cat => (
          <button
            key={cat}
            className={`stay-chip ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {/* Results */}
      <div className="stay-results">
        <p className="stay-results-count">{filtered.length} hotels found</p>
        {filtered.map(hotel => {
          const sorted = [...hotel.platforms].sort((a, b) => a.price - b.price);
          const best = sorted[0];
          const savings = sorted[sorted.length - 1].price - best.price;
          const isExpanded = expandedHotels[hotel.id];

          return (
            <div key={hotel.id} className="stay-hotel-card">
              {/* Image */}
              <div className="stay-hotel-image-wrap">
                <img src={hotel.image} alt={hotel.name} className="stay-hotel-image" loading="lazy" />
                <div className="stay-hotel-rating">
                  <Star size={12} fill="#FFD700" color="#FFD700" />
                  <span>{hotel.rating}</span>
                  <span className="stay-hotel-reviews">({hotel.reviews})</span>
                </div>
                <div className="stay-hotel-category-badge">{hotel.category}</div>
              </div>

              {/* Info */}
              <div className="stay-hotel-info">
                <h3 className="stay-hotel-name">{hotel.name}</h3>
                <div className="stay-hotel-location">
                  <MapPin size={12} />
                  <span>{hotel.location}</span>
                </div>

                {/* Amenities */}
                <div className="stay-amenities">
                  {hotel.amenities.map(key => {
                    const { icon: Icon, label } = amenityIcons[key] || {};
                    return Icon ? (
                      <span key={key} className="stay-amenity">
                        <Icon size={11} /> {label}
                      </span>
                    ) : null;
                  })}
                </div>

                {/* AI recommendation strip */}
                <div className="stay-ai-strip">
                  <Sparkles size={13} color="#7c3aed" />
                  <span>
                    <strong>{best.name}</strong> is cheapest
                    {savings > 0 && <> — save <strong>₹{savings.toLocaleString()}</strong> vs others</>}
                    {best.breakfast ? ' · Breakfast included' : ''}
                  </span>
                </div>

                {/* Best price preview */}
                <div className="stay-price-preview">
                  <span className="stay-best-price">₹{best.price.toLocaleString()}<span>/night</span></span>
                  <button
                    className="stay-toggle-btn"
                    onClick={() => toggleHotel(hotel.id)}
                  >
                    Compare {hotel.platforms.length} sites {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Expanded platform comparison */}
                {isExpanded && (
                  <div className="stay-platform-list">
                    {sorted.map((plat, idx) => (
                      <div key={plat.name} className={`stay-plat-row ${idx === 0 ? 'best' : ''}`}>
                        <div className="stay-plat-left">
                          <span className="stay-plat-name">{plat.name}</span>
                          {plat.breakfast && (
                            <span className="stay-breakfast-tag">
                              <Check size={9} /> Breakfast
                            </span>
                          )}
                          {idx === 0 && <span className="stay-recommended-tag">✨ Best</span>}
                        </div>
                        <div className="stay-plat-right">
                          <span className="stay-plat-price">₹{plat.price.toLocaleString()}</span>
                          <button
                            className="stay-book-btn"
                            onClick={() => setGlobalRedirectData({ providerName: plat.name || 'Partner', targetUrl: plat.url })}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StayTab;
