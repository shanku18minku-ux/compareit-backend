-- CompareIt Supabase PostgreSQL Schema Migration (Phase 1)
-- Run this in the Supabase SQL Editor

-- 1. Create table for Upcoming Sales
CREATE TABLE upcoming_sales (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    banner_color VARCHAR(50),
    description TEXT
);

-- 2. Create table for Trending Deals (Ecommerce)
CREATE TABLE trending_deals (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    image TEXT,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    specs JSONB,
    original_price NUMERIC,
    best_price NUMERIC,
    best_platform VARCHAR(100),
    discount INTEGER,
    deal_score INTEGER,
    rating NUMERIC(3, 2),
    reviews_count INTEGER,
    price_history JSONB,
    platforms JSONB
);

-- Enable Row Level Security (RLS)
ALTER TABLE upcoming_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_deals ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public read access
CREATE POLICY "Allow public read access on upcoming_sales"
ON upcoming_sales FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access on trending_deals"
ON trending_deals FOR SELECT
TO public
USING (true);

-- Insert Initial Seed Data for Upcoming Sales
INSERT INTO upcoming_sales (id, name, platform, start_date, end_date, banner_color, description) VALUES
('s1', 'Amazon Great Indian Festival', 'Amazon', '2026-08-15', '2026-08-20', '#F59E0B', 'Up to 80% off on Electronics & Fashion'),
('s2', 'Flipkart Big Billion Days', 'Flipkart', '2026-08-16', '2026-08-22', '#3B82F6', 'Biggest discounts on Mobiles & Appliances'),
('s3', 'Myntra EORS', 'Myntra', '2026-09-01', '2026-09-05', '#EC4899', 'End of Reason Sale - Fashion blockbusters'),
('s4', 'Croma Festive Sale', 'Croma', '2026-08-10', '2026-08-18', '#14B8A6', 'Exchange offers & Bank cashbacks');

-- Insert Initial Seed Data for Trending Deals (Sample)
INSERT INTO trending_deals (id, title, brand, image, category, sub_category, specs, original_price, best_price, best_platform, discount, deal_score, rating, reviews_count, price_history, platforms) VALUES
('d1', 'Apple iPhone 16 (128GB)', 'Apple', 'https://placehold.co/300x300/EEE/31343C?text=iPhone+16', 'Electronics', 'Mobiles', '["128GB Storage", "A18 Bionic Chip", "6.1-inch Super Retina XDR display", "48MP Main Camera"]'::jsonb, 79900, 74900, 'Amazon', 6, 92, 4.8, 4520, '[{"date": "2023-11-01", "price": 79900}, {"date": "2023-12-01", "price": 78000}, {"date": "2024-01-01", "price": 74900}]'::jsonb, '[{"url": "#", "logo": "https://placehold.co/50x50/FFF/000?text=A", "name": "Amazon", "price": 74900, "inStock": true, "bankOffer": "10% off with HDFC", "deliveryDays": 1, "shippingCost": 0}, {"url": "#", "logo": "https://placehold.co/50x50/FFF/000?text=F", "name": "Flipkart", "price": 75500, "inStock": true, "bankOffer": "5% unlimited cashback on Axis", "deliveryDays": 2, "shippingCost": 40}]'::jsonb);

