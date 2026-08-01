import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, ChevronDown, Search } from 'lucide-react';
import useAppStore from '../../store/appStore';
import './LocationPicker.css';

const LocationPicker = () => {
  const { userLocation, locationStatus, setUserLocation } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate location detection on mount if not already set
  useEffect(() => {
    if (locationStatus === 'detecting' && !userLocation.lat) {
      const detectLocation = async () => {
        // Simulate network delay for finding location
        await new Promise(res => setTimeout(res, 1500));
        setUserLocation(
          { address: 'Koramangala, Bengaluru, Karnataka', lat: 12.9352, lng: 77.6245 },
          'detected'
        );
      };
      detectLocation();
    }
  }, [locationStatus, setUserLocation, userLocation.lat]);

  const handleSelectMockLocation = (address, lat, lng) => {
    setUserLocation({ address, lat, lng }, 'selected');
    setIsModalOpen(false);
  };

  const mockLocations = [
    { address: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
    { address: 'Andheri West, Mumbai', lat: 19.1363, lng: 72.8277 },
    { address: 'Connaught Place, New Delhi', lat: 28.6304, lng: 77.2177 },
    { address: 'Banjara Hills, Hyderabad', lat: 17.4156, lng: 78.4347 },
  ];

  return (
    <div className="location-picker-container">
      <div className="location-trigger" onClick={() => setIsModalOpen(true)}>
        <MapPin className="location-icon" size={20} />
        <div className="location-info">
          <span className="location-label">Delivering to</span>
          <span className="location-address">
            {locationStatus === 'detecting' ? (
              <span className="pulsing-text">Detecting your location...</span>
            ) : (
              <span className="truncate">{userLocation.address}</span>
            )}
          </span>
        </div>
        <ChevronDown className="location-chevron" size={16} />
      </div>

      {isModalOpen && (
        <div className="location-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="location-modal" onClick={e => e.stopPropagation()}>
            <div className="location-modal-header">
              <h3>Select Location</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div className="location-search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div 
              className="current-location-btn"
              onClick={() => {
                setUserLocation({ address: 'Detecting location...', lat: null, lng: null }, 'detecting');
                setIsModalOpen(false);
              }}
            >
              <Navigation size={18} className="nav-icon" />
              <span>Use current location</span>
            </div>

            <div className="saved-locations">
              <h4>Suggested Locations</h4>
              {mockLocations.filter(loc => loc.address.toLowerCase().includes(searchQuery.toLowerCase())).map((loc, idx) => (
                <div 
                  key={idx} 
                  className="saved-location-item"
                  onClick={() => handleSelectMockLocation(loc.address, loc.lat, loc.lng)}
                >
                  <MapPin size={18} className="item-icon" />
                  <div className="item-details">
                    <span className="item-title">{loc.address.split(',')[0]}</span>
                    <span className="item-subtitle">{loc.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
