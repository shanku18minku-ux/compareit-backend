export class BaseAdapter {
  constructor(providerName, moduleType) {
    this.providerName = providerName;
    this.moduleType = moduleType; // e.g., 'shopping', 'health', 'food'
    this.enabled = true;
    this.responseTimes = [];
  }

  async fetch(query) {
    if (!this.enabled) return [];
    
    const start = performance.now();
    try {
      const rawData = await this._fetchData(query);
      const normalizedData = this.normalize(rawData);
      
      const end = performance.now();
      this.responseTimes.push(end - start);
      if (this.responseTimes.length > 50) this.responseTimes.shift();

      return normalizedData;
    } catch (error) {
      console.error(`[${this.providerName}] Fetch error:`, error);
      return [];
    }
  }

  // To be implemented by specific adapters
  async _fetchData(query) {
    throw new Error('_fetchData must be implemented');
  }

  // Convert raw provider data to standardized format
  normalize(data) {
    throw new Error('normalize must be implemented');
  }

  getAverageResponseTime() {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.responseTimes.length);
  }

  getHealth() {
    return {
      name: this.providerName,
      module: this.moduleType,
      enabled: this.enabled,
      avgResponseTime: this.getAverageResponseTime(),
      status: this.enabled ? (this.getAverageResponseTime() > 1000 ? 'slow' : 'healthy') : 'disabled'
    };
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }
}
