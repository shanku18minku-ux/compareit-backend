import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Tag, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import useAppStore from '../../store/appStore';
import './CouponManager.css';

const CouponManager = ({ itemId, validCoupons = [], onCouponApplied }) => {
  const { t } = useTranslation();
  const { couponMode, setCouponMode, appliedManualCoupons, setManualCoupon } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const currentManualCoupon = appliedManualCoupons[itemId] || '';

  const handleApply = () => {
    if (!inputValue.trim()) return;
    const code = inputValue.trim().toUpperCase();
    
    // Check if it's a valid coupon from the passed list
    const isValid = validCoupons.includes(code) || code === 'SAVE20' || code === 'FIRST100';
    
    if (isValid) {
      setManualCoupon(itemId, code);
      setError('');
      if (onCouponApplied) onCouponApplied(code);
      setInputValue('');
    } else {
      setError('Invalid coupon code');
    }
  };

  return (
    <div className="coupon-manager-container">
      <div className="coupon-toggle-wrapper">
        <button 
          className={`coupon-toggle-btn ${couponMode === 'auto' ? 'active' : ''}`}
          onClick={() => { setCouponMode('auto'); setError(''); }}
        >
          <Sparkles size={14} /> Auto Apply
        </button>
        <button 
          className={`coupon-toggle-btn ${couponMode === 'manual' ? 'active' : ''}`}
          onClick={() => setCouponMode('manual')}
        >
          <Tag size={14} /> Manual Code
        </button>
      </div>

      {couponMode === 'auto' ? (
        <div className="auto-coupon-state">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{t('auto_best_coupons_automat_f7fa', 'Best coupons automatically applied')}</span>
        </div>
      ) : (
        <div className="manual-coupon-state">
          <div className="manual-input-row">
            <input 
              type="text" 
              className="coupon-input"
              placeholder={t('auto_enter_code_e_g_save2_2015', 'Enter code (e.g. SAVE20)')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            />
            <button className="coupon-apply-btn" onClick={handleApply}>{t('auto_apply_9639', 'Apply')}</button>
          </div>
          
          {error && <div className="coupon-error"><AlertCircle size={14} /> {error}</div>}
          
          {currentManualCoupon && !error && (
            <div className="coupon-success">
              <CheckCircle2 size={14} /> Code <strong>{currentManualCoupon}</strong> applied!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponManager;
