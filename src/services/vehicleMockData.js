export const marketplaceVehicles = [
  {
    id: 'm1',
    brand: 'Hyundai',
    model: 'Creta 1.6 SX (O) CRDi',
    year: 2019,
    kmDriven: '45,200 km',
    fuelType: 'Diesel',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80',
    aiScore: 92,
    category: 'Cars',
    aiRecommendation: '🏆 Best Overall - Great resale value & condition',
    conditionScore: 'Excellent',
    platforms: [
      { name: 'Cars24', price: 920000, isCertified: true, url: 'https://cars24.com' },
      { name: 'Spinny', price: 935000, isCertified: true, url: 'https://spinny.com' },
      { name: 'CarDekho', price: 910000, isCertified: false, url: 'https://cardekho.com' },
      { name: 'CarTrade', price: 915000, isCertified: true, url: 'https://cartrade.com' }
    ]
  },
  {
    id: 'm2',
    brand: 'Maruti Suzuki',
    model: 'Swift VXI',
    year: 2021,
    kmDriven: '22,100 km',
    fuelType: 'Petrol',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=500&q=80',
    aiScore: 95,
    category: 'Cars',
    aiRecommendation: '⚡ Lowest Running Cost',
    conditionScore: 'Like New',
    platforms: [
      { name: 'Spinny', price: 580000, isCertified: true, url: 'https://spinny.com' },
      { name: 'True Value', price: 595000, isCertified: true, url: 'https://marutisuzukitruevalue.com' },
      { name: 'OLX', price: 560000, isCertified: false, url: 'https://olx.in' }
    ]
  },
  {
    id: 'm3',
    brand: 'Tata',
    model: 'Nexon EV XZ+',
    year: 2022,
    kmDriven: '18,500 km',
    fuelType: 'Electric',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=500&q=80',
    aiScore: 89,
    category: 'Cars',
    aiRecommendation: '🔋 Best EV Deal',
    conditionScore: 'Very Good',
    platforms: [
      { name: 'Cars24', price: 1150000, isCertified: true, url: 'https://cars24.com' },
      { name: 'CarTrade', price: 1120000, isCertified: false, url: 'https://cartrade.com' },
      { name: 'Droom', price: 1140000, isCertified: true, url: 'https://droom.in' }
    ]
  },
  {
    id: 'm4',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    year: 2021,
    kmDriven: '12,000 km',
    fuelType: 'Petrol',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80',
    aiScore: 94,
    category: 'Bikes',
    aiRecommendation: '🏍️ Best Selling Bike',
    conditionScore: 'Good',
    platforms: [
      { name: 'BikeWale', price: 145000, isCertified: true, url: 'https://bikewale.com' },
      { name: 'BikeDekho', price: 148000, isCertified: true, url: 'https://bikedekho.com' },
      { name: 'CredR', price: 142000, isCertified: false, url: 'https://credr.com' },
      { name: 'BeepKart', price: 146000, isCertified: true, url: 'https://beepkart.com' }
    ]
  },
  {
    id: 'm5',
    brand: 'Tata',
    model: 'Ace Gold',
    year: 2018,
    kmDriven: '85,000 km',
    fuelType: 'Diesel',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=500&q=80',
    aiScore: 88,
    category: 'Commercial',
    aiRecommendation: '🚛 Commercial Top Pick',
    conditionScore: 'Fair',
    platforms: [
      { name: 'Truck Junction', price: 320000, isCertified: true, url: 'https://truckjunction.com' },
      { name: '91Trucks', price: 315000, isCertified: false, url: 'https://91trucks.com' },
      { name: 'Tata OK', price: 330000, isCertified: true, url: 'https://tata.com' }
    ]
  },
  {
    id: 'm6',
    brand: 'Mahindra',
    model: '575 DI Tractor',
    year: 2020,
    kmDriven: '2,500 Hrs',
    fuelType: 'Diesel',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1623910271000-84c8a2455bda?auto=format&fit=crop&w=500&q=80',
    aiScore: 91,
    category: 'Tractors',
    aiRecommendation: '🚜 Heavy Duty Assured',
    conditionScore: 'Good',
    platforms: [
      { name: 'Tractor Junction', price: 450000, isCertified: true, url: 'https://tractorjunction.com' },
      { name: 'KhetiGaadi', price: 445000, isCertified: false, url: 'https://khetigaadi.com' },
      { name: 'TractorGuru', price: 455000, isCertified: true, url: 'https://tractorguru.com' }
    ]
  }
];

export const auctionVehicles = [
  {
    id: 'a1',
    brand: 'Mahindra',
    model: 'Scorpio S11',
    year: 2020,
    kmDriven: '65,000 km',
    fuelType: 'Diesel',
    auctionProvider: 'SBI Repo Auction',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80',
    currentBid: 750000,
    reservePrice: 700000,
    marketValue: 1050000,
    endsIn: '02:15:30',
    bidders: 14,
    aiRecommendation: '🔥 Massive Discount (30% below market)',
    url: 'https://sbi.auctiontiger.net'
  },
  {
    id: 'a2',
    brand: 'Honda',
    model: 'City ZX',
    year: 2018,
    kmDriven: '48,000 km',
    fuelType: 'Petrol',
    auctionProvider: 'Government Seized Vehicles',
    image: 'https://images.unsplash.com/photo-1550355191-aa2a80710609?auto=format&fit=crop&w=500&q=80',
    currentBid: 420000,
    reservePrice: 350000,
    marketValue: 700000,
    endsIn: '18:45:00',
    bidders: 8,
    aiRecommendation: '⭐ Great Value - Inspection Recommended',
    url: 'https://mstc.com'
  }
];
