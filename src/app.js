const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { env } = require('./config/env');

const app = express();
const allowedOrigins = env.clientOrigin.split(',').map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const uploadPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static(uploadPath));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => {
  res.json({
    name: 'portfolio-be',
    status: 'ok',
    health: '/health',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
