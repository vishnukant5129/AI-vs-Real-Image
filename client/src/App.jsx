import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:5000' // change if your backend runs elsewhere

export default function App(){
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  function pickFile(){ fileRef.current.click(); }

  function onFile(e){
    const f = e.target.files[0];
    if(!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }

  async function analyze(){
    if(!file) return alert('Select file');
    setLoading(true);
    setResult(null);

    const fd = new FormData();
    fd.append('image', file);

    try{
      // use absolute API URL to avoid dev proxy issues
      const res = await axios.post(`${API_BASE}/api/analyze`, fd, {
        headers: {'Content-Type':'multipart/form-data'}
      });
      setResult(res.data);
      await fetchHistory();
    }catch(e){
      console.error('Analysis error:', e);
      alert('Analysis failed — check console for details');
    }finally{
      setLoading(false);
    }
  }

  async function fetchHistory(){
    try{
      const res = await axios.get(`${API_BASE}/api/history`);
      const data = Array.isArray(res.data) ? res.data : (res.data && res.data.list ? res.data.list : []);
      setHistory(data);
    }catch(e){
      console.error('history fetch failed', e);
      setHistory([]);
    }
  }

  useEffect(()=>{ fetchHistory(); }, []);

  // helper to build full image url if backend returns a relative path
  function fullImageUrl(url){
    if(!url) return null;
    if(url.startsWith('http') || url.startsWith('data:')) return url;
    // relative path from server like /uploads/xxx.jpg
    return `${API_BASE}${url}`;
  }

  return (
    <div className="min-h-screen p-6 bg-[#0f1724] text-[#e6e6ff] font-sans">
      <h1 className="text-[28px] mb-3">AI vs Real</h1>

      <div className="bg-[#0b1220] p-5 rounded-xl">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <div
              className="border-2 border-dashed border-[#334155] p-5 rounded-lg cursor-pointer"
              onClick={pickFile}
              onDragOver={(e)=>e.preventDefault()}
              onDrop={(e)=>{ e.preventDefault(); const f = e.dataTransfer.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); } }}
            >
              {preview
                ? <img src={preview} alt="preview" className="w-full object-contain" />
                : <div className="py-8 text-center">Click to select or drop file (JPG/PNG/WebP)</div>
              }
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            </div>

            <div className="mt-3">
              <button
                onClick={analyze}
                disabled={loading || !file}
                className={`px-4 py-2 rounded-lg text-white ${loading || !file ? 'opacity-50 cursor-not-allowed bg-[#6d28d9]' : 'bg-[#6d28d9]'}`}
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
              <button
                onClick={()=>{ setFile(null); setPreview(null); setResult(null); }}
                className="ml-2 px-3 py-2 rounded-lg bg-[#111827] text-[#cbd5e1] border border-[#374151]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="w-[360px]">
            <h3 className="text-lg font-semibold">Result</h3>
            {loading && <div className="p-3">Processing...</div>}
            {result && (
              <div className="bg-[#07102a] p-3 rounded-md">
                <div className="font-bold">{result.result || 'No result'}</div>
                <div>AI: {typeof result.aiConfidence !== 'undefined' ? result.aiConfidence + '%' : 'N/A'}</div>
                <div>Real: {typeof result.realConfidence !== 'undefined' ? result.realConfidence + '%' : 'N/A'}</div>

                <div className="mt-2">
                  <div className="font-semibold">Details</div>
                  <ul className="list-disc list-inside">
                    {Array.isArray(result.details) && result.details.length > 0
                      ? result.details.map((d,i)=>(<li key={i}>{d}</li>))
                      : <li>No details available</li>
                    }
                  </ul>

                  {/* {result.imageUrl &&
                    <div className="mt-2">
                      <img src={fullImageUrl(result.imageUrl)} className="w-full object-contain" alt="analyzed" />
                    </div>
                  } */}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold">Recent analyses</h3>
          <div className="flex gap-3 flex-wrap mt-2">
            {Array.isArray(history) && history.length > 0 ? history.map(h=>(
              <div key={h._id || h.id || Math.random()} className="bg-[#07102a] p-2 rounded-md w-[220px]">
                <div className="font-bold text-sm">{h.result}</div>
                <div className="text-xs">AI: {h.aiConfidence}%</div>
                <div className="text-sm">File: {h.filename}</div>
                <div className="text-xs text-[#9ca3af]">{h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}</div>
              </div>
            )) : <div>Nothing yet</div>}
          </div>
        </div>
      </div>

      {/* <div className="mt-5">
        <small>Server expects MongoDB running (see server/.env.example)</small>
      </div> */}
    </div>
  )
}
