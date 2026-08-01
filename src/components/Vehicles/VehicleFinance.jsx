import React, { useState } from 'react';
import { DollarSign, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import styles from './VehicleEcosystem.module.css';
import { vehicleFinance } from '../../services/vehicleEcosystemData';
import AffiliateRedirectModal from './AffiliateRedirectModal';
import EmptyState from '../Global/EmptyState';

const VehicleFinance = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Car Loan', 'Used Vehicle Loan', 'Insurance'];
  
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(5); // in years
  
  const filteredFinance = activeFilter === 'All' 
    ? vehicleFinance 
    : vehicleFinance.filter(f => f.category === activeFilter);

  // EMI Calculation: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEMI = () => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTenure) * 12;
    if (!p || !r || !n) return 0;
    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const totalEMI = calculateEMI();

  return (
    <div className={styles.container}>
      
      {/* EMI Calculator Section */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#2563EB" /> 
          Quick EMI Calculator
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span>Loan Amount</span>
              <span style={{ fontWeight: 'bold' }}>₹{loanAmount.toLocaleString()}</span>
            </label>
            <input 
              type="range" min="50000" max="5000000" step="10000" 
              value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} 
              style={{ width: '100%', accentColor: '#2563EB' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Interest Rate (%)</label>
              <input 
                type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Tenure (Years)</label>
              <input 
                type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </div>
          </div>
          <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#4b5563' }}>Estimated EMI:</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563EB' }}>₹{totalEMI.toLocaleString()}/mo</span>
          </div>
        </div>
      </div>
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
        {filteredFinance.length === 0 ? (
          <EmptyState 
            icon="DollarSign"
            title="No Finance Options Found"
            message="We couldn't find any options matching this category."
          />
        ) : (
          filteredFinance.map((finance) => (
            <FinanceCard key={finance.id} finance={finance} />
          ))
        )}
      </div>
    </div>
  );
};

const FinanceCard = ({ finance }) => {
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [redirectData, setRedirectData] = useState(null);

  // For loans, lowest interest rate is best. For insurance, lowest price is best.
  const isInsurance = finance.category === 'Insurance';
  const bestPlatform = finance.platforms.reduce((min, p) => {
    if (isInsurance) {
      return p.price < min.price ? p : min;
    } else {
      return p.interestRate < min.interestRate ? p : min;
    }
  }, finance.platforms[0]);

  const handleApply = (e, plat) => {
    e.stopPropagation();
    if (plat.url) {
      setRedirectData({ providerName: plat.name, targetUrl: plat.url });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={finance.image} alt={finance.title} className={styles.image} />
        <div className={styles.badgesTopRight}>
          <span className={styles.aiBadge}><Zap size={12} color="#facc15" fill="#facc15" /> {finance.aiScore}/100</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoryBrand}>
          {finance.category.toUpperCase()} • {finance.vehicleModel}
        </div>
        
        <h3 className={styles.title}>{finance.title}</h3>
        
        <div className={styles.specsRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap' }}>
            <span className={styles.rating}>⭐ {finance.rating}</span>
            <span className={styles.reviews}>({finance.reviews.toLocaleString()} reviews)</span>
          </div>
          <span className={styles.specPill}>{finance.tenure}</span>
        </div>

        <ul className={styles.featuresList}>
          {finance.features.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
        </ul>

        {bestPlatform && (
          <div className={styles.highlightBox}>
            <div className={styles.highlightIcon}>
              <CheckCircle2 size={14} color="#2563eb" />
            </div>
            <div className={styles.highlightText}>
              <strong>{bestPlatform.name}</strong> is the best recommendation.<br/>
              {isInsurance ? `Starting at ₹${bestPlatform.price}` : `Lowest Rate: ${bestPlatform.interestRate}%`}
            </div>
          </div>
        )}

        <div className={styles.bottomRow}>
          <div className={styles.priceContainer}>
            {bestPlatform && (
              <span className={styles.finalPrice}>
                {isInsurance ? `₹${bestPlatform.price.toLocaleString()}` : `${bestPlatform.interestRate}%`}
              </span>
            )}
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
              {isInsurance ? 'Per Year' : 'Starting Rate'}
            </div>
          </div>
          
          <button 
            className={styles.expandSitesBtn}
            onClick={() => setShowPlatforms(!showPlatforms)}
          >
            {finance.platforms.length} Providers {showPlatforms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showPlatforms && (
          <div className={styles.comparisonsListWrap}>
            <div className={styles.comparisonList}>
              {finance.platforms.map((plat, index) => {
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
                        {isInsurance ? `Claim Ratio: ${plat.claimRatio}` : `Fees: ₹${plat.processingFee} | Approval: ${plat.approvalTime}`}
                      </div>
                    </div>
                    <div className={styles.platRight}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span className={`${styles.platformPrice} ${isBest ? styles.bestPrice : ''}`}>
                          {isInsurance ? `₹${plat.price.toLocaleString()}` : `${plat.interestRate}%`}
                        </span>
                        <button 
                          onClick={(e) => handleApply(e, plat)} 
                          className={styles.rowBuyBtn}
                        >
                          Apply <ExternalLink size={12} style={{ marginLeft: '4px' }} />
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

export default VehicleFinance;
