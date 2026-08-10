import React from 'react';
import styles from './LoadingSkeleton.module.css';

export const LoadingSkeleton: React.FC<{ width?: string; height?: string; className?: string }> = ({ width = '100%', height = '1rem', className }) => (
  <div
    className={`${styles.skeleton} ${className ?? ''}`}
    style={{ width, height }}
    aria-label="loading"
  />
);
