import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { auctionVehicles } from '../../services/vehicleMockData';
import useAppStore from '../../store/appStore';
import './VehicleAuction.css';

const VehicleAuctionCard = ({ vehicle }) => {
  const { t } = useTranslation();
  const { setGlobalRedirectData } = useAppStore();
  
  // Support both fallback structure and real mock data structure
  const name = vehicle.name || (vehicle.brand ? `${vehicle.year} ${vehicle.brand} ${vehicle.model}` : 'Vehicle');
  const provider = vehicle.provider || vehicle.auctionProvider || 'Bank Repo';
  const estValue = vehicle.estimatedValue || (vehicle.marketValue ? `₹${(vehicle.marketValue/100000).toFixed(1)} Lakh` : '₹6 Lakh');
  const dealStatus = vehicle.dealStatus || vehicle.aiRecommendation || 'Good Deal!';
  
  // Handle currentBid and reservePrice formatting if they are numbers
  const formatPrice = (val) => {
    if (typeof val === 'number') return `₹${val.toLocaleString()}`;
    return val;
  };
  const currentBid = formatPrice(vehicle.currentBid) || '₹0';
  const reservePrice = formatPrice(vehicle.reservePrice) || '₹0';

  // Parse endsIn like "02:15:30" into seconds
  const parseTime = (timeStr) => {
    if (!timeStr) return 3600;
    if (typeof timeStr === 'number') return timeStr;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    return 3600;
  };

  const [timeLeft, setTimeLeft] = useState(vehicle.timeRemaining || parseTime(vehicle.endsIn));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const isEndingSoon = timeLeft < 3600;

  const handleBidNow = () => {
    setGlobalRedirectData({ 
      providerName: provider, 
      targetUrl: vehicle.url || 'https://example.com/auction' 
    });
  };

  return (
    <div className="auction-card">
      <div className="image-container">
        <img src={vehicle.image} alt={name} className="vehicle-image" />
        <div className="provider-badge">{provider}</div>
        <div className="ai-recommendation">
          <ShieldCheck size={16} className="icon-mr" />
          Est. Value: {estValue} - {dealStatus}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="vehicle-name">{name}</h3>
        
        <div className="bidding-info">
          <div className="bid-section">
            <span className="label">{t('auto_current_bid_9c0e', 'Current Bid')}</span>
            <span className="current-bid">{currentBid}</span>
          </div>
          <div className="reserve-section">
            <span className="label">{t('auto_reserve_price_e58c', 'Reserve Price')}</span>
            <span className="reserve-price">{reservePrice}</span>
          </div>
        </div>

        <div className={`countdown-timer ${isEndingSoon ? 'ending-soon' : ''}`}>
          <Clock size={18} className="icon-mr" />
          <span>Ends in: {formatTime(timeLeft)}</span>
          {isEndingSoon && <span className="urgent-badge">{t('auto_urgent_2708', 'Urgent')}</span>}
        </div>

        <button className="bid-now-btn" onClick={handleBidNow}>
          Bid Now <ExternalLink size={18} className="icon-ml" />
        </button>
      </div>
    </div>
  );
};

const VehicleAuction = () => {
  const { t } = useTranslation();
  // Fallback data in case auctionVehicles is not populated in mock data yet
  const vehicles = auctionVehicles && auctionVehicles.length > 0 ? auctionVehicles : [
    {
      id: 1,
      name: '2022 Hyundai i20 Asta',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80',
      provider: 'Bank Repo',
      estimatedValue: '₹7.5 Lakh',
      dealStatus: 'Great Deal',
      currentBid: '₹5,20,000',
      reservePrice: '₹6,00,000',
      timeRemaining: 1850,
      url: 'https://example.com/bid/1'
    },
    {
      id: 2,
      name: '2019 Honda City VX',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80',
      provider: 'Gov Auction',
      estimatedValue: '₹8.2 Lakh',
      dealStatus: 'Good Deal',
      currentBid: '₹6,80,000',
      reservePrice: '₹7,50,000',
      timeRemaining: 7200,
      url: 'https://example.com/bid/2'
    },
    {
      id: 3,
      name: '2021 Tata Nexon XZ+',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80',
      provider: 'Dealer Auction',
      estimatedValue: '₹9.0 Lakh',
      dealStatus: 'Fair Deal',
      currentBid: '₹8,10,000',
      reservePrice: '₹8,50,000',
      timeRemaining: 900,
      url: 'https://example.com/bid/3'
    }
  ];

  return (
    <div className="vehicle-auction-container">
      <div className="header">
        <h2>{t('auto_live_vehicle_auction_fdf4', 'Live Vehicle Auctions')}</h2>
        <p>Premium deals on Bank Repos, Gov Auctions, and Dealer Inventories.</p>
      </div>
      
      <div className="auction-grid">
        {vehicles.map((vehicle, index) => (
          <VehicleAuctionCard key={vehicle.id || index} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default VehicleAuction;
