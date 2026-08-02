import { BaseAdapter } from '../BaseAdapter';

export class AmazonAdapter extends BaseAdapter {
  constructor() {
    super('Amazon', 'shopping');
  }

  async _fetchData(query) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const q = query.toLowerCase().trim();
    let results = [];

    if (q.includes('iphone')) {
      results = [
        {
          id: 'amz_ip15',
          title: 'Apple iPhone 15 (128 GB) - Black',
          brand: 'Apple',
          price: 72999,
          mrp: 79900,
          rating: 4.6,
          delivery: 'Tomorrow by 10 PM',
          image: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
          url: 'https://www.amazon.in/dp/B0CHX1W1XY'
        }
      ];
    } else if (q.includes('protein')) {
      results = [
        {
          id: 'amz_pro1',
          title: 'Optimum Nutrition (ON) Gold Standard 100% Whey Protein',
          brand: 'Optimum Nutrition',
          price: 3150,
          mrp: 3899,
          rating: 4.5,
          delivery: 'Tomorrow',
          image: 'https://via.placeholder.com/150',
          url: 'https://www.amazon.in'
        }
      ];
    }

    return results;
  }

  normalize(rawData) {
    return rawData.map(item => ({
      provider: this.providerName,
      name: item.title,
      brand: item.brand,
      category: 'Electronics', // Simplified
      price: item.price,
      mrp: item.mrp,
      discount: item.mrp ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0,
      deliveryTime: item.delivery,
      rating: item.rating,
      image: item.image,
      url: item.url
    }));
  }
}
