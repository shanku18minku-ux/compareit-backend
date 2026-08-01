import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { MapPin, Shield } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import useAppStore from '../../store/appStore';
import './LocationPrompt.css';

const LocationPrompt = () => {
  const { t } = useTranslation();
  const { userLocation, setUserLocation } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkLocation = async () => {
      // Check if user has already granted location or permanently dismissed it
      const hasDismissed = localStorage.getItem('compareit_location_dismissed');
      if (hasDismissed === 'true' || userLocation) {
        setIsVisible(false);
        return;
      }

      // Check current permissions via capacitor
      try {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location === 'granted') {
          // If already granted, fetch location silently and save
          fetchLocation();
        } else if (permissions.location === 'prompt' || permissions.location === 'prompt-with-rationale') {
          // If not decided, show prompt
          // Add a small delay so it doesn't jarringly pop up immediately on first load
          setTimeout(() => setIsVisible(true), 1500);
        }
      } catch (err) {
        console.warn('Geolocation plugin not available or error checking permissions', err);
        setTimeout(() => setIsVisible(true), 1500);
      }
    };

    checkLocation();
  }, [userLocation]);

  const fetchLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        city: 'Current Location', // In a real app, use reverse geocoding here
      });
      setIsVisible(false);
    } catch (e) {
      console.error('Error fetching location', e);
      // Even on error, we might want to hide the prompt
      setIsVisible(false);
    }
  };

  const handleAllow = async () => {
    try {
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location === 'granted') {
        await fetchLocation();
      } else {
        // User denied at system level
        setIsVisible(false);
      }
    } catch (e) {
      console.error('Error requesting location permission', e);
      setIsVisible(false);
    }
  };

  const handleNotNow = () => {
    localStorage.setItem('compareit_location_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="location-prompt-overlay">
      <div className="location-prompt-modal">
        
        <div className="location-header">
          <div className="location-icon-wrapper">
            <MapPin size={28} color="#2563EB" />
          </div>
          <h2>{t('auto_enable_your_location_a9bf', 'Enable Your Location')}</h2>
        </div>

        <div className="location-body">
          <p className="location-intro">
            To provide the best experience, we need access to your current location.
          </p>

          <div className="location-list">
            <p>Your location will only be used to:</p>
            <ul>
              <li>{t('auto_show_services_availa_8c67', 'Show services available near you')}</li>
              <li>Display nearby stores, restaurants, jobs, healthcare, education, and other local options</li>
              <li>{t('auto_improve_search_resul_5fff', 'Improve search results based on your area')}</li>
            </ul>
          </div>

          <div className="location-privacy">
            <div className="privacy-header">
              <Shield size={18} color="#10b981" />
              <span>Your privacy matters:</span>
            </div>
            <ul>
              <li>Your location is never sold or shared with third parties.</li>
              <li>We only access your location while you use the app (unless you choose otherwise).</li>
              <li>Location access is completely free—no extra charges apply.</li>
              <li>You can change this permission anytime from your device settings.</li>
            </ul>
          </div>

          <p className="location-footer-text">
            Please enable Location to continue.
          </p>
        </div>

        <div className="location-actions">
          <button className="location-btn-outline" onClick={handleNotNow}>
            Not Now
          </button>
          <button className="location-btn-primary" onClick={handleAllow}>
            Allow Location
          </button>
        </div>

      </div>
    </div>
  );
};

export default LocationPrompt;
