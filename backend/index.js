const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const ExifParser = require("exif-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so React frontend can access backend
app.use(cors());
app.use(express.json());

// Serve static files (optional, if you want to serve uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup (in-memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 12 * 1024 * 1024 }, // 12 MB
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// POST route for image upload
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Parse EXIF data
        const parser = ExifParser.create(req.file.buffer);
        const exifData = parser.parse();

        // Process image using sharp
        const processedBuffer = await sharp(req.file.buffer)
            .resize(800, 800, { fit: "inside" }) // Resize to max 800x800
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toBuffer();

        // Save processed image
        const filename = `image_${Date.now()}.jpeg`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, processedBuffer);

        res.json({
            message: "Image uploaded successfully",
            filename,
            exif: exifData.tags,
            url: `http://localhost:${PORT}/uploads/${filename}`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
