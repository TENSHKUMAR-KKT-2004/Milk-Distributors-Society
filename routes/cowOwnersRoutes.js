const express = require('express');
const router = express.Router();
const cowOwnersController = require('../controllers/cowOwnersController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/cow-owners', authMiddleware, cowOwnersController.getCowOwners);
router.get('/cow-owners-one/:id', authMiddleware, cowOwnersController.getCowOwnerOne);
router.get('/cowowner-add', authMiddleware, cowOwnersController.getAddCowOwnerPage);
router.get('/cowowner-edit', authMiddleware, cowOwnersController.getEditCowOwnerPage);

router.post('/cowowner-add', authMiddleware, cowOwnersController.addCowOwner);
router.post('/cowowner-edit', authMiddleware, cowOwnersController.updateCowOwner);
router.get('/cowowner-activate/:id', authMiddleware, cowOwnersController.activateCowOwner);
router.get('/cowowner-deactivate/:id', authMiddleware, cowOwnersController.deactivateCowOwner);

module.exports = router;
