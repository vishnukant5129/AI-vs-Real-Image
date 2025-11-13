import React from "react";

export default function ResultCard({ result }) {
  if (!result) return null;
  const isReal = result.result === "Real";
  const color = isReal ? "from-cyan-400 to-indigo-500" : "from-rose-400 to-pink-500";
  const raw = typeof result.raw_score === "number" ? result.raw_score : result.confidence ?? 0;
  const aiPercent = Math.round((1 - raw) * 1000) / 10; // one decimal
  return (
    <div className="max-w-3xl mx-auto px-6 mt-4">
      <div className={`p-4 rounded-lg bg-gradient-to-r ${color} text-black`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">{result.result}</div>
            <div className="text-xs">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
            <div className="text-xs text-black/70">AI Likelihood: {aiPercent}%</div>
          </div>
          <div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
