const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middlewares/errorHandler');
const setupChatSocket = require('./socket/chat.socket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);

// Error Handling
app.use(errorHandler);

// Setup Socket
setupChatSocket(io);

module.exports = server;
