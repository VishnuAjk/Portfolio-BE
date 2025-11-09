const { Server } = require('socket.io');
const { env } = require('../config/env');

let io;

const allowedOrigins = env.clientOrigin.split(',').map((origin) => origin.trim());

const configureSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    if (env.nodeEnv !== 'test') {
      console.info('🔌 Client connected', socket.id);
    }

    socket.on('disconnect', () => {
      if (env.nodeEnv !== 'test') {
        console.info('🔌 Client disconnected', socket.id);
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};

const emitPortfolioUpdate = (partialPayload) => {
  if (!io) return;
  io.emit('portfolio:update', partialPayload);
};

module.exports = { configureSocket, getIO, emitPortfolioUpdate };
