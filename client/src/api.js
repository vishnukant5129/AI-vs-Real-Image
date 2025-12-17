import axios from 'axios';

// Use Vite env var `VITE_API_BASE` for production or absolute backend URLs.
// For local development leave it empty so Vite dev server proxy (vite.config.js)
// will forward `/api` requests to the backend.
export const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function analyzeImage(imageFile, onUploadProgress) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${API_BASE}/api/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      try {
        if (!progressEvent) return;
        const { loaded, total } = progressEvent;
        if (typeof loaded === 'number' && typeof total === 'number' && total > 0) {
          const percent = Math.round((loaded / total) * 100);
          if (typeof onUploadProgress === 'function') onUploadProgress(percent);
        }
      } catch (e) {
        // swallow progress errors
      }
    }
  });
  return response.data;
}

export async function fetchHistory() {
  const response = await axios.get(`${API_BASE}/api/history`);
  return Array.isArray(response.data) 
    ? response.data 
    : (response.data?.list ? response.data.list : []);
}

export async function fetchAnalysisById(id) {
  const response = await axios.get(`${API_BASE}/api/history/${id}`);
  return response.data;
}