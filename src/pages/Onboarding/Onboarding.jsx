import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, ShoppingCart, Sparkles, ShoppingBag, 
  UtensilsCrossed, Plane, HeartPulse, GraduationCap, 
  Bot, Tag, TrendingDown, BadgePercent, ChevronRight,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import './Onboarding.css';

const slides = [
  {
    id: 1,
    title: 'Welcome to CompareIt',
    subtitle: 'Your ultimate comparison companion',
    bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
  },
  {
    id: 2,
    title: 'Compare Across 1000+ Platforms',
    subtitle: 'From electronics to food, travel to healthcare',
    bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
  },
  {
    id: 3,
    title: 'AI-Powered Smart Savings',
    subtitle: 'Auto-apply coupons, track prices, get deal scores',
    bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
  },
  {
    id: 4,
    title: 'Save ₹24,000+ Every Year',
    subtitle: 'Join 10 lakh+ smart shoppers',
    bgGradient: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)'
  }
];

const Onboarding = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (isPaused || currentSlide === slides.length - 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide, nextSlide]);

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  const renderSlideIllustration = (index) => {
    switch(index) {
      case 0:
        return (
          <div className="illustration-composition slide-1-icons">
            <BarChart3 className="floating-icon main-icon text-blue-600" size={80} />
            <ShoppingCart className="floating-icon icon-left text-blue-500" size={48} />
            <Sparkles className="floating-icon icon-right text-yellow-500" size={40} />
          </div>
        );
      case 1:
        return (
          <div className="illustration-composition slide-2-icons">
            <ShoppingBag className="platform-icon bounce-1" />
            <UtensilsCrossed className="platform-icon bounce-2" />
            <Plane className="platform-icon bounce-3" />
            <HeartPulse className="platform-icon bounce-4" />
            <GraduationCap className="platform-icon bounce-5" />
          </div>
        );
      case 2:
        return (
          <div className="illustration-composition slide-3-icons">
            <Bot className="center-bot text-indigo-600 pulse-glow" size={72} />
            <div className="orbit-icons">
              <Tag className="orbit-icon text-rose-500 pos-1" size={32} />
              <TrendingDown className="orbit-icon text-emerald-500 pos-2" size={32} />
              <BadgePercent className="orbit-icon text-amber-500 pos-3" size={32} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="illustration-composition slide-4-content">
            <div className="savings-badge scale-up">₹24,000+</div>
            <div className="users-pill fade-up">10L+ Users</div>
          </div>
        );
      default: return null;
    }
  };

  const getLanguageName = (code) => {
    const langs = {
      en: 'English',
      hi: 'हिन्दी',
      bn: 'বাংলা',
      te: 'తెలుగు',
      mr: 'मराठी',
      ta: 'தமிழ்',
      ur: 'اردو',
      gu: 'ગુજરાતી',
      kn: 'ಕನ್ನಡ',
      ml: 'മലയാളം'
    };
    return langs[code] || 'English';
  };

  return (
    <div 
      className="onboarding-container" 
      style={{ background: slides[currentSlide].bgGradient }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleTouchStart}
      onMouseLeave={handleTouchEnd}
    >
      {currentSlide < slides.length - 1 && (
        <button className="skip-button" onClick={onComplete}>
          {t('Skip', 'Skip')}
        </button>
      )}

      <div className="slides-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="slide-item">
            <div className="illustration-container">
              {renderSlideIllustration(index)}
            </div>
            
            <div className={`slide-content ${currentSlide === index ? 'active' : ''}`}>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="onboarding-controls">
        <div className="dots-container">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {currentSlide < slides.length - 1 ? (
          <button className="next-button" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        ) : (
          <div className="final-slide-controls fade-in-up">
            <button 
              className="lang-selector-btn" 
              onClick={() => setIsLangPickerOpen(true)}
            >
              <Globe size={18} />
              <span>{getLanguageName(i18n.language || 'en')}</span>
            </button>
            <button className="get-started-button" onClick={onComplete}>
              {t('Get Started', 'Get Started')}
            </button>
          </div>
        )}
      </div>

      <LanguagePicker 
        isOpen={isLangPickerOpen} 
        onClose={() => setIsLangPickerOpen(false)} 
        onSelectLanguage={(lang) => {
          setIsLangPickerOpen(false);
          // Assuming i18n is configured
        }}
      />
    </div>
  );
};

export default Onboarding;
