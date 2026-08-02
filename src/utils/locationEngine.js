/**
 * Location Engine
 * Deterministically filters mock data arrays based on the city hash.
 * This ensures that changing the location dynamically changes the available ecosystem,
 * giving a realistic localized experience.
 */

// Simple string hashing function
const hashString = (str) => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

/**
 * Filter an array of items (like restaurants, doctors, cabs) based on the city name.
 * @param {Array} items - The full mock data array.
 * @param {String} city - The current user's city or location string.
 * @param {Number} keepPercentage - e.g., 0.7 means keep 70% of items.
 * @returns {Array} - The filtered array.
 */
export const filterByLocation = (items, city) => {
    if (!items || !Array.isArray(items)) return [];
    if (!city || city === 'Detecting...') return items; // Return all if no location is provided

    const userCity = city.toLowerCase();

    // Strict filtering: Only return items that explicitly match the user's city/location.
    return items.filter(item => {
        // Collect all possible location-related fields from various modules (Food, Travel, Cabs, etc.)
        const loc1 = (item.location || '').toLowerCase();
        const loc2 = (item.city || '').toLowerCase();
        const loc3 = (item.origin || '').toLowerCase();
        const loc4 = (item.destination || '').toLowerCase();
        const loc5 = (item.from || '').toLowerCase();
        const loc6 = (item.to || '').toLowerCase();
        const loc7 = (item.address || '').toLowerCase();
        
        const combinedLocation = `${loc1} ${loc2} ${loc3} ${loc4} ${loc5} ${loc6} ${loc7}`.trim();

        if (!combinedLocation) {
            // If the item has NO location fields whatsoever, it is likely a global/nationwide item
            // like E-commerce electronics, Online courses, or Medicines.
            // We allow these to pass through because they are available everywhere.
            return true;
        }

        // Strict match check
        return combinedLocation.includes(userCity) || userCity.includes(combinedLocation) ||
               (loc1 && userCity.includes(loc1)) || (loc1 && loc1.includes(userCity)) ||
               (loc2 && userCity.includes(loc2)) || (loc2 && loc2.includes(userCity)) ||
               (loc3 && userCity.includes(loc3)) || (loc3 && loc3.includes(userCity)) ||
               (loc5 && userCity.includes(loc5)) || (loc5 && loc5.includes(userCity));
    });
};

/**
 * Dynamically adjust a price/number based on location (simulate tier-1 vs tier-2 cities)
 */
export const adjustPriceByLocation = (basePrice, city) => {
    if (!city || city === 'Detecting...') return basePrice;
    const cityHash = hashString(city.toLowerCase());
    
    // Vary price by up to +/- 15%
    const variance = ((cityHash % 30) - 15) / 100;
    return Math.round(basePrice * (1 + variance));
};

/**
 * Dynamically injects a local platform into a list of platforms based on the user's city
 * @param {Array} platforms - The original platforms array
 * @param {String} city - The user's current city
 * @param {String} category - e.g. 'ecommerce', 'food', 'medicine', 'travel', 'vehicle'
 * @param {Number} basePrice - Reference price to anchor the local platform's price
 */
export const injectLocalPlatforms = (platforms, city, category, basePrice = 100) => {
    if (!platforms || !Array.isArray(platforms)) return [];
    if (!city || city === 'Detecting...') return platforms;

    // Prevent duplicate injection if it's already there
    if (platforms.some(p => p.isLocal)) return platforms;

    // Standardize city name for display (e.g. "Delhi, India" -> "Delhi")
    const displayCity = city.split(',')[0].trim();
    if (!displayCity) return platforms;

    let localPlatform = null;

    switch (category) {
        case 'ecommerce':
            localPlatform = {
                name: `${displayCity} Supermart`,
                price: Math.round(basePrice * 0.95), // Usually slightly cheaper
                delivery: 'Same Day',
                rating: 4.8,
                logo: '🏪',
                isLocal: true,
                fee: 0,
                discount: 0
            };
            break;
        case 'food':
            localPlatform = {
                name: `${displayCity} Eats`,
                price: basePrice,
                fee: 10,
                time: '25 min',
                discount: 0,
                rating: 4.5,
                logo: '🍽️',
                isLocal: true
            };
            break;
        case 'medicine':
            localPlatform = {
                name: `${displayCity} Meds`,
                price: Math.round(basePrice * 0.92),
                delivery: '2 hrs',
                rating: 4.7,
                logo: '⚕️',
                isLocal: true,
                fee: 0,
                discount: 0
            };
            break;
        case 'travel':
            localPlatform = {
                name: `${displayCity} Transports`,
                price: Math.round(basePrice * 0.85),
                duration: 'N/A',
                rating: 4.2,
                logo: '🚕',
                isLocal: true,
                fee: 0,
                discount: 0
            };
            break;
        case 'vehicle':
            localPlatform = {
                name: `${displayCity} Wheels`,
                price: Math.round(basePrice * 0.90),
                duration: 'Flexible',
                rating: 4.4,
                logo: '🚗',
                isLocal: true,
                fee: 0,
                discount: 0
            };
            break;
        default:
            break;
    }

    if (localPlatform) {
        // Insert it at the 2nd position (or 1st if empty) to ensure visibility
        const newPlatforms = [...platforms];
        newPlatforms.splice(1, 0, localPlatform);
        return newPlatforms;
    }

    return platforms;
};
