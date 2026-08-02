const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dynamic route to handle all table queries
router.get('/:table', async (req, res) => {
  const { table } = req.params;
  
  try {
    let data;
    switch (table) {
      case 'trending_deals':
        data = await prisma.trendingDeal.findMany();
        break;
      case 'upcoming_sales':
        data = await prisma.upcomingSale.findMany();
        break;
      case 'delivery_dishes':
        data = await prisma.deliveryDish.findMany();
        break;
      case 'vehicles':
        data = await prisma.vehicle.findMany();
        break;
      default:
        return res.status(404).json({ error: `Table ${table} not supported locally.` });
    }

    // Parse JSON strings back into objects before sending to frontend
    const parsedData = data.map(item => {
      const parsedItem = { ...item };
      ['specs', 'price_history', 'platforms'].forEach(key => {
        if (parsedItem[key]) {
          try {
            parsedItem[key] = JSON.parse(parsedItem[key]);
          } catch (e) {
            // Ignore parse errors, leave as string
          }
        }
      });
      // Convert snake_case to camelCase mapping for frontend
      if (parsedItem.sub_category) parsedItem.subCategory = parsedItem.sub_category;
      if (parsedItem.original_price) parsedItem.originalPrice = parsedItem.original_price;
      if (parsedItem.best_price) parsedItem.bestPrice = parsedItem.best_price;
      if (parsedItem.best_platform) parsedItem.bestPlatform = parsedItem.best_platform;
      if (parsedItem.deal_score) parsedItem.dealScore = parsedItem.deal_score;
      if (parsedItem.reviews_count) parsedItem.reviewsCount = parsedItem.reviews_count;
      if (parsedItem.price_history) parsedItem.priceHistory = parsedItem.price_history;
      if (parsedItem.start_date) parsedItem.startDate = parsedItem.start_date;
      if (parsedItem.end_date) parsedItem.endDate = parsedItem.end_date;
      if (parsedItem.banner_color) parsedItem.bannerColor = parsedItem.banner_color;
      if (parsedItem.is_veg !== undefined) parsedItem.isVeg = parsedItem.is_veg;
      if (parsedItem.delivery_time) parsedItem.deliveryTime = parsedItem.delivery_time;
      if (parsedItem.is_ev !== undefined) parsedItem.isEv = parsedItem.is_ev;
      if (parsedItem.ai_score) parsedItem.aiScore = parsedItem.ai_score;
      
      return parsedItem;
    });

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error(`Database Fetch Error (${table}):`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
