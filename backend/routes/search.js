const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { rankAndScoreItems } = require('../services/aiEngine');
const amazonProvider = require('../providers/amazon');
const flipkartProvider = require('../providers/flipkart');

// Apply strict input validation and sanitization
router.post(
  '/', 
  [
    body('query')
      .isString()
      .withMessage('Query must be a string')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Query must be between 1 and 100 characters')
      .escape(), // Prevents XSS via API reflection
    body('category')
      .optional()
      .isString()
      .trim()
      .escape()
  ],
  async (req, res) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { query, category } = req.body;

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
