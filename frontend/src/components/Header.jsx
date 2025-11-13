import React from 'react'

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-slate-800 via-gray-700 to-slate-900 text-white shadow-lg">
      <div className="flex justify-between items-center px-6 md:px-16 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 text-3xl font-extrabold tracking-wider">
          <span className="text-blue-400">🤖</span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI vs REAL
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-8">
          {[
            { label: "How It Works", link: "#how-it-works" },
            { label: "Learn", link: "#learn" },
            { label: "About Us", link: "#about" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="relative group text-lg transition duration-300"
            >
              {item.label}
              {/* Underline hover effect */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
