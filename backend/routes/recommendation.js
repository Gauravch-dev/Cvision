const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');

// @route   GET /api/recommendations/:jobId
// @desc    Get recommended candidates for a job
// @access  Public
router.get('/:jobId', getRecommendations);

module.exports = router;
