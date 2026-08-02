import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './LanguagePicker.css';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ur', name: 'Urdu', native: 'اردو' }
];

const LanguagePicker = ({ isOpen, onClose, onSelectLanguage }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 300); // match transition time
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    
    // Trigger Google Translate for 100% DOM deep translation (mock data & dynamic strings)
    try {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      console.warn("Google translate widget not initialized yet");
    }
    
    if (onSelectLanguage) onSelectLanguage(langCode);
  };

  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
    lang.native.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`lang-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div 
        className={`lang-modal-content ${isOpen ? 'open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="lang-modal-header">
          <h2>{t('lang_choose', 'Choose Language')}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="lang-search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder={t('lang_search', 'Search language...')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="lang-search-input"
          />
        </div>

        <div className="lang-grid">
          {filteredLanguages.map(lang => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                className={`lang-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(lang.code)}
              >
                {isSelected && <div className="check-badge"><Check size={16} /></div>}
                <div className="lang-native">{lang.native}</div>
                <div className="lang-english">{lang.name}</div>
              </button>
            );
          })}
          
          {filteredLanguages.length === 0 && (
            <div className="no-results">
              {t('No languages found', 'No languages found')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguagePicker;
