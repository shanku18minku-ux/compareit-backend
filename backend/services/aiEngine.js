/**
 * Dynamic AI Ranking Engine
 * Normalizes scores and ranks items based on unified weights.
 */

const normalize = (value, min, max, invert = false) => {
  if (max === min) return 1;
  let normalized = (value - min) / (max - min);
  return invert ? 1 - normalized : normalized;
};

const rankAndScoreItems = (items) => {
  if (!items || items.length === 0) return [];

  // 1. Determine Global Min/Max for normalization
  let minPrice = Infinity, maxPrice = -Infinity;
  let minEta = Infinity, maxEta = -Infinity;

  items.forEach(item => {
    if (item.price) {
      minPrice = Math.min(minPrice, item.price);
      maxPrice = Math.max(maxPrice, item.price);
    }
    if (item.etaDays) {
      minEta = Math.min(minEta, item.etaDays);
      maxEta = Math.max(maxEta, item.etaDays);
    }
  });

  // 2. Score each item
  const scoredItems = items.map(item => {
    let score = 0;

    // Price Factor (40% Weight - Inverted)
    if (item.price && maxPrice !== -Infinity) {
      score += normalize(item.price, minPrice, maxPrice, true) * 0.40;
    } else {
      score += 0.20; // Default middle score
    }

    // Delivery Speed Factor (30% Weight - Inverted)
    if (item.etaDays && maxEta !== -Infinity) {
      score += normalize(item.etaDays, minEta, maxEta, true) * 0.30;
    } else {
      score += 0.15;
    }

    // Trust Score (20% Weight)
    // E.g., Amazon might return trust=95, an unknown platform trust=50
    const trust = item.trustScore || 80;
    score += (trust / 100) * 0.20;

    // Coupon Availability (10% Weight)
    if (item.hasCoupon) {
      score += 0.10;
    }

    // Map [0, 1] to [40, 99] for a realistic "AI Score" UI
    const finalScore = Math.min(Math.max(Math.round(score * 100), 40), 99);

    return {
      ...item,
      aiScore: finalScore
    };
  });

  // 3. Sort by AI Score descending
  return scoredItems.sort((a, b) => b.aiScore - a.aiScore);
};

module.exports = {
  rankAndScoreItems
};
