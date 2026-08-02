// AIOrchestrator.js
// Central Nervous System for CompareIt
import { ProviderManager } from './providers/ProviderManager';

class AIOrchestrator {
  constructor() {
    this.memoryCache = new Map();
    this.activeRequests = new Map();
  }

  // 1. Intent Routing Engine
  analyzeIntent(query) {
    const q = query.toLowerCase().trim();
    
    // Health Intent
    if (q.match(/(fever|doctor|medicine|hospital|clinic|cough|cold|pain|surgery|consult|protein|whey|vitamin|fish oil|supplement|calcium|creatine|device|monitor|machine|meter|glucometer|wheelchair|nurse|physio|home care|attendant|elder care|panadol|crocin|dolo|augmentin|shelcal|paracetamol|mg|ml|tablet|capsule|syrup)/)) {
      if (q.match(/(protein|whey|vitamin|fish oil|supplement|calcium|creatine)/)) return { module: 'health', tab: 'supplements', confidence: 0.9 };
      if (q.match(/(device|monitor|machine|meter|glucometer|wheelchair)/)) return { module: 'health', tab: 'devices', confidence: 0.9 };
      if (q.match(/(nurse|physio|home care|attendant|elder care)/)) return { module: 'health', tab: 'homecare', confidence: 0.9 };
      if (q.match(/(medicine|pill|tablet|capsule|syrup|panadol|crocin|dolo|augmentin|shelcal|paracetamol|mg|ml)/)) return { module: 'health', tab: 'medicine', confidence: 0.9 };
      return { module: 'health', tab: 'consult', confidence: 0.9 };
    }
    
    // Travel Intent
    if (q.match(/(flight|cab|hotel|stay|airport|train|bus|ticket|travel|ride)/)) {
      if (q.match(/(hotel|stay|room)/)) return { module: 'travel', tab: 'stay', confidence: 0.95 };
      if (q.match(/(cab|airport|ride)/)) return { module: 'travel', tab: 'commute', confidence: 0.95 };
      return { module: 'travel', tab: 'outstation', confidence: 0.85 };
    }

    // Food Intent
    if (q.match(/(food|pizza|burger|hungry|eat|restaurant|delivery|zomato|swiggy|dine)/)) {
      if (q.match(/(dine|table|restaurant)/)) return { module: 'food', tab: 'dineIn', confidence: 0.9 };
      return { module: 'food', tab: 'delivery', confidence: 0.9 };
    }

    // Education Intent
    if (q.match(/(college|school|course|degree|study|learn|exam|coaching|tutor)/)) {
      return { module: 'education', tab: 'colleges', confidence: 0.9 };
    }

    // E-commerce Intent
    if (q.match(/(buy|phone|laptop|shoes|clothes|watch|amazon|flipkart|price)/)) {
      return { module: 'ecommerce', tab: 'ecommerce', confidence: 0.85 };
    }
    
    // Vehicles Intent
    if (q.match(/(car|bike|service|mechanic|rent|auction|ev|tyre)/)) {
      if (q.match(/(service|mechanic)/)) return { module: 'vehicles', tab: 'services', confidence: 0.9 };
      if (q.match(/(rent)/)) return { module: 'vehicles', tab: 'rentals', confidence: 0.9 };
      return { module: 'vehicles', tab: 'marketplace', confidence: 0.8 };
    }

    // Logistics
    if (q.match(/(ship|courier|packers|movers|truck|parcel)/)) {
      return { module: 'logistics', tab: 'logistics', confidence: 0.9 };
    }

    return { module: 'unknown', confidence: 0 };
  }

  // Universal Provider Fetch via Adapter System
  async executeSmartQuery(moduleType, query) {
    if (!query) return [];
    
    // Check if ProviderManager has adapters for this module
    const adapters = ProviderManager.getAdaptersForModule(moduleType);
    
    // If we have modern adapters, use them!
    if (adapters.length > 0) {
      return this.fetchWithCache(`provider_v2_${moduleType}_${query}`, () => {
        return ProviderManager.fetchAndAggregate(moduleType, query);
      });
    }

    // Fallback: If no adapters exist yet for this module, return empty array
    // The individual tabs can handle the fallback to legacy local mock data
    return [];
  }

  // 2. Smart Cache & API Coordinator
  async fetchWithCache(key, fetchPromise, ttl = 300000) { // Default TTL: 5 mins
    const now = Date.now();
    
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      if (now - cached.timestamp < ttl) {
        return cached.data; // Return from cache
      }
    }

    // Prevent duplicate active requests
    if (this.activeRequests.has(key)) {
      return this.activeRequests.get(key);
    }

    try {
      const promise = fetchPromise();
      this.activeRequests.set(key, promise);
      
      const data = await promise;
      
      // Store in cache
      this.memoryCache.set(key, { timestamp: now, data });
      this.activeRequests.delete(key);
      
      return data;
    } catch (error) {
      this.activeRequests.delete(key);
      throw error;
    }
  }

  // 3. Background Optimizer (Memory & Battery)
  runBackgroundOptimization() {
    // Clear expired cache
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > 600000) { // 10 mins absolute max
        this.memoryCache.delete(key);
      }
    }
    console.log('[AI Orchestrator] Background Optimization Complete. Cache Size:', this.memoryCache.size);
  }
}

export const aiOrchestrator = new AIOrchestrator();
