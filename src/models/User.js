const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'viewer'],
      default: 'owner',
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function comparePassword(plainText) {
  return bcrypt.compare(plainText, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
