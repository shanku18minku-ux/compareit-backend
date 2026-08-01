import React from 'react';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';

const dummyJobs = [
  {
    id: 1,
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    title: 'Senior React Developer',
    subtitle: 'TechCorp India • Remote',
    price: '₹25L - ₹35L / yr',
    timeOrDistance: '4+ Yrs Exp',
    rating: 4.8,
    aiScore: 94,
    badge1: 'High Match',
    badge2: 'Actively Hiring',
    compareData: [
      { platform: 'LinkedIn', price: '₹25L-35L' },
      { platform: 'Instahyre', price: '₹24L-32L' },
      { platform: 'Naukri', price: '₹26L-36L' }
    ],
    features: ['Remote Work', 'Comprehensive Health Insurance', 'Flexible Hours']
  },
  {
    id: 2,
    coverImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    title: 'UX Designer',
    subtitle: 'DesignStudio • Bangalore',
    price: '₹15L - ₹22L / yr',
    timeOrDistance: '2-4 Yrs Exp',
    rating: 4.6,
    aiScore: 88,
    badge1: 'Fast Growing',
    badge2: 'Hybrid',
    compareData: [
      { platform: 'Wellfound', price: '₹15L-22L' },
      { platform: 'LinkedIn', price: '₹14L-20L' }
    ],
    features: ['Creative Environment', 'MacBook Pro Provided', 'Annual Retreats']
  }
];

const JobsTab = () => {
  return (
    <div className="tab-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <SwipeDeck 
        items={dummyJobs}
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

export default JobsTab;
