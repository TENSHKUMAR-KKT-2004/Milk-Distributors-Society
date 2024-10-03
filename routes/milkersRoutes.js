const express = require('express');
const router = express.Router();
const milkersController = require('../controllers/milkersController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/milker-add', milkersController.addMilkCollector);

router.get('/milkers', authMiddleware, milkersController.getMilkers);
router.get('/milkers-one', authMiddleware, milkersController.getMilkerOne);
router.get('/milker-add', authMiddleware, milkersController.getAddMilkersPage);

module.exports = router;
