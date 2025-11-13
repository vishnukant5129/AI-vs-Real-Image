import React, { useState, useRef, useEffect } from "react";

const MAX_BYTES = 10 * 1024 * 1024;

export default function UploadSection({ onResult }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();
  const xhrRef = useRef(null);

  // Build base URL from Vite env var if available, otherwise fallback
  const BASE =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
    "http://localhost:8000";

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  // Upload the file to backend when selected
  useEffect(() => {
    if (!file) return;

    // reset prior state
    setUploadProgress(0);
    setError("");
    setIsUploading(true);

    const upload = () => {
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append("file", file);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        try {
          xhr.open("POST", `${BASE.replace(/\/$/, "")}/predict`, true);
        } catch (err) {
          reject(new Error("Invalid backend URL"));
          return;
        }

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const json = JSON.parse(xhr.responseText || "{}");
              setUploadProgress(100);
              resolve(json);
            } else {
              // try to extract server error message
              let msg = `Upload failed: ${xhr.status} ${xhr.statusText}`;
              try {
                const body = JSON.parse(xhr.responseText || "{}");
                if (body && body.error) msg = body.error;
              } catch (e) {}
              reject(new Error(msg));
            }
          } catch (err) {
            reject(err);
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onabort = () => reject(new Error("Upload aborted"));

        xhr.send(form);
      });
    };

    upload()
      .then((res) => {
        if (onResult) onResult(res);
      })
      .catch((err) => {
        // show friendly error
        setError(err.message || "Upload failed");
        if (onResult) onResult(null);
      })
      .finally(() => {
        setIsUploading(false);
      });

    return () => {
      // abort request if component unmounts or file changes
      if (xhrRef.current) {
        try {
          xhrRef.current.abort();
        } catch (e) {}
        xhrRef.current = null;
      }
    };
  }, [file, onResult, BASE]);

  const validateFile = (f) => {
    setError("");
    if (!f) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
      setError("Unsupported file type — use PNG, JPG or WEBP.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("File too large — max 10 MB.");
      return;
    }
    // accept
    setFile(f);
    setUploadProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    validateFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // keep isDragging true so onDragLeave will clear it
  };

  const cancelUpload = () => {
    if (xhrRef.current) {
      try {
        xhrRef.current.abort();
      } catch (e) {}
      xhrRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setError("Upload cancelled");
    if (onResult) onResult(null);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-25">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-cyan-300 leading-tight">
            Is Your Image{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-400">
              Real
            </span>{" "}
            or{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-500">
              AI-Generated?
            </span>
          </h2>
          <p className="mt-3 text-balck-300">
            Upload an image (PNG, JPG, WEBP). We analyze image artifacts and metadata to give a confidence score.
          </p>
          {/* <p className="mt-2 text-xs text-slate-400">
            Backend: <span className="font-mono">{BASE}/predict</span>
          </p> */}
        </div>

        {/* Uploader */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl p-5 transition-transform duration-200 border ${
            isDragging ? "border-cyan-400 scale-105 shadow-[0_10px_30px_rgba(56,189,248,0.12)]" : "border-slate-700"
          } bg-slate-800`}
        >
          <input
            ref={inputRef}
            id="file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => validateFile(e.target.files?.[0])}
          />

          {!file ? (
            <label htmlFor="file" className="flex flex-col items-center gap-4 cursor-pointer">
              <div className="h-20 w-20 rounded-lg flex items-center justify-center bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-lg">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-white">Click to upload</div>
                <div className="text-xs text-slate-400 mt-1">or drag & drop — PNG / JPG / WEBP (max 10MB)</div>
              </div>
            </label>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <img src={previewUrl} alt="preview" className="h-40 w-40 object-cover rounded-lg border border-slate-700" />
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{file.name}</div>
                    <div className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isUploading ? (
                      <button
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                          setUploadProgress(0);
                          inputRef.current.value = "";
                          setError("");
                          if (onResult) onResult(null);
                        }}
                        className="px-3 py-1 rounded-md bg-slate-700 text-sm text-slate-200 hover:bg-slate-600 transition"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={cancelUpload}
                        className="px-3 py-1 rounded-md bg-rose-500 text-sm text-white hover:bg-rose-400 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>
                      {uploadProgress === 100 ? "Analysis ready" : isUploading ? `Analyzing... ${uploadProgress}%` : "Queued"}
                    </span>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </div>
      </div>
    </section>
  );
}
