import React, { useRef } from 'react';

export default function ImageUploader({ 
  onFileSelect, 
  onAnalyze, 
  onClear, 
  preview, 
  loading, 
  file 
  , uploadProgress = 0
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
    <div className="w-full space-y-3">
      <div
        className="border-2 border-dashed border-[#334155] p-6 rounded-lg cursor-pointer hover:border-[#6d28d9] transition-all hover:bg-[#0b1220] hover:shadow-lg"
        onClick={handlePickFile}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="space-y-2">
            <img src={preview} alt="preview" className="w-full object-contain max-h-80 rounded-md" />
            <p className="text-xs text-[#64748b] text-center">Click or drag to replace</p>
          </div>
        ) : (
          <div className="py-12 text-center text-[#94a3b8]">
            <div className="text-4xl mb-3">📸</div>
            <div className="font-medium">Click to select or drop file</div>
            <div className="text-xs mt-2">(JPG / PNG / WebP)</div>
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

      {/* Upload progress */}
      {typeof uploadProgress === 'number' && uploadProgress > 0 && (
        <div className="space-y-2 p-3 bg-[#07102a] rounded-lg border border-[#1e293b]">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#cbd5e1]">Uploading</span>
            <span className="font-mono text-[#94a3b8]">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-[#0b1220] rounded-full overflow-hidden border border-[#1e293b]">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-full bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] transition-all duration-200"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onAnalyze}
          disabled={loading || !file || (uploadProgress > 0 && uploadProgress < 100)}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            loading || !file 
              ? 'opacity-50 cursor-not-allowed bg-[#6d28d9] text-white' 
              : 'bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] text-white hover:shadow-lg hover:shadow-[#6d28d9]/30 active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="inline-block w-4 h-4 border-2 border-[#cbd5e1] border-t-white rounded-full animate-spin"></span>
              <span>Analyzing...</span>
            </span>
          ) : (
            '✓ Analyze Image'
          )}
        </button>
        <button
          onClick={onClear}
          className="px-4 py-3 rounded-lg bg-[#111827] text-[#cbd5e1] border border-[#374151] hover:bg-[#1f2937] transition-colors font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}