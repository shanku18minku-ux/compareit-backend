import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, GraduationCap, Calendar, Briefcase, Bell, BellRing, Link2, Sparkles, SlidersHorizontal, CheckCircle2, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { govtExams } from '../../services/mockData';
import useAppStore from '../../store/appStore';
import './GovtExamsTab.css';

const GovtExamsTab = ({ searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState('All Jobs');
  const [examType, setExamType] = useState('All'); 
  const [userQualification, setUserQualification] = useState('All'); 
  const [exams, setExams] = useState(govtExams);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSector, setFilterSector] = useState('All');
  const { setGlobalRedirectData } = useAppStore();

  const categories = ['All Jobs', 'Latest Jobs', 'Admit Cards', 'Results', 'Upcoming Exams', 'Previous Papers'];
  const qualifications = ['All', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Engineering', 'Medical'];
  const sectors = ['All', 'UPSC', 'SSC', 'Banking', 'Railway', 'Defence', 'Police', 'State PSC', 'PSU', 'Teaching'];

  const toggleNotification = (id) => {
    setExams(exams.map(exam => 
      exam.id === id ? { ...exam, notificationOn: !exam.notificationOn } : exam
    ));
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = examType === 'All' ? true : exam.type === examType;
    const matchesQual = userQualification === 'All' ? true : exam.qualification === userQualification;
    const matchesSector = filterSector === 'All' ? true : exam.sector === filterSector;
    
    let matchesCategory = true;
    if (activeCategory === 'Admit Cards') matchesCategory = exam.status === 'Admit Card';
    else if (activeCategory === 'Results') matchesCategory = exam.status === 'Result';
    else if (activeCategory === 'Upcoming Exams') matchesCategory = exam.status === 'Upcoming';
    else if (activeCategory === 'Latest Jobs') matchesCategory = exam.status === 'Active';
    else if (activeCategory === 'Previous Papers') matchesCategory = false; // Mock empty state
    
    return matchesSearch && matchesType && matchesQual && matchesSector && matchesCategory;
  });

  const handleApply = async (url) => {
    if (url && url !== '#') {
      setGlobalRedirectData({ providerName: 'Partner', targetUrl: url });
    } else {
      alert("Application link will be available soon.");
    }
  };

  return (
    <div className="govt-exams-tab">
      
      {/* Scrollable Categories Row */}
      <div className="horizontal-categories hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Bar (Filters & Central/State Toggle) */}
      <div className="action-bar-row">
        <div className="exam-type-toggle">
          <button className={`type-btn ${examType === 'All' ? 'active' : ''}`} onClick={() => setExamType('All')}>All</button>
          <button className={`type-btn ${examType === 'Central' ? 'active' : ''}`} onClick={() => setExamType('Central')}>Central</button>
          <button className={`type-btn ${examType === 'State' ? 'active' : ''}`} onClick={() => setExamType('State')}>State</button>
        </div>
        <button 
          className={`smart-filter-btn ${showFilters ? 'open' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} /> Filters {showFilters ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>
      </div>

      {/* Advanced Filters Drawer */}
      {showFilters && (
        <div className="filters-drawer">
          <div className="filter-group">
            <span className="filter-label">Qualification Matcher:</span>
            <div className="filter-options hide-scrollbar">
              {qualifications.map(qual => (
                <button key={qual} className={`filter-chip ${userQualification === qual ? 'active' : ''}`} onClick={() => setUserQualification(qual)}>
                  {qual}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Sector/Department:</span>
            <div className="filter-options hide-scrollbar">
              {sectors.map(sec => (
                <button key={sec} className={`filter-chip ${filterSector === sec ? 'active' : ''}`} onClick={() => setFilterSector(sec)}>
                  {sec}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exams List */}
      <div className="exams-list">
        <div className="list-header">
          <h3>{activeCategory} {userQualification !== 'All' ? `for ${userQualification}` : ''}</h3>
          <span className="count-badge">{filteredExams.length} Found</span>
        </div>

        {filteredExams.length === 0 ? (
          <div className="no-exams">
            <Briefcase size={40} className="empty-icon" />
            <p>No exams found matching your criteria.</p>
          </div>
        ) : (
          filteredExams.map(exam => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <div className="exam-title-row">
                  <img src={exam.logo} alt={exam.department} className="exam-logo" />
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                      <h4 className="exam-title">{exam.title}</h4>
                      <span className={`status-badge ${exam.status.toLowerCase().replace(' ', '-')}`}>{exam.status}</span>
                    </div>
                    <p className="exam-dept">{exam.department}</p>
                    <div className="official-source">
                      <CheckCircle2 size={12} className="text-green" /> <span>{exam.officialSource}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className={`notify-btn ${exam.notificationOn ? 'active' : ''}`}
                  onClick={() => toggleNotification(exam.id)}
                  title={exam.notificationOn ? "Turn off alerts" : "Get job alerts"}
                >
                  {exam.notificationOn ? <BellRing size={18} /> : <Bell size={18} />}
                </button>
              </div>

              <div className="exam-details-grid">
                <div className="detail-item">
                  <GraduationCap size={14} className="detail-icon text-green" />
                  <span><strong>Eligibility:</strong> {exam.qualification}</span>
                </div>
                <div className="detail-item">
                  <Building size={14} className="detail-icon text-blue" />
                  <span><strong>Sector:</strong> {exam.sector} ({exam.type})</span>
                </div>
                <div className="detail-item">
                  <Briefcase size={14} className="detail-icon text-orange" />
                  <span><strong>Vacancies:</strong> <span className="highlight-text">{exam.vacancies}</span></span>
                </div>
                <div className="detail-item">
                  <Calendar size={14} className="detail-icon text-red" />
                  <span><strong>Age Limit:</strong> {exam.ageLimit}</span>
                </div>
              </div>

              <div className="exam-footer">
                <div className="salary-box">
                  <span className="salary-label">Last Date</span>
                  <span className="salary-val">{exam.lastDate}</span>
                </div>
                
                {exam.status === 'Active' || exam.status === 'Upcoming' ? (
                  <button onClick={() => handleApply(exam.applyLink)} className="apply-btn">
                    Apply Now <ExternalLink size={14} />
                  </button>
                ) : exam.status === 'Admit Card' ? (
                  <button onClick={() => handleApply(exam.admitCardLink)} className="apply-btn outline-blue">
                    Download Admit Card <Download size={14} />
                  </button>
                ) : (
                  <button onClick={() => handleApply(exam.resultLink)} className="apply-btn outline-green">
                    View Result <ExternalLink size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GovtExamsTab;
