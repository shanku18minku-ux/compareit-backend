import React, { useState, useEffect } from 'react';
import styles from './ScholarshipsTab.module.css';
import { useApi } from '../../services/api';
import { Award, Search } from 'lucide-react';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';

const ScholarshipsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getEduScholarships } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEduScholarships().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const calculateDaysLeft = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const filteredScholarships = data?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return <div className="shimmer card" style={{ height: '300px', margin: '20px' }}></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Award className={styles.emptyIcon} size={48} />
        <p>No scholarships available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Financial Aid & Scholarships</h2>
        <p className={styles.subtitle}>Discover opportunities to fund your education.</p>
        
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by scholarship name or provider..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.grid} style={{ margin: '0 -20px' }}>
        <SwipeDeck 
          items={filteredScholarships}
          renderCard={(scholarship) => {
            const daysLeft = calculateDaysLeft(scholarship.deadline);
            const isClosed = daysLeft !== null && daysLeft < 0;
            const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
            
            let deadlineText = 'Rolling';
            if (isClosed) deadlineText = 'Closed';
            else if (daysLeft !== null) deadlineText = daysLeft === 0 ? 'Ends Today' : `${daysLeft} days left`;

            const eligibilityFeatures = Array.isArray(scholarship.eligibility) 
              ? scholarship.eligibility 
              : [scholarship.eligibility];
            
            return (
              <UniversalCard
                coverImage={scholarship.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                title={scholarship.name}
                subtitle={scholarship.provider}
                price={scholarship.rewardAmount}
                timeOrDistance={deadlineText}
                rating={scholarship.rating || '4.5'}
                aiScore={scholarship.aiScore || 90}
                badge1={isClosed ? 'Closed' : isUrgent ? 'Urgent' : 'Active'}
                badge2="Scholarship"
                compareData={[]}
                features={eligibilityFeatures}
              />
            );
          }}
          onSwipeLeft={(item) => console.log('Compare', item.name)}
          onSwipeRight={(item) => console.log('Check Eligibility', item.name)}
          onSwipeUp={(item) => console.log('Next', item.name)}
        />
      </div>
      
      {filteredScholarships.length === 0 && (
        <div className={styles.noResults}>
          <p>No scholarships match your search.</p>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsTab;
