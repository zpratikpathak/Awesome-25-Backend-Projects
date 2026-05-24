const chatService = require('../services/chat.service');
const logger = require('../utils/logger');
const { z } = require('zod');

const messageSchema = z.object({
  text: z.string().trim().min(1).max(500)
});
const usernameSchema = z.string().trim().min(1).max(30).regex(/^[\p{L}\p{N}_ -]+$/u);

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.info(`New connection: ${socket.id}`);

    // Send recent history
    socket.emit('history', chatService.getRecentMessages());

    socket.on('join', (username) => {
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) return socket.emit('error', 'Invalid username');
      if (chatService.getUser(socket.id)) return socket.emit('error', 'Already joined');
      username = parsed.data;
      chatService.addUser(socket.id, username);
      socket.broadcast.emit('user_joined', username);
    });

    socket.on('message', (data) => {
      try {
        const validated = messageSchema.parse(data);
        const username = chatService.getUser(socket.id) || 'Anonymous';
        const message = chatService.saveMessage(username, validated.text);
        
        io.emit('message', message);
      } catch (error) {
        if (error instanceof z.ZodError) {
          socket.emit('error', 'Invalid message format');
        } else {
          logger.error('Socket message error', error);
        }
      }
    });

    socket.on('disconnect', () => {
      const username = chatService.removeUser(socket.id);
      if (username) {
        socket.broadcast.emit('user_left', username);
      }
    });
  });
};
