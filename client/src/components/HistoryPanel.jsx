import React from 'react';

export default function HistoryPanel({ history }) {
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      {Array.isArray(history) && history.length > 0 ? (
        history.map(item => (
          <div 
            key={item._id || item.id || Math.random()} 
            className="bg-[#07102a] p-3 rounded-md w-[220px] border border-[#1e293b] hover:border-[#334155] transition-colors"
          >
            <div className="font-bold text-sm mb-1 text-[#e6e6ff]">
              {item.result}
            </div>
            <div className="text-xs text-[#94a3b8] space-y-1">
              <div>AI: {item.aiConfidence}%</div>
              <div className="truncate">File: {item.filename}</div>
              <div className="text-[10px] text-[#64748b]">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-[#94a3b8]">No analyses yet</div>
      )}
    </div>
  );
}