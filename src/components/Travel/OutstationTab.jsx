import React, { useState } from 'react';
import { Plane, Train, Bus, MapPin, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import useAppStore from '../../store/appStore';

const mockRoutes = {
  flights: [
    {
      id: 'f1',
      operator: 'IndiGo',
      flightNo: '6E-201',
      departure: '06:00',
      arrival: '08:15',
      duration: '2h 15m',
      from: 'DEL',
      to: 'BOM',
      platforms: [
        { name: 'MakeMyTrip', price: 4200, url: 'https://makemytrip.com' },
        { name: 'EaseMyTrip', price: 4100, url: 'https://easemytrip.com' },
        { name: 'Goibibo', price: 4250, url: 'https://goibibo.com' },
        { name: 'ixigo', price: 4150, url: 'https://ixigo.com' }
      ]
    },
    {
      id: 'f2',
      operator: 'Air India',
      flightNo: 'AI-863',
      departure: '09:00',
      arrival: '11:15',
      duration: '2h 15m',
      from: 'DEL',
      to: 'BOM',
      platforms: [
        { name: 'Air India', price: 4800, url: 'https://airindia.in' },
        { name: 'MakeMyTrip', price: 4750, url: 'https://makemytrip.com' },
        { name: 'Cleartrip', price: 4700, url: 'https://cleartrip.com' },
      ]
    }
  ],
  trains: [
    {
      id: 't1',
      operator: 'Vande Bharat Exp',
      trainNo: '22222',
      departure: '15:00',
      arrival: '22:30',
      duration: '7h 30m',
      from: 'CSMT',
      to: 'PUNE',
      platforms: [
        { name: 'IRCTC', price: 1050, url: 'https://irctc.co.in' },
        { name: 'ConfirmTkt', price: 1080, url: 'https://confirmtkt.com' },
        { name: 'ixigo Trains', price: 1060, url: 'https://ixigo.com/trains' },
      ]
    }
  ],
  buses: [
    {
      id: 'b1',
      operator: 'IntrCity SmartBus',
      type: 'A/C Sleeper (2+1)',
      departure: '22:30',
      arrival: '07:00',
      duration: '8h 30m',
      from: 'BLR',
      to: 'HYD',
      platforms: [
        { name: 'IntrCity', price: 1200, url: 'https://intrcity.com' },
        { name: 'RedBus', price: 1250, url: 'https://redbus.in' },
        { name: 'AbhiBus', price: 1190, url: 'https://abhibus.com' },
        { name: 'Paytm Bus', price: 1220, url: 'https://paytm.com/bus-tickets' },
      ]
    }
  ]
};

const OutstationTab = () => {
  const [activeMode, setActiveMode] = useState('flights');
  const { setGlobalRedirectData } = useAppStore();
  
  const modes = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'trains', label: 'Train', icon: Train },
    { id: 'buses', label: 'Bus', icon: Bus },
  ];

  const renderRouteCard = (route) => {
    const sortedPlatforms = [...route.platforms].sort((a, b) => a.price - b.price);
    const bestPlatform = sortedPlatforms[0];

    return (
      <div key={route.id} className="route-card" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div className="route-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px' }}>{route.operator}</h4>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              {route.flightNo || route.trainNo || route.type}
            </span>
          </div>
          <div className="route-timing" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>{route.departure}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{route.from}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{route.duration}</span>
              <ArrowRight size={14} color="rgba(255,255,255,0.3)" />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{route.arrival}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{route.to}</div>
            </div>
          </div>
        </div>

        <div className="platforms-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedPlatforms.map((platform, idx) => {
            const isBest = idx === 0;
            return (
              <div key={platform.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: isBest ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isBest ? '#10B981' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                position: 'relative'
              }}>
                {isBest && (
                  <div style={{
                    position: 'absolute', top: '-8px', left: '8px', background: '#10B981', 
                    color: 'white', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'
                  }}>
                    Cheapest
                  </div>
                )}
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{platform.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>₹{platform.price.toLocaleString()}</span>
                  <button onClick={() => setGlobalRedirectData({ providerName: platform.name || 'Partner', targetUrl: platform.url })} style={{
                    background: isBest ? '#10B981' : 'white',
                    color: isBest ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex', alignItems: 'center'
                  }}>
                    Book <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="outstation-tab" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="mode-selector" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: activeMode === mode.id ? '#2563EB' : 'transparent',
              color: activeMode === mode.id ? 'white' : 'rgba(255,255,255,0.6)',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
          >
            <mode.icon size={16} /> {mode.label}
          </button>
        ))}
      </div>

      <div className="search-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <MapPin size={16} color="#2563EB" style={{ marginRight: '10px' }} />
          <input type="text" placeholder="From (e.g. DEL)" defaultValue="DEL" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <MapPin size={16} color="#EF4444" style={{ marginRight: '10px' }} />
          <input type="text" placeholder="To (e.g. BOM)" defaultValue="BOM" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
        </div>
        <button style={{ background: '#2563EB', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px' }}>
          Search {modes.find(m => m.id === activeMode)?.label}
        </button>
      </div>

      <div className="results-list">
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Top Options</h3>
        {mockRoutes[activeMode].map(route => renderRouteCard(route))}
      </div>
    </div>
  );
};

export default OutstationTab;
