import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative mt-20 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 text-slate-400"
    >
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400">
            AI vs REAL
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Built for College Project
          </p>
          <p className="text-xs mt-1 text-slate-500">
            © {year} | All Rights Reserved
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:example@email.com"
            className="hover:text-pink-400 transition"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-[1.5px] bg-gradient-to-r from-cyan-400/30 via-indigo-400/30 to-pink-400/30"></div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute right-6 -top-4 p-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <ArrowUp size={18} />
      </button>
    </motion.footer>
  );
}
