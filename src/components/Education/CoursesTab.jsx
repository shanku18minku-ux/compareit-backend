import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import './CoursesTab.css';
import { Star, Clock, Users, Globe, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import useAppStore from '../../store/appStore';

const mockCourses = [
  {
    id: 'c1',
    title: 'Complete Web Development Bootcamp',
    category: 'Skills',
    instructor: 'Dr. Angela Yu',
    duration: '65 hours',
    language: 'English',
    rating: 4.8,
    enrolled: '1.2M+',
    platforms: [
      { name: 'Udemy', price: 3499, discountPrice: 449, link: 'https://udemy.com' },
      { name: 'Coursera', price: 4000, discountPrice: 3500, link: 'https://coursera.org' }
    ],
    recommended: true,
    logo: '🌐'
  },
  {
    id: 'c2',
    title: 'JEE Main & Advanced 2024 Crash Course',
    category: 'Competitive',
    instructor: 'Alakh Pandey',
    duration: '6 Months',
    language: 'Hinglish',
    rating: 4.9,
    enrolled: '500K+',
    platforms: [
      { name: 'PhysicsWallah', price: 4000, discountPrice: 2500, link: 'https://pw.live' },
      { name: 'Unacademy', price: 15000, discountPrice: 12000, link: 'https://unacademy.com' }
    ],
    recommended: true,
    logo: '⚛️'
  },
  {
    id: 'c3',
    title: 'Data Science Professional Certificate',
    category: 'Higher Ed',
    instructor: 'IBM',
    duration: '11 Months',
    language: 'English',
    rating: 4.7,
    enrolled: '800K+',
    platforms: [
      { name: 'Coursera', price: 3200, discountPrice: 0, note: 'Free Audit Available', link: 'https://coursera.org' },
      { name: 'edX', price: 4500, discountPrice: 3800, link: 'https://edx.org' }
    ],
    recommended: false,
    logo: '📊'
  },
  {
    id: 'c4',
    title: 'Class 12 Physics CBSE',
    category: 'K-12',
    instructor: 'BYJUS Faculty',
    duration: '1 Year',
    language: 'English',
    rating: 4.5,
    enrolled: '200K+',
    platforms: [
      { name: 'BYJUS', price: 25000, discountPrice: 20000, link: 'https://byjus.com' },
      { name: 'Vedantu', price: 18000, discountPrice: 15000, link: 'https://vedantu.com' }
    ],
    recommended: false,
    logo: '🔬'
  }
];

const filters = ['All', 'K-12', 'Competitive', 'Higher Ed', 'Skills', 'Language'];

const CoursesTab = ({ searchQuery }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');
  const { setGlobalRedirectData } = useAppStore();

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesFilter = activeFilter === 'All' || course.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEnroll = (url, platformName) => {
    setGlobalRedirectData({ providerName: platformName || 'Partner', targetUrl: url });
  };

  return (
    <div className="courses-tab">
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

      <div className="courses-list">
        {filteredCourses.length > 0 ? filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            {course.recommended && (
              <div className="ai-badge">
                <ShieldCheck size={12} /> AI Recommended
              </div>
            )}
            
            <div className="course-header">
              <div className="course-icon">{course.logo}</div>
              <div className="course-title-section">
                <h3>{course.title}</h3>
                <p className="instructor">by {course.instructor}</p>
              </div>
            </div>

            <div className="course-meta">
              <span className="meta-item"><Star size={12} className="star-icon" /> {course.rating} ({course.enrolled})</span>
              <span className="meta-item"><Clock size={12} /> {course.duration}</span>
              <span className="meta-item"><Globe size={12} /> {course.language}</span>
            </div>

            <div className="platform-comparisons">
              <h4>Compare Platforms:</h4>
              {course.platforms.map((plat, idx) => (
                <div key={idx} className="platform-row">
                  <span className="plat-name">{plat.name}</span>
                  <div className="price-section">
                    {plat.discountPrice > 0 ? (
                      <>
                        <span className="old-price">₹{plat.price}</span>
                        <span className="new-price">₹{plat.discountPrice}</span>
                      </>
                    ) : plat.note ? (
                      <span className="new-price">{plat.note}</span>
                    ) : (
                      <span className="new-price">₹{plat.price}</span>
                    )}
                    <button 
                      className="enroll-btn"
                      onClick={() => handleEnroll(plat.link, plat.name)}
                    >
                      Enroll <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="coupon-alert">
              <Tag size={12} /> Apply code <strong>{t('auto_learn20_ce89', 'LEARN20')}</strong> for 20% off on selected platforms
            </div>
          </div>
        )) : (
          <div className="no-results">No courses found for "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;
