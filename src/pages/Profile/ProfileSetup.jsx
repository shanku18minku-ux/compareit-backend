import React, { useState } from 'react';
import { Camera, User, Settings, Check, ChevronRight, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// import { updateUserProfile } from '../../services/authService'; // Assuming this exists
// import useAppStore from '../../store/appStore';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import './ProfileSetup.css';

const INTERESTS = [
  'Electronics', 'Fashion', 'Food & Dining', 'Travel', 
  'Health & Beauty', 'Home & Furniture', 'Books', 'Automotive',
  'Sports', 'Toys & Games', 'Groceries', 'Entertainment'
];

const DEFAULT_AVATARS = [
  { id: '1', bg: '#ef4444', text: 'A' },
  { id: '2', bg: '#f97316', text: 'B' },
  { id: '3', bg: '#10b981', text: 'C' },
  { id: '4', bg: '#3b82f6', text: 'D' },
  { id: '5', bg: '#8b5cf6', text: 'E' },
  { id: '6', bg: '#ec4899', text: 'F' }
];

const ProfileSetup = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    avatar: null,
    interests: []
  });

  const progress = step === 1 ? 50 : 100;

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, avatar }));
  };

  const nextStep = () => {
    if (step === 1 && formData.fullName) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    try {
      // await updateUserProfile(formData);
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <header className="setup-header">
        <h1>{t('Complete Your Profile', 'Complete Your Profile')}</h1>
        <p>Step {step} of 2</p>
      </header>

      <div className="steps-container" style={{ transform: `translateX(-${(step - 1) * 100}%)` }}>
        
        {/* Step 1: Basic Info */}
        <div className="step-panel">
          <div className="avatar-section">
            <div className="avatar-upload-circle">
              {formData.avatar ? (
                <div 
                  className="selected-avatar-preview" 
                  style={{ backgroundColor: formData.avatar.bg || '#e2e8f0' }}
                >
                  {formData.avatar.text || <User size={48} />}
                </div>
              ) : (
                <div className="avatar-placeholder">
                  <User size={48} color="#94a3b8" />
                </div>
              )}
              <div className="camera-badge">
                <Camera size={16} />
              </div>
            </div>
            
            <div className="default-avatars">
              {DEFAULT_AVATARS.map(avatar => (
                <div 
                  key={avatar.id}
                  className={`default-avatar ${formData.avatar?.id === avatar.id ? 'selected' : ''}`}
                  style={{ backgroundColor: avatar.bg }}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  {avatar.text}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t('Full Name', 'Full Name')}</label>
            <input 
              type="text" 
              placeholder="e.g., John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="setup-input"
            />
          </div>

          <div className="form-group">
            <label>{t('Gender', 'Gender')}</label>
            <div className="gender-chips">
              {['Male', 'Female', 'Other'].map(g => (
                <button
                  key={g}
                  className={`gender-chip ${formData.gender === g ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                >
                  {t(g, g)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t('Date of Birth', 'Date of Birth')}</label>
            <input 
              type="date" 
              value={formData.dob}
              onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              className="setup-input"
            />
          </div>

          <button 
            className="primary-button" 
            onClick={nextStep}
            disabled={!formData.fullName}
          >
            {t('Next', 'Next')} <ChevronRight size={20} />
          </button>
        </div>

        {/* Step 2: Preferences */}
        <div className="step-panel">
          
          <div className="form-group">
            <label className="flex-label">
              <span>{t('App Language', 'App Language')}</span>
            </label>
            <button 
              className="lang-select-btn"
              onClick={() => setIsLangPickerOpen(true)}
            >
              <span>{i18n.language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
              <Settings size={18} />
            </button>
          </div>

          <div className="form-group mt-6">
            <label className="flex-label">
              <span>{t('Select Your Interests', 'Select Your Interests')}</span>
              <Sparkles size={16} className="text-blue-500" />
            </label>
            <p className="subtitle-text">We'll personalize deals for you</p>
            
            <div className="interests-grid">
              {INTERESTS.map(interest => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    className={`interest-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {isSelected && <Check size={14} />}
                    {t(interest, interest)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="setup-footer">
            <button className="primary-button" onClick={handleComplete}>
              {t('Complete Setup', 'Complete Setup')}
            </button>
            <button className="skip-link" onClick={handleComplete}>
              {t('Complete Later', 'Complete Later')}
            </button>
          </div>
        </div>
      </div>

      <LanguagePicker 
        isOpen={isLangPickerOpen}
        onClose={() => setIsLangPickerOpen(false)}
        onSelectLanguage={() => setIsLangPickerOpen(false)}
      />
    </div>
  );
};

export default ProfileSetup;
