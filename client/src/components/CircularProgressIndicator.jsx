import React from 'react';

export default function CircularProgressIndicator({ progress = 0, status = 'analyzing' }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const statusConfig = {
    analyzing: { color: '#6d28d9', label: 'Analyzing...' },
    complete: { color: '#10b981', label: 'Complete' },
    error: { color: '#ef4444', label: 'Error' },
  };

  const config = statusConfig[status] || statusConfig.analyzing;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-2xl font-bold text-white">{progress}%</div>
          <div className="text-xs text-[#94a3b8]">{status}</div>
        </div>
      </div>

      {/* Status label */}
      <div className="text-center">
        <p className="text-sm font-medium text-[#cbd5e1]">{config.label}</p>
      </div>
    </div>
  );
}
