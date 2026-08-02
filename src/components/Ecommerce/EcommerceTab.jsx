import React, { useMemo } from 'react';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';
import { filterByLocation } from '../../utils/locationEngine';
import useAppStore from '../../store/appStore';

const dummyProducts = [
  {
    id: 1,
    coverImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    title: 'Sony WH-1000XM5',
    subtitle: 'Noise Cancelling Headphones',
    price: '₹24,990',
    timeOrDistance: 'Delivery by Tmrw',
    rating: 4.8,
    aiScore: 98,
    badge1: 'Best Seller',
    badge2: 'Lowest Price in 30d',
    compareData: [
      { platform: 'Amazon', price: '₹24,990' },
      { platform: 'Flipkart', price: '₹25,990' },
      { platform: 'Reliance Digital', price: '₹26,490' }
    ],
    features: ['Industry leading ANC', '30hr battery life', 'Multipoint connection']
  },
  {
    id: 2,
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    title: 'Nike Air Max 270',
    subtitle: 'Men\'s Running Shoes',
    price: '₹12,495',
    timeOrDistance: 'Delivery in 2 Days',
    rating: 4.6,
    aiScore: 92,
    badge1: 'Trending',
    badge2: 'Limited Stock',
    compareData: [
      { platform: 'Nike', price: '₹12,495' },
      { platform: 'Myntra', price: '₹12,995' },
      { platform: 'Ajio', price: '₹13,295' }
    ],
    features: ['Lightweight', 'Max Air 270 unit', 'Woven and synthetic fabric']
  }
];

const EcommerceTab = () => {
  const userLocation = useAppStore(state => state.userLocation);
  
  const filteredProducts = useMemo(() => {
    return filterByLocation(dummyProducts, userLocation?.city);
  }, [userLocation]);

  return (
    <div className="tab-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <SwipeDeck 
        items={filteredProducts}
        renderCard={(item) => (
          <UniversalCard 
            coverImage={item.coverImage}
            title={item.title}
            subtitle={item.subtitle}
            price={item.price}
            timeOrDistance={item.timeOrDistance}
            rating={item.rating}
            aiScore={item.aiScore}
            badge1={item.badge1}
            badge2={item.badge2}
          />
        )}
      />
    </div>
  );
};

export default EcommerceTab;
