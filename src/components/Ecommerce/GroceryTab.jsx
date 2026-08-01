import React from 'react';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';

const dummyGroceries = [
  {
    id: 1,
    coverImage: 'https://images.unsplash.com/photo-1587311420056-8e5436bb5c68?auto=format&fit=crop&q=80&w=800',
    title: 'Farm Fresh Organic Tomatoes',
    subtitle: '1 kg • Locally Sourced',
    price: '₹65',
    timeOrDistance: '10 mins away',
    rating: 4.5,
    aiScore: 95,
    badge1: 'Fresh Today',
    badge2: 'Organic',
    compareData: [
      { platform: 'Blinkit', price: '₹65' },
      { platform: 'Zepto', price: '₹72' },
      { platform: 'Instamart', price: '₹70' }
    ],
    features: ['Pesticide free', 'Rich in Vitamin C', 'Sourced from local farms']
  },
  {
    id: 2,
    coverImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800',
    title: 'Whole Wheat Bread',
    subtitle: '400g • Britannia',
    price: '₹45',
    timeOrDistance: '10 mins away',
    rating: 4.7,
    aiScore: 90,
    badge1: 'High Fiber',
    badge2: 'Daily Need',
    compareData: [
      { platform: 'Zepto', price: '₹45' },
      { platform: 'Blinkit', price: '₹45' },
      { platform: 'BigBasket', price: '₹43' }
    ],
    features: ['100% Whole Wheat', 'No added colors', 'Zero cholesterol']
  }
];

const GroceryTab = () => {
  return (
    <div className="tab-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <SwipeDeck 
        items={dummyGroceries}
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

export default GroceryTab;
