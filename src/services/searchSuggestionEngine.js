/**
 * searchSuggestionEngine.js — v4 (production-ready)
 *
 * Features:
 * - 14-module auto-extensible keyword index
 * - Fuzzy matching (Levenshtein distance)
 * - Typo correction ("Did you mean?")
 * - Synonym map (English + Hindi)
 * - Smart ranking: personalized > nearby > exact > fuzzy > trending
 * - Personalized suggestions (moduleVisits + recentSearches)
 * - Location-aware "Nearby" suggestions (userCity from appStore)
 * - City-level + national + seasonal trending
 * - Pinned searches (localStorage)
 * - Analytics tracking (localStorage)
 * - XSS/injection sanitization
 * - 5-minute in-memory cache (keyed by query + city)
 * - Debounce utility
 */

// ─── PIN SEARCHES ────────────────────────────────────────────────────────────
const PINNED_KEY = 'compareit_pinned_searches';
export const getPinnedSearches = () => {
  try { return JSON.parse(localStorage.getItem(PINNED_KEY) || '[]'); } catch { return []; }
};
export const pinSearch = (query) => {
  try {
    const p = getPinnedSearches();
    if (!p.includes(query)) { p.unshift(query); localStorage.setItem(PINNED_KEY, JSON.stringify(p.slice(0, 5))); }
  } catch {}
};
export const unpinSearch = (query) => {
  try {
    const p = getPinnedSearches().filter(q => q !== query);
    localStorage.setItem(PINNED_KEY, JSON.stringify(p));
  } catch {}
};

