const express = require('express');
const multer = require('multer');
const ExifParser = require('exif-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_vs_real';

// ---------------- Middleware ----------------
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

// ---------------- MongoDB ----------------
mongoose.set('bufferCommands', false);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err =>
    console.error(
      '⚠️ MongoDB connection error (continuing without DB):',
      err.message
    )
  );

// ---------------- Schema ----------------
const AnalysisSchema = new mongoose.Schema(
  {
    filename: String,
    result: String,
    aiConfidence: Number,
    realConfidence: Number,
    details: [String]
  },
  { timestamps: true }
);

const Analysis =
  mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);

// ---------------- Multer ----------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ---------------- Utils ----------------
function simulateDetection(buffer, originalName) {
  let aiScore = Math.random() * 0.3 + 0.1;
  const lower = (originalName || '').toLowerCase();
  if (lower.includes('ai') || lower.includes('generated')) aiScore += 0.25;
  if (buffer.length < 500_000) aiScore += 0.1;
  aiScore = Math.min(Math.max(aiScore, 0), 1);
  return Math.round(aiScore * 100);
}

// ---------------- Routes ----------------
app.get('/', (req, res) => {
  res.send('API running');
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    let exifSummary = 'No EXIF data';
    try {
      const parser = ExifParser.create(req.file.buffer);
      const parsed = parser.parse();
      if (parsed.tags) exifSummary = parsed.tags;
    } catch {}

    const aiPercent = simulateDetection(
      req.file.buffer,
      req.file.originalname
    );

    const realPercent = 100 - aiPercent;
    const isAI = aiPercent > 60;

    const details = [
      `Type: ${req.file.mimetype}`,
      `Size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      `EXIF: ${
        typeof exifSummary === 'string'
          ? exifSummary
          : JSON.stringify(exifSummary)
      }`
    ];

    if (mongoose.connection.readyState === 1) {
      await Analysis.create({
        filename: req.file.originalname,
        result: isAI ? 'AI Generated' : 'Real Image',
        aiConfidence: aiPercent,
        realConfidence: realPercent,
        details
      });
    }

    res.json({
      result: isAI ? 'AI Generated' : 'Real Image',
      aiConfidence: aiPercent,
      realConfidence: realPercent,
      details
    });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/history', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  const list = await Analysis.find().sort({ createdAt: -1 }).limit(50);
  res.json(list);
});

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// server.on('error', err => {
//   if (err.code === 'EADDRINUSE') {
//     console.error(`❌ Port ${PORT} already in use. Stop other server first.`);
//     process.exit(1);
//   } else {
//     console.error('Server error:', err);
//   }
// });
module.exports = app;
