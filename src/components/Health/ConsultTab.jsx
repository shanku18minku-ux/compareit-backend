import React, { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import useAppStore from '../../store/appStore';
import SwipeDeck from '../SwipeDeck/SwipeDeck';
import UniversalCard from '../UniversalCard/UniversalCard';
import styles from './ConsultTab.module.css';

export default function ConsultTab() {
  const { healthSearchQuery } = useAppStore();
  const { getHealthConsults } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealthConsults().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const filteredDoctors = data?.filter(doctor => {
    const query = healthSearchQuery?.toLowerCase() || '';
    return doctor.name.toLowerCase().includes(query) || 
           doctor.specialty.toLowerCase().includes(query);
  }) || [];

  if (loading) {
    return <div className="shimmer card" style={{ height: '300px', margin: '20px' }}></div>;
  }

  return (
    <div className={styles.consultContainer}>
      <h2 className={styles.sectionTitle}>Find & Compare Doctors</h2>
      <div className={styles.horizontalScroll}>
        {filteredDoctors.map(doctor => {
          let cheapestPlatform = null;
          let earliestPlatform = null;

          doctor.platforms.forEach(platform => {
            if (!cheapestPlatform || platform.fee < cheapestPlatform.fee) {
              cheapestPlatform = platform;
            }
            if (!earliestPlatform || platform.nextSlot < earliestPlatform.nextSlot) {
              earliestPlatform = platform;
            }
          });

          return (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.doctorHeader}>
                <img src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
                <div className={styles.doctorInfo}>
                  <h3 className={styles.doctorName}>{doctor.name}</h3>
                  <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                  <p className={styles.doctorExperience}>{doctor.experience} Exp</p>
                  <div className={styles.ratingBadge}>
                    <span>⭐ {doctor.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.platformsSection}>
                <h4 className={styles.platformsTitle}>Compare Platforms</h4>
                <div className={styles.platformList}>
                  {doctor.platforms.map((p, idx) => (
                    <div key={idx} className={`${styles.platformItem} ${p === cheapestPlatform ? styles.recommendedPlatform : ''}`}>
                      <div className={styles.platformDetails}>
                        <span className={styles.platformName}>{p.name}</span>
                        <span className={styles.platformSlot}>{p.type} • {p.nextSlot}</span>
                      </div>
                      <div className={styles.platformPriceCol}>
                        {p === cheapestPlatform && <span className={styles.recommendTag}>⭐ RECOMMENDED</span>}
                        <span className={styles.platformPrice}>₹{p.fee}</span>
                        <button className={styles.bookBtn}>Book</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredDoctors.length === 0 && (
        <div className={styles.noResults}>
          <p>No doctors found matching "{healthSearchQuery}"</p>
        </div>
      )}
    </div>
  );
}
