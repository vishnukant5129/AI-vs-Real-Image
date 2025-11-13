import React, { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "How It Works", link: "#how-it-works" },
  { label: "Learn", link: "#learn" },
  { label: "About Us", link: "#about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // close on escape
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    // add shadow on scroll
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleNavClick = (link) => {
    setActive(link);
    setOpen(false);
    // smooth scroll to section if present
    const el = document.querySelector(link);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback: if link is "#", scroll top
      if (link === "#") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? "shadow-xl bg-slate-900/70 border-b border-slate-800" : "bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#")}
            className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold tracking-wider focus:outline-none"
            aria-label="Go to top"
          >
            <span className="text-blue-400 text-2xl md:text-3xl">🤖</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI vs REAL
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.link;
              return (
                <button
                  key={item.link}
                  onClick={() => handleNavClick(item.link)}
                  className={`relative text-lg transition-colors px-1 py-1 ${
                    isActive ? "text-white" : "text-slate-200/80 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {/* underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}

            {/* CTA */}
            <a
              href="#upload"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#upload");
              }}
              className="ml-2 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-900 font-semibold shadow-md hover:scale-[1.02] transition-transform"
            >
              Try Now
            </a>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="#upload"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#upload");
              }}
              className="inline-flex items-center px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-300 text-sm font-medium"
            >
              Try
            </a>

            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-md ring-1 ring-slate-700 hover:bg-slate-800 transition"
            >
              {/* hamburger / close icon (SVG) */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-slate-200">
                {open ? (
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden border-t border-slate-800 bg-slate-900/95 transition-transform duration-300 ${
          open ? "max-h-[400px] ease-out" : "max-h-0 overflow-hidden"
        }`}
        aria-hidden={!open}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.link;
            return (
              <button
                key={item.link}
                onClick={() => handleNavClick(item.link)}
                className={`text-left w-full rounded-md px-3 py-2 transition-colors ${
                  isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-400">Built for College Project</div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 text-sm"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-indigo-400 text-sm"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
