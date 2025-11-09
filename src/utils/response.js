const sendSuccess = (res, data = {}, status = 200) => {
  res.status(status).json(data);
};

const sendError = (res, message, status = 500) => {
  res.status(status).json({ message });
};

module.exports = { sendSuccess, sendError };
