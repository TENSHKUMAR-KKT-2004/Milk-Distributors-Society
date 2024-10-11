const express = require('express');
const router = express.Router();
const milkersController = require('../controllers/milkersController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/milker-add', milkersController.addMilkCollector);
router.post('/milker-edit', milkersController.updateMilkCollector);
router.get('/milker-activate/:id', milkersController.activateMilkCollector);
router.get('/milker-deactivate/:id', milkersController.deactivateMilkCollector);

router.get('/milkers', authMiddleware, milkersController.getMilkers);
router.get('/milkers-one/:id', authMiddleware, milkersController.getMilkerOne);
router.get('/milker-add', authMiddleware, milkersController.getAddMilkersPage);
router.get('/milker-edit', authMiddleware, milkersController.getEditMilkersPage);

module.exports = router;
