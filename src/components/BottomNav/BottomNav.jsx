import React from 'react';
import { Home, UtensilsCrossed, Plane, HeartPulse, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './BottomNav.module.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', label: t('nav_home', 'Home'), icon: Home },
    { id: 'food', label: t('nav_food', 'Food'), icon: UtensilsCrossed },
    { id: 'travel', label: t('nav_travel', 'Travel'), icon: Plane },
    { id: 'health', label: t('nav_health', 'Health'), icon: HeartPulse },
    { id: 'education', label: t('nav_learn', 'Learn'), icon: GraduationCap },
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
