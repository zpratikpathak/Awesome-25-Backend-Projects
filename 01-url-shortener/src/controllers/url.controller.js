const { z } = require('zod');
const urlService = require('../services/url.service');
const logger = require('../utils/logger');

const urlSchema = z.object({
  url: z.string().max(2048).url('Invalid URL format').refine(value => {
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  }, 'Only HTTP(S) URLs without credentials are allowed')
});

class UrlController {
  shorten(req, res, next) {
    try {
      const validatedData = urlSchema.parse(req.body);
      const id = urlService.shortenUrl(validatedData.url);
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const shortUrl = `${baseUrl.replace(/\/$/, '')}/${id}`;
      
      logger.info(`URL shortened: ${id}`);
      res.status(201).json({ originalUrl: validatedData.url, shortUrl, id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.status = 400;
        error.message = error.issues.map(e => e.message).join(', ');
      }
      next(error);
    }
  }

  redirect(req, res, next) {
    try {
      const { id } = req.params;
      const originalUrl = urlService.getOriginalUrl(id);
      logger.info(`Redirecting ${id}`);
      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UrlController();
