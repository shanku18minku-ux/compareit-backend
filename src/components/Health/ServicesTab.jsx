import React from 'react';
import useAppStore from '../../store/appStore';
import { Microscope, Shield, Dumbbell, Brain, Baby, UserPlus, Ambulance, Star, ExternalLink } from 'lucide-react';
import './ServicesTab.css';

const serviceCategories = [
  {
    title: 'Diagnostics & Tests',
    icon: <Microscope size={20} />,
    color: '#3b82f6',
    services: [
      { name: 'Apollo Diagnostics', desc: 'Full Body Checkup', price: '₹999', rating: 4.8 },
      { name: 'Thyrocare', desc: 'Aarogyam Packages', price: '₹850', rating: 4.6 },
      { name: 'Dr Lal PathLabs', desc: 'Swasthfit Packages', price: '₹1200', rating: 4.7 },
      { name: 'Redcliffe Labs', desc: 'Smart Full Body', price: '₹799', rating: 4.5 }
    ]
  },
  {
    title: 'Health Insurance',
    icon: <Shield size={20} />,
    color: '#8b5cf6',
    services: [
      { name: 'Policybazaar', desc: 'Compare 50+ Plans', price: 'Free Quotes', rating: 4.8 },
      { name: 'ACKO', desc: 'Zero Commission', price: 'From ₹499/mo', rating: 4.6 },
      { name: 'Niva Bupa', desc: 'ReAssure 2.0', price: 'From ₹600/mo', rating: 4.5 }
    ]
  },
  {
    title: 'Mental Wellness',
    icon: <Brain size={20} />,
    color: '#10b981',
    services: [
      { name: 'Amaha', desc: 'Therapy & Psychiatry', price: 'From ₹800', rating: 4.7 },
      { name: 'YourDOST', desc: '24x7 Counseling', price: 'From ₹400', rating: 4.6 },
      { name: 'Wysa', desc: 'AI Chat & Therapists', price: 'Free Trial', rating: 4.8 }
    ]
  },
  {
    title: 'Fitness & Wellness',
    icon: <Dumbbell size={20} />,
    color: '#f59e0b',
    services: [
      { name: 'Cult.fit', desc: 'Gym & Group Classes', price: 'From ₹990/mo', rating: 4.7 },
      { name: 'HealthifyMe', desc: 'Diet & Workouts', price: 'Free Tier', rating: 4.6 }
    ]
  },
  {
    title: 'Emergency Services',
    icon: <Ambulance size={20} />,
    color: '#ef4444',
    services: [
      { name: '112', desc: 'National Emergency', price: 'Free', rating: 5.0, urgent: true },
      { name: 'StanPlus', desc: 'Red Ambulances', price: 'Varies', rating: 4.7, urgent: true },
      { name: 'Ziqitza', desc: 'Ambulance Network', price: 'Varies', rating: 4.5, urgent: true }
    ]
  }
];

const ServicesTab = ({ searchQuery }) => {
  
  const { setGlobalRedirectData } = useAppStore();

  const handleVisit = async (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  const filteredCategories = serviceCategories.map(cat => ({
    ...cat,
    services: cat.services.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.services.length > 0);

  return (
    <div className="services-tab">
      
      <div className="services-intro">
        <h3>Explore Health Services</h3>
        <p>Compare diagnostic labs, insurances, and wellness platforms in one place.</p>
      </div>

      <div className="services-container">
        {filteredCategories.length === 0 ? (
          <div className="no-results">No services found for this query.</div>
        ) : (
          filteredCategories.map(category => (
            <div key={category.title} className="service-category-block">
              <div className="category-header">
                <div className="category-icon" style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                  {category.icon}
                </div>
                <h4 className="category-title">{category.title}</h4>
              </div>

              <div className="service-cards-scroll">
                {category.services.map(service => (
                  <div key={service.name} className={`service-card ${service.urgent ? 'urgent-card' : ''}`}>
                    <div className="service-card-header">
                      <span className="service-name">{service.name}</span>
                      <div className="service-rating">
                        <Star size={12} className="star-icon" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                    <p className="service-desc">{service.desc}</p>
                    
                    <div className="service-footer">
                      <span className="service-price">{service.price}</span>
                      <button 
                        className={`visit-btn ${service.urgent ? 'urgent-btn' : ''}`}
                        onClick={() => handleVisit(service.name)}
                      >
                        {service.urgent ? 'Call Now' : 'Visit'} <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
