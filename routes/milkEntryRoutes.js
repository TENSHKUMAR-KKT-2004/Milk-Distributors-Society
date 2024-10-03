const express = require('express');
const router = express.Router();
const milkEntryController = require('../controllers/milkEntryController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/milk-entry-one', authMiddleware, milkEntryController.getMilkEntryOne);
router.get('/milk-entry-all', authMiddleware, milkEntryController.getMilkEntryAll);

module.exports = router;
