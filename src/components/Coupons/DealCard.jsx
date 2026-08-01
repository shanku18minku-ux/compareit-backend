import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Calculator, Copy, Check } from 'lucide-react';
import styles from './DealCard.module.css';

const DealCard = ({ coupon, onCalculate, isHighlighted }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle2 size={14} className={styles.verifiedIcon} />;
      case 'unverified': return <AlertTriangle size={14} className={styles.unverifiedIcon} />;
      case 'expired': return <XCircle size={14} className={styles.expiredIcon} />;
      default: return null;
    }
  };

  return (
    <div className={`${styles.card} ${isHighlighted ? styles.highlightedCard : ''}`}>
      {isHighlighted && (
        <div className={styles.aiBadge}>
          <span>AI Score 99</span>
        </div>
      )}
      
      <div className={styles.cardHeader}>
        <div className={styles.platformInfo}>
          <span className={styles.platformLogo}>{coupon.platformLogo || '🛍️'}</span>
          <span className={styles.platformName}>{coupon.platformName || 'Store'}</span>
        </div>
        <div className={styles.verificationBadge}>
          {getVerificationIcon(coupon.verificationStatus || 'verified')}
          <span className={`${styles.verificationText} ${styles[coupon.verificationStatus || 'verified']}`}>
            {coupon.verificationStatus ? coupon.verificationStatus.charAt(0).toUpperCase() + coupon.verificationStatus.slice(1) : 'Verified'}
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.offerTitle}>{coupon.title || 'Special Offer'}</h3>
        <div className={styles.discountBadge}>
          {coupon.discountBadge || 'DISCOUNT'}
        </div>

        <div className={styles.codeContainer}>
          {coupon.code ? (
            <button 
              className={`${styles.codePill} ${copied ? styles.copied : ''}`}
              onClick={(e) => { e.stopPropagation(); handleCopy(coupon.code); }}
            >
              <span className={styles.codeText}>{coupon.code}</span>
              <span className={styles.copyAction}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          ) : (
            <div className={styles.autoApplyBadge}>
              <span>⚡ Auto Apply</span>
            </div>
          )}
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.successRate}>
            <div className={styles.progressBarBg}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${coupon.successRate || 85}%` }}
              ></div>
            </div>
            <span className={styles.successText}>{coupon.successRate || 85}% Success</span>
          </div>
          <span className={styles.lastWorked}>{coupon.lastWorked || '✓ Worked recently'}</span>
        </div>
        
        {coupon.expiryDate && (
          <div className={styles.expiryDate}>
            Expires: {coupon.expiryDate}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.calculateBtn} onClick={onCalculate}>
          <Calculator size={16} />
          <span>Calculate Savings</span>
        </button>
      </div>
    </div>
  );
};

export default DealCard;
