import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import './JobsTab.css';
import { Briefcase, MapPin, DollarSign, ExternalLink, Zap, TrendingUp, Search, User, Filter } from 'lucide-react';
import useAppStore from '../../store/appStore';

const mockJobs = [
  {
    id: 'j1',
    title: 'Frontend Developer',
    company: 'TechCorp India',
    location: 'Remote',
    type: 'Full Time',
    salary: '8L - 12L / yr',
    skills: ['React', 'JavaScript', 'CSS'],
    platforms: [
      { name: 'LinkedIn Jobs', link: 'https://linkedin.com' },
      { name: 'Naukri.com', link: 'https://naukri.com' },
      { name: 'Indeed India', link: 'https://indeed.co.in' },
      { name: 'Wellfound', link: 'https://wellfound.com' }
    ]
  },
  {
    id: 'j2',
    title: 'Data Analyst Fresher',
    company: 'DataMinds',
    location: 'Bangalore',
    type: 'Full Time',
    salary: '4L - 6L / yr',
    skills: ['SQL', 'Python', 'Excel'],
    platforms: [
      { name: 'Foundit', link: 'https://foundit.in' },
      { name: 'Apna', link: 'https://apna.co' },
      { name: 'Shine.com', link: 'https://shine.com' }
    ]
  },
  {
    id: 'j3',
    title: 'Software Engineering Intern',
    company: 'InnovateX',
    location: 'Pune (Hybrid)',
    type: 'Internship',
    salary: '25k / mo',
    skills: ['Java', 'Spring Boot'],
    platforms: [
      { name: 'TimesJobs', link: 'https://timesjobs.com' },
      { name: 'WorkIndia', link: 'https://workindia.in' },
      { name: 'Hirect', link: 'https://hirect.in' }
    ]
  },
  {
    id: 'j4',
    title: 'Freelance UI/UX Designer',
    company: 'Multiple Clients',
    location: 'Global Remote',
    type: 'Freelance',
    salary: '$30 - $50 / hr',
    skills: ['Figma', 'UI Design', 'Wireframing'],
    platforms: [
      { name: 'Upwork', link: 'https://upwork.com' },
      { name: 'Fiverr', link: 'https://fiverr.com' },
      { name: 'Freelancer.com', link: 'https://freelancer.com' },
      { name: 'Guru', link: 'https://guru.com' }
    ]
  },
  {
    id: 'j5',
    title: 'Senior Backend Engineer',
    company: 'StartupStack',
    location: 'Remote',
    type: 'Full Time',
    salary: '25L - 40L / yr',
    skills: ['Node.js', 'AWS', 'Microservices'],
    platforms: [
      { name: 'Remote OK', link: 'https://remoteok.com' },
      { name: 'We Work Remotely', link: 'https://weworkremotely.com' },
      { name: 'FlexJobs', link: 'https://flexjobs.com' },
      { name: 'Jobspresso', link: 'https://jobspresso.co' }
    ]
  },
  {
    id: 'j6',
    title: 'Probationary Officer (PO)',
    company: 'State Bank of India',
    location: 'All India',
    type: 'Government',
    salary: 'Basic: ₹41,960 / mo',
    skills: ['Aptitude', 'Reasoning', 'General Awareness'],
    platforms: [
      { name: 'National Career Service (NCS)', link: 'https://ncs.gov.in' },
      { name: 'SSC', link: 'https://ssc.nic.in' }
    ]
  },
  {
    id: 'j7',
    title: 'Junior Engineer (Civil)',
    company: 'Indian Railways',
    location: 'Regional',
    type: 'Government',
    salary: 'Level 6 (₹35,400+)',
    skills: ['Civil Engineering', 'Tech Aptitude'],
    platforms: [
      { name: 'Railway Recruitment Boards (RRB)', link: 'https://indianrailways.gov.in' },
      { name: 'UPSC', link: 'https://upsc.gov.in' }
    ]
  },
  {
    id: 'j8',
    title: 'Content Writer',
    company: 'MediaCorp',
    location: 'Delhi',
    type: 'Full Time',
    salary: '3L - 5L / yr',
    skills: ['Copywriting', 'SEO', 'Blogging'],
    platforms: [
      { name: 'PeoplePerHour', link: 'https://peopleperhour.com' },
      { name: 'LinkedIn Jobs', link: 'https://linkedin.com' }
    ]
  }
];

