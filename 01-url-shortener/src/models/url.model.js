// Simple in-memory model since we don't have a DB specified
const urls = new Map();

module.exports = {
  save: (id, originalUrl) => urls.set(id, originalUrl),
  findById: (id) => urls.get(id),
  getAll: () => Array.from(urls.entries())
};
