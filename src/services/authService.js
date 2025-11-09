const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: '8h',
    }
  );

const ensureOwnerAccount = async () => {
  const normalizedEmail = env.ownerEmail.toLowerCase();
  let owner = await User.findOne({ email: normalizedEmail });

  if (!owner) {
    const passwordHash = await bcrypt.hash(env.ownerPassword, 12);
    owner = await User.create({
      email: normalizedEmail,
      passwordHash,
      role: 'owner',
    });
  }

  return owner;
};

const login = async ({ email, password }) => {
  await ensureOwnerAccount();

  const normalizedEmail = (email || '').toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password || '');
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = { login, getProfile, ensureOwnerAccount };
