import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import styles from './VehicleEcosystem.module.css';
import { vehicleRentals } from '../../services/vehicleEcosystemData';
import AffiliateRedirectModal from './AffiliateRedirectModal';

const VehicleRentals = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Self-Drive Cars', 'Bike Rentals'];
  
  const filteredRentals = activeFilter === 'All' 
    ? vehicleRentals 
    : vehicleRentals.filter(r => r.category === activeFilter);

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
        {filteredRentals.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

const RentalCard = ({ rental }) => {
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [redirectData, setRedirectData] = useState(null);

  // Consider both price and deposit for best platform, simplified to lowest price
  const bestPlatform = rental.platforms.reduce((min, p) => p.price < min.price ? p : min, rental.platforms[0]);

  const handleBook = (e, plat) => {
    e.stopPropagation();
    if (plat.url) {
      setRedirectData({ providerName: plat.name, targetUrl: plat.url });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={rental.image} alt={rental.title} className={styles.image} />
        <div className={styles.badgesTopRight}>
          <span className={styles.aiBadge}><Zap size={12} color="#facc15" fill="#facc15" /> {rental.aiScore}/100</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoryBrand}>
          {rental.category.toUpperCase()} • {rental.type}
        </div>
        
        <h3 className={styles.title}>{rental.title}</h3>
        
        <div className={styles.specsRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap' }}>
            <span className={styles.rating}>⭐ {rental.rating}</span>
            <span className={styles.reviews}>({rental.reviews.toLocaleString()} reviews)</span>
          </div>
          <span className={styles.specPill}>{rental.fuelType}</span>
          <span className={styles.specPill}>{rental.transmission}</span>
        </div>

        <div className={styles.featuresList} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <div><strong>Incl:</strong> {rental.includedKm}</div>
          <div><strong>Extra:</strong> {rental.extraKmCharge}</div>
        </div>

        {bestPlatform && (
          <div className={styles.highlightBox}>
            <div className={styles.highlightIcon}>
              <CheckCircle2 size={14} color="#2563eb" />
            </div>
            <div className={styles.highlightText}>
              <strong>{bestPlatform.name}</strong> has the most economical rental.<br/>
              Security Deposit: ₹{bestPlatform.deposit.toLocaleString()}
            </div>
          </div>
        )}

        <div className={styles.bottomRow}>
          <div className={styles.priceContainer}>
            {bestPlatform && (
              <span className={styles.finalPrice}>₹{bestPlatform.price.toLocaleString()}</span>
            )}
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t('auto_per_day_4bbf', 'Per Day')}</div>
          </div>
          
          <button 
            className={styles.expandSitesBtn}
            onClick={() => setShowPlatforms(!showPlatforms)}
          >
            {rental.platforms.length} Providers {showPlatforms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showPlatforms && (
          <div className={styles.comparisonsListWrap}>
            <div className={styles.comparisonList}>
              {rental.platforms.map((plat, index) => {
                const isBest = plat.name === bestPlatform?.name;
                return (
                  <div key={index} className={`${styles.comparisonItem} ${isBest ? styles.bestPlatRow : ''}`}>
                    <div className={styles.platLeft}>
                      <span className={styles.platform}>{plat.name}</span>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {isBest && <span className={styles.bestPriceTag}>✨ AI Recommended</span>}
                        {plat.isCertified && <span className={styles.certTag}>✓ Verified</span>}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                        Deposit: ₹{plat.deposit}
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

export default VehicleRentals;
