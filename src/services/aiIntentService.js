export const parseAIIntent = (query) => {
  if (!query || typeof query !== 'string') return null;
  
  const lowerQuery = query.toLowerCase();
  
  // Logistics Intent
  if (lowerQuery.includes('parcel') || lowerQuery.includes('courier') || lowerQuery.includes('delivery') || (lowerQuery.includes('se') && lowerQuery.includes('tak'))) {
    const pickupMatch = lowerQuery.match(/(.*?)\s+se\s+/);
    const dropMatch = lowerQuery.match(/se\s+(.*?)\s+(parcel|courier|delivery|bhejna)/);
    
    return {
      intent: 'logistics',
      parameters: {
        pickup: pickupMatch ? pickupMatch[1].trim() : 'Unknown',
        drop: dropMatch ? dropMatch[1].trim() : 'Unknown',
      },
      response: `I can help you send a parcel${pickupMatch ? ` from ${pickupMatch[1].trim()}` : ''}${dropMatch ? ` to ${dropMatch[1].trim()}` : ''}. Let me find the best courier rates for you.`
    };
  }

  // Shopping Intent
  if (lowerQuery.includes('phone') || lowerQuery.includes('laptop') || lowerQuery.includes('under') || lowerQuery.includes('price') || lowerQuery.includes('buy')) {
    return {
      intent: 'shopping',
      parameters: { query },
      response: `Searching for the best deals on "${query}" across Amazon, Flipkart, Croma, and more...`
    };
  }

  // Food Intent
  if (lowerQuery.includes('food') || lowerQuery.includes('pizza') || lowerQuery.includes('burger') || lowerQuery.includes('restaurant') || lowerQuery.includes('eat')) {
    return {
      intent: 'food',
      parameters: { query },
      response: `Looking for top-rated restaurants and food delivery options for "${query}" on Zomato and Swiggy...`
    };
  }

  // Travel Intent
  if (lowerQuery.includes('flight') || lowerQuery.includes('train') || lowerQuery.includes('hotel') || lowerQuery.includes('ticket') || lowerQuery.includes('bus')) {
    return {
      intent: 'travel',
      parameters: { query },
      response: `Checking travel options, schedules, and fares for "${query}" on MakeMyTrip, Ixigo, Goibibo...`
    };
  }

  // Education Intent
  if (lowerQuery.includes('coaching') || lowerQuery.includes('neet') || lowerQuery.includes('jee') || lowerQuery.includes('school') || lowerQuery.includes('learn')) {
    return {
      intent: 'education',
      parameters: { query },
      response: `Finding the best educational platforms and institutes for "${query}"...`
    };
  }

  // Default Intent
  return {
    intent: 'general',
    parameters: { query },
    response: `I'll search for information on "${query}". Can you provide more specific details?`
  };
};
