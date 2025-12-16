const fs = require('fs').promises;
const sharp = require('sharp');
const exifParser = require('exif-parser');

async function extractExif(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    return result.tags || {};
  } catch (e) {
    return {};
  }
}

async function colorHistogram(filePath, bins = 16) {
  try {
    const img = sharp(filePath).removeAlpha().raw();
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    const channels = info.channels || 3;
    const counts = { r: new Array(bins).fill(0), g: new Array(bins).fill(0), b: new Array(bins).fill(0) };
    const total = info.width * info.height;
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      counts.r[Math.floor((r / 256) * bins)] += 1;
      counts.g[Math.floor((g / 256) * bins)] += 1;
      counts.b[Math.floor((b / 256) * bins)] += 1;
    }
    // normalize
    return {
      r: counts.r.map(c => c / total),
      g: counts.g.map(c => c / total),
      b: counts.b.map(c => c / total)
    };
  } catch (e) {
    return { error: String(e) };
  }
}

async function noiseEstimate(filePath) {
  try {
    const img = sharp(filePath).greyscale().raw();
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    const pixels = data;
    // compute simple std deviation of pixel differences as rough noise proxy
    let sum = 0, sumSq = 0, count = pixels.length;
    for (let i = 1; i < pixels.length; i++) {
      const d = Math.abs(pixels[i] - pixels[i - 1]);
      sum += d;
      sumSq += d * d;
    }
    const mean = sum / (count - 1 || 1);
    const variance = sumSq / (count - 1 || 1) - mean * mean;
    const std = Math.sqrt(Math.max(0, variance));
    return { std: Math.round(std * 100) / 100 };
  } catch (e) {
    return { error: String(e) };
  }
}

async function imageSize(filePath) {
  try {
    const meta = await sharp(filePath).metadata();
    return { width: meta.width, height: meta.height, format: meta.format, size: meta.size };
  } catch (e) {
    return { error: String(e) };
  }
}

module.exports = {
  extractExif,
  colorHistogram,
  noiseEstimate,
  imageSize
};
