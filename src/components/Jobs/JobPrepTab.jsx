import React from 'react';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';

const dummyPrep = [
  {
    id: 1,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    title: 'Mock Interview: System Design',
    subtitle: 'With Ex-Google Engineer',
    price: '₹1,999',
    timeOrDistance: '60 mins session',
    rating: 4.9,
    aiScore: 98,
    badge1: 'Highly Recommended',
    badge2: 'Slots Available',
    compareData: [
      { platform: 'Preplaced', price: '₹1,999' },
      { platform: 'Topmate', price: '₹2,499' }
    ],
    features: ['Live Feedback', 'Actionable Insights', 'Recording Provided']
  },
  {
    id: 2,
    coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
    title: 'Frontend Interview Guide',
    subtitle: 'Comprehensive PDF & Videos',
    price: 'Free',
    timeOrDistance: 'Self-paced',
    rating: 4.7,
    aiScore: 92,
    badge1: 'Community Choice',
    badge2: 'Updated 2024',
    compareData: [
      { platform: 'Our Platform', price: 'Free' },
      { platform: 'Competitor', price: '₹499' }
    ],
    features: ['100+ Questions', 'Code Snippets', 'System Design Basics']
  }
];

const JobPrepTab = () => {
  return (
    <div className="tab-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <SwipeDeck 
        items={dummyPrep}
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

export default JobPrepTab;
