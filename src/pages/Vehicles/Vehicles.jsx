import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Car, 
  Gavel, 
  Wrench, 
  Calendar, 
  DollarSign,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import './Vehicles.css';

import VehicleMarketplace from '../../components/Vehicles/VehicleMarketplace';
import VehicleAuction from '../../components/Vehicles/VehicleAuction';
import VehicleServices from '../../components/Vehicles/VehicleServices';
import VehicleRentals from '../../components/Vehicles/VehicleRentals';
import VehicleFinance from '../../components/Vehicles/VehicleFinance';
import useAppStore from '../../store/appStore';

export default function Vehicles() {
  const { goToDashboard } = useAppStore();
  const activeTab = useAppStore(state => state.activeVehicleTab);
  const setActiveTab = useAppStore(state => state.setActiveVehicleTab);
  const searchQuery = useAppStore(state => state.vehicleSearchQuery);
  const setSearchQuery = useAppStore(state => state.setVehicleSearchQuery);

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: Car },
    { id: 'auctions', label: 'Auctions', icon: Gavel },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'rentals', label: 'Rentals', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <VehicleMarketplace searchQuery={searchQuery} />;
      case 'auctions':
        return <VehicleAuction searchQuery={searchQuery} />;
      case 'services':
        return <VehicleServices searchQuery={searchQuery} />;
      case 'rentals':
        return <VehicleRentals searchQuery={searchQuery} />;
      case 'finance':
        return <VehicleFinance searchQuery={searchQuery} />;
      default:
        return <VehicleMarketplace searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="vehicles-page">
      {/* Header */}
      <header className="vehicles-header">
        <button onClick={goToDashboard} className="back-button" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="header-title">{t('auto_vehicle_super_module_80d1', 'Vehicle Super Module')}</h1>
      </header>

      {/* Official API / Disclaimer Banner */}
      <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <ShieldAlert size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>
          <strong>Verified Discovery Engine:</strong> CompareIt partners with authorized platforms via official APIs & deep links. All bookings, purchases, and financing are securely processed on the official partner platforms.
        </p>
      </div>

      {/* AI Search Section */}
      <section className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="ai-search-input"
            placeholder={t('auto_ai_search_e_g_swift__31c4', "AI Search: e.g. 'Swift under 5 lakh'")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Sparkles size={18} className="ai-sparkle" />
        </div>
      </section>

      {/* Sub-tabs Navigation */}
      <nav className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content Area */}
      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  );
}
