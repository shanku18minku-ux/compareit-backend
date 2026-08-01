import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { X, ArrowDown, TrendingDown } from 'lucide-react';
import { calculatePriceBreakdown } from '../../services/couponService';
import styles from './PriceBreakdown.module.css';

const PriceBreakdown = ({ coupon, onClose }) => {
  const { t } = useTranslation();
  const [originalPrice, setOriginalPrice] = useState(1000);
  const [breakdown, setBreakdown] = useState(null);
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    // Generate breakdown whenever price changes
    const result = calculatePriceBreakdown(coupon, originalPrice);
    setBreakdown(result);
    setVisibleSteps(0);
  }, [coupon, originalPrice]);

  useEffect(() => {
    if (!breakdown) return;
    
    // Animate steps
    const timer = setInterval(() => {
      setVisibleSteps(prev => {
        if (prev < breakdown.steps.length) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [breakdown]);

  const handlePriceChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setOriginalPrice(val);
  };

  if (!breakdown) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>{t('auto_calculate_savings_f5b9', 'Calculate Savings')}</h2>
        <p className={styles.subtitle}>{coupon.title}</p>

        <div className={styles.inputGroup}>
          <label htmlFor="priceInput">Enter Original Price (₹)</label>
          <div className={styles.inputWrapper}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              id="priceInput"
              type="number"
              value={originalPrice || ''}
              onChange={handlePriceChange}
              className={styles.priceInput}
              min="1"
            />
          </div>
        </div>

        <div className={styles.ladderContainer}>
          <div className={styles.stepRow}>
            <span className={styles.stepLabel}>{t('auto_original_price_8bd1', 'Original Price')}</span>
            <span className={styles.stepAmount}>₹{originalPrice.toLocaleString()}</span>
          </div>

          {breakdown.steps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.animatedStep} ${index < visibleSteps ? styles.visible : ''}`}
            >
              <div className={styles.arrowConnector}>
                <ArrowDown size={14} />
              </div>
              
              {step.type === 'deduction' && (
                <div className={styles.stepRow}>
                  <span className={styles.deductionLabel}>{step.label}</span>
                  <span className={styles.deductionAmount}>-₹{step.amount.toLocaleString()}</span>
                </div>
              )}
              
              {step.type === 'subtotal' && (
                <div className={`${styles.stepRow} ${styles.subtotalRow}`}>
                  <span className={styles.subtotalLabel}>{step.label}</span>
                  <span className={styles.subtotalAmount}>₹{step.amount.toLocaleString()}</span>
                </div>
              )}
            </div>
          ))}

          <div 
            className={`${styles.finalSection} ${visibleSteps >= breakdown.steps.length ? styles.visible : ''}`}
          >
            <div className={styles.finalRow}>
              <span className={styles.finalLabel}>{t('auto_final_effective_pric_583a', 'Final Effective Price')}</span>
              <span className={styles.finalAmount}>₹{breakdown.finalPrice.toLocaleString()}</span>
            </div>
            
            <div className={styles.savingsCard}>
              <TrendingDown size={24} className={styles.savingsIcon} />
              <div className={styles.savingsInfo}>
                <span className={styles.savingsLabel}>{t('auto_total_savings_e62d', 'Total Savings')}</span>
                <div className={styles.savingsValueContainer}>
                  <span className={styles.savingsValue}>₹{breakdown.totalSavings.toLocaleString()}</span>
                  <span className={styles.savingsPercentage}>({breakdown.savingsPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
