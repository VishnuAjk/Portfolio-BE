const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');
const { MAX_FILE_SIZE_MB } = require('../middleware/uploadMiddleware');

const handleUpload = (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file uploaded');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  sendSuccess(
    res,
    {
      url,
      constraints: {
        field: 'image',
        formats: ['image/*'],
        maxSizeMb: MAX_FILE_SIZE_MB,
      },
    },
    201
  );
};

module.exports = { handleUpload };
