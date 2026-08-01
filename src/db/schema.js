const crypto = require('crypto');

const generateId = () => crypto.randomUUID();

// ENUMS
const Enums = {
  AuthProvider: ['email', 'google', 'guest'],
  MediaType: ['image', 'video'],
  TransportType: ['ride', 'flight', 'train', 'bus', 'hotel'],
  ConsultationType: ['video', 'audio', 'clinic'],
  CoachingMode: ['online', 'offline', 'hybrid'],
  CollegeType: ['engineering', 'medical', 'management', 'arts', 'law', 'other'],
  DiscountType: ['percentage', 'flat'],
  Recommendation: ['buy_now', 'wait'],
  ShareMethod: ['whatsapp', 'telegram', 'link'],
  FamilyRole: ['admin', 'member'],
  ReferralStatus: ['pending', 'completed', 'expired'],
  SearchType: ['text', 'voice', 'image', 'barcode'],
};

// TABLE NAMES
const Tables = {
  USERS: 'users',
  USER_PREFERENCES: 'user_preferences',
  USER_SESSIONS: 'user_sessions',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRODUCT_VARIANTS: 'product_variants',
  PRODUCT_IMAGES: 'product_images',
  PLATFORMS: 'platforms',
  PLATFORM_LISTINGS: 'platform_listings',
  PRICE_HISTORY: 'price_history',
  REVIEWS: 'reviews',
  SECONDHAND_LISTINGS: 'secondhand_listings',
  OFFLINE_STORES: 'offline_stores',
  RESTAURANTS: 'restaurants',
  DISHES: 'dishes',
  RESTAURANT_DISHES: 'restaurant_dishes',
  FOOD_PLATFORMS: 'food_platforms',
  FOOD_PLATFORM_LISTINGS: 'food_platform_listings',
  TRANSPORT_PROVIDERS: 'transport_providers',
  RIDE_QUOTES: 'ride_quotes',
  FLIGHTS: 'flights',
  TRAINS: 'trains',
  BUSES: 'buses',
  HOTELS: 'hotels',
  HOTEL_LISTINGS: 'hotel_listings',
  DOCTORS: 'doctors',
  HEALTH_PLATFORMS: 'health_platforms',
  CONSULTATION_LISTINGS: 'consultation_listings',
  MEDICINES: 'medicines',
  MEDICINE_LISTINGS: 'medicine_listings',
  DIAGNOSTICS: 'diagnostics',
  DIAGNOSTIC_LISTINGS: 'diagnostic_listings',
  COACHING_INSTITUTES: 'coaching_institutes',
  COLLEGES: 'colleges',
  COLLEGE_CUTOFFS: 'college_cutoffs',
  EDTECH_PLATFORMS: 'edtech_platforms',
  COURSES: 'courses',
  COURSE_LISTINGS: 'course_listings',
  SCHOLARSHIPS: 'scholarships',
  COUPONS: 'coupons',
  CASHBACK_OFFERS: 'cashback_offers',
  DEAL_SCORES: 'deal_scores',
  PRICE_PREDICTIONS: 'price_predictions',
  AI_CONVERSATIONS: 'ai_conversations',
  USER_REVIEWS: 'user_reviews',
  SHARED_DEALS: 'shared_deals',
  WISHLISTS: 'wishlists',
  WISHLIST_ITEMS: 'wishlist_items',
  FAMILY_GROUPS: 'family_groups',
  FAMILY_MEMBERS: 'family_members',
  REFERRALS: 'referrals',
  USER_SAVINGS: 'user_savings',
  SEARCH_LOGS: 'search_logs',
  SALE_EVENTS: 'sale_events'
};