// ─── MODULE INDEX REGISTRY ───────────────────────────────────────────────────
// Adding a new module here automatically makes it searchable. No other change needed.
export const MODULE_INDEX = {
  ecommerce: {
    category: 'Shopping', icon: '🛒',
    keywords: [
      'iphone 16', 'iphone 15', 'iphone 14', 'ipad air', 'ipad pro',
      'samsung galaxy s25 ultra', 'samsung galaxy s24', 'samsung galaxy a55',
      'oneplus nord 4', 'oneplus 13', 'realme 13 pro',
      'sony headphones', 'sony wh-1000xm5', 'sony playstation 5',
      'macbook air m3', 'macbook pro', 'dell xps', 'hp laptop',
      'nike shoes', 'adidas shoes', 'puma sneakers', 'running shoes',
      'men clothes', 'women dress', 't-shirt', 'jeans',
      'smart watch', 'boat smartwatch', 'noise smartwatch',
      'dyson vacuum', 'air purifier', 'refrigerator', 'washing machine',
      'led tv', 'oled tv', '4k tv', 'samsung tv',
      'earbuds', 'boat earbuds', 'jbl speaker', 'bluetooth speaker',
      'camera', 'dslr camera', 'gopro', 'kindle',
      'gaming chair', 'gaming monitor', 'gaming keyboard',
    ],
  },
  food: {
    category: 'Food', icon: '🍕',
    keywords: [
      'chicken biryani', 'hyderabadi biryani', 'veg biryani', 'biryani',
      'margherita pizza', 'paneer pizza', 'pepperoni pizza',
      'veg burger', 'chicken burger', 'mcaloo tikki',
      'steamed momos', 'fried momos', 'paneer momos',
      'masala dosa', 'paper dosa', 'rava dosa',
      'paneer butter masala', 'dal makhani', 'butter naan',
      'chinese noodles', 'hakka noodles', 'spring rolls',
      'ice cream', 'desserts', 'cake', 'pastry',
      'south indian food', 'north indian food', 'street food',
      'biryani near me', 'biryani under 300', 'best rated biryani',
      'food delivery', 'swiggy', 'zomato', 'eatsure',
    ],
  },
  grocery: {
    category: 'Grocery', icon: '🛍️',
    keywords: [
      'amul milk', 'toned milk', 'full cream milk',
      'bread', 'eggs', 'butter', 'cheese',
      'rice', 'basmati rice', 'atta', 'wheat flour',
      'sugar', 'salt', 'cooking oil', 'sunflower oil', 'mustard oil',
      'detergent', 'dish soap', 'hand wash', 'shampoo',
      'vegetables', 'fruits', 'onion', 'tomato', 'potato',
      'grocery delivery', 'blinkit', 'zepto', 'instamart',
      'instant noodles', 'maggi', 'cornflakes', 'oats',
    ],
  },
  travel: {
    category: 'Travel', icon: '✈️',
    keywords: [
      'indigo flight', 'air india flight', 'spicejet flight', 'akasa air',
      'cheap flights', 'flights to goa', 'flights to delhi', 'flights to mumbai',
      'irctc train', 'rajdhani express', 'shatabdi express', 'vande bharat',
      'delhi to mumbai train', 'delhi to goa train',
      'redbus bus', 'volvo bus', 'sleeper bus',
      'ola cab', 'uber cab', 'rapido bike', 'auto rickshaw',
      'goibibo', 'makemytrip', 'yatra', 'ixigo',
    ],
  },
  stays: {
    category: 'Hotels', icon: '🏨',
    keywords: [
      'hotel in mumbai', 'hotel in goa', 'hotel in delhi', 'hotel in bangalore',
      'budget hotel', 'luxury hotel', '5 star hotel',
      'oyo rooms', 'airbnb', 'treebo', 'lemon tree hotel',
      'resort', 'beach resort', 'hill station hotel',
    ],
  },
  education: {
    category: 'Education', icon: '🎓',
    keywords: [
      'iit jee coaching', 'neet coaching', 'upsc coaching',
      'full stack web development', 'data science course', 'digital marketing',
      'python course', 'machine learning', 'ai course', 'react course',
      'mba colleges', 'engineering colleges', 'medical colleges',
      'online courses', 'udemy courses', 'coursera', 'unacademy',
      'ssc cgl', 'rrb ntpc', 'bank po', 'sbi po', 'upsc civil services',
      'government job exam', 'competitive exam',
    ],
  },
  jobs: {
    category: 'Jobs', icon: '💼',
    keywords: [
      'software engineer jobs', 'it jobs bangalore', 'remote jobs',
      'data analyst jobs', 'product manager jobs', 'ui ux designer jobs',
      'freshers jobs', 'work from home jobs', 'government jobs',
      'naukri', 'linkedin jobs', 'indeed jobs', 'internshala',
      'campus placements', 'off campus jobs',
    ],
  },
  health: {
    category: 'Healthcare', icon: '🏥',
    keywords: [
      'doctor near me', 'online doctor consultation', 'practo',
      'crocin', 'paracetamol', 'dolo 650', 'augmentin', 'shelcal',
      'protein powder', 'whey protein', 'creatine', 'multivitamin',
      'blood pressure monitor', 'glucometer', 'pulse oximeter',
      'home nurse', 'physiotherapy at home', 'elder care',
      'pharmacy near me', 'apollo pharmacy', 'tata 1mg', 'pharmeasy',
    ],
  },
  coupons: {
    category: 'Coupons & Offers', icon: '🏷️',
    keywords: [
      'amazon coupon', 'flipkart coupon', 'zomato offer',
      'swiggy coupon', 'blinkit offer', 'myntra sale',
      'credit card cashback', 'hdfc offer', 'icici card offer',
      'paytm cashback', 'gpay offer', 'phonepe offer',
      'big billion day', 'great indian sale', 'black friday deals',
      'festival sale', 'diwali offers', 'holi sale',
    ],
  },
  games: {
    category: 'Games', icon: '🎮',
    keywords: [
      'games', 'play', 'gaming', 'pubg', 'bgmi', 'free fire',
      'ludo', 'candy crush', 'minecraft', 'roblox', 'gta'
    ]
  },
  recharge: {
    category: 'Recharge & Bills', icon: '📱',
    keywords: [
      'jio recharge', 'airtel recharge', 'vi recharge', 'bsnl recharge',
      'electricity bill', 'water bill', 'gas bill', 'dth recharge',
      'broadband recharge', 'fastag recharge',
      'paytm recharge', 'phonepe bill', 'gpay bill',
    ],
  },
  events: {
    category: 'Events & Movies', icon: '🎬',
    keywords: [
      'movie tickets', 'bookmyshow', 'pvr cinemas', 'inox',
      'concert tickets', 'cricket match tickets', 'ipl tickets',
      'events near me', 'comedy shows', 'music festival',
    ],
  },
  logistics: {
    category: 'Logistics', icon: '📦',
    keywords: [
      'courier service', 'delhivery', 'bluedart', 'dtdc',
      'packers and movers', 'shifting service',
      'package tracking', 'parcel delivery',
    ],
  },
  vehicles: {
    category: 'Vehicles', icon: '🚗',
    keywords: [
      'used cars', 'second hand cars', 'new car price',
      'bike service', 'car service', 'mechanic near me',
      'car rental', 'self drive car', 'ev charging',
      'maruti suzuki', 'hyundai creta', 'tata nexon',
    ],
  },
};

