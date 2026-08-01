import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, SkipForward, RotateCcw, 
  Home, Search, Tag, Grip, Bot, User
} from 'lucide-react';
import useAppStore from '../../store/appStore';
import './AppTourPlayer.css';

// The Data-Driven Tour Configuration
const TOUR_SCENES = [
  {
    id: 1,
    duration: 4000,
    title: "Welcome to CompareIt",
    caption: "The Ultimate Super App for everything.",
    icon: <Bot size={64} color="#38bdf8" />,
    spoken: {
      en: "Welcome to Compare it. The ultimate super app where you can find the best deals on everything.",
      hi: "कम्पेयर इट में आपका स्वागत है। यह आपका अपना सुपर ऐप है।"
    }
  },
  {
    id: 2,
    duration: 4000,
    title: "Home Screen",
    caption: "Your personalized dashboard for trending deals.",
    icon: <Home size={64} color="#22c55e" />,
    spoken: {
      en: "This is your home screen, your personalized dashboard for today's trending deals.",
      hi: "यह आपकी होम स्क्रीन है, जहाँ आप आज की बेहतरीन डील्स देख सकते हैं।"
    }
  },
  {
    id: 3,
    duration: 4500,
    title: "Universal Search",
    caption: "Search across products, services, and categories.",
    icon: <Search size={64} color="#f59e0b" />,
    spoken: {
      en: "Use the universal search to find any product, service, or brand across multiple platforms.",
      hi: "यूनिवर्सल सर्च का उपयोग करके आप किसी भी प्रोडक्ट या सर्विस को आसानी से खोज सकते हैं।"
    }
  },
  {
    id: 4,
    duration: 4500,
    title: "Compare Prices",
    caption: "Instantly compare prices from top platforms.",
    icon: <Tag size={64} color="#ef4444" />,
    spoken: {
      en: "Instantly compare prices from top platforms and always get the lowest price.",
      hi: "विभिन्न प्लेटफार्म्स से कीमतों की तुलना करें और हमेशा सबसे कम कीमत पाएं।"
    }
  },
  {
    id: 5,
    duration: 5000,
    title: "Categories",
    caption: "Food, Travel, Education, Healthcare, and more.",
    icon: <Grip size={64} color="#8b5cf6" />,
    spoken: {
      en: "Explore categories like Food delivery, Travel bookings, Education, Healthcare, and Local Services.",
      hi: "फूड डिलीवरी, ट्रैवल, एजुकेशन, और हेल्थकेयर जैसी कई कैटेगरीज एक्सप्लोर करें।"
    }
  },
  {
    id: 6,
    duration: 4000,
    title: "Profile & Help",
    caption: "Access Wishlist, Settings, and AI Assistant anytime.",
    icon: <User size={64} color="#ec4899" />,
    spoken: {
      en: "Access your profile, wishlist, and settings here. Tap the AI assistant icon anytime for help.",
      hi: "अपनी प्रोफाइल, विशलिस्ट और सेटिंग्स यहाँ देखें। किसी भी मदद के लिए AI असिस्टेंट से पूछें।"
    }
  },
  {
    id: 7,
    duration: 3500,
    title: "You're All Set!",
    caption: "Enjoy your seamless experience.",
    icon: <Bot size={64} color="#22c55e" />,
    spoken: {
      en: "You're all set. Enjoy using Compare it!",
      hi: "आप पूरी तरह तैयार हैं। कम्पेयर इट का आनंद लें!"
    }
  }
];

const AppTourPlayer = ({ onComplete, onClose }) => {
  const language = useAppStore(state => state.language) || 'en';
  
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const sceneTimeoutRef = useRef(null);
  const timeSpentInSceneRef = useRef(0);

  const scene = TOUR_SCENES[currentSceneIndex];

  // Cleanup function for speech and timers
  const cleanup = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (sceneTimeoutRef.current) clearTimeout(sceneTimeoutRef.current);
  };

  useEffect(() => {
    return cleanup;
  }, []);

  const speakCurrentScene = () => {
    if (isMuted || !isPlaying) return;
    if (synthRef.current) synthRef.current.cancel();

    const text = scene.spoken[language] || scene.spoken['en'];
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Set appropriate language voice
    if (language === 'hi') {
      utteranceRef.current.lang = 'hi-IN';
    } else {
      utteranceRef.current.lang = 'en-US';
    }
    
    synthRef.current.speak(utteranceRef.current);
  };

  const advanceScene = () => {
    if (currentSceneIndex < TOUR_SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      timeSpentInSceneRef.current = 0;
      setProgress(0);
    } else {
      handleComplete();
    }
  };

  const startSceneTimer = () => {
    if (!isPlaying) return;

    const remainingTime = scene.duration - timeSpentInSceneRef.current;
    
    progressIntervalRef.current = setInterval(() => {
      timeSpentInSceneRef.current += 100;
      const currentProgress = (timeSpentInSceneRef.current / scene.duration) * 100;
      setProgress(Math.min(currentProgress, 100));
    }, 100);

    sceneTimeoutRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current);
      advanceScene();
    }, remainingTime);
  };

  // Handle Scene Change or Play state change
  useEffect(() => {
    cleanup();
    if (isPlaying) {
      speakCurrentScene();
      startSceneTimer();
    } else {
      // If paused, pause the speech
      if (synthRef.current) synthRef.current.cancel();
    }
  }, [currentSceneIndex, isPlaying, isMuted, language]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel();
    }
  };
  
  const handleReplay = () => {
    cleanup();
    setCurrentSceneIndex(0);
    timeSpentInSceneRef.current = 0;
    setProgress(0);
    setIsPlaying(true);
  };

  const handleComplete = () => {
    cleanup();
    if (onComplete) onComplete();
  };

  return (
    <div className="tour-player-container">
      {/* Animated Scene Display */}
      <div className="tour-scene-display" key={currentSceneIndex}>
        <div className="scene-icon-wrapper">
          <div className="scene-icon-pulse">
            {scene.icon}
          </div>
        </div>
        
        <div className="tour-caption-box">
          <h3>{scene.title}</h3>
          <p>{scene.caption}</p>
        </div>
      </div>

      {/* Video Controls */}
      <div className="tour-controls">
        <div className="tour-progress-wrapper">
          <div className="tour-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="tour-buttons">
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="tour-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="tour-btn" onClick={handleReplay}>
              <RotateCcw size={20} />
            </button>
            <button className="tour-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          
          <button className="tour-btn tour-skip" onClick={handleComplete}>
            Skip <SkipForward size={16} style={{ marginLeft: 4 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppTourPlayer;
