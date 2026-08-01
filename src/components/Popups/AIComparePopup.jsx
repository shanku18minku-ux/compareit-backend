import React from 'react';
import { Bot, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIComparePopup.css';

const AIComparePopup = ({ isOpen, onClose, compareData, bestOptionIndex, savings }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="ai-compare-popup"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="popup-header">
              <div className="popup-title">
                <Bot size={20} color="#d946ef" /> AI Comparison
              </div>
              <button className="popup-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className="compare-list">
              {compareData && compareData.map((item, idx) => (
                <div key={idx} className={`compare-item ${idx === bestOptionIndex ? 'best-option' : ''}`}>
                  <span className="compare-platform">{item.platform}</span>
                  <div className="compare-price-wrap">
                    <span className="compare-price">{item.price}</span>
                    {idx === bestOptionIndex && <CheckCircle2 size={16} color="#10b981" />}
                  </div>
                </div>
              ))}
            </div>

            {savings && (
              <div className="savings-highlight">
                🏆 Best Option — Save {savings}
              </div>
            )}
            
            <button className="open-btn" onClick={onClose}>
              Open Best Option
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIComparePopup;
