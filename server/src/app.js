const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/logger');
const config = require('./config');
const detectRoutes = require('./routes/detectRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// request logging
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// api
app.use('/api', detectRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

module.exports = app;