// RELATIONSHIPS
const Relationships = {
  [Tables.USERS]: {
    preferences: { type: 'hasOne', target: Tables.USER_PREFERENCES },
    sessions: { type: 'hasMany', target: Tables.USER_SESSIONS }
  },
  [Tables.PRODUCTS]: {
    category: { type: 'belongsTo', target: Tables.CATEGORIES },
    variants: { type: 'hasMany', target: Tables.PRODUCT_VARIANTS },
    images: { type: 'hasMany', target: Tables.PRODUCT_IMAGES },
    listings: { type: 'hasMany', target: Tables.PLATFORM_LISTINGS }
  }
  // Simplified for brevity, standard active record relationships apply
};

// MOCK DATA FACTORIES (Indian Market Context)
const Factories = {
  createMockUser: () => ({
    id: generateId(),
    email: 'rahul.sharma@example.com',
    display_name: 'Rahul Sharma',
    photo_url: 'https://example.com/profiles/rahul.jpg',
    gender: 'Male',
    dob: '1990-05-15',
    auth_provider: 'google',
    supabase_uid: 'supabase_uid_12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),

  createMockPlatform: () => ({
    id: generateId(),
    name: 'Flipkart',
    slug: 'flipkart',
    logo_url: 'https://example.com/logos/flipkart.png',
    base_url: 'https://flipkart.com',
    is_active: true
  }),

  createMockProduct: (categoryId) => ({
    id: generateId(),
    name: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    description: 'Flagship smartphone from Samsung',
    category_id: categoryId || generateId(),
    avg_rating: 4.8,
    total_reviews: 12500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),

  createMockFoodPlatform: () => ({
    id: generateId(),
    name: 'Zomato',
    slug: 'zomato',
    logo_url: 'https://example.com/logos/zomato.png'
  }),

  createMockRestaurant: () => ({
    id: generateId(),
    name: 'Bikanervala',
    cuisine_type: 'North Indian, Mithai',
    rating: 4.2,
    address: 'Connaught Place, New Delhi',
    lat: 28.6315,
    lng: 77.2167,
    image_url: 'https://example.com/restaurants/bikaner.jpg',
    is_veg: true,
    cost_for_two: 800
  }),

  createMockFlight: (providerId) => ({
    id: generateId(),
    provider_id: providerId || generateId(),
    airline: 'IndiGo',
    flight_no: '6E-2022',
    origin_code: 'DEL',
    dest_code: 'BOM',
    departure_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    arrival_at: new Date(Date.now() + 86400000 + 7200000).toISOString(),
    duration_mins: 120,
    price: 4500.00,
    class: 'Economy',
    stops: 0,
    baggage_kg: 15,
    url: 'https://goindigo.in/book/xyz'
  }),

  createMockDoctor: () => ({
    id: generateId(),
    name: 'Dr. Priya Mehta',
    specialization: 'Dermatologist',
    qualifications: 'MBBS, MD - Dermatology',
    experience_years: 12,
    photo_url: 'https://example.com/doctors/priya.jpg',
    hospital: 'Apollo Hospitals',
    city: 'Mumbai',
    rating: 4.7,
    total_consultations: 5200
  }),

  createMockCollege: () => ({
    id: generateId(),
    name: 'IIT Bombay',
    type: 'engineering',
    city: 'Mumbai',
    state: 'Maharashtra',
    nirf_rank: 3,
    naac_grade: 'A++',
    established_year: 1958,
    avg_placement_lpa: 21.5,
    highest_placement_lpa: 367.0,
    total_students: 10000,
    url: 'https://iitb.ac.in',
    image_url: 'https://example.com/colleges/iitb.jpg'
  }),

  createMockCoupon: (platformId) => ({
    id: generateId(),
    platform_id: platformId || generateId(),
    code: 'FESTIVE50',
    description: 'Get 50% off up to ₹1000 on your first order',
    discount_type: 'percentage',
    discount_value: 50.00,
    min_order: 500.00,
    max_discount: 1000.00,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 7 * 86400000).toISOString(), // 1 week
    is_verified: true,
    success_rate: 98.5,
    category: 'electronics'
  })
};

module.exports = {
  Enums,
  Tables,
  Relationships,
  Factories
};
