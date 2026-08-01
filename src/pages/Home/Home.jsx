import React, { useEffect, useState } from 'react';
import { Search, Bell, User, MapPin, Mic, Camera, TrendingUp, Zap, Tag, ChevronRight, Star, Clock, ShieldCheck, ArrowDown, ArrowUp, Flame, Ticket, Sparkles, Package, HelpCircle } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { useApi } from '../../services/api';
import { Browser } from '@capacitor/browser';
import UniversalSearch from '../../components/Core/UniversalSearch';
import appLogo from '../../assets/logo.png';
import './Home.css';

// Upcoming sales data
const upcomingSalesData = [
  { name: 'Prime Day', date: '2025-07-20', daysLeft: 12, color: '#FF9900', icon: '🛒' },
  { name: 'Big Billion Days', date: '2025-10-10', daysLeft: 94, color: '#FF6161', icon: '🎯' },
  { name: 'Great Indian Festival', date: '2025-10-10', daysLeft: 94, color: '#FF9500', icon: '🎪' },
  { name: 'Diwali Sale', date: '2025-10-20', daysLeft: 104, color: '#FFD700', icon: '✨' },
];

// Price heatmap data
const heatmapData = [
  { category: '📱 Smartphones', trend: 'down', savings: '↓ 18%', color: '#22c55e' },
  { category: '💻 Laptops', trend: 'up', savings: '↑ 5%', color: '#ef4444' },
  { category: '📺 TVs', trend: 'down', savings: '↓ 22%', color: '#22c55e' },
  { category: '👟 Footwear', trend: 'down', savings: '↓ 35%', color: '#22c55e' },
  { category: '🛋 Furniture', trend: 'up', savings: '↑ 8%', color: '#ef4444' },
  { category: '🍳 Kitchen', trend: 'down', savings: '↓ 12%', color: '#22c55e' },
  { category: '💄 Beauty', trend: 'down', savings: '↓ 20%', color: '#22c55e' },
  { category: '🎮 Gaming', trend: 'up', savings: '↑ 3%', color: '#f59e0b' },
];

// Second-hand platforms
const secondHandPlatforms = [
  { name: 'OLX', logo: '🟡', url: 'https://olx.in', color: '#6ABA00' },
  { name: 'Cashify', logo: '🔵', url: 'https://cashify.in', color: '#2563EB' },
  { name: 'Amazon Renewed', logo: '🟠', url: 'https://amazon.in/renewed', color: '#FF9900' },
  { name: 'Quikr', logo: '🔴', url: 'https://quikr.com', color: '#E63946' },
  { name: 'Flipkart 2GUD', logo: '🟡', url: 'https://2gud.com', color: '#FFD700' },
];

