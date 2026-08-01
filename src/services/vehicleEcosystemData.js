export const vehicleServices = [
  {
    id: 1,
    category: 'Car Service',
    title: 'Periodic Maintenance',
    vehicleModel: 'Hyundai i20',
    kilometers: '20,000 KM Service',
    rating: 4.7,
    reviews: 1250,
    features: ['Engine Oil Change', 'Oil Filter Replace', 'Air Filter Clean', 'Coolant Top-up', 'Wiper Fluid'],
    image: 'https://images.unsplash.com/photo-1632823471565-1ec2a76f2648?auto=format&fit=crop&q=80&w=400',
    aiScore: 94,
    platforms: [
      { name: 'GoMechanic', price: 4200, isCertified: true, hasDoorstep: true, url: 'https://gomechanic.in' },
      { name: 'Pitstop', price: 4450, isCertified: true, hasDoorstep: true, url: 'https://getpitstop.com' },
      { name: 'Hyundai Authorized', price: 5800, isCertified: true, hasDoorstep: false, url: 'https://hyundai.com' }
    ]
  },
  {
    id: 2,
    category: 'Car Wash & Detailing',
    title: 'Deep Clean & Ceramic Coating',
    vehicleModel: 'Universal',
    kilometers: 'All Cars',
    rating: 4.8,
    reviews: 3200,
    features: ['Foam Wash', 'Interior Vacuum', 'Ceramic Coating', 'Tyre Polish'],
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400',
    aiScore: 96,
    platforms: [
      { name: '3M Car Care', price: 12500, isCertified: true, hasDoorstep: false, url: 'https://3mcarcare.com' },
      { name: 'GoMechanic', price: 9800, isCertified: true, hasDoorstep: true, url: 'https://gomechanic.in' },
      { name: 'Local Top Rated', price: 8500, isCertified: false, hasDoorstep: true, url: '#' }
    ]
  },
  {
    id: 3,
    category: 'Bike Service',
    title: 'Comprehensive Service',
    vehicleModel: 'Royal Enfield Classic 350',
    kilometers: '15,000 KM',
    rating: 4.6,
    reviews: 840,
    features: ['Chain Lube & Adjust', 'Carburetor Clean', 'Brake Bleeding', 'Spark Plug Change'],
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400',
    aiScore: 90,
    platforms: [
      { name: 'Hoopy', price: 1200, isCertified: true, hasDoorstep: true, url: 'https://hoopy.in' },
      { name: 'GarageWorks', price: 1100, isCertified: true, hasDoorstep: true, url: 'https://garageworks.in' },
      { name: 'RE Authorized', price: 2100, isCertified: true, hasDoorstep: false, url: 'https://royalenfield.com' }
    ]
  }
];

export const vehicleRentals = [
  {
    id: 1,
    category: 'Self-Drive Cars',
    title: 'Mahindra Thar 4x4',
    type: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    rating: 4.9,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1620882814836-9614ceafbb14?auto=format&fit=crop&q=80&w=400',
    aiScore: 98,
    includedKm: '120 km/day',
    extraKmCharge: '₹14/km',
    platforms: [
      { name: 'Zoomcar', price: 3500, deposit: 0, isCertified: true, url: 'https://zoomcar.com' },
      { name: 'Revv', price: 3800, deposit: 2000, isCertified: true, url: 'https://revv.co.in' },
      { name: 'MyChoize', price: 3300, deposit: 3000, isCertified: true, url: 'https://mychoize.com' }
    ]
  },
  {
    id: 2,
    category: 'Self-Drive Cars',
    title: 'Tata Nexon EV',
    type: 'Compact SUV',
    fuelType: 'Electric',
    transmission: 'Automatic',
    rating: 4.5,
    reviews: 650,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=400',
    aiScore: 95,
    includedKm: 'Unlimited',
    extraKmCharge: '₹0/km',
    platforms: [
      { name: 'Revv', price: 2400, deposit: 2000, isCertified: true, url: 'https://revv.co.in' },
      { name: 'Zoomcar', price: 2600, deposit: 0, isCertified: true, url: 'https://zoomcar.com' }
    ]
  },
  {
    id: 3,
    category: 'Bike Rentals',
    title: 'Royal Enfield Himalayan',
    type: 'Adventure',
    fuelType: 'Petrol',
    transmission: 'Manual',
    rating: 4.7,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400',
    aiScore: 92,
    includedKm: '100 km/day',
    extraKmCharge: '₹4/km',
    platforms: [
      { name: 'Royal Brothers', price: 1200, deposit: 1000, isCertified: true, url: 'https://royalbrothers.com' },
      { name: 'Rentrip', price: 1100, deposit: 1500, isCertified: true, url: 'https://rentrip.in' },
      { name: 'WheelStreet', price: 1300, deposit: 0, isCertified: true, url: 'https://wheelstreet.com' }
    ]
  }
];

export const vehicleFinance = [
  {
    id: 1,
    category: 'Car Loan',
    title: 'New Car Loan',
    vehicleModel: 'Up to ₹20 Lakhs',
    tenure: 'Up to 7 Years',
    rating: 4.8,
    reviews: 5400,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400',
    aiScore: 97,
    features: ['Zero Processing Fee', 'No Pre-closure Charges', 'Instant In-principle Approval'],
    platforms: [
      { name: 'HDFC Bank', interestRate: 8.75, processingFee: 0, approvalTime: '10 mins', isCertified: true, url: 'https://hdfcbank.com' },
      { name: 'SBI', interestRate: 8.65, processingFee: 1500, approvalTime: '2 Days', isCertified: true, url: 'https://sbi.co.in' },
      { name: 'ICICI Bank', interestRate: 8.90, processingFee: 1000, approvalTime: '30 mins', isCertified: true, url: 'https://icicibank.com' }
    ]
  },
  {
    id: 2,
    category: 'Insurance',
    title: 'Comprehensive Car Insurance',
    vehicleModel: 'Sedan / SUV',
    tenure: '1 Year Zero Dep',
    rating: 4.6,
    reviews: 12500,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400',
    aiScore: 94,
    features: ['Zero Depreciation', '24x7 Roadside Assistance', 'Engine Protect', 'Consumables Cover'],
    platforms: [
      { name: 'PolicyBazaar', price: 12400, claimRatio: '98%', isCertified: true, url: 'https://policybazaar.com' },
      { name: 'Acko', price: 10500, claimRatio: '95%', isCertified: true, url: 'https://acko.com' },
      { name: 'Digit', price: 11200, claimRatio: '96%', isCertified: true, url: 'https://godigit.com' }
    ]
  },
  {
    id: 3,
    category: 'Used Vehicle Loan',
    title: 'Pre-Owned Car Loan',
    vehicleModel: 'Any Used Car',
    tenure: 'Up to 5 Years',
    rating: 4.4,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400',
    aiScore: 89,
    features: ['Up to 100% of Car Value', 'Flexible Repayment', 'Quick Disbursal'],
    platforms: [
      { name: 'Cars24 Finance', interestRate: 11.5, processingFee: 2000, approvalTime: '15 mins', isCertified: true, url: 'https://cars24.com' },
      { name: 'HDFC Bank', interestRate: 10.75, processingFee: 2500, approvalTime: '1 Day', isCertified: true, url: 'https://hdfcbank.com' },
      { name: 'Mahindra Finance', interestRate: 12.0, processingFee: 1500, approvalTime: '2 Hours', isCertified: true, url: 'https://mahindrafinance.com' }
    ]
  }
];
