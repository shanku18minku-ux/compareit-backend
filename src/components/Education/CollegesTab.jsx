import React, { useState } from 'react';
import './CollegesTab.css';
import { Building, MapPin, Trophy, DollarSign, ExternalLink, Activity, Gift, Search, TrendingUp, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/appStore';

const mockColleges = [
  {
    id: 'clg1',
    name: 'Indian Institute of Technology (IIT)',
    location: 'Bombay, Maharashtra',
    stream: 'Engineering (B.Tech/B.E.)',
    ranking: 'NIRF #3',
    fees: '1.2 L/yr',
    avgPackage: '22 L/yr',
    status: 'Closed',
    platforms: [
      { name: 'Shiksha', link: 'https://shiksha.com' },
      { name: 'Collegedunia', link: 'https://collegedunia.com' }
    ],
    scholarship: {
      text: 'Govt. Merit Scholarship up to 100%',
      link: 'https://scholarships.gov.in'
    }
  },
  {
    id: 'clg2',
    name: 'All India Institute of Medical Sciences',
    location: 'New Delhi',
    stream: 'Medical (MBBS/BDS)',
    ranking: 'NIRF #1',
    fees: '6k/yr',
    avgPackage: '15 L/yr',
    status: 'Open',
    platforms: [
      { name: 'Careers360', link: 'https://careers360.com' }
    ],
    scholarship: null
  },
  {
    id: 'clg3',
    name: 'Indian Institute of Management (IIM)',
    location: 'Ahmedabad, Gujarat',
    stream: 'Management (BBA/BMS/IPM)',
    ranking: 'NIRF #1',
    fees: '25 L',
    avgPackage: '32 L/yr',
    status: 'Open',
    platforms: [
      { name: 'Shiksha', link: 'https://shiksha.com' },
      { name: 'Collegedekho', link: 'https://collegedekho.com' }
    ],
    scholarship: {
      text: 'Need-based Financial Aid Available',
      link: 'https://iima.ac.in/financial-aid'
    }
  },
  {
    id: 'clg4',
    name: 'National Institute of Technology (NIT)',
    location: 'Trichy, Tamil Nadu',
    stream: 'Engineering (B.Tech/B.E.)',
    ranking: 'NIRF #9',
    fees: '1.5 L/yr',
    avgPackage: '12 L/yr',
    status: 'Open',
    platforms: [
      { name: 'Shiksha', link: 'https://shiksha.com' }
    ],
    scholarship: null
  },
  {
    id: 'clg5',
    name: 'National Law School of India University',
    location: 'Bangalore, Karnataka',
    stream: 'Law (LLB/BALLB)',
    ranking: 'NIRF #1',
    fees: '3 L/yr',
    avgPackage: '16 L/yr',
    status: 'Open',
    platforms: [
      { name: 'Collegedunia', link: 'https://collegedunia.com' }
    ],
    scholarship: null
  },
  {
    id: 'clg6',
    name: 'National Institute of Fashion Technology (NIFT)',
    location: 'New Delhi',
    stream: 'Fashion Technology',
    ranking: 'NIRF #1',
    fees: '2.5 L/yr',
    avgPackage: '8 L/yr',
    status: 'Open',
    platforms: [{ name: 'Shiksha', link: 'https://shiksha.com' }],
    scholarship: null
  },
  {
    id: 'clg7',
    name: 'Indian Institute of Science Education and Research',
    location: 'Pune, Maharashtra',
    stream: 'Pure Science (B.Sc/MS)',
    ranking: 'NIRF #15',
    fees: '80k/yr',
    avgPackage: '10 L/yr',
    status: 'Closed',
    platforms: [{ name: 'Collegedunia', link: 'https://collegedunia.com' }],
    scholarship: {
      text: 'INSPIRE Scholarship Eligible',
      link: 'https://online-inspire.gov.in'
    }
  },
  {
    id: 'clg8',
    name: 'Institute of Hotel Management (IHM)',
    location: 'Mumbai, Maharashtra',
    stream: 'Hotel Management',
    ranking: 'India Today #1',
    fees: '1.2 L/yr',
    avgPackage: '6 L/yr',
    status: 'Open',
    platforms: [{ name: 'Shiksha', link: 'https://shiksha.com' }],
    scholarship: null
  }
];

const filters = [
  'Engineering (B.Tech/B.E.)', 'Architecture & Planning', 'Medical (MBBS/BDS)', 'AYUSH (BAMS/BHMS/BUMS/BSMS/BNYS)',
  'Veterinary', 'Nursing', 'Pharmacy', 'Agriculture', 'Pure Science (B.Sc/MS)',
  'Commerce / B.Com', 'Arts / Humanities', 'Law (LLB/BALLB)', 'Design', 'Fine Arts',
  'Animation / Multimedia', 'Hotel Management', 'Fashion Technology', 'Management (BBA/BMS/IPM)',
  'Mass Communication / Journalism', 'Psychology', 'Education (B.Ed Integrated)', 'Computer Applications (BCA)',
  'Maritime / Nautical Science', 'Defence Degree Programs', 'Performing Arts', 'Physical Education'
];

const examMap = {
  'Engineering (B.Tech/B.E.)': ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE', 'MET (Manipal)', 'COMEDK UGET', 'WBJEE', 'MHT CET', 'KCET', 'KEAM', 'AP EAPCET (EAMCET)', 'TS EAPCET (EAMCET)', 'GUJCET', 'OJEE', 'CUSAT CAT', 'IPU CET', 'LPU NEST', 'KIITEE', 'CUCET (Chandigarh University)', 'AMUEEE', 'UGEE (IIIT-H)', 'HITSEEE'],
  'Architecture & Planning': ['NATA', 'JEE Main Paper 2 (B.Arch/B.Planning)', 'AAT (IIT)'],
  'Medical (MBBS/BDS)': ['NEET UG'],
  'AYUSH (BAMS/BHMS/BUMS/BSMS/BNYS)': ['NEET UG'],
  'Veterinary': ['NEET UG', 'State Veterinary Entrance Exams'],
  'Nursing': ['AIIMS B.Sc Nursing', 'State Nursing Entrance Exams', 'University Entrance Tests'],
  'Pharmacy': ['MHT CET', 'AP EAPCET', 'TS EAPCET', 'KCET', 'WBJEE', 'GUJCET', 'OJEE', 'State CETs'],
  'Agriculture': ['CUET (ICAR UG)', 'AGRICET (state-specific)', 'AP EAPCET Agriculture', 'TS EAPCET Agriculture'],
  'Pure Science (B.Sc/MS)': ['IISER IAT', 'NEST', 'ISI Admission Test', 'CMI Entrance', 'CUET UG'],
  'Commerce / B.Com': ['CUET UG', 'Christ Entrance Test', 'NMIMS NPAT', "St. Xavier's Entrance", 'University-specific tests'],
  'Arts / Humanities': ['CUET UG', 'JMI Entrance', 'BHU Admissions', 'University-specific tests'],
  'Law (LLB/BALLB)': ['CLAT UG', 'AILET', 'SLAT', 'LSAT–India (where accepted)', 'MHCET Law', 'AP LAWCET', 'TS LAWCET'],
  'Design': ['UCEED', 'NID DAT', 'NIFT Entrance Exam (NIFTEE)', 'SEED', 'UID DAT', 'Pearl Academy Entrance'],
  'Fine Arts': ['BHU UET (where applicable)', 'State Fine Arts Entrance Exams', 'University Entrance Tests'],
  'Animation / Multimedia': ['Arena Scholarship Tests', 'MAAC Entrance', 'University Entrance Exams'],
  'Hotel Management': ['NCHM JEE', 'IIHM eCHAT'],
  'Fashion Technology': ['NIFT Entrance Exam', 'Pearl Academy Entrance', 'UID DAT'],
  'Management (BBA/BMS/IPM)': ['IPMAT (Indore/Rohtak)', 'JIPMAT', 'NPAT', 'SET', 'CUET UG', 'Christ Entrance Test', 'UGAT'],
  'Mass Communication / Journalism': ['IIMC Entrance (when applicable)', 'CUET', 'University Entrance Exams'],
  'Psychology': ['CUET UG', 'Christ Entrance Test', 'Ashoka University Admission', 'University-specific tests'],
  'Education (B.Ed Integrated)': ['NCET', 'CUET UG'],
  'Computer Applications (BCA)': ['CUET UG', 'IPU CET', 'SET', 'Christ Entrance', 'University-specific exams'],
  'Maritime / Nautical Science': ['IMU CET'],
  'Defence Degree Programs': ['NDA', 'Army TES', 'Indian Navy B.Tech Entry'],
  'Performing Arts': ['BHU Performing Arts Test', 'State Music Universities', 'University Entrance Tests'],
  'Physical Education': ['University Entrance Tests', 'State PET Entrance Exams']
};

const getMockPrediction = (exam, rank, category) => {
  // Simple mock logic based on rank ranges for demonstration
  let numRank = parseInt(rank, 10);
  if (isNaN(numRank)) return [];

  // Adjust mock rank threshold based on category to simulate reservation benefits
  if (category === 'OBC-NCL') numRank = numRank * 0.8;
  if (category === 'SC') numRank = numRank * 0.5;
  if (category === 'ST') numRank = numRank * 0.4;
  if (category === 'EWS') numRank = numRank * 0.9;

  if (exam.includes('JEE')) {
    if (numRank <= 5000) return [
      { name: 'IIT Bombay', branch: 'Computer Science', probability: 'High' },
      { name: 'IIT Delhi', branch: 'Mathematics & Computing', probability: 'High' }
    ];
    if (numRank <= 25000) return [
      { name: 'NIT Trichy', branch: 'Mechanical Engg', probability: 'Medium' },
      { name: 'NIT Warangal', branch: 'Civil Engg', probability: 'High' }
    ];
    return [{ name: 'VIT Vellore', branch: 'Information Technology', probability: 'High' }];
  }

  if (exam.includes('NEET')) {
    if (numRank <= 2000) return [{ name: 'AIIMS New Delhi', branch: 'MBBS', probability: 'Medium' }];
    if (numRank <= 15000) return [{ name: 'KGMU Lucknow', branch: 'MBBS', probability: 'High' }];
    return [{ name: 'Private Medical Colleges', branch: 'BDS', probability: 'High' }];
  }

  if (exam.includes('CAT') || exam.includes('CLAT') || exam.includes('MAT')) {
    if (numRank <= 100) return [{ name: 'Top IIMs / NLSIU', branch: 'Core Program', probability: 'High' }];
    return [{ name: 'Tier 2 Institutes', branch: 'Core Program', probability: 'High' }];
  }

  if (numRank <= 1000) {
      return [{ name: 'Top Ranked Institute in India', branch: 'Premium Program', probability: 'High' }];
  } else if (numRank <= 10000) {
      return [{ name: 'State Level Reputed University', branch: 'Standard Program', probability: 'Medium' }];
  }
  
  return [{ name: 'Private Affiliated College', branch: 'General Program', probability: 'High' }];
};

const CollegesTab = ({ searchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('Engineering (B.Tech/B.E.)');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const { setGlobalRedirectData } = useAppStore();
  
  // Predictor State
  const [predictorExam, setPredictorExam] = useState(examMap['Engineering (B.Tech/B.E.)'][0]);
  const [predictorRank, setPredictorRank] = useState('');
  const [predictorCategory, setPredictorCategory] = useState('General');
  const [predictionResults, setPredictionResults] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const filtered = mockColleges.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.stream === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleCompare = (id) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(cId => cId !== id));
    } else if (selectedForCompare.length < 2) {
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPredictorExam(examMap[filter][0]);
    setPredictionResults(null);
  };

  const handlePredict = (e) => {
    e.preventDefault();
    if (!predictorRank) return;
    
    setIsPredicting(true);
    // Simulate network delay
    setTimeout(() => {
      const results = getMockPrediction(predictorExam, predictorRank, predictorCategory);
      setPredictionResults(results);
      setIsPredicting(false);
    }, 800);
  };

  return (
    <div className="colleges-tab">
      <div className="chips-container">
        {filters.map(filter => (
          <button 
            key={filter} 
            className={`chip ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* College Rank Predictor */}
      <div className="predictor-card">
        <div className="predictor-header">
          <TrendingUp className="predictor-icon" />
          <div>
            <h3>Smart College Predictor</h3>
            <p>Know your chances based on previous year cutoffs</p>
          </div>
        </div>

        <form onSubmit={handlePredict} className="predictor-form">
          <div className="predictor-inputs">
            <select 
              value={predictorExam} 
              onChange={(e) => setPredictorExam(e.target.value)}
              className="predictor-select"
            >
              {examMap[activeFilter].map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
            <select
              value={predictorCategory}
              onChange={(e) => setPredictorCategory(e.target.value)}
              className="predictor-select"
            >
              <option value="General">General</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
            <input 
              type="number" 
              placeholder="Enter Rank" 
              value={predictorRank}
              onChange={(e) => setPredictorRank(e.target.value)}
              className="predictor-input"
              required
            />
          </div>
          <button type="submit" className="predictor-btn" disabled={isPredicting}>
            {isPredicting ? 'Predicting...' : 'Predict Colleges'}
          </button>
        </form>

        {predictionResults && (
          <div className="prediction-results">
            <div className="results-trust-badge">
              <CheckCircle2 size={12} />
              <span>Based on previous year data from Shiksha & Collegedunia</span>
            </div>
            {predictionResults.map((res, idx) => (
              <div key={idx} className="prediction-item">
                <div className="pred-info">
                  <h4>{res.name}</h4>
                  <span>{res.branch}</span>
                </div>
                <div className={`pred-prob ${res.probability.toLowerCase()}`}>
                  {res.probability} Chance
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedForCompare.length > 0 && (
        <div className="compare-bar">
          <span>{selectedForCompare.length}/2 Selected to compare</span>
          <button 
            className="compare-btn" 
            disabled={selectedForCompare.length < 2}
          >
            Compare Now
          </button>
        </div>
      )}

      <div className="colleges-list">
        {filtered.map(item => (
          <div key={item.id} className="college-card">
            <div className="college-top">
              <div className="college-info">
                <h3>{item.name}</h3>
                <p><MapPin size={12} /> {item.location}</p>
              </div>
              <div className={`status-badge ${item.status === 'Open' ? 'open' : 'closed'}`}>
                {item.status === 'Open' ? 'Admission Open' : 'Closed'}
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <Trophy size={14} className="stat-icon" />
                <div className="stat-text">
                  <span className="label">Ranking</span>
                  <span className="value">{item.ranking}</span>
                </div>
              </div>
              <div className="stat-item">
                <DollarSign size={14} className="stat-icon" />
                <div className="stat-text">
                  <span className="label">Avg Fees</span>
                  <span className="value">{item.fees}</span>
                </div>
              </div>
              <div className="stat-item">
                <Activity size={14} className="stat-icon" />
                <div className="stat-text">
                  <span className="label">Avg Package</span>
                  <span className="value">{item.avgPackage}</span>
                </div>
              </div>
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

            <div className="read-more-platforms">
              <span>Read reviews on: </span>
              {item.platforms.map((plat, idx) => (
                <a key={idx} href="#" onClick={(e) => { e.preventDefault(); setGlobalRedirectData({ providerName: plat.name, targetUrl: plat.link }); }}>
                  {plat.name}
                </a>
              ))}
            </div>

            <div className="college-actions">
              <label className="compare-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedForCompare.includes(item.id)}
                  onChange={() => toggleCompare(item.id)}
                /> Compare
              </label>
              <button 
                className="apply-now-btn"
                onClick={() => {
                  const domain = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setGlobalRedirectData({ providerName: item.name, targetUrl: `https://www.${domain}.com` });
                }}
              >
                Apply Now <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegesTab;