const Home = () => {
  const { user, totalSaved, cashbackEarned, couponsUsed, notifications, userLocation, setActiveTab, goToPLP, setSearchQuery, addRecentSearch, goToCoupons, goToLogistics } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getTrendingDeals } = useApi();

  useEffect(() => {
    setMounted(true);
    getTrendingDeals().then(res => {
      setDeals(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query);
    setSearchQuery(query);
    goToPLP(query);
  };

  const quickCategories = [
    { icon: '📱', label: 'Phones', q: 'smartphones' },
    { icon: '👗', label: 'Fashion', q: 'fashion clothing' },
    { icon: '💊', label: 'Health', tab: 'health' },
    { icon: '🍕', label: 'Food', tab: 'food' },
    { icon: '✈️', label: 'Travel', tab: 'travel' },
    { icon: '📚', label: 'Learn', tab: 'education' },
    { icon: '💻', label: 'Laptops', q: 'laptops' },
    { icon: '🏠', label: 'Home', q: 'home appliances' },
  ];

  return (
    <div className={`home-page ${mounted ? 'fade-in' : ''}`}>
      {/* Header */}
      <header className="home-header">
        <div className="header-top">
          <div className="logo-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div className="location-badge" onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <MapPin size={18} color="#ef4444" />
              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>{userLocation?.city || 'Delhi'}</span>
              <ChevronRight size={16} color="#64748b" />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '22px' }}>Deliver to your location</span>
          </div>
          <div className="header-actions">
            <button className="icon-btn support-btn" onClick={() => useAppStore.getState().setIsSupportOpen(true)}>
              <HelpCircle size={22} color="#2563EB" />
            </button>
            <button className="icon-btn bell-btn">
              <Bell size={22} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notif-dot">{notifications.filter(n => !n.read).length}</span>
              )}
            </button>
            <button className="icon-btn avatar-btn" onClick={() => useAppStore.getState().setSettingsOpen(true)}>
              {user?.photoURL || (user?.user_metadata?.avatar_url)
                ? <img src={user.photoURL || user.user_metadata?.avatar_url} alt="User" className="user-avatar-img" />
                : <User size={22} />}
            </button>
          </div>
        </div>

        {/* Universal Search */}
        <div className="home-search-container" style={{ marginTop: '12px' }}>
          <UniversalSearch />
        </div>
      </header>




      {/* Upcoming Sales Countdown */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title"><Flame size={18} color="#ef4444" /> Upcoming Sales</h2>
        </div>
        <div className="sales-scroll">
          {upcomingSalesData.map((sale, i) => (
            <div key={i} className="sale-card" style={{ borderColor: sale.color }}>
              <div className="sale-icon">{sale.icon}</div>
              <div className="sale-name">{sale.name}</div>
              <div className="sale-countdown" style={{ color: sale.color }}>
                <Clock size={12} />
                <span>{sale.daysLeft}d left</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎟️ Deals & Coupons Entry Point */}
      <section className="section">
        <div
          className="coupons-hero-banner"
          onClick={goToCoupons}
          role="button"
          tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 50%, #7c3aed 100%)',
            borderRadius: '20px',
            padding: '20px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background decorative circles */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px' }}>🎟️</span>
                <span style={{ color: '#a5b4fc', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>AI-Powered</span>
              </div>
              <h3 style={{ color: '#fff', margin: '0 0 4px', fontSize: '20px', fontWeight: '800', lineHeight: 1.2 }}>Deals & Coupons</h3>
              <p style={{ color: '#c7d2fe', margin: '0 0 14px', fontSize: '13px' }}>100+ verified codes from Amazon, Swiggy, Zomato, MakeMyTrip & more</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['🛒 Shopping', '🍕 Food', '✈️ Travel', '💊 Medicine'].map((tag, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#e0e7ff', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                <Sparkles size={28} color="#fbbf24" />
              </div>
              <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '700' }}>Explore →</div>
            </div>
          </div>

          {/* Savings strip */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: '16px' }}>
            <div style={{ color: '#fff', fontSize: '12px' }}><span style={{ fontWeight: '800', fontSize: '16px' }}>₹{totalSaved.toLocaleString()}</span><br /><span style={{ color: '#a5b4fc' }}>Total Saved</span></div>
            <div style={{ color: '#fff', fontSize: '12px' }}><span style={{ fontWeight: '800', fontSize: '16px' }}>{couponsUsed}</span><br /><span style={{ color: '#a5b4fc' }}>Coupons Used</span></div>
            <div style={{ color: '#fff', fontSize: '12px' }}><span style={{ fontWeight: '800', fontSize: '16px' }}>100+</span><br /><span style={{ color: '#a5b4fc' }}>Live Codes</span></div>
          </div>
        </div>
      </section>


      {/* Vehicle Super Module Entry Point */}
      <section className="section">
        <div
          className="vehicle-hero-banner"
          onClick={() => useAppStore.getState().goToVehicles()}
          role="button"
          tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            borderRadius: '20px',
            padding: '20px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '10px'
          }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px' }}>🚗</span>
                <span style={{ color: '#93c5fd', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Discovery Engine</span>
              </div>
              <h3 style={{ color: '#fff', margin: '0 0 4px', fontSize: '20px', fontWeight: '800', lineHeight: 1.2 }}>Vehicle Super Module</h3>
              <p style={{ color: '#cbd5e1', margin: '0 0 14px', fontSize: '13px' }}>Buy, Sell, Auction & Compare</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Marketplace', 'Auctions', 'Rentals', 'Services'].map((tag, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#f1f5f9', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '28px' }}>🏎️</span>
              </div>
              <div style={{ color: '#93c5fd', fontSize: '12px', fontWeight: '700' }}>Explore →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Courier Entry Point */}
      <section className="section">
        <div
          className="logistics-hero-banner"
          onClick={goToLogistics}
          role="button"
          tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
            borderRadius: '20px',
            padding: '20px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px' }}>📦</span>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Compare Prices</span>
              </div>
              <h3 style={{ color: '#fff', margin: '0 0 4px', fontSize: '20px', fontWeight: '800', lineHeight: 1.2 }}>Courier & Logistics</h3>
              <p style={{ color: '#cbd5e1', margin: '0 0 14px', fontSize: '13px' }}>Delhivery, Blue Dart, Porter & more</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Hyperlocal', 'Intercity', 'B2B', 'Same-day'].map((tag, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#f1f5f9', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                <Package size={28} color="#38bdf8" />
              </div>
              <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '700' }}>Book Now →</div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: '20px' }} />
    </div>
  );
};

export default Home;
