import React from 'react';
import { SearchX } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ title = "No Results Found", message = "Try adjusting your search or filters to find what you're looking for.", onAction, actionText }) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        <SearchX size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {onAction && actionText && (
        <button className="empty-state-action-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
