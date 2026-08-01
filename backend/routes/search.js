const express = require('express');
const router = express.Router();
const { rankAndScoreItems } = require('../services/aiEngine');
const amazonProvider = require('../providers/amazon');
const flipkartProvider = require('../providers/flipkart');

router.post('/', async (req, res) => {
  try {
    const { query, category } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // 1. Fetch raw data from providers concurrently
    const [amazonResults, flipkartResults] = await Promise.all([
      amazonProvider.search(query, category),
      flipkartProvider.search(query, category)
    ]);

    // Combine all results
    const combinedResults = [...amazonResults, ...flipkartResults];

    // 2. Pass to AI Ranking Engine
    const rankedResults = rankAndScoreItems(combinedResults);

    res.json({
      success: true,
      query,
      count: rankedResults.length,
      data: rankedResults
    });

  } catch (error) {
    console.error('Search API Error:', error);
    res.status(500).json({ error: 'Internal server error during search aggregation' });
  }
});

module.exports = router;
