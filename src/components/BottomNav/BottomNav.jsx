import React from 'react';
import { Home, UtensilsCrossed, Plane, HeartPulse, GraduationCap } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'health', label: 'Health', icon: HeartPulse },
    { id: 'education', label: 'Learn', icon: GraduationCap },
  ];
  // Note: Search tab and AI Copilot tab removed per user request.
  // AI Copilot remains as floating button only.

  return (
    <div className={styles.bottomNavContainer}>
      <nav className={styles.bottomNav}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
            >
              <div className={styles.iconContainer}>
                <Icon
                  className={styles.icon}
                  fill={isActive ? '#2563EB' : 'none'}
                  stroke={isActive ? '#2563EB' : 'currentColor'}
                  size={24}
                />
              </div>
              {isActive && <span className={styles.label}>{tab.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
