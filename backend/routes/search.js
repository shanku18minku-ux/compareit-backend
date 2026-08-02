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
      .withMessage('Query must be between 1 and 100 characters'),
      // NOTE: .escape() intentionally removed — it converts & to &amp; which
      // corrupts search terms sent to downstream providers. XSS is prevented
      // by parameterized queries and output encoding at render time.
    body('category')
      .optional()
      .isString()
      .trim()
  ],
  async (req, res) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { query, category } = req.body;

    // 1. Fetch raw data from providers concurrently.
    // Using Promise.allSettled so a failure in one provider does NOT crash the
    // entire search request — we gracefully use whichever providers succeeded.
    const providerResults = await Promise.allSettled([
      amazonProvider.search(query, category),
      flipkartProvider.search(query, category)
    ]);

    // Extract only fulfilled results, log rejections
    const combinedResults = providerResults.flatMap(result => {
      if (result.status === 'fulfilled') return result.value || [];
      console.warn('[Search] Provider failed:', result.reason?.message || result.reason);
      return [];
    });

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
