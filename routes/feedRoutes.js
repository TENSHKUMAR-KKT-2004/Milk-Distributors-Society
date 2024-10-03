const express = require('express');
const feedController = require('../controllers/feedController.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/feeds', authMiddleware, feedController.getFeeds);
router.get('/feed-add', authMiddleware, feedController.getAddFeedPage);
router.get('/feed-edit', authMiddleware, feedController.getEditFeedPage);
router.get('/feed-sales', authMiddleware, feedController.getFeedSalesPage);
router.get('/feed-purchase', authMiddleware, feedController.getFeedPurchasePage);

module.exports = router;
