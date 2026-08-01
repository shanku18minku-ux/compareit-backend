import React, { useEffect, Suspense, lazy } from 'react';
import useAppStore from './store/appStore';
import { onAuthChange, getUserProfile } from './services/authService';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase } from './config/supabase';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import './i18n';
import './App.css';
import appLogo from './assets/logo.png';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home/Home'));
const Food = lazy(() => import('./pages/Food/Food'));
const Travel = lazy(() => import('./pages/Travel/Travel'));
const Health = lazy(() => import('./pages/Health/Health'));
const Education = lazy(() => import('./pages/Education/Education'));
import GlobalAffiliateRedirectModal from './components/Global/GlobalAffiliateRedirectModal';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Onboarding from './pages/Onboarding/Onboarding';
import ProfileSetup from './pages/Profile/ProfileSetup';
import Settings from './pages/Settings/Settings';

import BottomNav from './components/BottomNav/BottomNav';
import AICopilot from './components/AICopilot/AICopilot';
import FloatingWidget from './components/FloatingWidget/FloatingWidget';
import CustomerSupportModal from './pages/Settings/CustomerSupportModal';
import LanguagePicker from './components/LanguagePicker/LanguagePicker';
import LocationPrompt from './components/LocationPrompt/LocationPrompt';
import ModuleLoadingSkeleton from './components/Global/ModuleLoadingSkeleton';
import OfflineOverlay from './components/Global/OfflineOverlay';

const ProductList = lazy(() => import('./pages/Ecommerce/ProductList'));
const ProductDetail = lazy(() => import('./pages/Ecommerce/ProductDetail'));
const Coupons = lazy(() => import('./pages/Coupons/Coupons'));
const Logistics = lazy(() => import('./pages/Logistics/Logistics'));
const Vehicles = lazy(() => import('./pages/Vehicles/Vehicles'));
const ProviderDashboard = lazy(() => import('./pages/Admin/ProviderDashboard'));

const SplashScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff, #e0e7ff)'
  }}>
    <img 
      src={appLogo}
      alt="CompareIt" 
      style={{
        width: '200px', // Adjust size as needed
        height: 'auto',
        marginBottom: '2rem',
        animation: 'pulse 2s infinite'
      }} 
    />
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div style={{ width: '12px', height: '12px', backgroundColor: '#2563EB', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
      <div style={{ width: '12px', height: '12px', backgroundColor: '#2563EB', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
      <div style={{ width: '12px', height: '12px', backgroundColor: '#2563EB', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
    </div>
    <style>
      {`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}
    </style>
  </div>
);

const App = () => {
  const {
    user,
    setUser,
    currentScreen,
    setCurrentScreen,
    authPage,
    setAuthPage,
    activeTab,
    setActiveTab,
    isSettingsOpen,
    isLanguagePickerOpen,
    viewMode,
    goToDashboard
  } = useAppStore();

  useEffect(() => {
    // Initialize GoogleAuth plugin
    GoogleSignIn.initialize({
      clientId: '502172302950-nej2aod4j8ugr99ks29fen5btqsaa07a.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });

    // Setup deep link listener for Capacitor OAuth
    const setupDeepLink = async () => {
      await CapApp.addListener('appUrlOpen', async (event) => {
        if (event.url.includes('login-callback')) {
          await Browser.close();
          const url = new URL(event.url);
          const code = url.searchParams.get('code');
          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          } else {
            const hashParams = new URLSearchParams(url.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
            }
          }
        }
      });
    };
    setupDeepLink();

    // Show loading initially
    setCurrentScreen('loading');

    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        try {
          const profile = await getUserProfile(authUser.uid);
          // Merge auth user details with firestore/supabase profile
          const fullUser = { 
            ...authUser, 
            ...profile,
            isProfileComplete: profile?.isProfileComplete || false,
            isOnboarded: profile?.isOnboarded || false
          };
          
          setUser(fullUser);
          
          if (!fullUser.isOnboarded) {
            setCurrentScreen('onboarding');
          } else if (!fullUser.isProfileComplete && fullUser.authProvider !== 'guest') {
            setCurrentScreen('profileSetup');
          } else {
            setCurrentScreen('main');
          }
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          setUser(authUser);
          setCurrentScreen('main'); // Fallback to main on error
        }
      } else {
        setUser(null);
        // Check if device has seen onboarding before
        const hasSeenOnboarding = localStorage.getItem('compareit_has_seen_onboarding');
        if (!hasSeenOnboarding) {
          setCurrentScreen('onboarding');
        } else {
          setCurrentScreen('auth');
        }
      }
    });

    return () => unsubscribe();
  }, [setUser, setCurrentScreen]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('compareit_has_seen_onboarding', 'true');
    if (user) {
      if (!user.isProfileComplete && user.authProvider !== 'guest') {
        setCurrentScreen('profileSetup');
      } else {
        setCurrentScreen('main');
      }
    } else {
      setCurrentScreen('auth');
    }
  };

  const handleProfileSetupComplete = () => {
    setCurrentScreen('main');
  };

  const handleProfileSetupSkip = () => {
    setCurrentScreen('main');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return <SplashScreen />;
        
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
        
      case 'auth':
        if (authPage === 'login') {
          return <Login onNavigate={setAuthPage} onLoginSuccess={() => {}} />;
        }
        if (authPage === 'signup') {
          return <Signup onNavigate={setAuthPage} onLoginSuccess={() => {}} />;
        }
        if (authPage === 'forgot') {
          return <ForgotPassword onNavigate={setAuthPage} />;
        }
        return null;
        
      case 'profileSetup':
        return (
          <ProfileSetup 
            onComplete={handleProfileSetupComplete} 
            onSkip={handleProfileSetupSkip} 
          />
        );
        
      case 'main':
        return (
          <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' /* offset for bottom nav */ }}>
              <Suspense fallback={<ModuleLoadingSkeleton />}>
                {viewMode === 'pdp' && <ProductDetail />}
                {viewMode === 'plp' && <ProductList />}
                {viewMode === 'coupons' && <Coupons />}
                {viewMode === 'logistics' && <Logistics />}
                {viewMode === 'vehicles' && <Vehicles />}
                {viewMode === 'admin' && <ProviderDashboard />}
                {viewMode === 'dashboard' && (
                  <>
                    {activeTab === 'home' && <Home />}
                    {activeTab === 'food' && <Food />}
                    {activeTab === 'travel' && <Travel />}
                    {activeTab === 'health' && <Health />}
                    {activeTab === 'education' && <Education />}
                  </>
                )}
              </Suspense>
            </div>
            
            <BottomNav activeTab={activeTab} onTabChange={(tab) => { 
              goToDashboard(); 
              useAppStore.getState().setSettingsOpen(false); // Close settings when navigating
              // Force re-render even if same tab is clicked (fixes home re-open bug)
              if (tab === activeTab) {
                setActiveTab('__reset__');
                setTimeout(() => setActiveTab(tab), 0);
              } else {
                setActiveTab(tab);
              }
            }} />

            
            {isSettingsOpen && <Settings />}
            {isLanguagePickerOpen && <LanguagePicker />}
            <LocationPrompt />
            {!(viewMode === 'dashboard' && activeTab === 'home') && <FloatingWidget />}
          </div>
        );
        
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}

      {/* Global Overlays */}
      <GlobalAffiliateRedirectModal />
      <OfflineOverlay />
      
      {/* Global Modals */}
      <CustomerSupportModal />
    </div>
  );
};

export default App;
