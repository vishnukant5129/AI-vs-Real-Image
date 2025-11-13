import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between">
        <div>© {new Date().getFullYear()} AI vs REAL</div>
        <div className="mt-2 md:mt-0">Built for college project</div>
      </div>
    </footer>
  );
}
