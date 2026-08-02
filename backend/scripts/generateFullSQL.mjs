import fs from 'fs';
import path from 'path';

// A helper to safely escape strings for SQL
const escapeSQL = (val) => {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
};

const generateSQL = async () => {
  console.log('Loading mock data...');
  // Dynamic imports of the frontend mock data
  const mockData = await import('../../src/services/mockData.js');
  const vehicleData = await import('../../src/services/vehicleMockData.js');
  const foodData = await import('../../src/services/foodDeliveryService.js');
  
  let sql = `-- CompareIt Complete Supabase PostgreSQL Schema (Full Migration)\n\n`;
  
  // 1. Trending Deals (Ecommerce)
  sql += `CREATE TABLE IF NOT EXISTS trending_deals (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255), brand VARCHAR(100), image TEXT,
    category VARCHAR(100), sub_category VARCHAR(100), specs JSONB,
    original_price NUMERIC, best_price NUMERIC, best_platform VARCHAR(100),
    discount INTEGER, deal_score INTEGER, rating NUMERIC, reviews_count INTEGER,
    price_history JSONB, platforms JSONB
);\n\n`;

  if (mockData.trendingDeals && mockData.trendingDeals.length > 0) {
    sql += `INSERT INTO trending_deals (id, title, brand, image, category, sub_category, specs, original_price, best_price, best_platform, discount, deal_score, rating, reviews_count, price_history, platforms) VALUES\n`;
    sql += mockData.trendingDeals.map(d => 
      `(${escapeSQL(d.id)}, ${escapeSQL(d.title)}, ${escapeSQL(d.brand)}, ${escapeSQL(d.image)}, ${escapeSQL(d.category)}, ${escapeSQL(d.subCategory)}, ${escapeSQL(d.specs)}, ${escapeSQL(d.originalPrice)}, ${escapeSQL(d.bestPrice)}, ${escapeSQL(d.bestPlatform)}, ${escapeSQL(d.discount)}, ${escapeSQL(d.dealScore)}, ${escapeSQL(d.rating)}, ${escapeSQL(d.reviewsCount)}, ${escapeSQL(d.priceHistory)}, ${escapeSQL(d.platforms)})`
    ).join(',\n') + ' ON CONFLICT (id) DO NOTHING;\n\n';
  }

  // 2. Upcoming Sales
  sql += `CREATE TABLE IF NOT EXISTS upcoming_sales (
    id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), platform VARCHAR(100),
    start_date DATE, end_date DATE, banner_color VARCHAR(50), description TEXT
);\n\n`;
  
  if (mockData.upcomingSales && mockData.upcomingSales.length > 0) {
    sql += `INSERT INTO upcoming_sales (id, name, platform, start_date, end_date, banner_color, description) VALUES\n`;
    sql += mockData.upcomingSales.map(s => 
      `(${escapeSQL(s.id)}, ${escapeSQL(s.name)}, ${escapeSQL(s.platform)}, ${escapeSQL(s.startDate)}, ${escapeSQL(s.endDate)}, ${escapeSQL(s.bannerColor)}, ${escapeSQL(s.description)})`
    ).join(',\n') + ' ON CONFLICT (id) DO NOTHING;\n\n';
  }

  // 3. Delivery Dishes (Food)
  sql += `CREATE TABLE IF NOT EXISTS delivery_dishes (
    id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), location VARCHAR(255),
    restaurant VARCHAR(255), cuisine VARCHAR(100), image TEXT, rating NUMERIC,
    is_veg BOOLEAN, delivery_time VARCHAR(50), platforms JSONB
);\n\n`;

  if (mockData.deliveryDishes && mockData.deliveryDishes.length > 0) {
    sql += `INSERT INTO delivery_dishes (id, name, location, restaurant, cuisine, image, rating, is_veg, delivery_time, platforms) VALUES\n`;
    sql += mockData.deliveryDishes.map(d => 
      `(${escapeSQL(d.id)}, ${escapeSQL(d.name)}, ${escapeSQL(d.location)}, ${escapeSQL(d.restaurant)}, ${escapeSQL(d.cuisine)}, ${escapeSQL(d.image)}, ${escapeSQL(d.rating)}, ${escapeSQL(d.isVeg)}, ${escapeSQL(d.deliveryTime)}, ${escapeSQL(d.platforms)})`
    ).join(',\n') + ' ON CONFLICT (id) DO NOTHING;\n\n';
  }

  // 4. Vehicles (Cars)
  sql += `CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), type VARCHAR(100),
    brand VARCHAR(100), price NUMERIC, image TEXT, rating NUMERIC,
    specs JSONB, platforms JSONB, is_ev BOOLEAN, ai_score INTEGER
);\n\n`;

  if (vehicleData.carListings && vehicleData.carListings.length > 0) {
    sql += `INSERT INTO vehicles (id, title, type, brand, price, image, rating, specs, platforms, is_ev, ai_score) VALUES\n`;
    sql += vehicleData.carListings.map(v => 
      `(${escapeSQL(v.id)}, ${escapeSQL(v.title)}, ${escapeSQL(v.type || 'Car')}, ${escapeSQL(v.brand)}, ${escapeSQL(v.price || v.basePrice)}, ${escapeSQL(v.image)}, ${escapeSQL(v.rating)}, ${escapeSQL(v.specs)}, ${escapeSQL(v.platforms || v.dealers)}, ${escapeSQL(v.isEv || false)}, ${escapeSQL(v.aiScore || 85)})`
    ).join(',\n') + ' ON CONFLICT (id) DO NOTHING;\n\n';
  }

  // Final Policies
  sql += `-- Enable RLS and public policies\n`;
  ['trending_deals', 'upcoming_sales', 'delivery_dishes', 'vehicles'].forEach(table => {
    sql += `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;\n`;
    sql += `DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow public read access on ${table}') THEN CREATE POLICY "Allow public read access on ${table}" ON ${table} FOR SELECT TO public USING (true); END IF; END $$;\n`;
  });

  const outputPath = path.join(process.cwd(), 'complete_supabase_migration.sql');
  fs.writeFileSync(outputPath, sql);
  console.log('Successfully generated complete SQL file at:', outputPath);
};

generateSQL().catch(console.error);
