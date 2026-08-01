import React, { useState, useEffect } from 'react';
import { Bot, Play, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAppStore from '../../store/appStore';
import AppTourPlayer from './AppTourPlayer';
import './AIOnboarding.css';

const AIOnboarding = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language && i18n.language.startsWith('hi') ? 'hi' : 'en';

  const hasSeenAppTour = useAppStore(state => state.hasSeenAppTour);
  const setHasSeenAppTour = useAppStore(state => state.setHasSeenAppTour);
  const isAppTourOpen = useAppStore(state => state.isAppTourOpen);
  const setIsAppTourOpen = useAppStore(state => state.setIsAppTourOpen);
  
  const [step, setStep] = useState('greeting'); // 'greeting', 'playing', 'finished'
  const [progress, setProgress] = useState(0);

  // Auto-trigger for first time users
  useEffect(() => {
    if (!hasSeenAppTour && !isAppTourOpen) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsAppTourOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenAppTour, isAppTourOpen]);

  // Fake progress effect removed in favor of AppTourPlayer

  if (!isAppTourOpen) return null;

  const handleClose = () => {
    setIsAppTourOpen(false);
    setHasSeenAppTour(true);
    setStep('greeting');
    setProgress(0);
  };

  const startTour = () => {
    setStep('playing');
  };

  return (
    <div className="ai-onboarding-overlay">
      <div className="ai-onboarding-card">
        {step !== 'playing' && (
          <button 
            onClick={handleClose}
            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={24} />
          </button>
        )}

        {step === 'greeting' && (
          <>
            <div className="ai-avatar-container">
              <Bot size={40} color="white" />
            </div>
            <h2>{t('onboarding.welcome', currentLang === 'hi' ? 'कम्पेयर इट में आपका स्वागत है! 👋' : 'Welcome to CompareIt! 👋')}</h2>
            <p>{t('onboarding.assistant_intro', currentLang === 'hi' ? 'मैं आपका AI असिस्टेंट हूँ। मैं आपको सबसे अच्छी डील्स खोजने में मदद कर सकता हूँ।' : "I'm your AI Assistant. I can help you find the best deals across all platforms.")}</p>
            <p style={{ fontWeight: 500, color: '#3b82f6', marginBottom: 24 }}>
              {t('onboarding.ask_tour', currentLang === 'hi' ? 'क्या आप ऐप का एक छोटा सा टूर देखना चाहेंगे?' : 'Would you like a quick 30-second app tour?')}
            </p>
            
            <div className="ai-onboarding-actions">
              <button className="ai-btn-primary" onClick={startTour}>
                <Play size={18} /> {t('onboarding.start_tour', currentLang === 'hi' ? 'हाँ, टूर शुरू करें' : 'Yes, start tour')}
              </button>
              <button className="ai-btn-secondary" onClick={handleClose}>
                {t('onboarding.skip', currentLang === 'hi' ? 'अभी नहीं' : 'Not right now')}
              </button>
            </div>
          </>
        )}

        {step === 'playing' && (
          <div style={{ width: '100%', height: '500px', borderRadius: '16px', overflow: 'hidden' }}>
            <AppTourPlayer 
              onComplete={() => setStep('finished')} 
              onClose={handleClose} 
            />
          </div>
        )}

        {step === 'finished' && (
          <>
            <div className="ai-avatar-container" style={{ background: '#22c55e' }}>
              <CheckCircle2 size={40} color="white" />
            </div>
            <h2>{t('onboarding.all_set', currentLang === 'hi' ? 'आप तैयार हैं!' : "You're all set!")}</h2>
            <p>{t('onboarding.enjoy', currentLang === 'hi' ? 'अब आप आसानी से खरीदारी और बुकिंग कर सकते हैं।' : 'You can now start shopping, booking, and saving seamlessly.')}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 12 }}>
              {t('onboarding.replay_hint', currentLang === 'hi' ? '(आप इसे सेटिंग्स > अबाउट से दोबारा देख सकते हैं)' : '(You can replay this anytime from Settings > About)')}
            </p>
            <button className="ai-btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={handleClose}>
              {t('onboarding.get_started', currentLang === 'hi' ? 'शुरू करें' : 'Get Started')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AIOnboarding;
