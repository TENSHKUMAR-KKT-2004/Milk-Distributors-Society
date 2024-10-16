const express = require('express');
const feedController = require('../controllers/feedController.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/feeds', authMiddleware, feedController.getFeeds);
router.get('/feed-add', authMiddleware, feedController.getAddFeedPage);
router.get('/feed-edit', authMiddleware, feedController.getEditFeedPage);
router.get('/feed-sales', authMiddleware, feedController.getFeedSalesPage);
router.get('/feed-purchase', authMiddleware, feedController.getFeedPurchasePage);

router.post('/feed-add', authMiddleware, feedController.addNewFeedProduct);
router.post('/feed-edit', authMiddleware, feedController.updateFeedProduct);
router.post('/feed-purchase-add', authMiddleware, feedController.addFeedPurchase);
router.post('/feed-purchase-edit', authMiddleware, feedController.updateFeedPurchase);
router.post('/feed-sales-add', authMiddleware, feedController.addFeedSales);

module.exports = router;
