import React from 'react';

export default function ResultDisplay({ result, loading }) {
  if (loading) {
    return <div className="p-3 text-[#94a3b8]">Processing...</div>;
  }

  if (!result) {
    return <div className="p-3 text-[#94a3b8]">No result yet</div>;
  }

  return (
    <div className="bg-[#07102a] p-4 rounded-md border border-[#1e293b]">
      <div className="font-bold text-lg mb-2 text-[#e6e6ff]">
        {result.result || 'No result'}
      </div>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-[#94a3b8]">AI Confidence:</span>
          <span className="font-mono">
            {typeof result.aiConfidence !== 'undefined' ? `${result.aiConfidence}%` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#94a3b8]">Real Confidence:</span>
          <span className="font-mono">
            {typeof result.realConfidence !== 'undefined' ? `${result.realConfidence}%` : 'N/A'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e293b]">
        <div className="font-semibold mb-2 text-[#cbd5e1]">Details</div>
        <ul className="list-disc list-inside space-y-1 text-sm text-[#94a3b8]">
          {Array.isArray(result.details) && result.details.length > 0
            ? result.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))
            : <li>No details available</li>
          }
        </ul>
      </div>
    </div>
  );
}