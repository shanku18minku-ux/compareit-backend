import React from 'react';
import { Bot, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AISummaryPopup.css';

const AISummaryPopup = ({ isOpen, onClose, summaryPoints, aiScore }) => {
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
            className="ai-summary-popup"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="summary-header">
              <div className="summary-title">
                <Bot size={24} color="#d946ef" /> AI Summary
              </div>
              <button className="popup-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className="summary-points">
              {summaryPoints && summaryPoints.map((point, idx) => (
                <div key={idx} className="summary-point">
                  <CheckCircle size={18} color="#10b981" className="point-icon" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="ai-confidence">
              <span>AI Confidence</span>
              <span className="confidence-score">{aiScore || 95}%</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISummaryPopup;
