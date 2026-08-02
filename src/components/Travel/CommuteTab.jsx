import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, Clock, Zap, ChevronRight } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { filterByLocation } from '../../utils/locationEngine';
import './CommuteTab.css';

const mockRides = [
  {
    provider: 'Uber',
    type: 'Uber Go',
    price: 245,
    eta: '4 min',
    surge: false,
    url: 'https://m.uber.com'
  },
  {
    provider: 'Ola',
    type: 'Mini',
    price: 230,
    eta: '6 min',
    surge: false,
    url: 'https://book.olacabs.com'
  },
  {
    provider: 'BluSmart',
    type: 'Electric',
    price: 260,
    eta: '12 min',
    surge: false,
    url: 'https://blu-smart.com'
  },
  {
    provider: 'Rapido',
    type: 'Cab',
    price: 215,
    eta: '5 min',
    surge: true,
    url: 'https://rapido.bike'
  },
  {
    provider: 'inDrive',
    type: 'AC',
    price: 190,
    eta: '8 min',
    surge: false,
    url: 'https://indrive.com'
  }
];

const CommuteTab = () => {
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState('cab');
  const [from, setFrom] = useState('Current Location');
  const [to, setTo] = useState('');
  const { setGlobalRedirectData, userLocation } = useAppStore();

  const vehicles = [
    { id: 'auto', icon: '🛺', label: 'Auto' },
    { id: 'cab', icon: '🚗', label: 'Cab' },
    { id: 'bike', icon: '🏍️', label: 'Bike' },
  ];

  // If user typed a custom from location (not "Current Location"), use that. Otherwise use GPS city.
  const searchCity = (from && from !== 'Current Location') ? from : userLocation?.city;
  
  // First filter by origin/location
  let filteredRides = filterByLocation(mockRides, searchCity);
  
  // If user typed a destination, strictly match it too
  if (to && to.trim() !== '') {
      filteredRides = filteredRides.filter(r => 
          (r.destination || '').toLowerCase().includes(to.toLowerCase()) ||
          (r.to || '').toLowerCase().includes(to.toLowerCase()) ||
          (r.location || '').toLowerCase().includes(to.toLowerCase())
      );
  }

  // If no rides match the strict route, gracefully fallback to showing all rides in the origin city
  if (filteredRides.length === 0 && to) {
      filteredRides = filterByLocation(mockRides, searchCity);
  }

  const sortedRides = [...filteredRides].sort((a, b) => a.price - b.price);
  const cheapest = sortedRides[0] || {};
  const fastest = [...filteredRides].sort((a, b) => parseInt(a.eta) - parseInt(b.eta))[0] || {};

  return (
    <div className="commute-tab">
      <div className="location-inputs">
        <div className="input-row">
          <div className="icon-col">
            <Navigation size={18} color="#2563EB" />
            <div className="line-connector"></div>
          </div>
          <div className="input-field">
            <input 
              type="text" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              placeholder={t('auto_pickup_location_c4a6', 'Pickup Location')}
            />
          </div>
        </div>
        <div className="input-row">
          <div className="icon-col">
            <MapPin size={18} color="#EF4444" />
          </div>
          <div className="input-field">
            <input 
              type="text" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              placeholder={t('auto_where_to_b97b', 'Where to?')}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="vehicle-selector">
        {vehicles.map(v => (
          <button 
            key={v.id}
            className={`vehicle-btn ${vehicle === v.id ? 'active' : ''}`}
            onClick={() => setVehicle(v.id)}
          >
            <span className="vehicle-icon">{v.icon}</span>
            <span className="vehicle-label">{v.label}</span>
          </button>
        ))}
      </div>

      {to && (
        <div className="rides-container">
          {filteredRides.length > 0 ? (
            <>
              <div className="ai-insight">
                <Sparkles size={16} color="#2563EB" />
                <span><strong>{cheapest.provider}</strong> is the cheapest, but <strong>{fastest.provider}</strong> is arriving fastest ({fastest.eta}).</span>
              </div>

              <div className="rides-list">
                {sortedRides.map((ride, index) => {
                  const isCheapest = ride.provider === cheapest.provider;
                  const isFastest = ride.provider === fastest.provider;

                  return (
                <div key={ride.provider} className={`ride-card ${isCheapest ? 'best-price' : ''}`}>
                  <div className="ride-info">
                    <div className="provider-name">
                      {ride.provider}
                      {ride.surge && <span className="surge-badge"><Zap size={10} /> High Demand</span>}
                    </div>
                    <div className="ride-meta">
                      <span>{ride.type}</span>
                      <span className="dot">•</span>
                      <span className="eta"><Clock size={12} /> {ride.eta}</span>
                    </div>
                    <div className="badges">
                      {isCheapest && <span className="badge green">{t('auto_cheapest_f650', 'Cheapest')}</span>}
                      {isFastest && <span className="badge blue">{t('auto_fastest_90fd', 'Fastest')}</span>}
                    </div>
                  </div>
                  
                  <div className="price-book">
                    <div className="price">₹{ride.price}</div>
                    <button onClick={() => setGlobalRedirectData({ providerName: ride.provider || 'Partner', targetUrl: ride.url })} className="book-ride-btn">
                      Book <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No rides found in your location.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommuteTab;
