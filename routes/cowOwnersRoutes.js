const express = require('express');
const router = express.Router();
const cowOwnersController = require('../controllers/cowOwnersController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/cow-owners', authMiddleware, cowOwnersController.getCowOwners);
router.get('/cow-owners-one', authMiddleware, cowOwnersController.getCowOwnerOne);
router.get('/cowowner-add', authMiddleware, cowOwnersController.getAddCowOwnerPage);

router.post('/cowowner-add', authMiddleware, cowOwnersController.addCowOwner);


module.exports = router;
