"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTypingRoute = pathname === "/typing";

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. Sarkari Selection Maroon Header (#991b1b) */}
      <div className="bg-[#991b1b] text-white py-3 px-4 sm:px-6 lg:px-8 border-b border-red-950/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center space-x-3.5 group cursor-pointer text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-white text-[#991b1b] flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <i className="fa-solid fa-landmark"></i>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm uppercase">
                  Sarkari <span className="text-amber-400">Selection</span>
                </span>
                <span className="bg-amber-400 text-red-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">
                  Official
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-red-100 font-medium tracking-wide">
                India&apos;s Leading Govt Jobs, Results &amp; Typing Examination Portal
              </p>
            </div>
          </Link>

          {/* Helpline Badge & Actions */}
          <div className="flex items-center flex-wrap justify-center gap-2 text-xs">
            {/* Helpline Badge */}
            <div className="bg-red-950/60 border border-red-700/60 text-red-100 px-3.5 py-1.5 rounded-full flex items-center space-x-2 font-medium">
              <i className="fa-solid fa-headset text-amber-400 text-sm animate-pulse"></i>
              <span>
                Helpline: <strong className="text-white font-bold">1800-SELECTION</strong> (Toll Free)
              </span>
            </div>

            {/* Quick Portal Switcher */}
            <Link
              href="/typing"
              className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black px-3.5 py-1.5 rounded-full shadow transition flex items-center space-x-1.5 transform hover:scale-105"
            >
              <i className="fa-solid fa-keyboard text-xs"></i>
              <span>Practice Typing Exam</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 rounded-lg bg-red-900 hover:bg-red-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dark Navigation Bar (#0f172a) */}
      <nav className="bg-[#0f172a] text-slate-200 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between h-12">
            <div className="flex items-center space-x-1 text-xs lg:text-sm font-bold tracking-wide">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-md transition flex items-center space-x-1.5 ${
                  pathname === "/" && !isTypingRoute
                    ? "bg-slate-800 text-amber-400 font-extrabold shadow-inner"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-house text-xs"></i>
                <span>HOME</span>
              </Link>

              <Link
                href="/#latest-jobs"
                className="px-3.5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition flex items-center space-x-1"
              >
                <i className="fa-solid fa-briefcase text-xs text-blue-400"></i>
                <span>LATEST JOBS</span>
              </Link>

              <Link
                href="/#admit-card"
                className="px-3.5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition flex items-center space-x-1"
              >
                <i className="fa-solid fa-id-card text-xs text-emerald-400"></i>
                <span>ADMIT CARD</span>
              </Link>

              <Link
                href="/#results"
                className="px-3.5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition flex items-center space-x-1"
              >
                <i className="fa-solid fa-square-poll-vertical text-xs text-amber-400"></i>
                <span>RESULTS</span>
              </Link>

              <Link
                href="/#answer-key"
                className="px-3.5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition"
              >
                <span>ANSWER KEY</span>
              </Link>

              <Link
                href="/#syllabus"
                className="px-3.5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition"
              >
                <span>SYLLABUS</span>
              </Link>

              <Link
                href="/#admission"
                className="px-3.5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition"
              >
                <span>ADMISSION</span>
              </Link>
            </div>

            {/* Prominent Menu Item: SARKARI SELECTION TYPING with active red-pill highlighting */}
            <div className="flex items-center">
              <Link
                href="/typing"
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider transition-all shadow-md flex items-center space-x-2 border ${
                  isTypingRoute
                    ? "bg-red-600 text-white border-red-500 ring-2 ring-red-400/60 shadow-red-900/50"
                    : "bg-red-700 hover:bg-red-600 text-white border-red-600 hover:scale-105"
                }`}
              >
                <i className="fa-solid fa-keyboard text-amber-300"></i>
                <span>SARKARI SELECTION TYPING</span>
                <span className="bg-amber-400 text-red-950 text-[10px] px-1.5 py-0.2 rounded font-black uppercase">
                  Test
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 space-y-1 text-sm font-semibold border-t border-slate-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-white"
              >
                <i className="fa-solid fa-house mr-2 text-amber-400"></i> Home
              </Link>
              <Link
                href="/#latest-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <i className="fa-solid fa-briefcase mr-2 text-blue-400"></i> Latest Jobs
              </Link>
              <Link
                href="/#admit-card"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <i className="fa-solid fa-id-card mr-2 text-emerald-400"></i> Admit Card
              </Link>
              <Link
                href="/#results"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <i className="fa-solid fa-square-poll-vertical mr-2 text-amber-400"></i> Results
              </Link>
              <Link
                href="/#answer-key"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <i className="fa-solid fa-key mr-2 text-purple-400"></i> Answer Key
              </Link>
              <Link
                href="/typing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg bg-red-700 text-white font-bold"
              >
                <i className="fa-solid fa-keyboard mr-2 text-amber-300"></i> SARKARI SELECTION TYPING
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
