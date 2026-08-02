import * as mockData from '../mockData';

// Helper to simulate network delay for mock data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const useApi = () => {
  const fetchLocalDatabase = async (table) => {
    try {
      const response = await fetch(`${API_URL}/db/${table}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json.success) {
        return json.data;
      }
      throw new Error(json.error || 'Unknown error');
    } catch (error) {
      console.warn(`Local database fetch failed for ${table}, falling back to mock data:`, error);
      return null;
    }
  };

  return {
    getUpcomingSales: async () => {
      const data = await fetchLocalDatabase('upcoming_sales');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.upcomingSales || [];
    },
    getTrendingDeals: async () => {
      const data = await fetchLocalDatabase('trending_deals');
      if (data && data.length > 0) return data;
      await delay(500);
      return [...(mockData.trendingDeals || []), ...(mockData.universalDeals || [])];
    },
    getDeliveryDishes: async () => {
      const data = await fetchLocalDatabase('delivery_dishes');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.deliveryDishes || [];
    },
    getGroceryItems: async () => {
      const data = await fetchLocalDatabase('grocery_items');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.groceryItems || [];
    },
    getCommuteRides: async () => {
      const data = await fetchLocalDatabase('commute_rides');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.commuteRides || [];
    },
    getOutstationRoutes: async () => {
      const data = await fetchLocalDatabase('outstation_routes');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.outstationRoutes || [];
    },
    getHotelListings: async () => {
      const data = await fetchLocalDatabase('hotel_listings');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.hotelListings || [];
    },
    getHealthConsults: async () => {
      const data = await fetchLocalDatabase('health_consults');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.healthConsults || [];
    },
    getHealthMedicines: async () => {
      const data = await fetchLocalDatabase('health_medicines');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.healthMedicines || [];
    },
    getHealthLabs: async () => {
      const data = await fetchLocalDatabase('health_labs');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.healthLabs || [];
    },
    getEduCourses: async () => {
      const data = await fetchLocalDatabase('edu_courses');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.eduCourses || [];
    },
    getEduColleges: async () => {
      const data = await fetchLocalDatabase('edu_colleges');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.eduColleges || [];
    },
    getEduScholarships: async () => {
      const data = await fetchLocalDatabase('edu_scholarships');
      if (data && data.length > 0) return data;
      await delay(500);
      return mockData.eduScholarships || [];
    }
  };
};
