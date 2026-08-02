import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, ChevronDown, Search } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { Geolocation } from '@capacitor/geolocation';
import './LocationPicker.css';
const LocationPicker = () => {
  const { t } = useTranslation();
  const { userLocation, locationStatus, setUserLocation } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real location detection is handled by LocationPrompt or the button below.

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
          <span className="location-label">{t('auto_delivering_to_d34e', 'Delivering to')}</span>
          <span className="location-address">
            {locationStatus === 'detecting' ? (
              <span className="pulsing-text">{t('auto_detecting_your_locat_e365', 'Detecting your location...')}</span>
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
              <h3>{t('auto_select_location_0afc', 'Select Location')}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div className="location-search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder={t('auto_search_for_area_stre_492b', 'Search for area, street name...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div 
              className="current-location-btn"
              onClick={async () => {
                setUserLocation({ address: 'Detecting location...', lat: null, lng: null }, 'detecting');
                setIsModalOpen(false);
                try {
                  let permissions = await Geolocation.checkPermissions();
                  if (permissions.location !== 'granted') {
                    permissions = await Geolocation.requestPermissions();
                  }
                  if (permissions.location !== 'granted') throw new Error('Permission denied');
                  const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  let city = 'Current Location';
                  let address = 'Detecting address...';
                  try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || 'Unknown City';
                    const neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.residential;
                    address = neighborhood ? `${neighborhood}, ${city}` : (data.display_name || city);
                  } catch (err) {}
                  setUserLocation({ lat, lng, city, address }, 'detected');
                } catch (e) {
                  setUserLocation({ address: 'Location failed', lat: null, lng: null }, 'failed');
                }
              }}
            >
              <Navigation size={18} className="nav-icon" />
              <span>{t('auto_use_current_location_1759', 'Use current location')}</span>
            </div>

            <div className="saved-locations">
              <h4>{t('auto_suggested_locations_f7d4', 'Suggested Locations')}</h4>
              {mockLocations.filter(loc => loc.address.toLowerCase().includes(searchQuery.toLowerCase().trim())).map((loc, idx) => (
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
