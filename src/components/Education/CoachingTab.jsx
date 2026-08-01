import React, { useState } from 'react';
import './CoachingTab.css';
import { MapPin, Users, Award, Navigation2, CheckCircle2, Gift } from 'lucide-react';
import useAppStore from '../../store/appStore';

const mockCoaching = [
  {
    id: 'ch1',
    name: 'Allen Career Institute',
    city: 'Kota',
    exam: 'JEE',
    mode: 'Offline',
    successRate: '28%',
    reviews: '4.8 (10k+)',
    distance: '2.5 km',
    platforms: [
      { name: 'Direct Enroll', fee: '1,45,000' },
      { name: 'Scholarship Test', fee: 'Up to 90% Off' }
    ],
    demo: true,
    scholarship: {
      text: 'Up to 90% Online Scholarship',
      link: 'https://allen.ac.in/scholarship'
    }
  },
  {
    id: 'ch2',
    name: 'Vajiram & Ravi',
    city: 'Delhi',
    exam: 'UPSC',
    mode: 'Hybrid',
    successRate: '15%',
    reviews: '4.9 (5k+)',
    distance: 'New Delhi',
    platforms: [
      { name: 'Classroom', fee: '1,75,000' },
      { name: 'Online Live', fee: '95,000' }
    ],
    demo: false,
    scholarship: null
  },
  {
    id: 'ch3',
    name: 'TIME',
    city: 'Mumbai',
    exam: 'CAT',
    mode: 'Hybrid',
    successRate: '35%',
    reviews: '4.5 (8k+)',
    distance: '4.2 km',
    platforms: [
      { name: 'Classroom Program', fee: '55,000' },
      { name: 'Self Paced', fee: '25,000' }
    ],
    demo: true,
    scholarship: {
      text: '100% Scholarship for Top 100',
      link: 'https://time4education.com/scholarship'
    }
  },
  {
    id: 'ch4',
    name: 'Aakash Institute',
    city: 'Online',
    exam: 'School',
    mode: 'Online',
    successRate: '40%',
    reviews: '4.6 (12k+)',
    distance: 'N/A',
    platforms: [
      { name: 'Live Classes', fee: '45,000' }
    ],
    demo: true,
    scholarship: {
      text: 'Up to 100% Scholarship Test (ANTHE)',
      link: 'https://aakash.ac.in/anthe'
    }
  }
];

const filters = ['All', 'UPSC', 'JEE', 'NEET', 'CAT', 'Banking', 'School'];

const CoachingTab = ({ searchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { setGlobalRedirectData } = useAppStore();

  const filtered = mockCoaching.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.exam === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="coaching-tab">
      <div className="chips-container">
        {filters.map(filter => (
          <button 
            key={filter} 
            className={`chip ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* <div className="scholarship-banner">
        <Award className="banner-icon" />
        <div className="banner-content">
          <h4>CompareIt Scholarship</h4>
          <p>Take our test and get up to 100% fee waiver across 500+ institutes!</p>
        </div>
        <button className="apply-btn">Apply</button>
      </div> */}

      <div className="coaching-list">
        {filtered.map(item => (
          <div key={item.id} className="coaching-card">
            {item.demo && <div className="demo-badge">Free Demo Available</div>}
            
            <div className="coaching-header">
              <h3>{item.name}</h3>
              <span className="mode-badge">{item.mode}</span>
            </div>
            
            <div className="coaching-meta">
              <span><MapPin size={12}/> {item.city} ({item.distance})</span>
              <span><CheckCircle2 size={12}/> {item.exam}</span>
              <span><Users size={12}/> Success: {item.successRate}</span>
            </div>

            {/* Direct Scholarship Tag */}
            {item.scholarship && (
              <div className="direct-scholarship-tag">
                <div className="direct-scholarship-info">
                  <Gift size={14} className="gift-icon" />
                  <span>{item.scholarship.text}</span>
                </div>
                <button 
                  className="direct-scholarship-apply"
                  onClick={() => setGlobalRedirectData({ providerName: 'Partner', targetUrl: item.scholarship.link })}
                >
                  Apply Now
                </button>
              </div>
            )}

            <div className="fee-comparison">
              {item.platforms.map((plat, idx) => (
                <div key={idx} className="fee-row">
                  <span className="fee-type">{plat.name}</span>
                  <span className="fee-amount">₹{plat.fee}</span>
                </div>
              ))}
            </div>

            <div className="coaching-actions">
              <button className="action-btn secondary">
                <Navigation2 size={14} /> Directions
              </button>
              <button className="action-btn primary" onClick={() => {
                const domain = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                setGlobalRedirectData({ providerName: item.name, targetUrl: `https://www.${domain}.com` });
              }}>
                Enquire Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachingTab;
