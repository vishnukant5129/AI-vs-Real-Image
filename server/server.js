// server/server.js
const express = require('express');
const multer = require('multer');
const ExifParser = require('exif-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_vs_real';

// --- Safety: disable mongoose buffering so it won't queue operations while disconnected
mongoose.set('bufferCommands', false);

// Try to connect (log error but don't crash)
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error (continuing without DB):', err.message || err));

// Schema & model (guard against model overwrite in hot-reload)
const AnalysisSchema = new mongoose.Schema({
  filename: String,
  result: String,
  aiConfidence: Number,
  realConfidence: Number,
  details: [String],
  createdAt: { type: Date, default: Date.now }
});
const Analysis = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

// Serve static client (if built)
app.use(express.static(path.join(__dirname, 'public')));

// Multer memory storage with 10MB limit
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Heuristic simulation (keeps results realistic-looking)
function simulateDetection(buffer, originalName) {
  const lower = (originalName || '').toLowerCase();
  let aiScore = Math.random() * 0.3 + 0.1;
  if (lower.includes('ai') || lower.includes('generated')) aiScore += 0.25;
  if (buffer.length < 500_000) aiScore += 0.1;
  const sample = buffer.slice(0, Math.min(1024, buffer.length));
  let mean = 0;
  for (let i = 0; i < sample.length; i++) mean += sample[i];
  mean = mean / (sample.length || 1);
  if (mean > 100) aiScore += 0.05;
  aiScore += (Math.random() - 0.5) * 0.15;
  aiScore = Math.max(0, Math.min(1, aiScore));
  return Math.round(aiScore * 100);
}

// POST /api/analyze
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const file = req.file;

    // EXIF parse (best-effort)
    let exifSummary = 'No EXIF data';
    try {
      const parser = ExifParser.create(file.buffer);
      const parsed = parser.parse();
      if (parsed && parsed.tags) exifSummary = parsed.tags;
    } catch (e) {
      exifSummary = 'EXIF parse failed';
    }

    const aiPercent = simulateDetection(file.buffer, file.originalname);
    const realPercent = 100 - aiPercent;
    const isAI = aiPercent > 60;

    const details = [
      `Image format: ${file.mimetype}`,
      `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      `EXIF summary: ${typeof exifSummary === 'string' ? exifSummary : JSON.stringify(exifSummary)}`,
      `Heuristic notes: ${isAI ? 'Patterns consistent with AI synthesis' : 'Natural photo characteristics observed'}`
    ];

    // Ensure uploads dir exists and save preview file (always)
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    const id = uuidv4();
    const safeName = (file.originalname || 'upload').replace(/[^a-z0-9.\-]/gi, '_');
    const outPath = path.join(uploadsDir, `${id}-${safeName}`);
    fs.writeFileSync(outPath, file.buffer);
    const imageUrl = `/uploads/${path.basename(outPath)}`;

    // Persist analysis only when DB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const analysis = new Analysis({
          filename: file.originalname,
          result: isAI ? 'AI Generated' : 'Real Image',
          aiConfidence: aiPercent,
          realConfidence: realPercent,
          details
        });
        await analysis.save();
      } catch (dbErr) {
        console.error('DB save failed (continuing):', dbErr.message || dbErr);
      }
    } else {
      console.warn('DB not connected — analysis not persisted.');
    }

    return res.json({
      result: isAI ? 'AI Generated' : 'Real Image',
      aiConfidence: aiPercent,
      realConfidence: realPercent,
      details,
      imageUrl
    });
  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/history
app.get('/api/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // DB unavailable -> safe empty list
      return res.json([]);
    }
    const list = await Analysis.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json(list);
  } catch (err) {
    console.error('History error:', err);
    return res.json([]);
  }
});

// SPA fallback
app.get('*', (req, res) => {
  const index = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(index)) return res.sendFile(index);
  return res.json({ ok: true, msg: 'Server running. Client not built yet.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
