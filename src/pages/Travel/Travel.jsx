import React, { useState } from 'react';
import { MapPin, Plane, Car, Hotel } from 'lucide-react';
import CommuteTab from '../../components/Travel/CommuteTab';
import OutstationTab from '../../components/Travel/OutstationTab';
import StayTab from '../../components/Travel/StayTab';
import useAppStore from '../../store/appStore';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';
import './Travel.css';

const Travel = () => {
  const { userLocation: userLocationObj } = useAppStore();
  const userLocation = typeof userLocationObj === 'string' ? userLocationObj : (userLocationObj?.city || userLocationObj?.address || 'Detecting...');
  const [activeTab, setActiveTab] = useState('commute');

  const tabs = [
    { id: 'commute', label: 'Commute', icon: Car },
    { id: 'outstation', label: 'Outstation', icon: Plane },
    { id: 'stay', label: 'Stay', icon: Hotel },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'commute':
        return <CommuteTab />;
      case 'outstation':
        return <OutstationTab />;
      case 'stay':
        return <StayTab />;
      default:
        return <CommuteTab />;
    }
  };

  return (
    <div className="travel-page-container">
      <GlobalDisclaimer />
      <header className="travel-header">
        <div className="header-content">
          <h1>Travel & Compare</h1>
          <div className="location-display">
            <MapPin size={16} className="location-icon" />
            <span>{userLocation || 'Detecting Location...'}</span>
          </div>
        </div>
      </header>

      <div className="travel-tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`travel-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="travel-content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default Travel;
