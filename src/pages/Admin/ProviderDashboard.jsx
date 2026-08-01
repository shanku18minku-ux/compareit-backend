import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Server, Activity, Power, CheckCircle, XCircle } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { ProviderManager } from '../../core/providers/ProviderManager';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const { t } = useTranslation();
  const [adapters, setAdapters] = useState([]);
  const goToDashboard = useAppStore(state => state.goToDashboard);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const all = ProviderManager.getAllAdapters().map(a => a.getHealth());
    setAdapters(all);
  };

  const toggleAdapter = (name, currentStatus) => {
    ProviderManager.toggleProvider(name, !currentStatus);
    refreshData();
  };

  return (
    <div className="provider-dashboard-page">
      <div className="admin-header">
        <button className="back-btn" onClick={goToDashboard}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-title-col">
          <h2>{t('auto_provider_management_1d4e', 'Provider Management')}</h2>
          <p>{t('auto_universal_adapter_sy_f6b9', 'Universal Adapter System')}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-row">
          <div className="stat-card">
            <Server size={24} color="#3b82f6" />
            <div className="stat-info">
              <h3>{adapters.length}</h3>
              <p>{t('auto_total_adapters_599a', 'Total Adapters')}</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} color="#10b981" />
            <div className="stat-info">
              <h3>{adapters.filter(a => a.enabled).length}</h3>
              <p>{t('auto_active_4d3d', 'Active')}</p>
            </div>
          </div>
        </div>

        <h3 className="section-title">{t('auto_registered_providers_2508', 'Registered Providers')}</h3>
        
        <div className="providers-list">
          {adapters.map((adapter, idx) => (
            <div key={idx} className={`provider-card ${!adapter.enabled ? 'disabled' : ''}`}>
              <div className="provider-info">
                <h4>{adapter.name}</h4>
                <span className="module-badge">{adapter.module}</span>
              </div>
              
              <div className="provider-health">
                <Activity size={16} color={adapter.enabled ? '#10b981' : '#94a3b8'} />
                <span>{adapter.avgResponseTime} ms</span>
              </div>
              
              <button 
                className={`toggle-btn ${adapter.enabled ? 'on' : 'off'}`}
                onClick={() => toggleAdapter(adapter.name, adapter.enabled)}
              >
                <Power size={18} />
                {adapter.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
