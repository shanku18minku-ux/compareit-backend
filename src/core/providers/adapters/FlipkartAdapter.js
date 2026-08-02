import { BaseAdapter } from '../BaseAdapter';

export class FlipkartAdapter extends BaseAdapter {
  constructor() {
    super('Flipkart', 'shopping');
  }

  async _fetchData(query) {
    await new Promise(resolve => setTimeout(resolve, 250));

    const q = query.toLowerCase().trim();
    let results = [];

    if (q.includes('iphone')) {
      results = [
        {
          id: 'fk_ip15',
          title: 'Apple iPhone 15 (128 GB) - Black',
          brand: 'Apple',
          price: 71999,
          mrp: 79900,
          rating: 4.7,
          delivery: '2 Days',
          image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/h/d/9/-original-imagtc2qzpzcdpdz.jpeg',
          url: 'https://www.flipkart.com'
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
      category: 'Electronics',
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
