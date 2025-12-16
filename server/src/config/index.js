const path = require('path');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_vs_real',
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'public', 'uploads'),
  maxFileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 5 * 1024 * 1024,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
  rateLimitMax: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100
};
