# utils.py
from io import BytesIO
from PIL import Image
import numpy as np
import cv2

def read_imagefile(file_bytes) -> np.ndarray:
    """Read bytes into an OpenCV BGR image (numpy array)."""
    image = Image.open(BytesIO(file_bytes)).convert("RGB")
    arr = np.array(image)[:, :, ::-1].copy()  # RGB -> BGR
    return arr

def laplacian_variance_confidence(bgr_img: np.ndarray) -> float:
    """
    Heuristic: Laplacian variance -> higher = more detail -> likely REAL.
    Returns score in [0,1] where higher means more 'real-like'.
    """
    gray = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2GRAY)
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    var = float(lap.var())
    # Map variance to 0..1 range with log scaling and clamping
    # These constants are heuristic/tunable for demo
    import math
    scaled = math.log1p(var) / math.log1p(2000.0)
    scaled = max(0.0, min(1.0, scaled))
    return scaled
