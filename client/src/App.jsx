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
    <div style={{fontFamily:'Inter, system-ui', background:'#0f1724', minHeight:'100vh', color:'#e6e6ff', padding:24}}>
      <h1 style={{fontSize:28, marginBottom:12}}>AI vs Real</h1>

      <div style={{background:'#0b1220', padding:18, borderRadius:12}}>
        <div style={{display:'flex',gap:12, flexWrap:'wrap'}}>
          <div style={{flex:1, minWidth:260}}>
            <div
              style={{border:'2px dashed #334155', padding:20, borderRadius:10, cursor:'pointer'}}
              onClick={pickFile}
              onDragOver={(e)=>e.preventDefault()}
              onDrop={(e)=>{ e.preventDefault(); const f = e.dataTransfer.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); } }}
            >
              {preview
                ? <img src={preview} alt="preview" style={{maxWidth:'100%'}} />
                : <div style={{padding:30, textAlign:'center'}}>Click to select or drop file (JPG/PNG/WebP)</div>
              }
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFile} />
            </div>

            <div style={{marginTop:12}}>
              <button onClick={analyze} disabled={loading || !file} style={{padding:'10px 16px', background:'#6d28d9', color:'#fff', border:'none', borderRadius:8}}>
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
              <button onClick={()=>{ setFile(null); setPreview(null); setResult(null); }} style={{marginLeft:8, padding:'10px 12px', borderRadius:8, background:'#111827', color:'#cbd5e1', border:'1px solid #374151'}}>
                Clear
              </button>
            </div>
          </div>

          <div style={{width:360}}>
            <h3>Result</h3>
            {loading && <div style={{padding:12}}>Processing...</div>}
            {result && (
              <div style={{background:'#07102a', padding:12, borderRadius:8}}>
                <div style={{fontWeight:700}}>{result.result || 'No result'}</div>
                <div>AI: {typeof result.aiConfidence !== 'undefined' ? result.aiConfidence + '%' : 'N/A'}</div>
                <div>Real: {typeof result.realConfidence !== 'undefined' ? result.realConfidence + '%' : 'N/A'}</div>

                <div style={{marginTop:8}}>
                  <div style={{fontWeight:600}}>Details</div>
                  <ul>
                    {Array.isArray(result.details) && result.details.length > 0
                      ? result.details.map((d,i)=>(<li key={i}>{d}</li>))
                      : <li>No details available</li>
                    }
                  </ul>

                  {result.imageUrl &&
                    <div style={{marginTop:8}}>
                      <img src={fullImageUrl(result.imageUrl)} style={{maxWidth:'100%'}} alt="analyzed" />
                    </div>
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{marginTop:20}}>
          <h3>Recent analyses</h3>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            {Array.isArray(history) && history.length > 0 ? history.map(h=>(
              <div key={h._id || h.id || Math.random()} style={{background:'#07102a', padding:8, borderRadius:8, width:220}}>
                <div style={{fontWeight:700, fontSize:14}}>{h.result}</div>
                <div style={{fontSize:12}}>AI: {h.aiConfidence}%</div>
                <div style={{fontSize:12}}>File: {h.filename}</div>
                <div style={{fontSize:11, color:'#9ca3af'}}>{h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}</div>
              </div>
            )) : <div>Nothing yet</div>}
          </div>
        </div>
      </div>

      <div style={{marginTop:20}}>
        <small>Server expects MongoDB running (see server/.env.example)</small>
      </div>
    </div>
  )
}
