import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Coffee, Wifi, Car, Waves, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './HotelsTab.module.css';
import { useApi } from '../../services/api';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';

const getCheapestPlatform = (prices) => {
  if (!prices) return { name: '', data: null };
  let min = Infinity;
  let cheapest = '';
  
  Object.entries(prices).forEach(([platform, data]) => {
    if (data && data.price < min) {
      min = data.price;
      cheapest = platform;
    }
  });
  
  return { name: cheapest, data: prices[cheapest] };
};

export default function HotelsTab() {
  const { getHotelListings } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHotelListings().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="shimmer card" style={{ height: '300px', margin: '20px' }}></div>;
  }

  if (!data || data.length === 0) {
    return <div className={styles.emptyState}>{t('auto_no_hotels_available__854c', 'No hotels available at the moment.')}</div>;
  }

  const hotelListings = data;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>{t('auto_premium_stays_02cd', 'Premium Stays')}</h2>
        <p>{t('auto_compare_luxury_hotel_8c99', 'Compare luxury hotels across top booking platforms.')}</p>
      </header>

      <div className={styles.hotelGrid} style={{ margin: '0 -20px' }}>
        <SwipeDeck 
          items={hotelListings}
          renderCard={(hotel) => {
            const cheapest = getCheapestPlatform(hotel.prices);
            const compareData = Object.entries(hotel.prices || {}).map(([platform, data]) => ({
              platform,
              price: data?.price || 0
            }));

            return (
              <UniversalCard 
                key={hotel.id}
                coverImage={hotel.image || 'https://images.unsplash.com/photo-1566073171526-873130761923?auto=format&fit=crop&q=80&w=800'}
                title={hotel.name}
                subtitle={hotel.location}
                price={`₹${cheapest.data?.price?.toLocaleString() || 0}`}
                timeOrDistance="Per Night"
                rating={hotel.stars || 5}
                aiScore={96}
                badge1="Best Deal"
                badge2={hotel.amenities?.[0] || 'Free WiFi'}
                compareData={compareData}
                features={hotel.amenities || ['Free WiFi', 'Pool', 'Spa', 'Breakfast']}
              />
            );
          }}
          onSwipeLeft={(item) => console.log('Compare', item.name)}
          onSwipeRight={(item) => console.log('Book', item.name)}
          onSwipeUp={(item) => console.log('Next', item.name)}
        />
      </div>
    </div>
  );
}