// ─── SYNONYM MAP (English + Hindi) ───────────────────────────────────────────
const SYNONYM_MAP = {
  'shoes': ['sneakers', 'sports shoes', 'running shoes', 'footwear'],
  'food': ['delivery', 'restaurant', 'khaana', 'meal'],
  'khaana': ['food', 'biryani', 'pizza', 'restaurant', 'delivery'],
  'khana': ['food', 'biryani', 'pizza', 'restaurant', 'delivery'],
  'mobile': ['phone', 'smartphone', 'iphone', 'android'],
  'phone': ['mobile', 'smartphone', 'iphone', 'samsung', 'oneplus'],
  'laptop': ['notebook', 'macbook', 'chromebook', 'computer'],
  'hotel': ['stay', 'room', 'accommodation', 'hostel', 'oyo'],
  'medicine': ['tablet', 'capsule', 'syrup', 'drug', 'pharmacy'],
  'dawai': ['medicine', 'tablet', 'pharmacy', 'health'],
  'dawa': ['medicine', 'tablet', 'pharmacy', 'health'],
  'naukriya': ['jobs', 'job', 'employment', 'work'],
  'padhai': ['education', 'course', 'coaching', 'study', 'learning'],
  'flight': ['flights', 'air ticket', 'airplane', 'aviation'],
  'train': ['railway', 'irctc', 'rajdhani', 'shatabdi'],
  'cab': ['taxi', 'ola', 'uber', 'ride', 'auto'],
  'grocery': ['groceries', 'vegetables', 'fruits', 'daily needs'],
  'saabji': ['vegetables', 'grocery', 'sabzi', 'fruits'],
  'sabzi': ['vegetables', 'grocery', 'fruits', 'daily needs'],
  'recharge': ['mobile recharge', 'jio', 'airtel', 'vi', 'prepaid'],
  'offers': ['deals', 'discounts', 'coupons', 'sale', 'cashback'],
  'sale': ['offers', 'discount', 'deals', 'clearance'],
  'jobs': ['employment', 'career', 'work', 'hiring', 'vacancy'],
};

// ─── TRENDING ─────────────────────────────────────────────────────────────────
const TRENDING_SEARCHES = [
  { text: 'iPhone 16 Pro Max price', module: 'ecommerce', score: 98 },
  { text: 'Chicken Biryani near me', module: 'food', score: 95 },
  { text: 'Cheap flights to Goa', module: 'travel', score: 92 },
  { text: 'UPSC Civil Services coaching', module: 'education', score: 88 },
  { text: 'Work from home IT jobs', module: 'jobs', score: 85 },
  { text: 'Zomato discount coupon', module: 'coupons', score: 82 },
  { text: 'Zepto grocery delivery', module: 'grocery', score: 80 },
  { text: 'Best crypto exchange', module: 'finance', score: 77 },
  { text: 'Jio 84 day recharge plan', module: 'recharge', score: 75 },
  { text: 'Protein powder best price', module: 'health', score: 72 },
  { text: 'Best biryani restaurant', module: 'food', score: 70 },
  { text: 'Vande Bharat train ticket', module: 'travel', score: 68 },
  { text: 'Samsung Galaxy S25 Ultra deal', module: 'ecommerce', score: 66 },
  { text: 'Online doctor consultation', module: 'health', score: 64 },
  { text: 'Laptop under 50000', module: 'ecommerce', score: 62 },
  { text: 'Monsoon travel packages', module: 'travel', score: 58 },
];

