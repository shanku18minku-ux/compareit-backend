import React, { useState } from 'react';
import { Search, Mic, Camera, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { aiOrchestrator } from '../../core/AIOrchestrator';
import useAppStore from '../../store/appStore';
import usePersonalizationStore from '../../store/personalizationStore';
import './UniversalSearch.css';

const UniversalSearch = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
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
    setVehicleSearchQuery
  } = useAppStore();
  const { addRecentSearch, recentSearches } = usePersonalizationStore();

  const handleRouting = (intent, queryText) => {
    if (intent.module !== 'unknown') {
      console.log(`[AI Routing] Detected intent: ${intent.module} -> ${intent.tab}`);
      
      setViewMode('dashboard');
      setActiveTab(intent.module);
      
      // Route to sub-tab and set local module search query if applicable
      switch(intent.module) {
        case 'health':
          setActiveHealthTab(intent.tab);
          setHealthSearchQuery(queryText);
          break;
        case 'travel':
          setActiveTravelTab(intent.tab);
          setTravelSearchQuery(queryText);
          break;
        case 'food':
          setActiveFoodTab(intent.tab);
          setFoodSearchQuery(queryText);
          break;
        case 'education':
          setActiveEducationTab(intent.tab);
          setEducationSearchQuery(queryText);
          break;
        case 'vehicles':
          setActiveVehicleTab(intent.tab);
          setVehicleSearchQuery(queryText);
          break;
        case 'ecommerce':
          setSearchQuery(queryText);
          goToPLP(queryText);
          break;
        default:
          break;
      }
    } else {
      // Fallback: Assume it's a product search for E-commerce
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
      document.activeElement.blur(); // dismiss keyboard on mobile
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

  return (
    <div className={`universal-search-wrapper ${isFocused ? 'focused' : ''}`}>
      <form className="universal-search-bar" onSubmit={handleSearch}>
        <Search className="univ-search-icon" size={20} />
        <input 
          type="search" 
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
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

      {isFocused && recentSearches.length > 0 && (
        <div className="search-dropdown">
          <div className="dropdown-header">
            <span>{t('auto_recent_searches_5c79', 'Recent Searches')}</span>
          </div>
          <div className="recent-list">
            {recentSearches.map((term, i) => (
              <div 
                key={i} 
                className="recent-item" 
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(term);
                }}
              >
                <Search size={14} className="recent-icon" />
                <span>{term}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Overlay for clicking outside */}
      {isFocused && (
        <div className="search-overlay" onClick={() => setIsFocused(false)}></div>
      )}
    </div>
  );
};

export default UniversalSearch;
