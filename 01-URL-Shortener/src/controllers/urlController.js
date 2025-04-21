const Url = require('../models/Url');
const { generateShortCode } = require('../utils/generateShortCode');

/**
 * Create a shortened URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 * @param {Function} next - Express next middleware function
 */
const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    // Validate URL
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    // Check if URL already exists in database
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.status(200).json({
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
        shortCode: existingUrl.shortCode,
        originalUrl: existingUrl.originalUrl,
        clicks: existingUrl.clicks,
        createdAt: existingUrl.createdAt
      });
    }

    // Generate short code
    const shortCode = generateShortCode();

    // Create new URL record
    const url = new Url({
      originalUrl,
      shortCode
    });

    await url.save();

    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
      originalUrl,
      clicks: 0,
      createdAt: url.createdAt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redirect to original URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    const url = await Url.findOne({ shortCode: code });
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    
    // Track analytics
    const referrer = req.get('Referrer') || 'direct';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Simple browser detection
    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Safari')) browser = 'safari';
    else if (userAgent.includes('Edge')) browser = 'edge';
    
    // Simple device detection
    let device = 'desktop';
    if (userAgent.includes('Mobile')) device = 'mobile';
    else if (userAgent.includes('Tablet')) device = 'tablet';
    
    // Update analytics
    const referrers = url.analytics.referrers || new Map();
    referrers.set(referrer, (referrers.get(referrer) || 0) + 1);
    
    const browsers = url.analytics.browsers || new Map();
    browsers.set(browser, (browsers.get(browser) || 0) + 1);
    
    const devices = url.analytics.devices || new Map();
    devices.set(device, (devices.get(device) || 0) + 1);
    
    // Increment click count and save analytics
    url.clicks += 1;
    url.analytics = {
      referrers,
      browsers,
      devices
    };
    
    await url.save();
    
    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * Get URL statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUrlStats = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    const url = await Url.findOne({ shortCode: code });
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    
    // Convert Maps to plain objects for response
    const referrers = Object.fromEntries(url.analytics.referrers);
    const browsers = Object.fromEntries(url.analytics.browsers);
    const devices = Object.fromEntries(url.analytics.devices);
    
    return res.status(200).json({
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      analytics: {
        referrers,
        browsers,
        devices
      },
      createdAt: url.createdAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats
};