const CITY_TRENDING = {
  bengaluru: ['Tech Park cab Bengaluru', 'IT jobs Bangalore', 'Swiggy offers Bangalore'],
  bangalore: ['Tech Park cab Bengaluru', 'IT jobs Bangalore', 'Swiggy offers Bangalore'],
  mumbai: ['Local train pass Mumbai', 'Dabba delivery Mumbai', 'Mumbai hotel deals'],
  delhi: ['Metro card recharge Delhi', 'Connaught Place restaurants', 'DL to MUM flight'],
  hyderabad: ['Hyderabadi biryani', 'IT jobs Hyderabad', 'Gachibowli cab'],
  chennai: ['Chennai auto fare', 'Tamil Nadu train', 'Chennai hotel'],
  kolkata: ['Kolkata cab', 'Street food Kolkata', 'Durga Puja events'],
  pune: ['Pune IT jobs', 'Pune to Mumbai cab', 'Shaniwar Wada restaurants'],
  ahmedabad: ['Ahmedabad events', 'Gujarat travel', 'Navratri 2025'],
};

// ─── TYPO MAP ─────────────────────────────────────────────────────────────────
const TYPO_MAP = {
  'iphon': 'iPhone', 'iphn': 'iPhone', 'iohone': 'iPhone',
  'samsng': 'Samsung', 'sasmung': 'Samsung',
  'biryni': 'Biryani', 'biriyani': 'Biryani', 'biryaani': 'Biryani',
  'amzon': 'Amazon', 'amazn': 'Amazon',
  'flipkartt': 'Flipkart', 'flpkart': 'Flipkart',
  'zomto': 'Zomato', 'swggy': 'Swiggy',
  'macbok': 'MacBook', 'pizzza': 'Pizza', 'burget': 'Burger',
  'trvel': 'Travel', 'flght': 'Flight', 'trainn': 'Train',
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const sanitize = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>{}()\[\]\\;'"]/g, '').trim().slice(0, 150);
};

const levenshtein = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
};

const fuzzyScore = (query, keyword) => {
  const q = query.toLowerCase();
  const k = keyword.toLowerCase();
  if (k === q) return 1.0;
  if (k.startsWith(q)) return 0.95;
  if (k.includes(q)) return 0.85;
  const qTokens = q.split(/\s+/);
  const kTokens = k.split(/\s+/);
  let tokenMatches = 0;
  for (const qt of qTokens) {
    if (kTokens.some(kt => kt.startsWith(qt) || levenshtein(qt, kt) <= 1)) tokenMatches++;
  }
  if (tokenMatches > 0) return (tokenMatches / qTokens.length) * 0.8;
  if (q.length >= 3) {
    const dist = levenshtein(q, k.slice(0, q.length + 2));
    if (dist <= 2) return Math.max(0, 0.6 - dist * 0.15);
  }
  return 0;
};

