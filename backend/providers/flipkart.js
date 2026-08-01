// Mock Flipkart Provider
module.exports = {
  search: async (query, category) => {
    // In a real app, this would use the Flipkart Affiliate API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'flp_1',
            platform: 'Flipkart',
            title: `${query} (Assured)`,
            price: Math.floor(Math.random() * 500) + 40, // Slightly randomized diff
            etaDays: 3, 
            trustScore: 85,
            hasCoupon: true,
            link: 'https://flipkart.com'
          },
          {
            id: 'flp_2',
            platform: 'Flipkart',
            title: `${query} (Local Seller)`,
            price: Math.floor(Math.random() * 400) + 30, // Usually cheaper but slower
            etaDays: 5,
            trustScore: 60,
            hasCoupon: false,
            link: 'https://flipkart.com'
          }
        ]);
      }, 400); // simulate network delay
    });
  }
};
