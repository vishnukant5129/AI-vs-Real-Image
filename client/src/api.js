import axios from 'axios';

export const API_BASE = 'http://localhost:5000';

export async function analyzeImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${API_BASE}/api/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export async function fetchHistory() {
  const response = await axios.get(`${API_BASE}/api/history`);
  return Array.isArray(response.data) 
    ? response.data 
    : (response.data?.list ? response.data.list : []);
}