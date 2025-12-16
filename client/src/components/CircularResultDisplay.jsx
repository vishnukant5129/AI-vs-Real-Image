import React from 'react';

export default function CircularResultDisplay({ result, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-6">
        <div className="relative w-40 h-40">
          {/* Animated loading circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#1e293b] border-t-[#6d28d9] border-r-[#4f46e5] animate-spin"></div>
          </div>
        </div>
        <p className="text-[#94a3b8] text-center animate-pulse">
          Processing image...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-64">
        <div className="text-5xl mb-4 text-[#6d28d9]">◯</div>
        <p className="text-[#94a3b8]">Upload an image to begin analysis</p>
      </div>
    );
  }

  const aiConfidence = typeof result.aiConfidence !== 'undefined' ? result.aiConfidence : 0;
  const realConfidence = typeof result.realConfidence !== 'undefined' ? result.realConfidence : 0;
  
  const isAI = result.result?.toLowerCase() === 'ai' || aiConfidence > realConfidence;
  const primaryConfidence = isAI ? aiConfidence : realConfidence;
  const secondaryConfidence = isAI ? realConfidence : aiConfidence;
  
  const primaryLabel = isAI ? 'AI Generated' : 'Real Image';
  const primaryColor = isAI ? '#f97316' : '#10b981';
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (primaryConfidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      {/* Main circular result */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
          />
          {/* Primary confidence circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={primaryColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          {/* Secondary confidence circle */}
          
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white mb-1">
            {primaryConfidence}%
          </div>
          <div className="text-xs text-[#94a3b8]">{primaryLabel}</div>
        </div>
      </div>

      {/* Result verdict */}
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{ color: primaryColor }}
        >
          {primaryLabel}
        </h3>
        <p className="text-[#94a3b8] text-sm mb-4">
          {primaryConfidence}% confidence
        </p>
      </div>

      {/* Confidence breakdown */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-[#0b1220] p-4 rounded-lg border border-[#1e293b]">
          <div className="text-sm text-[#94a3b8] mb-1">AI Generated</div>
          <div className="text-2xl font-bold text-[#f97316]">{aiConfidence}%</div>
        </div>
        <div className="bg-[#0b1220] p-4 rounded-lg border border-[#1e293b]">
          <div className="text-sm text-[#94a3b8] mb-1">Real Image</div>
          <div className="text-2xl font-bold text-[#10b981]">{realConfidence}%</div>
        </div>
      </div>

      {/* Details section */}
      {Array.isArray(result.details) && result.details.length > 0 && (
        <div className="w-full bg-[#07102a] p-4 rounded-lg border border-[#1e293b]">
          <div className="font-semibold mb-3 text-[#cbd5e1]">Analysis Details</div>
          <ul className="space-y-2">
            {result.details.map((detail, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-[#94a3b8]">
                <span className="text-[#6d28d9] mt-1">◆</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
