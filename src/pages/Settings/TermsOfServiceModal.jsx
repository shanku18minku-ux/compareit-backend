import React from 'react';
import { X, Info } from 'lucide-react';
import './Settings.css';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-content">
        <header className="settings-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={24} color="#2563EB" />
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Terms of Service</h2>
          </div>
          <button onClick={onClose} className="settings-modal-close">
            <X size={24} color="#64748b" />
          </button>
        </header>
        
        <div className="settings-modal-body" style={{ padding: '20px', overflowY: 'auto', maxHeight: '70vh', color: '#475569', lineHeight: '1.6' }}>
          <p><strong>Effective Date:</strong> August 1, 2026</p>
          
          <p>Welcome to <strong>CompareIt</strong>. By accessing or using our mobile application ("App"), you agree to be bound by these Terms of Service. Please read them carefully.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>1. Nature of Service (Aggregator)</h3>
          <p>CompareIt is a deal discovery and price aggregation platform. We compile information from various third-party services across categories like Food Delivery, E-commerce, Travel, and Health. <strong>We do not sell products, provide services, or process payments directly.</strong> Our sole purpose is to help you compare prices and ETAs.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>2. Third-Party Transactions & Partner Responsibility</h3>
          <p>When you find a deal, service, or vehicle on CompareIt and click to proceed ("Buy," "Book," "Apply"), you will be redirected to the respective third-party provider's platform (e.g., Cars24, GoMechanic, HDFC, Amazon). Any purchase, booking, loan agreement, or transaction is conducted strictly between you and the third-party provider. CompareIt is not liable for vehicle condition, failed deliveries, incorrect pricing, loan rejections, or payment disputes arising from partner platforms.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>3. Official APIs and Partner Terms</h3>
          <p>We source our data through official APIs and authorized integrations with our partners. By utilizing CompareIt, you also agree to be bound by the respective Terms of Service of our integrated partners when you are redirected to their platforms to complete a transaction.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>4. Accuracy of Information</h3>
          <p>While we strive to provide accurate and real-time data regarding prices, surge multipliers, and coupons, we do not guarantee the absolute accuracy of the information displayed. Prices, vehicle availability, and loan interest rates are subject to change rapidly on third-party platforms.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>5. User Responsibilities</h3>
          <p>You agree to use CompareIt for lawful purposes only. You must not attempt to scrape, hack, or reverse-engineer the App's aggregation engine or data sources.</p>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px' }}>6. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of the App following any changes constitutes your acceptance of the new terms.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
