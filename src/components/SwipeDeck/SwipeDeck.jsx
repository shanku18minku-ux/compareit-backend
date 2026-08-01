import React from 'react';
import './SwipeDeck.css';

/**
 * SwipeDeck has been simplified to a standard horizontal list.
 * The Tinder-style swiping mechanics have been removed per user request,
 * but cards are shown side-by-side.
 */
const SwipeDeck = ({ items, renderCard }) => {
  if (!items || items.length === 0) {
    return (
      <div className="swipe-deck-empty" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
        <h2>No items available</h2>
      </div>
    );
  }

  return (
    <div className="horizontal-list-container" style={{ display: 'flex', flexDirection: 'row', gap: '16px', padding: '16px', paddingBottom: '32px', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%' }}>
      {items.map((item, index) => (
        <div key={item.id || item.title || item.name || index} className="list-card-wrapper" style={{ minWidth: '320px', width: '320px', scrollSnapAlign: 'start', flexShrink: 0 }}>
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
};

export default SwipeDeck;
