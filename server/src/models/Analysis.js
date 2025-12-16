const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  filename: String,
  imageUrl: String,
  result: String,
  confidence: Number,
  details: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
