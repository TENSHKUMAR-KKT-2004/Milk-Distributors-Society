const express = require('express');
const milkCompanyController = require('../controllers/milkCompanyController.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/milk-company', authMiddleware, milkCompanyController.getMilkCompanyPage);
router.get('/milkcompany-add', authMiddleware, milkCompanyController.getAddMilkCompanyPage);
router.get('/milkcompany-edit', authMiddleware, milkCompanyController.getEditMilkCompanyPage);
router.get('/milk-sales', authMiddleware, milkCompanyController.getMilkSalesPage);

router.post('/milkcompany-add', authMiddleware, milkCompanyController.addCompany);
router.post('/milkcompany-edit', authMiddleware, milkCompanyController.updateCompany);
router.post('/milk-sales-add', authMiddleware, milkCompanyController.addMilkSaleRecord);
router.post('/milk-sales-edit', authMiddleware, milkCompanyController.updateMilkSaleRecord);

module.exports = router;
