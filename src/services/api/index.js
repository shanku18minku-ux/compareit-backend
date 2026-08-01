import { supabase } from '../../config/supabase';
import * as mockData from '../mockData';

// Helper to simulate network delay for mock data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useApi = () => {
  const fetchSupabaseData = async (table, select = '*') => {
    try {
      // Check if supabase is configured
      if (supabase.supabaseUrl === 'https://placeholder.supabase.co') {
        throw new Error('Supabase not configured');
      }
      
      const { data, error } = await supabase.from(table).select(select);
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn(`Supabase fetch failed for ${table}, falling back to mock data:`, error);
      return null;
    }
  };

  return {
    getUpcomingSales: async () => {
      const data = await fetchSupabaseData('upcoming_sales');
      if (data) return data;
      await delay(500);
      return mockData.upcomingSales || [];
    },
    getTrendingDeals: async () => {
      const data = await fetchSupabaseData('trending_deals');
      if (data) return data;
      await delay(500);
      return [...(mockData.trendingDeals || []), ...(mockData.universalDeals || [])];
    },
    getDeliveryDishes: async () => {
      const data = await fetchSupabaseData('delivery_dishes');
      if (data) return data;
      await delay(500);
      return mockData.deliveryDishes || [];
    },
    getGroceryItems: async () => {
      const data = await fetchSupabaseData('grocery_items');
      if (data) return data;
      await delay(500);
      return mockData.groceryItems || [];
    },
    getCommuteRides: async () => {
      const data = await fetchSupabaseData('commute_rides');
      if (data) return data;
      await delay(500);
      return mockData.commuteRides || [];
    },
    getOutstationRoutes: async () => {
      const data = await fetchSupabaseData('outstation_routes');
      if (data) return data;
      await delay(500);
      return mockData.outstationRoutes || [];
    },
    getHotelListings: async () => {
      const data = await fetchSupabaseData('hotel_listings');
      if (data) return data;
      await delay(500);
      return mockData.hotelListings || [];
    },
    getHealthConsults: async () => {
      const data = await fetchSupabaseData('health_consults');
      if (data) return data;
      await delay(500);
      return mockData.healthConsults || [];
    },
    getHealthMedicines: async () => {
      const data = await fetchSupabaseData('health_medicines');
      if (data) return data;
      await delay(500);
      return mockData.healthMedicines || [];
    },
    getHealthLabs: async () => {
      const data = await fetchSupabaseData('health_labs');
      if (data) return data;
      await delay(500);
      return mockData.healthLabs || [];
    },
    getEduCourses: async () => {
      const data = await fetchSupabaseData('edu_courses');
      if (data) return data;
      await delay(500);
      return mockData.eduCourses || [];
    },
    getEduColleges: async () => {
      const data = await fetchSupabaseData('edu_colleges');
      if (data) return data;
      await delay(500);
      return mockData.eduColleges || [];
    },
    getEduScholarships: async () => {
      const data = await fetchSupabaseData('edu_scholarships');
      if (data) return data;
      await delay(500);
      return mockData.eduScholarships || [];
    }
  };
};
