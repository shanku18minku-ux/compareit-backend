// Mock Amazon Provider
module.exports = {
  search: async (query, category) => {
    // In a real app, this would use the Amazon PA-API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'amz_1',
            platform: 'Amazon',
            title: `${query} (Amazon Basics)`,
            price: Math.floor(Math.random() * 500) + 50,
            etaDays: 1, // Prime Delivery
            trustScore: 95,
            hasCoupon: false,
            link: 'https://amazon.in'
          },
          {
            id: 'amz_2',
            platform: 'Amazon',
            title: `${query} - Premium Brand`,
            price: Math.floor(Math.random() * 1000) + 150,
            etaDays: 2,
            trustScore: 90,
            hasCoupon: true,
            link: 'https://amazon.in'
          }
        ]);
      }, 300); // simulate network delay
    });
  }
};
