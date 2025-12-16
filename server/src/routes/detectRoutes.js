const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { detectHandler } = require('../controllers/detectController');

// POST /api/detect - single file upload under 'image'
router.post('/detect', upload.single('image'), detectHandler);

module.exports = router;
