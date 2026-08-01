import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import styles from './AICopilot.module.css';

const AICopilot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your CompareIt AI Assistant. How can I help you find the best deals today?", sender: 'ai' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I can help with that! Based on current market trends, I suggest looking at the latest electronics sale on Amazon or Flipkart.",
        sender: 'ai'
      }]);
    }, 1500);
  };

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
      
      <div className={styles.copilotContainer}>
        {isOpen ? (
          <div className={styles.chatDrawer}>
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <Bot size={20} color="#2563EB" />
                <span>{t('auto_ai_assistant_3542', 'AI Assistant')}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.messagesList}>
              {messages.map(msg => (
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.aiWrapper}`}>
                  <div className={`${styles.message} ${msg.sender === 'user' ? styles.userMsg : styles.aiMsg}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
                  <div className={`${styles.message} ${styles.aiMsg} ${styles.typingIndicator}`}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
              <input
                type="text"
                placeholder={t('auto_ask_me_anything_3249', 'Ask me anything...')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          <button className={styles.fab} onClick={() => setIsOpen(true)}>
            <Sparkles size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default AICopilot;
