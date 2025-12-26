const { Router } = require('express');
const { protect, requireOwner } = require('../middleware/authMiddleware');
const { uploadSingleImage } = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

const router = Router();

router.post('/', protect, requireOwner, uploadSingleImage, uploadController.handleUpload);

module.exports = router;
