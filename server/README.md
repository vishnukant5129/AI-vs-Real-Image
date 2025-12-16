# AI vs Real Image - Server

This folder contains a small Express.js service that accepts image uploads and runs a lightweight image forensics pipeline.

Quick start

1. Install dependencies

```bash
cd server
npm install
```

2. Start (development)

```bash
npm start
```

Endpoints

- `POST /api/detect` - accepts `multipart/form-data` with field `image`. Returns `{ prediction, confidence, forensicDetails }` or persisted `Analysis` document when DB is available.
- `GET /api/health` - simple health check

Notes & best practices

- Use environment variables for `MONGO_URI`, `PORT`, `UPLOAD_DIR`, `MAX_FILE_SIZE`.
- For production, store uploads in durable object storage (S3) and use signed URLs rather than serving from the app.
- Consider moving heavy ML inference to an async worker or external service if it becomes expensive.
