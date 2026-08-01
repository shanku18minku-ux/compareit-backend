import React, { useState } from 'react';
import { Sparkles, Filter } from 'lucide-react';
import VehicleCard from './VehicleCard';
import styles from './VehicleMarketplace.module.css';

import { marketplaceVehicles } from '../../services/vehicleMockData';

const VehicleMarketplace = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Cars', 'Bikes', 'Commercial', 'Tractors'];
  
  const filteredVehicles = activeFilter === 'All' 
    ? marketplaceVehicles 
    : marketplaceVehicles.filter(v => v.category === activeFilter);

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
