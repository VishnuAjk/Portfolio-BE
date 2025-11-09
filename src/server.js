const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { configureSocket } = require('./socket');
const { env } = require('./config/env');

const server = http.createServer(app);
configureSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(env.port, () => {
      console.log(`🚀 Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Server failed to start', error);
    process.exit(1);
  }
};

startServer();

module.exports = server;
