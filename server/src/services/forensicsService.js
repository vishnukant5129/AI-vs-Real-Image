const logger = require('../config/logger');
const { extractExif, colorHistogram, noiseEstimate, imageSize } = require('../utils/imageUtils');

async function analyzeImageForensics(filePath) {
  // gather features
  const [exif, hist, noise, size] = await Promise.all([
    extractExif(filePath),
    colorHistogram(filePath),
    noiseEstimate(filePath),
    imageSize(filePath)
  ]);

  const details = { exif, hist, noise, size };

  // simple scoring heuristics (placeholder for ML)
  let score = 0;
  if (!exif || Object.keys(exif).length === 0) score += 10;
  if (!noise.error && noise.std < 5) score += 30;
  if (!hist.error) {
    // detect excessive flatness
    const flat = hist.r.concat(hist.g).concat(hist.b).reduce((s, v) => s + Math.abs(v - 1 / hist.r.length), 0);
    if (flat > 2) score += 10;
  }
  if (!size.error && size.format === 'jpeg' && size.size < 50 * 1024) score += 10;

  const confidence = Math.max(0, Math.min(100, Math.round(score)));
  const prediction = confidence > 40 ? 'AI-generated' : 'Real';

  logger.info(`forensics: ${filePath} -> ${prediction} (${confidence}%)`);

  return {
    prediction,
    confidence,
    forensicDetails: details
  };
}

module.exports = {
  analyzeImageForensics
};
