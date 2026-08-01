import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePersonalizationStore = create(
  persist(
    (set, get) => ({
      moduleVisits: {}, // { 'food': 12, 'travel': 5, ... }
      recentSearches: [],
      
      recordVisit: (moduleId) => set((state) => {
        const currentVisits = state.moduleVisits[moduleId] || 0;
        return {
          moduleVisits: {
            ...state.moduleVisits,
            [moduleId]: currentVisits + 1
          }
        };
      }),

      addRecentSearch: (query) => set((state) => {
        const filtered = state.recentSearches.filter(q => q.toLowerCase() !== query.toLowerCase());
        return {
          recentSearches: [query, ...filtered].slice(0, 10) // Keep top 10
        };
      }),

      // Returns modules ordered by frequency of visits
      getTopModules: () => {
        const visits = get().moduleVisits;
        return Object.entries(visits)
          .sort(([, a], [, b]) => b - a)
          .map(([moduleId]) => moduleId);
      }
    }),
    {
      name: 'compareit-personalization', // unique name
    }
  )
);

export default usePersonalizationStore;
