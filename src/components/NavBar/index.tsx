import React from 'react';
import type { TabType } from '../../types/common';
import styles from './NavBar.module.css';

interface NavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.navButton} ${activeTab === 'now' ? styles.active : ''}`}
        onClick={() => onTabChange('now')}
        type="button"
      >
        NOW
      </button>
      <button
        className={`${styles.navButton} ${activeTab === 'today' ? styles.active : ''}`}
        onClick={() => onTabChange('today')}
        type="button"
      >
        TODAY
      </button>
      <button
        className={`${styles.navButton} ${activeTab === 'week' ? styles.active : ''}`}
        onClick={() => onTabChange('week')}
        type="button"
      >
        7 DAYS
      </button>
    </nav>
  );
};