const JobsTab = ({ searchQuery }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({ role: '', location: '', type: 'All' });
  const [hasSearched, setHasSearched] = useState(false);
  const { setGlobalRedirectData } = useAppStore();

  const handleSearch = () => {
    setHasSearched(true);
  };

  const calculateMatch = (job) => {
    if (!hasSearched) return Math.floor(Math.random() * (95 - 75 + 1)) + 75; // Dummy random score if no profile
    
    let score = 50; // base score
    if (profile.role && job.title.toLowerCase().includes(profile.role.toLowerCase())) score += 30;
    if (profile.location && job.location.toLowerCase().includes(profile.location.toLowerCase())) score += 10;
    if (profile.type !== 'All' && job.type === profile.type) score += 10;
    
    // Ensure score is within reasonable bounds
    return Math.min(Math.max(score + Math.floor(Math.random() * 5), 65), 99);
  };

  const filtered = mockJobs.filter(item => {
    // Top bar global search
    const matchesGlobalSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Profile form search
    const matchesProfileRole = !hasSearched || !profile.role || item.title.toLowerCase().includes(profile.role.toLowerCase());
    const matchesProfileType = !hasSearched || profile.type === 'All' || item.type === profile.type;

    return matchesGlobalSearch && (matchesProfileRole || matchesProfileType);
  });

  return (
    <div className="jobs-tab">
      
      {/* Trust Banner */}
      <div className="aggregator-banner">
        <span className="banner-title">🔥 Aggregating from 20+ Platforms:</span>
        <div className="banner-scroll">
          <span>Naukri.com • LinkedIn • Upwork • Apna • Foundit • RRB • UPSC • Fiverr • Remote OK • Indeed • NCS • Wellfound...</span>
        </div>
      </div>

      {/* Smart Match Form */}
      <div className="smart-match-card">
        <h3><Zap size={18} color="#2563EB"/> Find Your Best Match</h3>
        <p>Enter your details and let our AI scan 20+ platforms to find the perfect opportunities.</p>
        
        <div className="match-form">
          <div className="input-group">
            <User size={16} className="input-icon" />
            <input 
              type="text" 
              placeholder={t('auto_e_g_frontend_develop_c034', 'e.g. Frontend Developer')} 
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
            />
          </div>
          <div className="input-group">
            <MapPin size={16} className="input-icon" />
            <input 
              type="text" 
              placeholder={t('auto_e_g_remote_bangalore_d892', 'e.g. Remote, Bangalore')} 
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
            />
          </div>
          <div className="input-group">
            <Filter size={16} className="input-icon" />
            <select 
              value={profile.type}
              onChange={(e) => setProfile({...profile, type: e.target.value})}
            >
              <option value="All">{t('auto_all_job_types_6d16', 'All Job Types')}</option>
              <option value="Full Time">{t('auto_full_time_1f0c', 'Full Time')}</option>
              <option value="Freelance">{t('auto_freelance_0f28', 'Freelance')}</option>
              <option value="Internship">{t('auto_internship_dabd', 'Internship')}</option>
              <option value="Government">{t('auto_government_1845', 'Government')}</option>
            </select>
          </div>
          <button className="find-match-btn" onClick={handleSearch}>
            Find Matches
          </button>
        </div>
      </div>

      <div className="jobs-list">
        {filtered.map(item => {
          const matchScore = calculateMatch(item);
          return (
            <div key={item.id} className="job-card">
              <div className="match-badge">
                {matchScore}% AI Match
              </div>
              
              <div className="job-header">
                <div className="job-title-sec">
                  <h3>{item.title}</h3>
                  <p>{item.company}</p>
                </div>
              </div>

              <div className="job-meta">
                <span><MapPin size={12}/> {item.location}</span>
                <span><Briefcase size={12}/> {item.type}</span>
                <span><DollarSign size={12}/> {item.salary}</span>
              </div>

              <div className="skills-row">
                {item.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip">{skill}</span>
                ))}
              </div>

              <div className="apply-section">
                <div className="apply-links">
                  <span className="apply-text">Apply via:</span>
                  {item.platforms.map((plat, idx) => (
                    <button 
                      key={idx}
                      className="plat-btn"
                      onClick={() => setGlobalRedirectData({ providerName: plat.name, targetUrl: plat.link })}
                    >
                      {plat.name} <ExternalLink size={10} />
                    </button>
                  ))}
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobsTab;
