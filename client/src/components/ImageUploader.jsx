import React, { useRef } from 'react';

export default function ImageUploader({ 
  onFileSelect, 
  onAnalyze, 
  onClear, 
  preview, 
  loading, 
  file 
}) {
  const fileRef = useRef();

  const handlePickFile = () => { 
    fileRef.current.click(); 
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="flex-1 min-w-[260px]">
      <div
        className="border-2 border-dashed border-[#334155] p-5 rounded-lg cursor-pointer hover:border-[#6d28d9] transition-colors"
        onClick={handlePickFile}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full object-contain max-h-64" />
        ) : (
          <div className="py-8 text-center text-[#94a3b8]">
            Click to select or drop file (JPG/PNG/WebP)
          </div>
        )}
        <input 
          ref={fileRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onAnalyze}
          disabled={loading || !file}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            loading || !file 
              ? 'opacity-50 cursor-not-allowed bg-[#6d28d9]' 
              : 'bg-[#6d28d9] hover:bg-[#5b21b6] transition-colors'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
        <button
          onClick={onClear}
          className="px-3 py-2 rounded-lg bg-[#111827] text-[#cbd5e1] border border-[#374151] hover:bg-[#1f2937] transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}