const getTypoCorrection = (query) => {
  const q = query.toLowerCase().trim();
  if (TYPO_MAP[q]) return TYPO_MAP[q];
  const commonTerms = ['iPhone', 'Samsung', 'Biryani', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy', 'MacBook', 'Pizza', 'Burger'];
  for (const term of commonTerms) {
    if (levenshtein(q, term.toLowerCase()) <= 2 && q !== term.toLowerCase()) return term;
  }
  return null;
};

// ─── PERSONALIZED SUGGESTIONS ────────────────────────────────────────────────
const buildPersonalizedSuggestions = (q, recentSearches, moduleVisits) => {
  const results = [];

  // Match recent searches against query
  if (Array.isArray(recentSearches)) {
    for (const term of recentSearches) {
      const score = fuzzyScore(q, term);
      if (score >= 0.3) {
        results.push({
          text: term,
          rawText: term.toLowerCase(),
          module: 'recent',
          category: 'Your Searches',
          icon: '🕐',
          score: score * 1.15,
          type: 'personalized',
        });
      }
    }
  }

  // Boost keywords from frequently visited modules
  if (moduleVisits && typeof moduleVisits === 'object') {
    const topModules = Object.entries(moduleVisits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([m]) => m);

    for (const mod of topModules) {
      const modDef = MODULE_INDEX[mod];
      if (!modDef) continue;
      for (const kw of modDef.keywords.slice(0, 8)) {
        const score = fuzzyScore(q, kw);
        if (score >= 0.35) {
          results.push({
            text: kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            rawText: kw,
            module: mod,
            category: 'AI Recommended',
            icon: '✨',
            score: score * 1.1,
            type: 'personalized',
          });
        }
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 4);
};

// ─── NEARBY SUGGESTIONS ──────────────────────────────────────────────────────
const NEARBY_TEMPLATES = [
  { keywords: ['food', 'restaurant', 'eat', 'biryani', 'pizza', 'burger', 'khaana', 'khana', 'dosa'], template: (city) => `Best restaurants near me in ${city}`, module: 'food' },
  { keywords: ['grocery', 'vegetable', 'milk', 'sabzi', 'kiryana'], template: (city) => `Grocery delivery near me in ${city}`, module: 'grocery' },
  { keywords: ['doctor', 'hospital', 'clinic', 'health', 'medicine', 'dawai'], template: (city) => `Doctors near me in ${city}`, module: 'health' },
  { keywords: ['hotel', 'stay', 'room', 'oyo', 'lodge'], template: (city) => `Hotels near me in ${city}`, module: 'stays' },
  { keywords: ['job', 'work', 'employment', 'hiring', 'vacancy'], template: (city) => `Jobs near me in ${city}`, module: 'jobs' },
  { keywords: ['cab', 'taxi', 'ride', 'auto', 'rickshaw'], template: (city) => `Cabs available in ${city}`, module: 'travel' },
  { keywords: ['offer', 'deal', 'coupon', 'discount', 'cashback'], template: (city) => `Best offers in ${city}`, module: 'coupons' },
  { keywords: ['pharmacy', 'tablet', 'capsule', 'chemist'], template: (city) => `Pharmacy near me in ${city}`, module: 'health' },
  { keywords: ['mechanic', 'car service', 'bike service', 'tyre', 'puncture'], template: (city) => `Car service near me in ${city}`, module: 'vehicles' },
  { keywords: ['gym', 'fitness', 'workout', 'yoga'], template: (city) => `Gyms near me in ${city}`, module: 'health' },
];

const buildNearbySuggestions = (q, cityName) => {
  if (!cityName || cityName === 'Detecting...' || cityName === '') return [];
  return NEARBY_TEMPLATES
    .filter(t => t.keywords.some(kw => q.includes(kw) || kw.includes(q) || fuzzyScore(q, kw) >= 0.6))
    .slice(0, 3)
    .map(t => ({
      text: t.template(cityName),
      rawText: t.template(cityName).toLowerCase(),
      module: t.module,
      category: 'Nearby',
      icon: '📍',
      score: 0.88,
      type: 'nearby',
    }));
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
const trackEvent = (eventName, data = {}) => {
  try {
    const existing = JSON.parse(localStorage.getItem('search_analytics') || '[]');
    existing.push({ event: eventName, data, ts: Date.now() });
    if (existing.length > 100) existing.shift();
    localStorage.setItem('search_analytics', JSON.stringify(existing));
  } catch {}
};

export const trackSuggestionClick = (text, category) => trackEvent('SUGGESTION_CLICK', { text, category });
export const trackSuggestionImpression = (query, count) => trackEvent('SUGGESTION_IMPRESSION', { query, count });
export const trackNoResult = (query) => trackEvent('NO_RESULT', { query });

// ─── DEBOUNCE UTILITY ─────────────────────────────────────────────────────────
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

// ─── CORE BUILDER ─────────────────────────────────────────────────────────────
const buildSuggestions = (rawQuery, { recentSearches = [], moduleVisits = {}, userCity = '' } = {}) => {
  const query = sanitize(rawQuery);
  if (!query || query.length < 1) return { groups: [], typoCorrection: null };

  const q = query.toLowerCase().trim();
  const results = new Map();

  // ── Step 1: Expand synonyms ──
  const expandedQueries = [q];
  if (SYNONYM_MAP[q]) expandedQueries.push(...SYNONYM_MAP[q].map(s => s.toLowerCase()));

  // ── Step 2: Score all module keywords ──
  for (const [moduleKey, moduleDef] of Object.entries(MODULE_INDEX)) {
    for (const keyword of moduleDef.keywords) {
      let bestScore = 0;
      for (const eq of expandedQueries) {
        const score = fuzzyScore(eq, keyword);
        if (score > bestScore) bestScore = score;
      }
      if (bestScore >= 0.3) {
        const key = `${moduleKey}_${keyword}`;
        const existing = results.get(key);
        if (!existing || existing.score < bestScore) {
          results.set(key, {
            text: keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            rawText: keyword,
            module: moduleKey,
            category: moduleDef.category,
            icon: moduleDef.icon,
            score: bestScore,
            type: 'suggestion',
          });
        }
      }
    }
  }

  // ── Step 3: Match trending searches ──
  for (const trend of TRENDING_SEARCHES) {
    const score = fuzzyScore(q, trend.text);
    if (score >= 0.25) {
      results.set(`trend_${trend.text}`, {
        text: trend.text,
        rawText: trend.text.toLowerCase(),
        module: trend.module,
        category: MODULE_INDEX[trend.module]?.category || 'Trending',
        icon: '🔥',
        score: score * 0.9,
        type: 'trending',
      });
    }
  }

  // ── Step 4: Add personalized (recent + module-based) ── ✅ NOW ACTUALLY CALLED
  const personalized = buildPersonalizedSuggestions(q, recentSearches, moduleVisits);
  for (const item of personalized) {
    results.set(`pers_${item.text}`, item);
  }

  // ── Step 5: Add nearby location-aware suggestions ── ✅ NOW ACTUALLY CALLED
  const nearby = buildNearbySuggestions(q, userCity);
  for (const item of nearby) {
    results.set(`nearby_${item.text}`, item);
  }

  // ── Step 6: Sort all results ──
  const sortedResults = Array.from(results.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  // ── Step 7: Group by category with priority ordering ──
  const PRIORITY_ORDER = ['AI Recommended', 'Your Searches', 'Nearby'];
  const groupMap = new Map();
  for (const item of sortedResults) {
    if (!groupMap.has(item.category)) groupMap.set(item.category, []);
    const group = groupMap.get(item.category);
    if (group.length < 4) group.push(item);
  }

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => {
      const ai = PRIORITY_ORDER.indexOf(a);
      const bi = PRIORITY_ORDER.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return 0;
    })
    .map(([category, items]) => ({ category, items }))
    .slice(0, 8);

  return { groups, typoCorrection: getTypoCorrection(q) };
};

// ─── CACHE ───────────────────────────────────────────────────────────────────
const SUGGESTION_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export const getCachedSuggestions = (rawQuery, ctx = {}) => {
  const query = sanitize(rawQuery);
  if (!query || query.length < 1) return null;
  const cacheKey = `sug_v4_${query.toLowerCase()}_${ctx.userCity || ''}`;
  const now = Date.now();
  if (SUGGESTION_CACHE.has(cacheKey)) {
    const cached = SUGGESTION_CACHE.get(cacheKey);
    if (now - cached.ts < CACHE_TTL) return cached.data;
  }
  return null;
};

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
/**
 * getSuggestions — Primary entry point
 * @param {string} rawQuery
 * @param {{ recentSearches?: string[], moduleVisits?: object, userCity?: string }} ctx
 */
export const getSuggestions = async (rawQuery, ctx = {}) => {
  const query = sanitize(rawQuery);
  if (!query || query.length < 1) return { groups: [], typoCorrection: null };

  const cacheKey = `sug_v4_${query.toLowerCase()}_${ctx.userCity || ''}`;
  const now = Date.now();

  if (SUGGESTION_CACHE.has(cacheKey)) {
    const cached = SUGGESTION_CACHE.get(cacheKey);
    if (now - cached.ts < CACHE_TTL) return cached.data;
  }

  const result = buildSuggestions(query, ctx); // ← passes ctx with all 3 params

  SUGGESTION_CACHE.set(cacheKey, { data: result, ts: now });

  // Prune cache
  if (SUGGESTION_CACHE.size > 300) {
    const oldest = Array.from(SUGGESTION_CACHE.entries())
      .sort((a, b) => a[1].ts - b[1].ts).slice(0, 80);
    oldest.forEach(([k]) => SUGGESTION_CACHE.delete(k));
  }

  if (result.groups.length === 0) trackNoResult(query);
  else trackSuggestionImpression(query, result.groups.reduce((s, g) => s + g.items.length, 0));

  return result;
};

export const getTrendingSuggestions = (userCity = '') => {
  const cityKey = userCity.toLowerCase().replace(/\s+/g, '');
  const cityItems = (CITY_TRENDING[cityKey] || []).map(text => ({
    text, module: 'ecommerce',
    category: `Trending in ${userCity}`,
    icon: '📍', type: 'city_trending',
  }));
  const national = TRENDING_SEARCHES.slice(0, 8).map(t => ({
    text: t.text, module: t.module,
    category: MODULE_INDEX[t.module]?.category || 'Trending',
    icon: '🔥', type: 'trending',
  }));
  return [...cityItems, ...national].slice(0, 5);
};
