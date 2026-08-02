import { deliveryDishes } from './mockData.js';

// Mock location based distance calculation
const getLocationDistance = (location) => {
    // Generate a pseudo-random distance based on string length and char codes
    const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 10) + 1; // Returns 1 to 10 km
};

// Mock coupon configurations
const coupons = {
    'Zomato': { code: 'ZOMATO50', type: 'PERCENT', value: 0.50, maxCap: 100 },
    'Swiggy': { code: 'SWIGGYIT', type: 'FLAT', value: 50 },
    'EatSure': { code: 'EATSURE20', type: 'PERCENT', value: 0.20, maxCap: 80 }
};

const getDeliveryFee = (appName, distance) => {
    let base = 20;
    return base + (distance * 5); // ₹5 per km
};

const getPlatformFee = (appName) => {
    switch(appName) {
        case 'Zomato': return 5;
        case 'Swiggy': return 5;
        case 'EatSure': return 0;
        default: return 3;
    }
};

const applyCoupon = (appName, itemPrice, deliveryFee) => {
    const coupon = coupons[appName] || null;
    if (!coupon) return { couponCode: null, discount: 0 };

    let discount = 0;
    if (coupon.type === 'PERCENT') {
        discount = itemPrice * coupon.value;
        if (coupon.maxCap) {
            discount = Math.min(discount, coupon.maxCap);
        }
    } else if (coupon.type === 'FLAT') {
        discount = coupon.value;
    } else if (coupon.type === 'FREE_DELIVERY') {
        discount = deliveryFee;
    }
    return { couponCode: coupon.code, discount: Math.floor(discount) };
};

/**
 * Aggregates food delivery options, computes dynamic pricing with coupons, 
 * and ranks platforms using an AI Scoring formula.
 * 
 * @param {string} location - User's location string.
 * @returns {Array} Enriched array of dishes with ranked platforms.
 */
export const getAggregatedDeliveryOptions = (location = 'Central') => {
    const distance = getLocationDistance(location);

    const enrichedDishes = deliveryDishes.map(dish => {
        const dishRating = dish.rating || 4.0;
        
        // 1. Process Pricing and Coupons for each Platform
        let enrichedPlatforms = dish.platforms.map(platform => {
            const appName = platform.name || platform.appName;
            const itemPrice = platform.itemPrice || platform.price || dish.basePrice || 200;
            const deliveryFee = getDeliveryFee(appName, distance);
            const platformFee = getPlatformFee(appName);
            const deliveryTime = 20 + Math.floor(Math.random() * 20) + Math.floor(distance * 2); 
            
            const { couponCode, discount } = applyCoupon(appName, itemPrice, deliveryFee);
            
            let finalPrice = itemPrice + deliveryFee + platformFee - discount;
            if (finalPrice < 0) finalPrice = 0;

            const deepLink = `${appName.toLowerCase()}://restaurant/${dish.restaurantId || '123'}/item/${dish.id || '456'}`;

            return {
                ...platform,
                appName,
                itemPrice,
                platformFee,
                deliveryFee,
                couponCode,
                discount,
                finalPrice,
                deepLink,
                deliveryTime
            };
        });

        // 2. AI Ranking Engine Execution
        // Calculate dynamic baselines for the score formula
        const minPrice = Math.min(...enrichedPlatforms.map(p => p.finalPrice));
        const minTime = Math.min(...enrichedPlatforms.map(p => p.deliveryTime));
        const minFee = Math.min(...enrichedPlatforms.map(p => p.deliveryFee));

        enrichedPlatforms = enrichedPlatforms.map(platform => {
            // Formula component weighting:
            // Final price: 40% (cheaper is better)
            const priceScore = (minPrice / Math.max(platform.finalPrice, 1)) * 40;
            
            // Delivery time: 20% (faster is better)
            const timeScore = (minTime / Math.max(platform.deliveryTime, 1)) * 20;
            
            // Rating: 20%
            const ratingScore = (dishRating / 5) * 20;
            
            // Distance/Delivery Fee: 10% (lower fee is better)
            const feeScore = platform.deliveryFee === 0 ? 10 : (minFee / platform.deliveryFee) * 10;
            
            // Offer quality: 10% (higher discount ratio is better)
            const offerScore = Math.min((platform.discount / Math.max(platform.itemPrice, 1)) * 10, 10);
            
            // Calculate and cap total aiScore at 100
            const rawScore = priceScore + timeScore + ratingScore + feeScore + offerScore;
            const aiScore = Number(Math.min(rawScore, 100).toFixed(2));
            
            return {
                ...platform,
                aiScore
            };
        });

        // 3. Sort the platforms array for each dish descending by aiScore
        enrichedPlatforms.sort((a, b) => b.aiScore - a.aiScore);

        return {
            ...dish,
            platforms: enrichedPlatforms
        };
    });

    return enrichedDishes;
};
