const { createClient } = require('redis');

/**
 * Create and initialize Redis client
 * @returns {Promise<Object>} - Redis client object
 */
const createRedisClient = async () => {
  try {
    const client = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    });
    
    // Handle Redis connection errors
    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    await client.connect();
    console.log('Redis client connected');
    return client;
    
  } catch (error) {
    console.error('Failed to create Redis client:', error.message);
    // Return null so the app can continue without Redis
    return null;
  }
};

module.exports = { createRedisClient };