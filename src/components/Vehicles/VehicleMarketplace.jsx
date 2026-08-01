import React, { useState } from 'react';
import { Sparkles, Filter } from 'lucide-react';
import VehicleCard from './VehicleCard';
import styles from './VehicleMarketplace.module.css';

import { marketplaceVehicles } from '../../services/vehicleMockData';

const VehicleMarketplace = ({ searchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Cars', 'Bikes', 'Commercial', 'Tractors'];
  
  const filteredVehicles = marketplaceVehicles.filter(v => {
    // Check category filter
    if (activeFilter !== 'All' && v.category !== activeFilter) return false;
    
    // Check search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      // Allow generic keywords
      if (q.includes('car') && v.category === 'Cars') return true;
      if (q.includes('bike') && v.category === 'Bikes') return true;
      if (q.includes('vehicle') || q.includes('auto')) return true;

      // Check fields
      const matchesSearch = 
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q);
        
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  return (
    <div className={styles.container}>
      {/* AI Comparison Summary Hidden As Requested */}
      
      <div className={styles.filtersSection}>
        <div className={styles.filters}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.filterChip} ${activeFilter === category ? styles.active : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default VehicleMarketplace;
