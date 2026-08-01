import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Mic, Send, Bot, User, Sparkles, MoreHorizontal } from 'lucide-react';
import './FloatingWidget.css';
import { parseAIIntent } from '../../services/aiIntentService';
import useAppStore from '../../store/appStore';

const FloatingWidget = () => {
  // Try to use the store if it's properly exported, otherwise fallback to local state for safety in this subagent build
  let isAICopilotOpen = false;
  let toggleAICopilot = () => {};
  
  try {
    const store = useAppStore();
    isAICopilotOpen = store.isAICopilotOpen;
    toggleAICopilot = store.toggleAICopilot;
  } catch (e) {
    console.warn("useAppStore not available or structured differently. Using local state fallback for development.");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [localOpen, setLocalOpen] = useState(false);
    isAICopilotOpen = localOpen;
    toggleAICopilot = () => setLocalOpen(!localOpen);
  }

  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am your CompareIt Copilot. Ask me to find deals, book tickets, or send parcels!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English for better local context (Patna se Delhi, etc)

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            // Append final result and send immediately or let user edit?
            // Let's just set the input value to allow editing
            setInputValue((prev) => prev + finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue(''); // Clear previous input before new dictation
      recognitionRef.current?.start();
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network delay and AI processing
    setTimeout(() => {
      const intentResult = parseAIIntent(userMessage.text);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: intentResult.response,
        intent: intentResult.intent
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="floating-widget-container">
      {isAICopilotOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-title">
              <div className="bot-avatar-header">
                <Sparkles size={16} color="#fff" />
              </div>
              <div>
                <h3>CompareIt Copilot</h3>
                <p>AI-Powered Assistant</p>
              </div>
            </div>
            <button className="close-btn" onClick={toggleAICopilot} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.type}`}>
                {msg.type === 'bot' && (
                  <div className="message-avatar bot">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`message-bubble ${msg.type}`}>
                  <p>{msg.text}</p>
                  {msg.intent && msg.intent !== 'general' && (
                    <div className="intent-badge">
                      {msg.intent}
                    </div>
                  )}
                </div>
                {msg.type === 'user' && (
                  <div className="message-avatar user">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message-avatar bot">
                  <Bot size={16} />
                </div>
                <div className="message-bubble bot typing-indicator">
                  <MoreHorizontal size={24} className="typing-dots" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (e.g. Under 30k phone)"
                rows={1}
                className="chat-input"
              />
              <div className="input-actions">
                <button 
                  type="button" 
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={handleToggleVoice}
                  title={isListening ? "Stop listening" : "Use voice input"}
                >
                  <Mic size={18} />
                  {isListening && <span className="pulse-ring"></span>}
                </button>
                <button 
                  type="submit" 
                  className="send-btn"
                  disabled={!inputValue.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <button 
        className={`fab-button ${isAICopilotOpen ? 'active' : ''}`}
        onClick={toggleAICopilot}
        aria-label="Toggle AI Copilot"
      >
        {isAICopilotOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default FloatingWidget;
