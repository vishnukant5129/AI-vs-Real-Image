import React, { useState, useEffect } from 'react';
import { analyzeImage, fetchHistory, API_BASE } from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import HistoryPanel from './components/HistoryPanel';

export default function App() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    // start analysis automatically when a file is selected
    analyzeFile(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const analyzeFile = async (fileToAnalyze) => {
    if (!fileToAnalyze) return;

    setLoading(true);
    setResult(null);
    setUploadProgress(0);

    try {
      const analysisResult = await analyzeImage(fileToAnalyze, (percent) => {
        setUploadProgress(percent);
      });
      setResult(analysisResult);
      loadHistory();
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed — check console for details');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleAnalyze = () => analyzeFile(file);

  const loadHistory = async () => {
    try {
      const historyData = await fetchHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('History fetch failed', error);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const fullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${API_BASE}${url}`;
  };

  return (
    <>
      <div className="min-h-screen flex flex-col p-6 bg-[#0f1724] text-[#e6e6ff] font-sans">
        <Header />

        <main className="flex-1">
          <div className="bg-[#0b1220] p-5 rounded-xl border border-[#1e293b]">
            <div className="flex gap-3 flex-wrap">
              <ImageUploader
                onFileSelect={handleFileSelect}
                onAnalyze={handleAnalyze}
                onClear={handleClear}
                preview={preview}
                loading={loading}
                file={file}
                uploadProgress={uploadProgress}
              />

              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2 text-[#cbd5e1]">Result</h3>
                <ResultDisplay result={result} loading={loading} />
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-semibold mb-2 text-[#cbd5e1]">Recent analyses</h3>
              <HistoryPanel history={history} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}