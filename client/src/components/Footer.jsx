import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 py-8 border-t border-[#1e293b] bg-[#0b1220]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center 
                           group-hover:rotate-12 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#e6e6ff] group-hover:text-purple-400 transition-colors">
                AI vs Real Detector
              </h4>
              <p className="text-xs text-[#94a3b8]">Powered by Deep Learning</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            {['Documentation', 'API', 'Privacy', 'Terms', 'Support'].map((item, i) => (
              <a key={i} href="#" 
                 className="text-[#94a3b8] hover:text-[#e6e6ff] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-400 
                               group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Social & Status */}
          <div className="flex items-center space-x-6">
            <div className="flex space-x-3">
              <a href="#" className="text-[#94a3b8] hover:text-[#e6e6ff] transition-colors hover:scale-110 transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-[#94a3b8] hover:text-[#e6e6ff] transition-colors hover:scale-110 transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-[#64748b]">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#64748b] text-center sm:text-left">
            Built with React, FastAPI & TensorFlow • v2.1.0
          </p>
          <a href="#" className="text-xs text-[#94a3b8] hover:text-[#e6e6ff] transition-colors">
            Status Page →
          </a>
        </div>
      </div>
    </footer>
  );
}