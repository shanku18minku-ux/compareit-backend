import { useTranslation } from 'react-i18next';
import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import './FloatingAI.css';

const FloatingAI = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <motion.button 
      className="floating-ai-btn"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Bot size={24} color="#fff" />
      <span>{t('auto_ask_ai_3ed8', 'Ask AI')}</span>
    </motion.button>
  );
};

export default FloatingAI;
