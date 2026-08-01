import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // === AUTH STATE ===
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: true,
      authError: null,
      setUser: (user) => set({ user, isAuthenticated: !!user, isGuest: user?.authProvider === 'guest', isLoading: false, authError: null }),
      setAuthLoading: (loading) => set({ isLoading: loading }),
      setAuthError: (error) => set({ authError: error }),
      clearAuth: () => set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false, authError: null }),

      // === APP FLOW STATE ===
      currentScreen: 'loading',
      authPage: 'login',
      viewMode: 'dashboard', // 'dashboard' | 'plp' | 'pdp' | 'coupons' | 'logistics' | 'vehicles'
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      setAuthPage: (page) => set({ authPage: page }),
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // === GLOBAL REDIRECT (AFFILIATE) ===
      globalRedirectData: null, // { providerName: 'Zoomcar', targetUrl: 'https...' }
      setGlobalRedirectData: (data) => set({ globalRedirectData: data }),

      // === NAVIGATION ===
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      resetToHome: () => set({ activeTab: 'home', searchQuery: '', searchMode: 'text', viewMode: 'dashboard', activeProduct: null }),

      // === SEARCH ===
      searchQuery: '',
      searchMode: 'text',
      searchResults: [],
      recentSearches: ['iPhone 16', 'Nike Air Max', 'Samsung Galaxy S25', 'Protein Powder', 'Air Purifier'],
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchMode: (mode) => set({ searchMode: mode }),
      addRecentSearch: (query) => set(state => ({
        recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 10)
      })),

      // === LOCATION STATE ===
      userLocation: { address: 'Detecting location...', city: 'Delhi', lat: null, lng: null },
      locationStatus: 'detecting',
      couponMode: 'auto', // 'auto' | 'manual'
      setCouponMode: (mode) => set({ couponMode: mode }),
      
      appliedManualCoupons: {}, // { itemId: 'CODE123' }
      setManualCoupon: (itemId, code) => set((state) => ({
        appliedManualCoupons: {
          ...state.appliedManualCoupons,
          [itemId]: code
        }
      })),
      setUserLocation: (location, status) => set({ userLocation: location, locationStatus: status }),

      // === FOOD MODULE ===
      activeFoodTab: 'delivery',
      setActiveFoodTab: (tab) => set({ activeFoodTab: tab }),
      foodSearchQuery: '',
      setFoodSearchQuery: (query) => set({ foodSearchQuery: query }),

      // === TRAVEL MODULE ===
      activeTravelTab: 'commute',
      setActiveTravelTab: (tab) => set({ activeTravelTab: tab }),
      travelSearchQuery: '',
      setTravelSearchQuery: (query) => set({ travelSearchQuery: query }),
      stayCheckIn: '',
      stayCheckOut: '',
      stayGuests: 1,
      setStayCheckIn: (date) => set({ stayCheckIn: date }),
      setStayCheckOut: (date) => set({ stayCheckOut: date }),
      setStayGuests: (count) => set({ stayGuests: count }),
      commuteFrom: '',
      commuteTo: '',
      setCommuteFrom: (loc) => set({ commuteFrom: loc }),
      setCommuteTo: (loc) => set({ commuteTo: loc }),

      // === HEALTH MODULE ===
      activeHealthTab: 'doctor',
      setActiveHealthTab: (tab) => set({ activeHealthTab: tab }),
      healthSearchQuery: '',
      setHealthSearchQuery: (query) => set({ healthSearchQuery: query }),

      // === EDUCATION MODULE ===
      activeEducationTab: 'courses',
      setActiveEducationTab: (tab) => set({ activeEducationTab: tab }),
      educationSearchQuery: '',
      setEducationSearchQuery: (query) => set({ educationSearchQuery: query }),

      // === VEHICLES MODULE ===
      activeVehicleTab: 'marketplace',
      setActiveVehicleTab: (tab) => set({ activeVehicleTab: tab }),
      vehicleSearchQuery: '',
      setVehicleSearchQuery: (query) => set({ vehicleSearchQuery: query }),
      goToVehicles: () => set({ viewMode: 'vehicles' }),

      // === E-COMMERCE / PRODUCTS ===
      activeProduct: null,
      setActiveProduct: (product) => set({ activeProduct: product }),
      filters: { category: 'All', priceRange: [0, 200000], brands: [], minRating: 0 },
      setFilter: (key, value) => set(state => ({ filters: { ...state.filters, [key]: value } })),
      clearFilters: () => set({ filters: { category: 'All', priceRange: [0, 200000], brands: [], minRating: 0 } }),
      sortBy: 'relevance',
      setSortBy: (sort) => set({ sortBy: sort }),
      goToPDP: (product) => set({ activeProduct: product, viewMode: 'pdp' }),
      goToPLP: (query) => set({ searchQuery: query || '', viewMode: 'plp' }),
      goToDashboard: () => set({ viewMode: 'dashboard', activeProduct: null }),

      // === COUPON ENGINE STATE ===
      activeCoupons: {},
      applyCoupon: (productId, coupon) => set(state => ({ activeCoupons: { ...state.activeCoupons, [productId]: coupon } })),
      couponSearchQuery: '',
      setCouponSearchQuery: (q) => set({ couponSearchQuery: q }),
      activeCouponCategory: 'all',
      setActiveCouponCategory: (cat) => set({ activeCouponCategory: cat }),
      goToCoupons: () => set({ viewMode: 'coupons', activeProduct: null }),

      // === LOGISTICS MODULE ===
      logisticsSearch: { from: '', to: '', weight: '2kg', type: 'box' },
      setLogisticsSearch: (searchObj) => set(state => ({ logisticsSearch: { ...state.logisticsSearch, ...searchObj } })),
      goToLogistics: () => set({ viewMode: 'logistics', activeProduct: null }),

      // === UI STATE ===
      isAICopilotOpen: false,
      toggleAICopilot: () => set(state => ({ isAICopilotOpen: !state.isAICopilotOpen })),
      isLanguagePickerOpen: false,
      setLanguagePickerOpen: (open) => set({ isLanguagePickerOpen: open }),
      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),

      // === LANGUAGE ===
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // === NOTIFICATIONS ===
      notifications: [],
      addNotification: (notif) => set(state => ({ notifications: [notif, ...state.notifications] })),

      // === WISHLIST ===
      wishlistItems: [],
      toggleWishlist: (productId) => set(state => ({
        wishlistItems: state.wishlistItems.includes(productId)
          ? state.wishlistItems.filter(id => id !== productId)
          : [...state.wishlistItems, productId]
      })),

      // === SAVINGS ===
      totalSaved: 24580,
      cashbackEarned: 3420,
      couponsUsed: 47,
    }),
    {
      name: 'compareit-store',
      partialize: (state) => ({
        language: state.language,
        recentSearches: state.recentSearches,
        wishlistItems: state.wishlistItems,
        userLocation: state.userLocation,
      }),
    }
  )
);

export default useAppStore;
