import React from 'react';
import { ShieldAlert } from 'lucide-react';

const GlobalDisclaimer = () => {
  return (
    <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <ShieldAlert size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
      <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>
        <strong>Verified Discovery Engine:</strong> CompareIt partners with authorized platforms via official APIs & deep links. All bookings, purchases, and financing are securely processed on the official partner platforms.
      </p>
    </div>
  );
};

export default GlobalDisclaimer;
