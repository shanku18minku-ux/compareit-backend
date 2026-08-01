import React from 'react';
import './ModuleLoadingSkeleton.css';

const ModuleLoadingSkeleton = () => {
  return (
    <div className="module-skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-search shimmer"></div>
      </div>
      
      <div className="skeleton-tabs">
        <div className="skeleton-tab shimmer"></div>
        <div className="skeleton-tab shimmer"></div>
        <div className="skeleton-tab shimmer"></div>
      </div>
      
      <div className="skeleton-content">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-card shimmer">
            <div className="skeleton-img"></div>
            <div className="skeleton-lines">
              <div className="skeleton-line-long"></div>
              <div className="skeleton-line-short"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleLoadingSkeleton;
