import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, TrendingUp, Zap, Search, X, Pin, Clock } from 'lucide-react';
import {
  getSuggestions,
  getTrendingSuggestions,
  trackSuggestionClick,
  pinSearch,
  getPinnedSearches,
  getCachedSuggestions,
} from '../../services/searchSuggestionEngine';
import './SmartSuggestionsDropdown.css';

/**
 * SmartSuggestionsDropdown — React Portal based, works inside overflow:hidden headers
 *
 * Props:
 *   query          — current search input string
 *   isVisible      — whether the dropdown should be rendered
 *   anchorRef      — ref to the search bar element (for positioning)
 *   onSelect       — (text) => void
 *   onTypoAccept   — (correctedText) => void
 *   recentSearches — string[] from personalizationStore
 *   moduleVisits   — object from personalizationStore
 *   userCity       — string from appStore.userLocation.city
 *   onDeleteRecent — (term) => void
 *   onClearAll     — () => void
 */
const SmartSuggestionsDropdown = ({
  query,
  isVisible,
  anchorRef,
  onSelect,
  onTypoAccept,
  recentSearches = [],
  moduleVisits = {},
  userCity = '',
  onDeleteRecent,
  onClearAll,
}) => {
  const [groups, setGroups] = useState([]);
  const [typoCorrection, setTypoCorrection] = useState(null);
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [pinnedSearches, setPinnedSearches] = useState([]);
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  // Load pinned + trending on mount or city change
  useEffect(() => {
    setTrendingItems(getTrendingSuggestions(userCity));
    setPinnedSearches(getPinnedSearches());
  }, [userCity]);

  // Compute position from anchor element
  useEffect(() => {
    if (!isVisible || !anchorRef?.current) return;
    const updatePos = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) {
        setDropdownPos({
          top: rect.bottom + window.scrollY + 6,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [isVisible, anchorRef]);

  // Fetch suggestions with debounce (250ms) — passes context for personalization
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    setFocusedIndex(-1);

    if (!query || query.length < 1) {
      setGroups([]);
      setTypoCorrection(null);
      setIsLoading(false);
      return;
    }

    const cached = getCachedSuggestions(query, { userCity });
    if (cached) {
      setGroups(cached.groups || []);
      setTypoCorrection(cached.typoCorrection || null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const result = await getSuggestions(query, {
          recentSearches,
          moduleVisits,
          userCity,
        });
        setGroups(result.groups || []);
        setTypoCorrection(result.typoCorrection || null);
      } catch (_) {
        setGroups([]);
        setTypoCorrection(null);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceTimer.current);
  }, [query, recentSearches, moduleVisits, userCity]);

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      const allItems = wrapperRef.current
        ? Array.from(wrapperRef.current.querySelectorAll('[data-ssd-item]'))
        : [];
      if (!allItems.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = Math.min(prev + 1, allItems.length - 1);
          allItems[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = Math.max(prev - 1, 0);
          allItems[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        allItems[focusedIndex]?.click();
      } else if (e.key === 'Escape') {
        setFocusedIndex(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, focusedIndex, groups]);

  const highlightMatch = (text, q) => {
    if (!q || q.length < 2) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="ssd-highlight">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const handleItemSelect = (itemText, category) => {
    trackSuggestionClick(itemText, category);
    onSelect(itemText);
  };

  const handlePin = (e, term) => {
    e.preventDefault();
    e.stopPropagation();
    pinSearch(term);
    setPinnedSearches(getPinnedSearches());
  };

  if (!isVisible) return null;

  const showTrending = !query || query.length === 0;
  const showSuggestions = query && query.length > 0;
  let itemIndex = 0;

  const dropdownContent = (
    <div
      className="ssd-wrapper"
      ref={wrapperRef}
      role="listbox"
      aria-label="Search suggestions"
      style={{
        position: 'fixed',
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: `${dropdownPos.width}px`,
        zIndex: 99999,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* ── Typo Correction Banner ── */}
      {typoCorrection && query && (
        <div className="ssd-typo-banner">
          <span className="ssd-typo-label">Did you mean:</span>
          <button
            className="ssd-typo-link"
            onMouseDown={(e) => { e.preventDefault(); onTypoAccept(typoCorrection); }}
          >
            {typoCorrection}
          </button>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {isLoading && (
        <div className="ssd-skeleton-list">
          {[80, 55, 70, 60].map((w, i) => (
            <div key={i} className="ssd-skeleton-item">
              <div className="ssd-skeleton-icon" />
              <div className="ssd-skeleton-text" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      )}

      {/* ── No Query: Pinned + Recent + Trending ── */}
      {showTrending && !isLoading && (
        <>
          {/* Pinned Searches */}
          {pinnedSearches.length > 0 && (
            <div className="ssd-group">
              <div className="ssd-group-header"><span className="ssd-group-icon">📌</span>Pinned</div>
              {pinnedSearches.map((term, idx) => {
                const myIdx = itemIndex++;
                return (
                  <button
                    key={`pin_${idx}`}
                    data-ssd-item="true"
                    className={`ssd-item ${focusedIndex === myIdx ? 'ssd-item--focused' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); handleItemSelect(term, 'Pinned'); }}
                  >
                    <div className="ssd-item-icon">📌</div>
                    <div className="ssd-item-content"><div className="ssd-item-text">{term}</div></div>
                    <ArrowRight size={14} className="ssd-item-arrow" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent Searches with Delete + Clear All */}
          {recentSearches.length > 0 && (
            <div className="ssd-group">
              <div className="ssd-group-header ssd-group-header--row">
                <span><span className="ssd-group-icon">🕐</span>Recent Searches</span>
                {onClearAll && (
                  <button className="ssd-clear-all-btn" onMouseDown={(e) => { e.preventDefault(); onClearAll(); }}>
                    Clear All
                  </button>
                )}
              </div>
              {recentSearches.slice(0, 3).map((term, idx) => {
                const myIdx = itemIndex++;
                return (
                  <div
                    key={`rec_${idx}`}
                    className={`ssd-item ssd-item--recent ${focusedIndex === myIdx ? 'ssd-item--focused' : ''}`}
                  >
                    <button
                      data-ssd-item="true"
                      className="ssd-item-main"
                      onMouseDown={(e) => { e.preventDefault(); handleItemSelect(term, 'Recent'); }}
                    >
                      <div className="ssd-item-icon">🕐</div>
                      <div className="ssd-item-content"><div className="ssd-item-text">{term}</div></div>
                    </button>
                    <div className="ssd-item-actions">
                      <button
                        className="ssd-action-btn"
                        title="Pin this search"
                        onMouseDown={(e) => handlePin(e, term)}
                      >📌</button>
                      {onDeleteRecent && (
                        <button
                          className="ssd-action-btn ssd-delete-btn"
                          title="Remove"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteRecent(term); }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Trending */}
          <div className="ssd-trending-header">
            <TrendingUp size={12} />
            {userCity ? `Trending in ${userCity} & India` : 'Trending Searches'}
          </div>
          <div className="ssd-trending-chips">
            {trendingItems.map((item, idx) => {
              const myIdx = itemIndex++;
              return (
                <button
                  key={idx}
                  data-ssd-item="true"
                  className={`ssd-trending-chip ${focusedIndex === myIdx ? 'ssd-item--focused' : ''}`}
                  onMouseDown={(e) => { e.preventDefault(); handleItemSelect(item.text, item.category); }}
                >
                  <span>{item.icon}</span>
                  {item.text}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ── Categorized Suggestions ── */}
      {showSuggestions && !isLoading && groups.length > 0 && groups.map((group) => (
        <div key={group.category} className="ssd-group">
          <div className="ssd-group-header">
            <span className="ssd-group-icon">{group.items[0]?.icon}</span>
            {group.category}
          </div>
          {group.items.map((item, iIdx) => {
            const myIdx = itemIndex++;
            return (
              <button
                key={`${group.category}_${iIdx}`}
                data-ssd-item="true"
                className={`ssd-item ${item.type === 'trending' ? 'ssd-item-trending' : ''} ${item.type === 'nearby' ? 'ssd-item-nearby' : ''} ${focusedIndex === myIdx ? 'ssd-item--focused' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); handleItemSelect(item.text, item.category); }}
              >
                <div className="ssd-item-icon">
                  {item.type === 'trending' ? '🔥' : item.icon}
                </div>
                <div className="ssd-item-content">
                  <div className="ssd-item-text">{highlightMatch(item.text, query)}</div>
                </div>
                <div className="ssd-badges">
                  {item.type === 'trending' && <span className="ssd-badge ssd-badge--trending">Trending</span>}
                  {item.type === 'nearby' && <span className="ssd-badge ssd-badge--nearby">Nearby</span>}
                  {item.type === 'personalized' && <span className="ssd-badge ssd-badge--ai">AI Pick</span>}
                </div>
                <ArrowRight size={14} className="ssd-item-arrow" />
              </button>
            );
          })}
        </div>
      ))}

      {/* ── No Results ── */}
      {showSuggestions && !isLoading && groups.length === 0 && (
        <div className="ssd-no-result">
          <Search size={16} />
          Press Enter to search for "{query}"
        </div>
      )}

      {/* ── Footer ── */}
      <div className="ssd-footer">
        <Zap size={10} />
        Powered by CompareIt AI
      </div>
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

export default SmartSuggestionsDropdown;
