import React, { useState, useEffect } from 'react';
import { Stethoscope } from 'lucide-react';
import styles from './LabsTab.module.css';
import { useApi } from '../../services/api';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';

const LabsTab = () => {
  const { getHealthLabs } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealthLabs().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const labs = data || [];

  if (loading) {
    return <div className="shimmer card" style={{ height: '300px', margin: '20px' }}></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleIcon}>
            <Stethoscope className={styles.icon} />
          </div>
          <div>
            <h2 className={styles.title}>Diagnostic Packages</h2>
            <p className={styles.subtitle}>Compare lab tests, full body checkups, and diagnostic profiles.</p>
          </div>
        </div>
      </header>

      <div className={styles.grid} style={{ margin: '0 -20px' }}>
        <SwipeDeck 
          items={labs}
          renderCard={(lab) => {
            const vendors = lab.vendors || [
              { name: 'Thyrocare', price: 999, reportTimeHrs: 24 },
              { name: 'Lal PathLabs', price: 1250, reportTimeHrs: 12 },
              { name: 'Redcliffe', price: 899, reportTimeHrs: 24 }
            ];

            const sortedVendors = [...vendors].sort((a, b) => a.price - b.price);
            const cheapestVendor = sortedVendors[0];

            const compareData = sortedVendors.map(v => ({
              platform: v.name,
              price: `₹${v.price}`
            }));

            return (
              <UniversalCard
                coverImage={lab.image || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                title={lab.name || 'Comprehensive Body Checkup'}
                subtitle={`${lab.testCount || 60} Tests Included`}
                price={`₹${cheapestVendor.price.toLocaleString()}`}
                timeOrDistance={`${cheapestVendor.reportTimeHrs} hrs report`}
                rating={lab.rating || '4.7'}
                aiScore={lab.aiScore || 89}
                badge1={lab.fastingRequired !== false ? 'Fasting Required' : 'No Fasting'}
                badge2="Lab Test"
                compareData={compareData}
                features={['Home Sample Collection', 'Free Doctor Consultation', 'NABL Accredited']}
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
};

export default LabsTab;
