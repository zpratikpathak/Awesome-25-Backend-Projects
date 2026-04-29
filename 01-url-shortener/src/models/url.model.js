// ponytail: single-process demo; use durable storage before multi-worker deployment.
const urls = new Map();

module.exports = {
  save: (id, originalUrl) => urls.set(id, originalUrl),
  findById: (id) => urls.get(id),
  getAll: () => Array.from(urls.entries())
};
