const { Router } = require('express');
const portfolioController = require('../controllers/portfolioController');
const { protect, requireOwner } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', portfolioController.fetchPortfolio);
router.put('/:section', protect, requireOwner, portfolioController.updatePortfolioSection);

module.exports = router;
