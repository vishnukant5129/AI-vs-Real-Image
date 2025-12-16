const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error(err && err.message ? err.message : String(err));
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
