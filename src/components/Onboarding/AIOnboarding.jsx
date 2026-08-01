import React, { useState, useEffect } from 'react';
import { Bot, Play, X, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/appStore';
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

  // Simulate video progress
  useEffect(() => {
    let interval;
    if (step === 'playing') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('finished');
            return 100;
          }
          return prev + 5; // Fake progress
        });
      }, 1500); // 30 second simulation (20 steps * 1.5s)
    }
    return () => clearInterval(interval);
  }, [step]);

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
          <>
            <h2 style={{ marginBottom: 20 }}>App Tour</h2>
            <div className="ai-video-container">
              <div style={{ color: 'white', textAlign: 'center' }}>
                <Bot size={48} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Playing Tutorial...</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: 8 }}>Please watch and listen</div>
              </div>
              <div className="video-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ margin: 0 }}>You can skip anytime.</p>
            <button className="ai-btn-secondary" style={{ marginTop: 16, width: '100%' }} onClick={handleClose}>
              Skip Tour
            </button>
          </>
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
