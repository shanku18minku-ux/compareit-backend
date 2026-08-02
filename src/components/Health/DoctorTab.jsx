import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import useAppStore from '../../store/appStore';
import { filterByLocation } from '../../utils/locationEngine.js';
import { Star, Clock, Video, Phone, MessageCircle, Home, Building2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import './DoctorTab.css';

const mockDoctors = [
  {
    id: 'd1',
    name: 'Dr. Sharma',
    specialty: 'Cardiologist',
    experience: '15 Years',
    rating: 4.8,
    reviews: 1240,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    platforms: [
      { name: 'Apollo 24|7', type: 'Video', price: 800, nextAvailable: 'In 10 mins', recommended: true },
      { name: 'Practo', type: 'Clinic', price: 1200, nextAvailable: 'Today, 5 PM', recommended: false },
      { name: 'Tata 1mg', type: 'Voice', price: 600, nextAvailable: 'In 30 mins', recommended: true, cheapest: true }
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Priya Reddy',
    specialty: 'Dermatologist',
    experience: '8 Years',
    rating: 4.6,
    reviews: 890,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    platforms: [
      { name: 'Practo', type: 'Video', price: 500, nextAvailable: 'In 15 mins', recommended: true, cheapest: true },
      { name: 'MFine', type: 'Chat', price: 300, nextAvailable: 'Instantly', recommended: true },
      { name: 'MediBuddy', type: 'Clinic', price: 800, nextAvailable: 'Tomorrow, 10 AM', recommended: false }
    ]
  },
  {
    id: 'd3',
    name: 'Dr. Ramesh Kumar',
    specialty: 'General Physician',
    experience: '20 Years',
    rating: 4.9,
    reviews: 3200,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop',
    platforms: [
      { name: 'Tata 1mg', type: 'Video', price: 400, nextAvailable: 'In 5 mins', recommended: true },
      { name: 'DocsApp', type: 'Chat', price: 150, nextAvailable: 'Instantly', recommended: true, cheapest: true },
      { name: 'Practo', type: 'Clinic', price: 600, nextAvailable: 'Today, 2 PM', recommended: false }
    ]
  },
  {
    id: 'd4',
    name: 'Dr. Anjali Desai',
    specialty: 'Pediatrician',
    experience: '12 Years',
    rating: 4.7,
    reviews: 1560,
    photo: 'https://images.unsplash.com/photo-1594824432258-29408226068d?w=150&h=150&fit=crop',
    platforms: [
      { name: 'Apollo 24|7', type: 'Video', price: 700, nextAvailable: 'In 20 mins', recommended: false },
      { name: 'Practo', type: 'Clinic', price: 900, nextAvailable: 'Today, 6 PM', recommended: false },
      { name: 'Lybrate', type: 'Voice', price: 450, nextAvailable: 'In 10 mins', recommended: true, cheapest: true }
    ]
  }
];

const specialties = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Gynecologist', 
  'Pediatrician', 'Orthopedic', 'Neurologist', 'Psychiatrist', 
  'Dentist', 'Eye Specialist', 'Physiotherapist', 'Nutritionist'
];

const hospitals = [
  { name: 'Apollo', logo: '🏥' },
  { name: 'Fortis', logo: '🏥' },
  { name: 'Max Healthcare', logo: '🏥' },
  { name: 'Manipal', logo: '🏥' },
  { name: 'Narayana', logo: '🏥' },
  { name: 'Medanta', logo: '🏥' }
];

const getTypeIcon = (type) => {
  switch (type) {
    case 'Video': return <Video size={14} />;
    case 'Voice': return <Phone size={14} />;
    case 'Chat': return <MessageCircle size={14} />;
    case 'Home Visit': return <Home size={14} />;
    case 'Clinic': return <Building2 size={14} />;
    default: return <Stethoscope size={14} />;
  }
};

const DoctorCard = ({ doctor, handleBook }) => {
  const { t } = useTranslation();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [couponMode, setCouponMode] = useState('auto');
  const [couponCode, setCouponCode] = useState('');
  
  let cheapestPlatformIdx = 0;
  doctor.platforms.forEach((p, idx) => {
    if (p.price < doctor.platforms[cheapestPlatformIdx].price) {
      cheapestPlatformIdx = idx;
    }
  });

  const activePlatform = doctor.platforms[activeTabIdx];
  const isCheapest = activeTabIdx === cheapestPlatformIdx;
  
  const originalPrice = activePlatform.price + 150; 
  let finalPrice = activePlatform.price;
  
  if (couponMode === 'manual' && couponCode.toUpperCase() === 'SAVE50') {
    finalPrice = activePlatform.price - 50;
  }

  return (
    <div className="doctor-card">
      <div className="doctor-header">
        <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
        <div className="doctor-info">
          <h4 className="doctor-name">{doctor.name} <ShieldCheck size={16} className="verified-icon" /></h4>
          <p className="doctor-specialty">{doctor.specialty} • {doctor.experience}</p>
          <div className="doctor-rating">
            <Star size={14} className="star-icon" />
            <span className="rating-val">{doctor.rating}</span>
            <span className="reviews-val">({doctor.reviews})</span>
          </div>
        </div>
      </div>
      
      <div className="platforms-comparison">
        <div className="comparison-title">{t('auto_compare_consultation_de43', 'Compare Consultation Options')}</div>
        
        <div className="platform-tabs">
          {doctor.platforms.map((platform, idx) => (
            <button 
              key={idx} 
              className={`plat-tab-btn ${activeTabIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveTabIdx(idx)}
            >
              {platform.name}
            </button>
          ))}
        </div>
        
        <div className={`platform-content-box ${isCheapest ? 'recommended-box' : ''}`}>
           {isCheapest && <div className="rec-badge-top">⭐ APP RECOMMENDED</div>}
           <div className="plat-content-header">
             <div className="consult-type">
                {getTypeIcon(activePlatform.type)}
                <span>{activePlatform.type} • {activePlatform.nextAvailable}</span>
             </div>
           </div>
           
           <div className="coupon-section">
             <div className="coupon-toggle">
               <label className="radio-label">
                 <input type="radio" name={`coupon-${doctor.id}`} checked={couponMode === 'auto'} onChange={() => setCouponMode('auto')} />
                 Auto Apply Best
               </label>
               <label className="radio-label">
                 <input type="radio" name={`coupon-${doctor.id}`} checked={couponMode === 'manual'} onChange={() => setCouponMode('manual')} />
                 Manual Code
               </label>
             </div>
             
             {couponMode === 'manual' && (
               <div className="manual-coupon-input">
                 <input 
                   type="text" 
                   placeholder={t('auto_code_save50_e6ae', 'Code: SAVE50')} 
                   value={couponCode} 
                   onChange={(e) => setCouponCode(e.target.value)}
                 />
                 <button className="apply-btn">{t('auto_apply_9639', 'Apply')}</button>
               </div>
             )}
             
             {couponMode === 'auto' && (
               <div className="auto-applied-msg">
                 <Zap size={12} className="fast-icon" /> Auto-applied max discount coupons!
               </div>
             )}
           </div>
           
           <div className="platform-action-bottom">
             <div className="price-col-bottom">
               <span className="strike-price">₹{originalPrice}</span>
               <span className="final-price">₹{finalPrice}</span>
             </div>
             <button className={`book-btn-bottom ${isCheapest ? 'btn-recommended' : ''}`} onClick={() => handleBook(activePlatform.name)}>
               Book Now
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const DoctorTab = ({ searchQuery }) => {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const { setGlobalRedirectData, userLocation } = useAppStore();

  let filteredDoctors = filterByLocation(mockDoctors, userLocation?.city).filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery?.toLowerCase().trim() || '') || 
                          doc.specialty.toLowerCase().includes(searchQuery?.toLowerCase().trim() || '');
    const matchesSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });
  
  if (filteredDoctors.length === 0 && searchQuery) {
    const capitalizedQuery = searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    filteredDoctors = [{
      id: `dyn_${Date.now()}`,
      name: `Dr. ${capitalizedQuery} Specialist`,
      specialty: capitalizedQuery,
      experience: '10+ Years',
      rating: 4.8,
      reviews: 500 + Math.floor(Math.random() * 1000),
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
      platforms: [
        { name: 'Apollo 24|7', type: 'Video', price: 800, nextAvailable: 'In 10 mins', recommended: true },
        { name: 'Practo', type: 'Clinic', price: 1000, nextAvailable: 'Today', recommended: false },
        { name: 'Tata 1mg', type: 'Voice', price: 500, nextAvailable: 'In 30 mins', recommended: true, cheapest: true }
      ]
    }];
  }

  // setGlobalRedirectData moved to top

  const handleBook = async (platformName) => {
    const domain = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = `https://www.${domain}.com`;
    setGlobalRedirectData({ providerName: platformName, targetUrl: url });
  };

  return (
    <div className="doctor-tab">
      <div className="specialty-scroll">
        {specialties.map(spec => (
          <button
            key={spec}
            className={`specialty-chip ${selectedSpecialty === spec ? 'active' : ''}`}
            onClick={() => setSelectedSpecialty(selectedSpecialty === spec ? null : spec)}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="hospitals-section">
        <h3 className="section-title">{t('auto_top_hospital_network_b08c', 'Top Hospital Networks')}</h3>
        <div className="hospitals-grid">
          {hospitals.map(hospital => (
            <div key={hospital.name} className="hospital-card" onClick={() => handleBook(hospital.name)}>
              <div className="hospital-logo">{hospital.logo}</div>
              <span className="hospital-name">{hospital.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="doctors-section-wrapper">
        <h3 className="section-title">{t('auto_recommended_doctors_c004', 'Recommended Doctors')}</h3>
        
        <div className="horizontal-doctors-scroll">
          {filteredDoctors.length === 0 ? (
            <div className="no-results">{t('auto_no_doctors_found_for_93a5', 'No doctors found for this query.')}</div>
          ) : (
            filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} handleBook={handleBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorTab;
