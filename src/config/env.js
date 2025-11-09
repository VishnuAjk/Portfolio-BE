const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  ownerEmail: process.env.OWNER_EMAIL || 'owner@example.com',
  ownerPassword: process.env.OWNER_PASSWORD || 'changeMe123!',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};

module.exports = { env };
