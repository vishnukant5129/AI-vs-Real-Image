cd "c:\Users\vishn\OneDrive\Desktop\MiniProjects\AI vs Real Image\backend"
python -m venv .venv; .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.pycd "c:\Users\vishn\OneDrive\Desktop\MiniProjects\AI vs Real Image\backend"
python -m venv .venv; .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.pyAI vs Real Image
=================

Overview
--------
This project is a small demo that analyzes an uploaded image and returns a heuristic score indicating how likely the image is AI-generated vs real.

What I implemented
------------------
- Backend: Flask app (`backend/app.py`) with `/predict` POST endpoint that accepts an image file and returns JSON with `result`, `confidence`, and `raw_score`.
- Detection: Simple heuristic in `backend/utils.py` using Laplacian variance (sharpness/detail heuristic) as a placeholder detector.
- Frontend: Vite + React UI (in `frontend/`) with an upload area, progress indicator, and result card showing AI likelihood percent. `UploadSection.jsx` now uploads the file to the backend and `ResultCard.jsx` shows AI percent.

Run locally (Dev)
-----------------
1. Start backend (Python 3.8+ recommended)

```powershell
cd "c:\Users\vishn\OneDrive\Desktop\MiniProjects\AI vs Real Image\backend"
python -m venv .venv; .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Backend will listen on `http://localhost:8000`.

2. Start frontend (Node.js + npm/yarn)

```powershell
cd "c:\Users\vishn\OneDrive\Desktop\MiniProjects\AI vs Real Image\frontend"
npm install
npm run dev
```

Frontend dev server runs on `http://localhost:5173` (default Vite port). The frontend uploads images to `http://localhost:8000/predict`.

Notes and next steps
--------------------
- Current detector is a lightweight heuristic for demo purposes. For more reliable AI-detection consider integrating a trained model or an API specialized for AI-image detection.
- You mentioned adding video support later. Recommended approach:
  - Add a separate backend route to accept short video clips or frames.
  - Run per-frame analysis and aggregate results to compute an overall AI-likelihood.
  - Stream results to frontend or provide progress updates for longer jobs.

If you want, I can:
- Replace the heuristic with a pretrained detector (requires model files or an external API).
- Add server-side endpoints for video (frame extraction + analysis).
- Add tests and CI steps.

---
If you want the README in Hindi or want me to add a simple Dockerfile, tell me which and I'll add it next.