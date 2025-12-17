import React from 'react';

export default function HistoryPanel({ history, onSelect }) {
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      {Array.isArray(history) && history.length > 0 ? (
        history.map(item => (
          <button
            key={item._id || item.id || Math.random()}
            onClick={() => onSelect && onSelect(item._id || item.id)}
            className="text-left bg-[#07102a] p-3 rounded-md w-[220px] border border-[#1e293b] hover:border-[#334155] transition-colors focus:outline-none"
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
          </button>
        ))
      ) : (
        <div className="text-[#94a3b8]">No analyses yet</div>
      )}
    </div>
  );
}