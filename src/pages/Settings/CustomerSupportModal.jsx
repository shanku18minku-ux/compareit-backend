import React, { useState, useEffect, useRef } from 'react';
import { 
  X, MessageSquare, Phone, Mail, HelpCircle, 
  Clock, ArrowLeft, Send, Bot, User as UserIcon, PhoneCall, CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './CustomerSupport.css';
import useAppStore from '../../store/appStore';

// Initial chat greeting
const INITIAL_MESSAGES = [
  { id: 1, text: "Hi there! I'm your AI Support Assistant. How can I help you today?", sender: 'ai' }
];

// Mock tickets
const MOCK_TICKETS = [
  { id: '#T-4920', status: 'open', title: 'Issue with recent order cashback', date: 'Aug 1, 2026' },
  { id: '#T-4811', status: 'resolved', title: 'Account login problem', date: 'Jul 25, 2026' }
];

const CustomerSupportModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  
  // States: 'menu' | 'chat' | 'tickets' | 'faqs'
  const [view, setView] = useState('menu');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [escalated, setEscalated] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, view, isTyping]);

  if (!isOpen) return null;

  const handleClose = () => {
    setView('menu');
    setMessages(INITIAL_MESSAGES);
    setEscalated(false);
    onClose();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMsg = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      if (escalated) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: "Human Agent: I've received your message. I'm checking your account details now.", 
          sender: 'ai' 
        }]);
      } else {
        // AI Logic simulation
        const msgLower = newUserMsg.text.toLowerCase();
        if (msgLower.includes('human') || msgLower.includes('agent') || msgLower.includes('call') || msgLower.includes('talk')) {
          setEscalated(true);
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Transferring you to a Human Agent...",
            sender: 'system'
          }]);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              text: "Hi, I'm Sarah from the support team. How can I assist you further?",
              sender: 'ai'
            }]);
          }, 1500);
        } else {
          setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: "I understand you're facing an issue. Could you provide a bit more detail? (Tip: Type 'human' to connect to an agent)", 
            sender: 'ai' 
          }]);
        }
      }
    }, 1000);
  };

  const renderMenu = () => (
    <div className="support-modal-body">
      <button className="support-action-btn primary" onClick={() => setView('chat')}>
        <div className="support-action-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
          <MessageSquare size={24} />
        </div>
        <div className="support-action-text">
          <h4>{t('support.chatAI', 'Chat with AI / Agent')}</h4>
          <p>{t('support.chatAIDesc', 'Instant help, 24/7. Connects to human if needed.')}</p>
        </div>
      </button>

      <button className="support-action-btn" onClick={() => window.location.href = 'tel:18001234567'}>
        <div className="support-action-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
          <PhoneCall size={24} />
        </div>
        <div className="support-action-text">
          <h4>{t('support.call', 'Call Customer Care')}</h4>
          <p>{t('support.callDesc', 'Toll-free: 1800-123-4567')}</p>
        </div>
      </button>

      <button className="support-action-btn" onClick={() => window.open('https://wa.me/1234567890', '_blank')}>
        <div className="support-action-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
          <MessageSquare size={24} />
        </div>
        <div className="support-action-text">
          <h4>{t('support.whatsapp', 'WhatsApp Support')}</h4>
          <p>{t('support.whatsappDesc', 'Get help directly on WhatsApp')}</p>
        </div>
      </button>

      <button className="support-action-btn" onClick={() => window.location.href = 'mailto:www.compareit19022026@gmail.com'}>
        <div className="support-action-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          <Mail size={24} />
        </div>
        <div className="support-action-text">
          <h4>{t('support.email', 'Email Support')}</h4>
          <p>{t('support.emailDesc', 'www.compareit19022026@gmail.com')}</p>
        </div>
      </button>

      <button className="support-action-btn" onClick={() => setView('tickets')}>
        <div className="support-action-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
          <Clock size={24} />
        </div>
        <div className="support-action-text">
          <h4>{t('support.track', 'Track Support Tickets')}</h4>
          <p>{t('support.trackDesc', 'View your past and active complaints')}</p>
        </div>
      </button>
    </div>
  );

  const renderChat = () => (
    <div className="chat-container">
      <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-color, #e2e8f0)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="back-btn" onClick={() => setView('menu')}>
          <ArrowLeft size={18} /> {t('Back')}
        </button>
        <span style={{ fontWeight: '500', color: escalated ? '#16a34a' : '#2563eb' }}>
          {escalated ? 'Chatting with Sarah (Agent)' : 'Chatting with AI Assistant'}
        </span>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble ai" style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          className="chat-input" 
          placeholder={t('support.typeMessage', 'Type your message...')}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputMessage.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );

  const renderTickets = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
        <button className="back-btn" onClick={() => setView('menu')}>
          <ArrowLeft size={18} /> {t('Back')}
        </button>
      </div>
      <div className="support-modal-body">
        {MOCK_TICKETS.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <span className="ticket-id">{ticket.id}</span>
              <span className={`ticket-status ${ticket.status}`}>
                {ticket.status}
              </span>
            </div>
            <h4 className="ticket-title">{ticket.title}</h4>
            <p className="ticket-date">{ticket.date}</p>
          </div>
        ))}
        
        <button className="support-action-btn" style={{ marginTop: 'auto', justifyContent: 'center' }} onClick={() => setView('chat')}>
          <HelpCircle size={20} />
          <span style={{ fontWeight: '500' }}>{t('support.newTicket', 'Raise New Issue')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="support-modal-overlay" onClick={handleClose}>
      <div className="support-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="support-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={24} color="#2563EB" />
            <h2>{t('support.title', 'Customer Support')}</h2>
          </div>
          <button onClick={handleClose} className="support-modal-close">
            <X size={24} color="#64748b" />
          </button>
        </header>
        
        {view === 'menu' && renderMenu()}
        {view === 'chat' && renderChat()}
        {view === 'tickets' && renderTickets()}
      </div>
    </div>
  );
};

export default CustomerSupportModal;
