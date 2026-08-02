import { PrismaClient } from '@prisma/client';
import { trendingDeals, upcomingSales, deliveryDishes } from '../../src/services/mockData.js';

const prisma = new PrismaClient();

const safeJSON = (obj) => obj ? JSON.stringify(obj) : null;

async function main() {
  console.log('Seeding SQLite Database...');

  // 1. Trending Deals
  if (trendingDeals && trendingDeals.length > 0) {
    for (const deal of trendingDeals) {
      await prisma.trendingDeal.upsert({
        where: { id: deal.id },
        update: {},
        create: {
          id: deal.id,
          title: deal.title,
          brand: deal.brand,
          image: deal.image,
          category: deal.category,
          sub_category: deal.subCategory,
          specs: safeJSON(deal.specs),
          original_price: deal.originalPrice,
          best_price: deal.bestPrice,
          best_platform: deal.bestPlatform,
          discount: deal.discount,
          deal_score: deal.dealScore,
          rating: deal.rating,
          reviews_count: deal.reviewsCount,
          price_history: safeJSON(deal.priceHistory),
          platforms: safeJSON(deal.platforms)
        }
      });
    }
    console.log(`Seeded ${trendingDeals.length} Trending Deals.`);
  }

  // 2. Upcoming Sales
  if (upcomingSales && upcomingSales.length > 0) {
    for (const sale of upcomingSales) {
      await prisma.upcomingSale.upsert({
        where: { id: sale.id },
        update: {},
        create: {
          id: sale.id,
          name: sale.name,
          platform: sale.platform,
          start_date: sale.startDate,
          end_date: sale.endDate,
          banner_color: sale.bannerColor,
          description: sale.description
        }
      });
    }
    console.log(`Seeded ${upcomingSales.length} Upcoming Sales.`);
  }

  // 3. Delivery Dishes
  if (deliveryDishes && deliveryDishes.length > 0) {
    for (const dish of deliveryDishes) {
      await prisma.deliveryDish.upsert({
        where: { id: dish.id },
        update: {},
        create: {
          id: dish.id,
          name: dish.name,
          location: dish.location,
          restaurant: dish.restaurant,
          cuisine: dish.cuisine,
          image: dish.image,
          rating: dish.rating,
          is_veg: dish.isVeg,
          delivery_time: dish.deliveryTime,
          platforms: safeJSON(dish.platforms)
        }
      });
    }
    console.log(`Seeded ${deliveryDishes.length} Delivery Dishes.`);
  }

  console.log('Database Seeding Completed Successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
