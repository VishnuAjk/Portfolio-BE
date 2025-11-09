const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result);
});

const profile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  sendSuccess(res, user);
});

const logout = (_req, res) => {
  sendSuccess(res, { ok: true }, 200);
};

module.exports = { login, profile, logout };
