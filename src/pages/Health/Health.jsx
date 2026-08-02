import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, Pill, Activity, Leaf, ShieldPlus, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DoctorTab from '../../components/Health/DoctorTab';
import MedicineTab from '../../components/Health/MedicineTab';
import ServicesTab from '../../components/Health/ServicesTab';
import SupplementsTab from '../../components/Health/SupplementsTab';
import DevicesTab from '../../components/Health/DevicesTab';
import HomeCareTab from '../../components/Health/HomeCareTab';
import useAppStore from '../../store/appStore';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';
import './Health.css';

const Health = () => {
  const { t } = useTranslation();
  const activeTab = useAppStore(state => state.activeHealthTab);
  const setActiveTab = useAppStore(state => state.setActiveHealthTab);
  const searchQuery = useAppStore(state => state.healthSearchQuery);
  const setSearchQuery = useAppStore(state => state.setHealthSearchQuery);
  
  const userLocationObj = useAppStore(state => state.userLocation);
  const userLocation = typeof userLocationObj === 'string' ? userLocationObj : (userLocationObj?.address || userLocationObj?.city || 'Detecting...');

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
            placeholder={t('health_search_placeholder', 'Search doctors, medicines, or services...')}
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
            <span>{t('health_tab_doctor', 'Doctor')}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'medicine' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicine')}
          >
            <Pill size={18} />
            <span>{t('health_tab_medicine', 'Medicine')}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Activity size={18} />
            <span>{t('health_tab_services', 'Services')}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'supplements' ? 'active' : ''}`}
            onClick={() => setActiveTab('supplements')}
          >
            <Leaf size={18} />
            <span>{t('health_tab_supplements', 'Supplements')}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            <ShieldPlus size={18} />
            <span>{t('health_tab_devices', 'Devices')}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'homecare' ? 'active' : ''}`}
            onClick={() => setActiveTab('homecare')}
          >
            <Home size={18} />
            <span>{t('health_tab_homecare', 'Home Care')}</span>
          </button>
        </div>
      </div>

      <div className="health-content">
        {activeTab === 'doctor' && <DoctorTab searchQuery={searchQuery} />}
        {activeTab === 'medicine' && <MedicineTab searchQuery={searchQuery} />}
        {activeTab === 'services' && <ServicesTab searchQuery={searchQuery} />}
        {activeTab === 'supplements' && <SupplementsTab searchQuery={searchQuery} />}
        {activeTab === 'devices' && <DevicesTab searchQuery={searchQuery} />}
        {activeTab === 'homecare' && <HomeCareTab searchQuery={searchQuery} />}
      </div>
    </div>
  );
};

export default Health;
