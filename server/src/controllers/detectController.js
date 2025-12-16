const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');
const { analyzeImageForensics } = require('../services/forensicsService');
const Analysis = require('../models/Analysis');

async function detectHandler(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const filePath = req.file.path;
    const filename = req.file.filename;
    const original = req.file.originalname;

    // run forensics
    const result = await analyzeImageForensics(filePath);

    // save to DB when available
    const doc = {
      filename: original,
      imageUrl: `/uploads/${filename}`,
      result: result.prediction,
      confidence: result.confidence,
      details: result.forensicDetails
    };

    try {
      const saved = await Analysis.create(doc);
      // best-effort delete the file after saving
      fs.unlink(filePath).catch(() => {});
      return res.json(saved);
    } catch (e) {
      // DB may be unavailable — return result but still delete file
      fs.unlink(filePath).catch(() => {});
      return res.json(Object.assign({}, result, { filename: original, imageUrl: `/uploads/${filename}` }));
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { detectHandler };
