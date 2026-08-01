import { AIAggregationEngine } from '../engine/AIAggregationEngine';
import { AmazonAdapter } from './adapters/AmazonAdapter';
import { FlipkartAdapter } from './adapters/FlipkartAdapter';

class ProviderManagerImpl {
  constructor() {
    this.adapters = [];
    this.aggregationEngine = new AIAggregationEngine();
    
    // Register initial adapters
    this.registerAdapter(new AmazonAdapter());
    this.registerAdapter(new FlipkartAdapter());
  }

  registerAdapter(adapter) {
    this.adapters.push(adapter);
  }

  getAdaptersForModule(moduleType) {
    return this.adapters.filter(a => a.moduleType === moduleType && a.enabled);
  }

  getAllAdapters() {
    return this.adapters;
  }

  toggleProvider(providerName, enable) {
    const adapter = this.adapters.find(a => a.providerName === providerName);
    if (adapter) {
      enable ? adapter.enable() : adapter.disable();
    }
  }

  async fetchAndAggregate(moduleType, query) {
    if (!query) return [];

    // Try new Backend Gateway first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category: moduleType }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.length > 0) {
           console.log("Returned from Backend Gateway:", json.data);
           // Adapt backend response to frontend expectations if needed, but since we designed it well, it should just work.
           return json.data;
        }
      }
    } catch (e) {
      console.warn("Backend Gateway failed, falling back to mock adapters", e);
    }

    // Fallback to old mock adapters
    const relevantAdapters = this.getAdaptersForModule(moduleType);
    if (relevantAdapters.length === 0) return [];

    // Fetch from all adapters in parallel
    const fetchPromises = relevantAdapters.map(adapter => adapter.fetch(query));
    const results = await Promise.allSettled(fetchPromises);
    
    // Flatten successful results
    let allRawItems = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        allRawItems = allRawItems.concat(result.value);
      }
    });

    // Pass to AI Engine for deduplication, merging, and ranking
    return this.aggregationEngine.process(allRawItems, moduleType);
  }
}

export const ProviderManager = new ProviderManagerImpl();
