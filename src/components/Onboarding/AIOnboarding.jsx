import React, { useState, useEffect } from 'react';
import { Bot, Play, X, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/appStore';
import AppTourPlayer from './AppTourPlayer';
import './AIOnboarding.css';

const AIOnboarding = () => {
  const { hasSeenAppTour, setHasSeenAppTour, isAppTourOpen, setIsAppTourOpen } = useAppStore();
  
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
            <h2>Welcome to CompareIt! 👋</h2>
            <p>I'm your AI Assistant. I can help you find the best deals across all platforms.</p>
            <p style={{ fontWeight: 500, color: '#3b82f6', marginBottom: 24 }}>Would you like a quick 30-second app tour?</p>
            
            <div className="ai-onboarding-actions">
              <button className="ai-btn-primary" onClick={startTour}>
                <Play size={20} /> Yes, start tour
              </button>
              <button className="ai-btn-secondary" onClick={handleClose}>
                No, maybe later
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
            <div className="ai-avatar-container" style={{ background: '#22c55e', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)' }}>
              <CheckCircle2 size={40} color="white" />
            </div>
            <h2>You're all set! 🚀</h2>
            <p>You can replay this tour anytime from your Profile Settings under "Help".</p>
            
            <div className="ai-onboarding-actions">
              <button className="ai-btn-primary" onClick={handleClose}>
                Start exploring
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIOnboarding;
