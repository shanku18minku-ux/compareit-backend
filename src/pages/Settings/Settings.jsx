import React, { useState } from 'react';
import { 
  User, Globe, Bell, Lock, LogOut, Trash2, 
  Info, Shield, Star, ChevronRight, Edit3, X, Database
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logOut } from '../../services/authService';
import useAppStore from '../../store/appStore';
import LanguagePicker, { LANGUAGES } from '../../components/LanguagePicker/LanguagePicker';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import { HelpCircle, PlayCircle } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // Mock user data
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarInitials: 'JD'
  };

  const { setSettingsOpen } = useAppStore();

  const handleLogout = async () => {
    if (window.confirm(t('logout_confirm', 'Are you sure you want to logout?'))) {
      console.log('Logging out...');
      try {
        await logOut();
        setSettingsOpen(false);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('delete_confirm', 'WARNING: This will permanently delete your account. Are you sure?'))) {
      console.log('Deleting account...');
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t('settings', 'Settings')}</h1>
        <button onClick={() => {
          import('../../store/appStore').then(module => {
            module.default.getState().setSettingsOpen(false);
          });
        }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={24} color="#1f2937" />
        </button>
      </header>

      <div className="settings-content">
        {/* Profile Section */}
        <section className="settings-section profile-section">
          <div className="profile-info-row">
            <div className="profile-avatar">
              {user.avatarInitials}
            </div>
            <div className="profile-details">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <button className="edit-profile-btn">
              <Edit3 size={18} />
              <span>{t('edit', 'Edit')}</span>
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="settings-section">
          <h3>{t('preferences', 'Preferences')}</h3>
          <div className="settings-card">
            
            <div 
              className="settings-item clickable"
              onClick={() => setIsLangPickerOpen(true)}
            >
              <div className="item-left">
                <div className="icon-wrapper bg-blue"><Globe size={20} /></div>
                <span>{t('language', 'Language')}</span>
              </div>
              <div className="item-right">
                <span className="value-text">{currentLang.native}</span>
                <ChevronRight size={20} color="#94a3b8" />
              </div>
            </div>
            
            <div className="settings-divider" />

            <div className="settings-item">
              <div className="item-left">
                <div className="icon-wrapper bg-purple"><Bell size={20} /></div>
                <span>{t('push_notifications', 'Push Notifications')}</span>
              </div>
              <div className="item-right">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notifications} 
                    onChange={() => setNotifications(!notifications)} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

          </div>
        </section>

        {/* Account Section */}
        <section className="settings-section">
          <h3>{t('account', 'Account')}</h3>
          <div className="settings-card">
            
            <div className="settings-item clickable">
              <div className="item-left">
                <div className="icon-wrapper bg-gray"><Lock size={20} /></div>
                <span>{t('change_password', 'Change Password')}</span>
              </div>
              <div className="item-right">
                <ChevronRight size={20} color="#94a3b8" />
              </div>
            </div>
            
            <div className="settings-divider" />

            <div className="settings-item clickable text-red" onClick={handleLogout}>
              <div className="item-left">
                <div className="icon-wrapper bg-red-light"><LogOut size={20} /></div>
                <span>{t('logout', 'Logout')}</span>
              </div>
            </div>
            
            <div className="settings-divider" />

            <div className="settings-item clickable text-red" onClick={handleDeleteAccount}>
              <div className="item-left">
                <div className="icon-wrapper bg-red-light"><Trash2 size={20} /></div>
                <span>{t('delete_account', 'Delete Account')}</span>
              </div>
            </div>

          </div>
        </section>

        {/* Support Section is moved to Home Header */}

        <div className="settings-section">
          <h2>{t('about', 'About')}</h2>
          <div className="settings-card">

            <div className="settings-item clickable" onClick={() => setIsPrivacyOpen(true)}>
              <div className="item-left">
                <div className="icon-wrapper bg-gray"><Shield size={20} /></div>
                <span>{t('privacy_policy', 'Privacy Policy')}</span>
              </div>
              <div className="item-right">
                <ChevronRight size={20} color="#94a3b8" />
              </div>
            </div>
            
            <div className="settings-divider" />

            <div className="settings-item clickable" onClick={() => setIsTermsOpen(true)}>
              <div className="item-left">
                <div className="icon-wrapper bg-gray"><Info size={20} /></div>
                <span>{t('terms_of_service', 'Terms of Service')}</span>
              </div>
              <div className="item-right">
                <ChevronRight size={20} color="#94a3b8" />
              </div>
            </div>
            
            <div className="settings-divider" />

            <div className="settings-item clickable">
              <div className="item-left">
                <div className="icon-wrapper bg-yellow"><Star size={20} /></div>
                <span>{t('rate_us', 'Rate Us')}</span>
              </div>
              <div className="item-right">
                <ChevronRight size={20} color="#94a3b8" />
              </div>
            </div>

          </div>
          
          <div className="app-version">
            CompareIt v1.0.0
          </div>
        </div>
      </div>

      <LanguagePicker 
        isOpen={isLangPickerOpen}
        onClose={() => setIsLangPickerOpen(false)}
      />

      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsOfServiceModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
};

export default Settings;
