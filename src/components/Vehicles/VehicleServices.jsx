import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Wrench, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import styles from './VehicleEcosystem.module.css';
import { vehicleServices } from '../../services/vehicleEcosystemData';
import AffiliateRedirectModal from './AffiliateRedirectModal';

const VehicleServices = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Car Service', 'Bike Service', 'Car Wash & Detailing'];
  
  const filteredServices = activeFilter === 'All' 
    ? vehicleServices 
    : vehicleServices.filter(s => s.category === activeFilter);

  return (
    <div className={styles.container}>
      <div className={styles.filtersSection}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterChip} ${activeFilter === cat ? styles.active : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

const ServiceCard = ({ service }) => {
  const { t } = useTranslation();
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [redirectData, setRedirectData] = useState(null);

  const bestPlatform = service.platforms.reduce((min, p) => p.price < min.price ? p : min, service.platforms[0]);

  const handleBook = (e, plat) => {
    e.stopPropagation();
    if (plat.url) {
      setRedirectData({ providerName: plat.name, targetUrl: plat.url });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={service.image} alt={service.title} className={styles.image} />
        <div className={styles.badgesTopRight}>
          <span className={styles.aiBadge}><Zap size={12} color="#facc15" fill="#facc15" /> {service.aiScore}/100</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoryBrand}>
          {service.category.toUpperCase()} • {service.vehicleModel}
        </div>
        
        <h3 className={styles.title}>{service.title}</h3>
        
        <div className={styles.specsRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap' }}>
            <span className={styles.rating}>⭐ {service.rating}</span>
            <span className={styles.reviews}>({service.reviews.toLocaleString()} reviews)</span>
          </div>
          <span className={styles.specPill}>{service.kilometers}</span>
        </div>

        <ul className={styles.featuresList}>
          {service.features.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
          {service.features.length > 3 && <li>+ {service.features.length - 3} more</li>}
        </ul>

        {bestPlatform && (
          <div className={styles.highlightBox}>
            <div className={styles.highlightIcon}>
              <CheckCircle2 size={14} color="#2563eb" />
            </div>
            <div className={styles.highlightText}>
              <strong>{bestPlatform.name}</strong> is the most economical.<br/>
              {bestPlatform.hasDoorstep ? 'Includes Doorstep Service' : 'Visit Workshop'}
            </div>
          </div>
        )}

        <div className={styles.bottomRow}>
          <div className={styles.priceContainer}>
            {bestPlatform && (
              <span className={styles.finalPrice}>₹{bestPlatform.price.toLocaleString()}</span>
            )}
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t('auto_starting_price_b028', 'Starting Price')}</div>
          </div>
          
          <button 
            className={styles.expandSitesBtn}
            onClick={() => setShowPlatforms(!showPlatforms)}
          >
            {service.platforms.length} Providers {showPlatforms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showPlatforms && (
          <div className={styles.comparisonsListWrap}>
            <div className={styles.comparisonList}>
              {service.platforms.map((plat, index) => {
                const isBest = plat.name === bestPlatform?.name;
                return (
                  <div key={index} className={`${styles.comparisonItem} ${isBest ? styles.bestPlatRow : ''}`}>
                    <div className={styles.platLeft}>
                      <span className={styles.platform}>{plat.name}</span>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {isBest && <span className={styles.bestPriceTag}>✨ AI Recommended</span>}
                        {plat.isCertified && <span className={styles.certTag}>✓ Certified</span>}
                      </div>
                    </div>
                    <div className={styles.platRight}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span className={`${styles.platformPrice} ${isBest ? styles.bestPrice : ''}`}>
                          ₹{plat.price.toLocaleString()}
                        </span>
                        <button 
                          onClick={(e) => handleBook(e, plat)} 
                          className={styles.rowBuyBtn}
                        >
                          Book <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <AffiliateRedirectModal 
        isOpen={!!redirectData}
        providerName={redirectData?.providerName}
        targetUrl={redirectData?.targetUrl}
        onClose={() => setRedirectData(null)}
      />
    </div>
  );
};

export default VehicleServices;
