const { Router } = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = Router();

router.post('/login', authController.login);
router.get('/me', protect, authController.profile);
router.post('/logout', protect, authController.logout);

module.exports = router;
