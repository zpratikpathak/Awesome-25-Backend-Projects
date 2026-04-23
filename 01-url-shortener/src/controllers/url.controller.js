const { z } = require('zod');
const urlService = require('../services/url.service');
const logger = require('../utils/logger');

const urlSchema = z.object({
  url: z.string().url('Invalid URL format')
});

class UrlController {
  shorten(req, res, next) {
    try {
      const validatedData = urlSchema.parse(req.body);
      const id = urlService.shortenUrl(validatedData.url);
      const shortUrl = `${process.env.BASE_URL}/${id}`;
      
      logger.info(`URL shortened: ${validatedData.url} -> ${shortUrl}`);
      res.status(201).json({ originalUrl: validatedData.url, shortUrl, id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.status = 400;
        error.message = error.errors.map(e => e.message).join(', ');
      }
      next(error);
    }
  }

  redirect(req, res, next) {
    try {
      const { id } = req.params;
      const originalUrl = urlService.getOriginalUrl(id);
      logger.info(`Redirecting ${id} to ${originalUrl}`);
      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UrlController();
