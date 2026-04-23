const Message = require('../models/message.model');
const logger = require('../utils/logger');

class ChatService {
  constructor() {
    this.messages = [];
    this.users = new Map();
  }

  addUser(socketId, username) {
    this.users.set(socketId, username);
    logger.info(`User joined: ${username} (${socketId})`);
  }

  removeUser(socketId) {
    const username = this.users.get(socketId);
    this.users.delete(socketId);
    logger.info(`User left: ${username || 'Unknown'} (${socketId})`);
    return username;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  saveMessage(sender, text) {
    const message = new Message(sender, text);
    this.messages.push(message);
    
    // Keep only last 100 messages
    if (this.messages.length > 100) {
      this.messages.shift();
    }
    
    return message;
  }

  getRecentMessages() {
    return this.messages;
  }
}

module.exports = new ChatService();
