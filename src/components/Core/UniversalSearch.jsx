import React, { useState, useRef } from 'react';
import { Search, Mic, Camera, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { aiOrchestrator } from '../../core/AIOrchestrator';
import useAppStore from '../../store/appStore';
import usePersonalizationStore from '../../store/personalizationStore';
import SmartSuggestionsDropdown from '../SearchBar/SmartSuggestionsDropdown';
import './UniversalSearch.css';

const UniversalSearch = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Ref passed to SmartSuggestionsDropdown for portal positioning
  const searchBarRef = useRef(null);

  const {
    setActiveTab,
    setViewMode,
    setSearchQuery,
    goToPLP,
    setActiveHealthTab,
    setActiveTravelTab,
    setActiveFoodTab,
    setActiveEducationTab,
    setActiveVehicleTab,
    setHealthSearchQuery,
    setTravelSearchQuery,
    setFoodSearchQuery,
    setEducationSearchQuery,
    setVehicleSearchQuery,
    userLocation,
    goToCoupons,
    goToLogistics,
  } = useAppStore();

  // Personalization context — passed to suggestion engine for smart ranking
  const {
    addRecentSearch,
    recentSearches,
    moduleVisits,
    removeRecentSearch,
    clearRecentSearches,
  } = usePersonalizationStore();

  const handleRouting = (intent, queryText) => {
    if (intent.module !== 'unknown') {
      console.log(`[AI Routing] Detected intent: ${intent.module} -> ${intent.tab}`);
      switch (intent.module) {
        case 'health':
          setViewMode('dashboard');
          setActiveTab(intent.module);
          setActiveHealthTab(intent.tab);
          setHealthSearchQuery(queryText);
          break;
        case 'travel':
          setViewMode('dashboard');
          setActiveTab(intent.module);
          setActiveTravelTab(intent.tab);
          setTravelSearchQuery(queryText);
          break;
        case 'food':
          setViewMode('dashboard');
          setActiveTab(intent.module);
          setActiveFoodTab(intent.tab);
          setFoodSearchQuery(queryText);
          break;
        case 'education':
          setViewMode('dashboard');
          setActiveTab(intent.module);
          setActiveEducationTab(intent.tab);
          setEducationSearchQuery(queryText);
          break;
        case 'vehicles':
          setViewMode('vehicles');
          setActiveVehicleTab(intent.tab);
          setVehicleSearchQuery(queryText);
          break;
        case 'ecommerce':
          setSearchQuery(queryText);
          goToPLP(queryText);
          break;
        case 'logistics':
          goToLogistics();
          break;
        case 'coupons':
          goToCoupons();
          break;
        default:
          setViewMode('dashboard');
          setActiveTab(intent.module);
          break;
      }
    } else {
      console.log(`[AI Routing] Unknown intent for: ${queryText}. Falling back to E-commerce.`);
      setSearchQuery(queryText);
      goToPLP(queryText);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query);
    const intent = aiOrchestrator.analyzeIntent(query);
    handleRouting(intent, query);
    setIsFocused(false);
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    addRecentSearch(suggestion);
    const intent = aiOrchestrator.analyzeIntent(suggestion);
    handleRouting(intent, suggestion);
    setIsFocused(false);
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  };

  // ── Smart Suggestion Handlers ──────────────────────────────
  const handleSmartSelect = (suggestionText) => {
    handleSuggestionClick(suggestionText);
  };

  const handleTypoAccept = (correctedText) => {
    setQuery(correctedText);
  };

  // Delete individual recent search — graceful fallback if not in store
  const handleDeleteRecent = (term) => {
    if (typeof removeRecentSearch === 'function') {
      removeRecentSearch(term);
    }
  };

  // Clear all recent searches
  const handleClearAll = () => {
    if (typeof clearRecentSearches === 'function') {
      clearRecentSearches();
    }
  };

  // Blur handler: timeout allows onMouseDown in dropdown to fire first
  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 180);
  };

  return (
    <>
      <div className={`universal-search-wrapper ${isFocused ? 'focused' : ''}`} ref={searchBarRef}>
        <form className="universal-search-bar" onSubmit={handleSearch}>
          <Search className="univ-search-icon" size={20} />
          <input
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={t('search_placeholder', "Search anything... (e.g. 'cheap flights to Goa')")}
            className="univ-search-input"
          />
          {query ? (
            <button type="button" className="icon-btn clear-btn" onClick={() => setQuery('')}>
              <X size={18} />
            </button>
          ) : (
            <div className="search-actions">
              <button type="button" className="icon-btn"><Mic size={20} /></button>
              <button type="button" className="icon-btn"><Camera size={20} /></button>
            </div>
          )}
        </form>
      </div>

      {/* Smart AI Suggestions Dropdown — portal-rendered at document.body */}
      <SmartSuggestionsDropdown
        query={query}
        isVisible={isFocused}
        anchorRef={searchBarRef}
        onSelect={handleSmartSelect}
        onTypoAccept={handleTypoAccept}
        recentSearches={recentSearches}
        moduleVisits={moduleVisits}
        userCity={userLocation?.city || ''}
        onDeleteRecent={handleDeleteRecent}
        onClearAll={handleClearAll}
      />

      {/* Overlay — click outside to close */}
      {isFocused && (
        <div
          className="search-overlay"
          onMouseDown={() => setIsFocused(false)}
        />
      )}
    </>
  );
};

export default UniversalSearch;
