export class AIAggregationEngine {
  
  process(rawItems, moduleType) {
    if (!rawItems || rawItems.length === 0) return [];
    
    // 1. Deduplicate & Merge (Group by normalized name)
    const grouped = this._groupByProduct(rawItems);
    
    // 2. Format for UI (Convert grouped items to UniversalCard format)
    const aggregated = this._formatForUI(grouped, moduleType);

    // 3. Rank Results
    return this._rankResults(aggregated);
  }

  _groupByProduct(items) {
    const map = new Map();
    
    items.forEach(item => {
      // Guard against null/undefined item.name to prevent TypeError
      const safeName = item.name ? String(item.name) : 'unnamed-product';
      const normalizedName = safeName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (!map.has(normalizedName)) {
        map.set(normalizedName, {
          baseInfo: item,
          platforms: []
        });
      }
      
      map.get(normalizedName).platforms.push({
        platform: item.provider,
        price: item.price,
        mrp: item.mrp,
        url: item.url,
        rating: item.rating,
        deliveryTime: item.deliveryTime
      });
    });
    
    return Array.from(map.values());
  }

  _formatForUI(groupedItems, moduleType) {
    return groupedItems.map(group => {
      const base = group.baseInfo;
      const platforms = group.platforms;
      
      // Calculate cheapest
      const prices = platforms.map(p => p.price);
      const minPrice = Math.min(...prices);
      
      // Calculate AI Score (Mock logic: higher is better based on price and ratings)
      const avgRating = platforms.reduce((acc, p) => acc + (p.rating || 4), 0) / platforms.length;
      const aiScore = Math.min(9.9, ((avgRating / 5) * 6) + (base.mrp ? ((base.mrp - minPrice)/base.mrp * 4) : 3)).toFixed(1);

      // Create compareData for UniversalCard AI Popups
      const compareData = platforms.map(p => ({
        platform: p.platform,
        price: p.price,
        url: p.url,
        isCheapest: p.price === minPrice
      })).sort((a, b) => a.price - b.price);

      return {
        id: `ai_${Math.random().toString(36).slice(2, 11)}`,
        title: base.name,
        subtitle: base.brand || base.category || moduleType,
        coverImage: base.image || null,
        price: minPrice,
        mrp: base.mrp || minPrice,
        rating: avgRating.toFixed(1),
        timeOrDistance: platforms[0].deliveryTime || 'Standard Delivery',
        aiScore: parseFloat(aiScore),
        badge1: compareData.length > 1 ? `${compareData.length} Deals` : 'Exclusive',
        badge2: base.discount ? `${base.discount}% OFF` : '',
        compareData: compareData,
        features: ['AI Verified', 'Best Price Guarantee', 'Authorized Sellers']
      };
    });
  }

  _rankResults(items) {
    // Sort by AI Score descending
    return items.sort((a, b) => b.aiScore - a.aiScore);
  }
}
