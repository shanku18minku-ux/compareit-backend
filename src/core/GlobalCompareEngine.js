// GlobalCompareEngine.js
// Shared Comparison Logic across all modules

class GlobalCompareEngine {
  
  // Normalizes a value between 0 and 1 based on min/max across the dataset
  _normalize(value, min, max, invert = false) {
    if (max === min) return 1;
    let normalized = (value - min) / (max - min);
    return invert ? 1 - normalized : normalized;
  }

  // Generates an AI Score (0-100) based on unified weights
  // items: Array of objects [{ price, rating, timeOrDistance, ... }]
  // categoryWeights: Optional custom weights for specific domains
  rankItems(items, categoryWeights = null) {
    if (!items || items.length === 0) return [];

    // Default Weights
    const weights = categoryWeights || {
      price: 0.40,        // Lower is better (inverted)
      rating: 0.30,       // Higher is better
      timeOrDistance: 0.20, // Lower is better (inverted)
      reliability: 0.10   // Higher is better (or static fallback)
    };

    // Extract bounds for normalization
    let minPrice = Infinity, maxPrice = -Infinity;
    let minRating = Infinity, maxRating = -Infinity;
    let minTime = Infinity, maxTime = -Infinity;

    items.forEach(item => {
      if (item.price !== undefined) {
        minPrice = Math.min(minPrice, item.price);
        maxPrice = Math.max(maxPrice, item.price);
      }
      if (item.rating !== undefined) {
        minRating = Math.min(minRating, item.rating);
        maxRating = Math.max(maxRating, item.rating);
      }
      if (item.timeOrDistance !== undefined) {
        let val = parseFloat(item.timeOrDistance);
        if(!isNaN(val)){
            minTime = Math.min(minTime, val);
            maxTime = Math.max(maxTime, val);
        }
      }
    });

    // Calculate score for each item
    const scoredItems = items.map(item => {
      let score = 0;

      // Price Score (Inverted: cheapest = 1, most expensive = 0)
      if (item.price !== undefined && maxPrice !== -Infinity) {
        score += this._normalize(item.price, minPrice, maxPrice, true) * weights.price;
      } else {
        score += 0.5 * weights.price; // Neutral fallback
      }

      // Rating Score
      if (item.rating !== undefined && maxRating !== -Infinity) {
        score += this._normalize(item.rating, minRating, maxRating, false) * weights.rating;
      } else {
        score += 0.8 * weights.rating; // Assume good default
      }

      // Time/Distance Score (Inverted: fastest/closest = 1)
      if (item.timeOrDistance !== undefined && maxTime !== -Infinity) {
         let val = parseFloat(item.timeOrDistance);
         if(!isNaN(val)){
            score += this._normalize(val, minTime, maxTime, true) * weights.timeOrDistance;
         } else {
            score += 0.5 * weights.timeOrDistance;
         }
      } else {
        score += 0.5 * weights.timeOrDistance;
      }

      // Reliability / Trust Score
      let relScore = item.reliability || 0.8; // Default 80%
      score += relScore * weights.reliability;

      // Convert to 1-100 scale
      const finalScore = Math.round(score * 100);

      return {
        ...item,
        aiScore: Math.min(Math.max(finalScore, 40), 99) // Clamp between 40-99 for realism
      };
    });

    // Sort descending by aiScore
    return scoredItems.sort((a, b) => b.aiScore - a.aiScore);
  }
}

export const globalCompareEngine = new GlobalCompareEngine();
