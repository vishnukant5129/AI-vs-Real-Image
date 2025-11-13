import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import read_imagefile, laplacian_variance_confidence
import logging

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 12 * 1024 * 1024

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
CORS(app, origins=[o.strip() for o in allowed_origins.split(",")])

logging.basicConfig(level=logging.INFO)

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}

def allowed_filename(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

@app.route("/")
def root():
    return {"status": "ok", "message": "AI vs Real - Flask backend"}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if not allowed_filename(file.filename):
        return jsonify({"error": "Unsupported file extension"}), 400
    try:
        contents = file.read()
        img = read_imagefile(contents)  # may raise
        real_score = laplacian_variance_confidence(img)  # 0..1
        label = "Real" if real_score >= 0.5 else "AI-Generated"
        confidence = real_score if label == "Real" else 1.0 - real_score
        return jsonify({
            "result": label,
            "confidence": round(float(confidence), 4),
            "raw_score": round(float(real_score), 4)
        })
    except Exception as e:
        app.logger.exception("predict error")
        # safe error message
        return jsonify({"error": "internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8000)), debug=(os.getenv("FLASK_DEBUG","0")=="1"))
