import React, { useState, useEffect } from 'react';
import { Search, Mic, Camera, ScanBarcode, X, Clock, TrendingUp } from 'lucide-react';
import styles from './SearchBar.module.css';
// import { useTranslation } from 'react-i18next'; // Assuming i18n is setup

const SearchBar = ({ onSearch, onModeChange }) => {
  // const { t } = useTranslation();
  const t = (str) => str; // Fallback
  
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('text'); // 'text', 'voice', 'image', 'barcode'
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const suggestions = [
    { id: 1, type: 'recent', text: 'iphone 15 pro max' },
    { id: 2, type: 'recent', text: 'sony headphones' },
    { id: 3, type: 'trending', text: 'summer dress' },
    { id: 4, type: 'trending', text: 'camping tent' },
  ];

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e) => {
    // Timeout to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setMode('text');
    }, 200);
  };

  const handleModeToggle = (newMode) => {
    if (mode === newMode) {
      setMode('text');
      if (onModeChange) onModeChange('text');
      setIsListening(false);
    } else {
      setMode(newMode);
      if (onModeChange) onModeChange(newMode);
      
      if (newMode === 'voice') {
        setIsListening(true);
        // Implement Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            if (onSearch) onSearch(transcript);
            setMode('text');
            setIsFocused(false);
          };
          recognition.onend = () => setIsListening(false);
          recognition.start();
        } else {
          setTimeout(() => setIsListening(false), 3000);
        }
      } else if (newMode === 'image' || newMode === 'barcode') {
        setIsListening(false);
        // Mock scanner auto resolve
        setTimeout(() => {
          setQuery('iPhone 15');
          if (onSearch) onSearch('iPhone 15');
          setMode('text');
          setIsFocused(false);
        }, 2000);
      } else {
        setIsListening(false);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);  // Optional chaining prevents crash if onSearch prop not passed
      setIsFocused(false);
    }
  };

  return (
    <>
      {isFocused && <div className={styles.backdrop} onClick={() => setIsFocused(false)} />}
      
      <div className={`${styles.searchContainer} ${isFocused ? styles.focused : ''}`}>
        <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
          <Search className={styles.searchIcon} size={20} color="#9ca3af" />
          
          <input
            type="text"
            className={styles.input}
            placeholder={t('Search products, brands and more...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {query && isFocused && (
            <button type="button" className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={16} color="#6b7280" />
            </button>
          )}

          <div className={styles.actions}>
            <button 
              type="button" 
              className={`${styles.actionBtn} ${mode === 'voice' ? styles.activeAction : ''} ${isListening ? styles.listening : ''}`}
              onClick={() => handleModeToggle('voice')}
            >
              <Mic size={20} />
            </button>
            <button 
              type="button" 
              className={`${styles.actionBtn} ${mode === 'image' ? styles.activeAction : ''}`}
              onClick={() => handleModeToggle('image')}
            >
              <Camera size={20} />
            </button>
            <button 
              type="button" 
              className={`${styles.actionBtn} ${mode === 'barcode' ? styles.activeAction : ''}`}
              onClick={() => handleModeToggle('barcode')}
            >
              <ScanBarcode size={20} />
            </button>
          </div>
        </form>

        {isFocused && (
          <div className={styles.dropdown}>
            {mode === 'voice' && (
              <div className={styles.modeOverlay}>
                <div className={`${styles.micPulse} ${isListening ? styles.active : ''}`}>
                  <Mic size={48} color="#2563EB" />
                </div>
                <p>{isListening ? t('Listening...') : t('Tap microphone to speak')}</p>
              </div>
            )}
            
            {mode === 'image' && (
              <div className={styles.modeOverlay}>
                <Camera size={48} color="#2563EB" className={styles.modeIcon} />
                <p>{t('Take a photo or upload an image to search')}</p>
                <button className={styles.primaryBtn}>{t('Open Camera')}</button>
              </div>
            )}
            
            {mode === 'barcode' && (
              <div className={styles.modeOverlay}>
                <ScanBarcode size={48} color="#2563EB" className={styles.modeIcon} />
                <p>{t('Scan a product barcode')}</p>
                <div className={styles.scannerPlaceholder}></div>
              </div>
            )}

            {mode === 'text' && (
              <div className={styles.suggestionsList}>
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    className={styles.suggestionItem}
                    onClick={() => { setQuery(suggestion.text); onSearch(suggestion.text); }}
                  >
                    {suggestion.type === 'recent' ? (
                      <Clock size={16} color="#9ca3af" />
                    ) : (
                      <TrendingUp size={16} color="#2563EB" />
                    )}
                    <span>{suggestion.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
