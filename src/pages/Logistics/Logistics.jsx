import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Package, Search, Zap, Tag, ShieldCheck } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import useAppStore from '../../store/appStore';
import LogisticsCard from '../../components/Logistics/LogisticsCard';
import { logisticsProviders } from '../../services/mockData';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';
import './Logistics.css';

const Logistics = () => {
  const { t } = useTranslation();
  const { goToDashboard, setGlobalRedirectData } = useAppStore();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [weight, setWeight] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [providers, setProviders] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Auto-coupons list
  const availableCoupons = [
    { code: 'SHIP50', discount: 50, type: 'flat', desc: 'Flat ₹50 OFF' },
    { code: 'FIRSTSHIP', discount: 20, type: 'percent', max: 100, desc: '20% OFF for new users' },
    { code: 'DELHIVERY25', discount: 25, type: 'percent', max: 150, desc: '25% OFF on Delhivery' }
  ];

  const calculateDistanceFactor = (p1, p2) => {
    // Fake distance factor based on pincode difference
    if (!p1 || !p2) return 1;
    const diff = Math.abs(parseInt(p1) - parseInt(p2));
    if (diff > 500000) return 2.5; // cross country
    if (diff > 100000) return 1.5; // inter-state
    if (diff > 1000) return 1.2; // intra-state
    return 1; // local
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (pickup && drop && weight) {
      const w = parseFloat(weight) || 1;
      const distFactor = calculateDistanceFactor(pickup, drop);
      
      const calculatedProviders = logisticsProviders.map(p => {
        // Base rate + weight factor * distance factor
        let baseRate = p.price || 50;
        let finalCost = baseRate + (w * 15 * distFactor);
        if (p.type === 'air') finalCost *= 1.8;
        if (p.type === 'hyperlocal') finalCost = baseRate + (w * 5) + (distFactor * 20);

        return {
          ...p,
          calculatedCost: Math.round(finalCost),
          originalCost: Math.round(finalCost),
        };
      });

      // Sort by cheapest
      calculatedProviders.sort((a, b) => a.calculatedCost - b.calculatedCost);
      setProviders(calculatedProviders);
      setHasSearched(true);
      
      // Auto apply best coupon
      handleApplyCoupon('FIRSTSHIP', calculatedProviders);
    }
  };

  const handleApplyCoupon = (code, currentProviders = providers) => {
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode(code);
      const updatedProviders = currentProviders.map(p => {
        let discountVal = 0;
        if (coupon.type === 'flat') {
          discountVal = coupon.discount;
        } else if (coupon.type === 'percent') {
          discountVal = (p.originalCost * coupon.discount) / 100;
          if (coupon.max) discountVal = Math.min(discountVal, coupon.max);
        }
        return {
          ...p,
          calculatedCost: Math.max(0, p.originalCost - discountVal),
          discountAmount: Math.round(discountVal)
        };
      });
      // Re-sort
      updatedProviders.sort((a, b) => a.calculatedCost - b.calculatedCost);
      setProviders(updatedProviders);
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const handleBook = (provider) => {
    setGlobalRedirectData({ 
      providerName: provider.name || 'Logistics Provider', 
      targetUrl: provider.url || 'https://www.delhivery.com/' 
    });
  };

  const bestProvider = providers.length > 0 ? providers[0].name : "Delhivery";

  return (
    <div className="logistics-page">
      <GlobalDisclaimer />
      <header className="logistics-header">
        <button className="back-btn" onClick={goToDashboard}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">{t('auto_courier_logistics_314e', 'Courier & Logistics')}</h1>
      </header>

      <div className="logistics-content">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <MapPin className="input-icon" size={20} />
              <div className="input-field">
                <label>Pickup From (Pincode)</label>
                <input 
                  type="text" 
                  placeholder={t('auto_e_g_400001_842e', 'e.g. 400001')} 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <MapPin className="input-icon" size={20} />
              <div className="input-field">
                <label>Drop To (Pincode)</label>
                <input 
                  type="text" 
                  placeholder={t('auto_e_g_110001_af26', 'e.g. 110001')} 
                  value={drop} 
                  onChange={(e) => setDrop(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <Package className="input-icon" size={20} />
              <div className="input-field">
                <label>Package Weight (kg)</label>
                <input 
                  type="number" 
                  placeholder={t('auto_e_g_2_5_213c', 'e.g. 2.5')} 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  step="0.1"
                  min="0.1"
                />
              </div>
            </div>

            <button type="submit" className="search-btn">
              <Search size={18} />
              <span>{t('auto_compare_rates_d906', 'Compare Rates')}</span>
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className="results-section">
            <div className="logistics-coupon-box">
              <div className="lc-coupon-input-wrap">
                <Tag size={16} color="#64748b" />
                <input 
                  type="text" 
                  placeholder={t('auto_have_a_promo_code_3111', 'Have a promo code?')} 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button onClick={() => handleApplyCoupon(couponCode)}>{t('auto_apply_9639', 'Apply')}</button>
              </div>
              {appliedCoupon && (
                <div className="lc-applied-success">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>'{appliedCoupon.code}' applied! {appliedCoupon.desc}</span>
                </div>
              )}
              <div className="lc-auto-coupons">
                <span>Available Offers:</span>
                {availableCoupons.map(c => (
                  <span key={c.code} className="lc-mini-coupon" onClick={() => handleApplyCoupon(c.code)}>
                    {c.code}
                  </span>
                ))}
              </div>
            </div>

            <div className="ai-recommendation">
              <Zap size={20} className="ai-icon" />
              <div className="ai-text">
                <strong>AI Suggestion:</strong> {bestProvider} is the cheapest option at ₹{providers[0]?.calculatedCost}.
              </div>
            </div>

            <div className="providers-list">
              {providers.map((provider, index) => (
                <LogisticsCard 
                  key={index} 
                  provider={provider} 
                  onBook={handleBook} 
                  isBest={index === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logistics;
