const express = require('express');
const milkCompanyController = require('../controllers/milkCompanyController.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/milk-company', authMiddleware, milkCompanyController.getMilkCompanyPage);
router.get('/milkcompany-add', authMiddleware, milkCompanyController.getAddMilkCompanyPage);
router.get('/milk-sales', authMiddleware, milkCompanyController.getMilkSalesPage);

module.exports = router;
