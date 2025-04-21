const axios = require('axios');
const WeatherCache = require('../models/WeatherCache');
const { createRedisClient } = require('../config/redis');

// Create Redis client
let redisClient;
(async () => {
  redisClient = await createRedisClient();
})();

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHERMAP_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Get current weather for a location
   * @param {string} location - City name or coordinates
   * @param {string} units - Units (metric or imperial)
   * @returns {Promise<Object>} - Weather data
   */
  async getCurrentWeather(location, units = 'metric') {
    try {
      // Try to get from cache first
      const cacheKey = `weather:current:${location}:${units}`;
      
      // Check Redis cache first (faster)
      if (redisClient) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      
      // Check MongoDB cache
      const cachedWeather = await WeatherCache.findOne({
        location: location.toLowerCase(),
        type: 'current'
      });
      
      if (cachedWeather && this._isCacheValid(cachedWeather.createdAt)) {
        return cachedWeather.data;
      }
      
      // If not in cache, fetch from API
      const url = `${this.baseUrl}/weather?q=${location}&units=${units}&appid=${this.apiKey}`;
      const response = await axios.get(url);
      
      // Save to caches
      if (redisClient) {
        await redisClient.set(cacheKey, JSON.stringify(response.data), {
          EX: 1800 // Expire after 30 minutes
        });
      }
      
      await WeatherCache.findOneAndUpdate(
        { location: location.toLowerCase(), type: 'current' },
        { 
          location: location.toLowerCase(), 
          type: 'current', 
          data: response.data,
          coordinates: {
            lat: response.data.coord.lat,
            lon: response.data.coord.lon
          }
        },
        { upsert: true, new: true }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error.message);
      throw new Error('Unable to fetch current weather data');
    }
  }

  /**
   * Get weather forecast for a location
   * @param {string} location - City name or coordinates
   * @param {string} units - Units (metric or imperial)
   * @returns {Promise<Object>} - Forecast data
   */
  async getForecast(location, units = 'metric') {
    try {
      // Try to get from cache first
      const cacheKey = `weather:forecast:${location}:${units}`;
      
      // Check Redis cache first (faster)
      if (redisClient) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      
      // Check MongoDB cache
      const cachedForecast = await WeatherCache.findOne({
        location: location.toLowerCase(),
        type: 'forecast'
      });
      
      if (cachedForecast && this._isCacheValid(cachedForecast.createdAt)) {
        return cachedForecast.data;
      }
      
      // If not in cache, fetch from API
      const url = `${this.baseUrl}/forecast?q=${location}&units=${units}&appid=${this.apiKey}`;
      const response = await axios.get(url);
      
      // Save to caches
      if (redisClient) {
        await redisClient.set(cacheKey, JSON.stringify(response.data), {
          EX: 3600 // Expire after 1 hour
        });
      }
      
      await WeatherCache.findOneAndUpdate(
        { location: location.toLowerCase(), type: 'forecast' },
        { 
          location: location.toLowerCase(), 
          type: 'forecast', 
          data: response.data,
          coordinates: {
            lat: response.data.city.coord.lat,
            lon: response.data.city.coord.lon
          }
        },
        { upsert: true, new: true }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error.message);
      throw new Error('Unable to fetch forecast data');
    }
  }

  /**
   * Get weather by coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Units (metric or imperial)
   * @returns {Promise<Object>} - Weather data
   */
  async getWeatherByCoordinates(lat, lon, units = 'metric') {
    try {
      const cacheKey = `weather:coordinates:${lat}:${lon}:${units}`;
      
      // Check Redis cache first
      if (redisClient) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      
      // If not in cache, fetch from API
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
      const response = await axios.get(url);
      
      // Save to Redis cache
      if (redisClient) {
        await redisClient.set(cacheKey, JSON.stringify(response.data), {
          EX: 1800 // Expire after 30 minutes
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error.message);
      throw new Error('Unable to fetch weather data for these coordinates');
    }
  }

  /**
   * Check if cache is still valid
   * @param {Date} cacheTime - Time when cache was created
   * @returns {boolean} - True if cache is valid
   */
  _isCacheValid(cacheTime) {
    const cacheAge = Date.now() - new Date(cacheTime).getTime();
    return cacheAge < 1800000; // Valid if less than 30 minutes old
  }
}

module.exports = new WeatherService();