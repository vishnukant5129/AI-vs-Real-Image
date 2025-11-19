import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [detectionCount, setDetectionCount] = useState(1247);

  // Real-time detection counter (simulated)
  useEffect(() => {
    const timer = setInterval(() => {
      setDetectionCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '#', active: true },
    { name: 'Batch Analyze', href: '#' },
    { name: 'History', href: '#' },
    { name: 'Settings', href: '#' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0b1220]/95 backdrop-blur-lg shadow-xl border-b border-[#1e293b]' 
        : 'bg-[#0b1220]/80 backdrop-blur-md border-b border-[#1e293b]/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-lg 
                           flex items-center justify-center animate-pulse group-hover:animate-spin transition-transform">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              {/* Live indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#e6e6ff] to-[#94a3b8] bg-clip-text text-transparent">
                AI vs Real
              </h1>
              <p className="hidden md:block text-xs text-[#94a3b8]">Advanced Image Detection</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} 
                 className={`relative group text-sm font-medium transition-all ${
                   item.active ? 'text-[#e6e6ff]' : 'text-[#94a3b8] hover:text-[#e6e6ff]'
                 }`}>
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300 ${
                  item.active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
          </nav>

          {/* Stats & User */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="bg-[#07102a] px-3 py-2 rounded-lg border border-[#1e293b] hover:border-[#334155] transition-all">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-[#94a3b8] group-hover:text-[#e6e6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div>
                  <p className="text-xs text-[#94a3b8]">Detections</p>
                  <p className="text-lg font-bold text-[#e6e6ff] animate-pulse">
                    {detectionCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center 
                           justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">
              U
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-[#e6e6ff] hover:text-[#94a3b8] transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden backdrop-blur-sm ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="px-4 pb-4 space-y-1 bg-[#0b1220]/95 border-t border-[#1e293b]">
          {navItems.map((item, index) => (
            <a key={index} href={item.href} 
               className={`block px-3 py-3 rounded-md text-sm transition-all ${
                 item.active 
                   ? 'bg-[#07102a] text-[#e6e6ff] border-l-4 border-purple-600' 
                   : 'text-[#94a3b8] hover:text-[#e6e6ff] hover:bg-[#07102a]'
               }`}>
              {item.name}
            </a>
          ))}
          <div className="mt-2 p-3 bg-[#07102a] rounded-lg border border-[#1e293b]">
            <p className="text-xs text-[#94a3b8] mb-1">Total Detections</p>
            <p className="text-xl font-bold text-[#e6e6ff]">{detectionCount.toLocaleString()}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}