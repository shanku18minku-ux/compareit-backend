import React, { useState } from 'react';
import './Education.css';
import CoursesTab from '../../components/Education/CoursesTab';
import CoachingTab from '../../components/Education/CoachingTab';
import CollegesTab from '../../components/Education/CollegesTab';
import JobsTab from '../../components/Education/JobsTab';
import GovtExamsTab from '../../components/Education/GovtExamsTab';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';
import { Search, BookOpen, GraduationCap, Building2, Briefcase, Landmark } from 'lucide-react';
import useAppStore from '../../store/appStore';

const Education = () => {
  const activeTab = useAppStore(state => state.activeEducationTab);
  const setActiveTab = useAppStore(state => state.setActiveEducationTab);
  const searchQuery = useAppStore(state => state.educationSearchQuery);
  const setSearchQuery = useAppStore(state => state.setEducationSearchQuery);

  // Simple AI routing mock based on keywords
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('sarkari') || lowerQuery.includes('govt') || lowerQuery.includes('ssc') || lowerQuery.includes('upsc')) {
      setActiveTab('govtexams');
    } else if (lowerQuery.includes('job') || lowerQuery.includes('salary') || lowerQuery.includes('fresher') || lowerQuery.includes('software engineer')) {
      setActiveTab('jobs');
    } else if (lowerQuery.includes('college') || lowerQuery.includes('university') || lowerQuery.includes('btech') || lowerQuery.includes('mba')) {
      setActiveTab('colleges');
    } else if (lowerQuery.includes('coaching') || lowerQuery.includes('institute') || lowerQuery.includes('offline')) {
      setActiveTab('coaching');
    } else if (query.length > 3) {
      // Default to courses for general subjects
      setActiveTab('courses');
    }
  };

  return (
    <div className="education-container">
      <GlobalDisclaimer />
      <div className="education-header">
        <h1>Learn & Grow</h1>
        <p>Discover courses, colleges, coaching, and jobs</p>
        
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for Class 12, UPSC, Python, MBA..."
            value={searchQuery}
            onChange={handleSearch}
            className="global-search"
          />
        </div>
      </div>

      <div className="education-tabs">
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={18} /> Courses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'coaching' ? 'active' : ''}`}
          onClick={() => setActiveTab('coaching')}
        >
          <Building2 size={18} /> Coaching
        </button>
        <button 
          className={`tab-btn ${activeTab === 'colleges' ? 'active' : ''}`}
          onClick={() => setActiveTab('colleges')}
        >
          <GraduationCap size={18} /> Colleges
        </button>
        <button 
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={18} /> Jobs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'govtexams' ? 'active' : ''}`}
          onClick={() => setActiveTab('govtexams')}
        >
          <Landmark size={18} /> Govt Exams
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'courses' && <CoursesTab searchQuery={searchQuery} />}
        {activeTab === 'coaching' && <CoachingTab searchQuery={searchQuery} />}
        {activeTab === 'colleges' && <CollegesTab searchQuery={searchQuery} />}
        {activeTab === 'jobs' && <JobsTab searchQuery={searchQuery} />}
        {activeTab === 'govtexams' && <GovtExamsTab searchQuery={searchQuery} />}
      </div>
    </div>
  );
};

export default Education;
