import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, Pill, Activity } from 'lucide-react';
import DoctorTab from '../../components/Health/DoctorTab';
import MedicineTab from '../../components/Health/MedicineTab';
import ServicesTab from '../../components/Health/ServicesTab';
import useAppStore from '../../store/appStore';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';
import './Health.css';

const Health = () => {
  const [activeTab, setActiveTab] = useState('doctor');
  const [searchQuery, setSearchQuery] = useState('');
  const userLocationObj = useAppStore(state => state.userLocation);
  const userLocation = typeof userLocationObj === 'string' ? userLocationObj : (userLocationObj?.city || userLocationObj?.address || 'New Delhi, Delhi');

  return (
    <div className="health-page">
      <GlobalDisclaimer />
      <div className="health-header">
        <div className="location-bar">
          <MapPin size={16} className="text-blue-500" />
          <span>{userLocation}</span>
        </div>
        
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search doctors, medicines, or services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="health-tabs">
          <button 
            className={`tab-btn ${activeTab === 'doctor' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            <Stethoscope size={18} />
            <span>Doctor</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'medicine' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicine')}
          >
            <Pill size={18} />
            <span>Medicine</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Activity size={18} />
            <span>Services</span>
          </button>
        </div>
      </div>

      <div className="health-content">
        {activeTab === 'doctor' && <DoctorTab searchQuery={searchQuery} />}
        {activeTab === 'medicine' && <MedicineTab searchQuery={searchQuery} />}
        {activeTab === 'services' && <ServicesTab searchQuery={searchQuery} />}
      </div>
    </div>
  );
};

export default Health;
