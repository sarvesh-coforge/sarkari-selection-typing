"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SiteNavbarProps {
  authButtonText: string;
  onOpenAuth: (mode: "login" | "pricing") => void;
}

export default function SiteNavbar({ authButtonText, onOpenAuth }: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/home";
  const isTypingTest = pathname.startsWith("/typing-test") || pathname === "/typing";
  const isExamMode = pathname === "/" || pathname.startsWith("/exam-mode");
  const isTutor = pathname.startsWith("/typing-tutor");
  const isTools = pathname.startsWith("/tools");
  const isGame = pathname.startsWith("/word-blaster");
  const isBlog = pathname.startsWith("/blog");

  return (
    <header className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer shrink-0 py-2">
            <svg
              width="40"
              height="40"
              style={{ width: "40px", height: "40px", minWidth: "40px", maxWidth: "40px", flexShrink: 0 }}
              className="w-10 h-10 shrink-0 drop-shadow"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" rx="20" fill="#1e3a8a" />
              <rect x="12" y="24" width="76" height="52" rx="10" fill="#ffffff" />
              <path
                d="M22 40H30M38 40H46M54 40H62M70 40H78M26 52H34M42 50H58M66 52H74"
                stroke="#1e3a8a"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <rect x="35" y="62" width="30" height="8" rx="4" fill="#f59e0b" />
              <circle cx="82" cy="20" r="12" fill="#f59e0b" />
              <text x="82" y="24" fontSize="11" fontWeight="900" fill="#1e3a8a" textAnchor="middle">
                SS
              </text>
            </svg>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white whitespace-nowrap uppercase">
                  Sarkari <span className="text-amber-400">Selection</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden xl:flex items-center space-x-1.5 shrink-0">
            <Link
              href="/home"
              className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                isHome ? "bg-white/15 text-amber-300 shadow-inner" : "text-white hover:bg-white/10"
              }`}
            >
              <i className="fa-solid fa-house"></i> Home
            </Link>

            {/* Typing Test Dropdown */}
            <div className="relative group">
              <Link
                href="/typing-test"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isTypingTest ? "bg-white/15 text-amber-300 shadow-inner" : "text-white hover:bg-white/10"
                }`}
              >
                <i className="fa-solid fa-stopwatch"></i> Typing Test{" "}
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </Link>
              <div className="absolute left-0 mt-0 w-48 bg-white text-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-200 z-50">
                <Link
                  href="/typing-test?lang=english"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-globe mr-2 text-blue-600"></i> English Test
                </Link>
                <Link
                  href="/typing-test?lang=hindi"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-language mr-2 text-blue-600"></i> Hindi Test
                </Link>
                <Link
                  href="/typing-test?lang=punjabi"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-feather mr-2 text-blue-600"></i> Punjabi Test
                </Link>
                <Link
                  href="/typing-test?lang=marathi"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-pen-nib mr-2 text-blue-600"></i> Marathi Test
                </Link>
              </div>
            </div>

            {/* Exam Menu */}
            <Link
              href="/exam-mode"
              className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                isExamMode ? "bg-white/15 text-amber-300 shadow-inner" : "text-white hover:bg-white/10"
              }`}
            >
              <i className="fa-solid fa-bullhorn text-amber-300"></i> Exam Mode
            </Link>

            {/* Typing Tutor Dropdown */}
            <div className="relative group">
              <Link
                href="/typing-tutor"
                className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                  isTutor ? "bg-white/15 text-amber-300 font-bold shadow-inner" : "text-white"
                }`}
              >
                <i className="fa-solid fa-chalkboard-user"></i> Typing Tutor{" "}
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </Link>
              <div className="absolute left-0 mt-0 w-52 bg-white text-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-200 z-50">
                <Link
                  href="/typing-tutor?type=english"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  English Tutor
                </Link>
                <Link
                  href="/typing-tutor?type=krutidev"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  KrutiDev Hindi Tutor
                </Link>
                <Link
                  href="/typing-tutor?type=mangal"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  Mangal Inscript Tutor
                </Link>
              </div>
            </div>

            {/* Tools & Converters Dropdown */}
            <div className="relative group">
              <Link
                href="/tools"
                className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                  isTools ? "bg-white/15 text-amber-300 font-bold shadow-inner" : "text-white"
                }`}
              >
                <i className="fa-solid fa-screwdriver-wrench"></i> Tools{" "}
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </Link>
              <div className="absolute left-0 mt-0 w-56 bg-white text-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-200 z-50">
                <Link
                  href="/tools?tool=converter"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-font mr-2 text-indigo-600"></i> Krutidev to Unicode
                </Link>
                <Link
                  href="/tools?tool=keyboard"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-keyboard mr-2 text-indigo-600"></i> Virtual Keyboard
                </Link>
                <Link
                  href="/tools?tool=translator"
                  className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap"
                >
                  <i className="fa-solid fa-language mr-2 text-indigo-600"></i> Translator
                </Link>
              </div>
            </div>

            {/* Games Menu */}
            <Link
              href="/word-blaster"
              className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                isGame ? "bg-white/15 text-amber-300 font-bold shadow-inner" : "text-white"
              }`}
            >
              <i className="fa-solid fa-gamepad"></i> Word Blaster Game
            </Link>

            {/* Blog & Info */}
            <Link
              href="/blog"
              className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                isBlog ? "bg-white/15 text-amber-300 font-bold shadow-inner" : "text-white"
              }`}
            >
              <i className="fa-solid fa-blog"></i> Blog &amp; FAQ
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => onOpenAuth("pricing")}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-4 py-2 rounded-lg text-sm shadow transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <i className="fa-solid fa-crown text-amber-800"></i>
              <span>{authButtonText}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-white focus:outline-none p-2 rounded-md hover:bg-blue-800"
              aria-label="Toggle Navigation Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-blue-900 border-t border-blue-800 px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/home"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${
              isHome ? "bg-white/15 text-amber-300 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-house mr-2"></i> Home
          </Link>
          <Link
            href="/typing-test"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${
              isTypingTest ? "bg-white/15 text-amber-300 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-stopwatch mr-2"></i> Typing Tests
          </Link>
          <Link
            href="/exam-mode"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 text-amber-300 ${
              isExamMode ? "bg-white/15 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-graduation-cap mr-2"></i> Exam Mode
          </Link>
          <Link
            href="/typing-tutor"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${
              isTutor ? "bg-white/15 text-amber-300 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-chalkboard-user mr-2"></i> Typing Tutor
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${
              isTools ? "bg-white/15 text-amber-300 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-screwdriver-wrench mr-2"></i> Tools &amp; Converters
          </Link>
          <Link
            href="/word-blaster"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${
              isGame ? "bg-white/15 text-amber-300 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-gamepad mr-2"></i> Word Blaster Game
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${
              isBlog ? "bg-white/15 text-amber-300 font-bold" : ""
            }`}
          >
            <i className="fa-solid fa-blog mr-2"></i> Blog &amp; FAQ
          </Link>
        </div>
      )}
    </header>
  );
}

