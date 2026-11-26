"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SiteNavbarProps {
  authButtonText: string;
  onOpenAuth: (mode: "login" | "pricing") => void;
}

type DropdownKey = "test" | "tutor" | "tools" | null;

export default function SiteNavbar({ authButtonText, onOpenAuth }: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLElement>(null);

  const isHome = pathname === "/home";
  const isTypingTest = pathname.startsWith("/typing-test") || pathname === "/typing";
  const isExamMode = pathname === "/" || pathname.startsWith("/exam-mode");
  const isTutor = pathname.startsWith("/typing-tutor");
  const isTools = pathname.startsWith("/tools");
  const isGame = pathname.startsWith("/word-blaster");
  const isBlog = pathname.startsWith("/blog");

  // Close menus on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItemClass = (active: boolean) =>
    `px-2.5 py-2 rounded-lg text-[13px] xl:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
      active
        ? "bg-white/15 text-amber-300 shadow-inner ring-1 ring-white/20"
        : "text-white/95 hover:text-white hover:bg-white/10"
    }`;

  const mobileItemClass = (active: boolean) =>
    `flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
      active ? "bg-white/15 text-amber-300 font-bold" : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header
      ref={navRef}
      className="bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#1e40af] text-white shadow-md border-b border-blue-950/30 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-2.5 cursor-pointer shrink-0 group">
            <svg
              width="38"
              height="38"
              style={{ width: "38px", height: "38px", minWidth: "38px", maxWidth: "38px", flexShrink: 0 }}
              className="w-9 h-9 shrink-0 drop-shadow group-hover:scale-105 transition-transform"
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
            <span className="text-base sm:text-xl font-black tracking-tight text-white whitespace-nowrap uppercase">
              Sarkari <span className="text-amber-400">Selection</span>
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden xl:flex items-center space-x-1 shrink-0">
            <Link href="/home" className={navItemClass(isHome)}>
              <i className="fa-solid fa-house text-xs"></i>
              <span>Home</span>
            </Link>

            {/* Typing Test Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("test")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/typing-test"
                onClick={() => setOpenDropdown(null)}
                className={navItemClass(isTypingTest)}
              >
                <i className="fa-solid fa-stopwatch text-xs"></i>
                <span>Typing Test</span>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-150 ${
                    openDropdown === "test" ? "rotate-180" : ""
                  }`}
                ></i>
              </Link>
              {openDropdown === "test" && (
                <div className="absolute left-0 top-full pt-1.5 w-48 z-50">
                  <div className="bg-white text-slate-800 rounded-xl shadow-2xl py-1.5 border border-slate-200">
                    <Link
                      href="/typing-test?lang=english"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-globe text-blue-600 w-4 text-center"></i> English Test
                    </Link>
                    <Link
                      href="/typing-test?lang=hindi"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-language text-blue-600 w-4 text-center"></i> Hindi Test
                    </Link>
                    <Link
                      href="/typing-test?lang=punjabi"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-feather text-blue-600 w-4 text-center"></i> Punjabi Test
                    </Link>
                    <Link
                      href="/typing-test?lang=marathi"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-pen-nib text-blue-600 w-4 text-center"></i> Marathi Test
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Exam Mode */}
            <Link href="/exam-mode" className={navItemClass(isExamMode)}>
              <i className="fa-solid fa-bullhorn text-xs text-amber-300"></i>
              <span>Exam Mode</span>
            </Link>

            {/* Typing Tutor Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("tutor")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/typing-tutor"
                onClick={() => setOpenDropdown(null)}
                className={navItemClass(isTutor)}
              >
                <i className="fa-solid fa-chalkboard-user text-xs"></i>
                <span>Typing Tutor</span>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-150 ${
                    openDropdown === "tutor" ? "rotate-180" : ""
                  }`}
                ></i>
              </Link>
              {openDropdown === "tutor" && (
                <div className="absolute left-0 top-full pt-1.5 w-52 z-50">
                  <div className="bg-white text-slate-800 rounded-xl shadow-2xl py-1.5 border border-slate-200">
                    <Link
                      href="/typing-tutor?type=english"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-keyboard text-emerald-600 w-4 text-center"></i> English Tutor
                    </Link>
                    <Link
                      href="/typing-tutor?type=krutidev"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-font text-emerald-600 w-4 text-center"></i> KrutiDev Hindi Tutor
                    </Link>
                    <Link
                      href="/typing-tutor?type=mangal"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-language text-emerald-600 w-4 text-center"></i> Mangal Inscript Tutor
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tools & Converters Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("tools")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/tools"
                onClick={() => setOpenDropdown(null)}
                className={navItemClass(isTools)}
              >
                <i className="fa-solid fa-screwdriver-wrench text-xs"></i>
                <span>Tools</span>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-150 ${
                    openDropdown === "tools" ? "rotate-180" : ""
                  }`}
                ></i>
              </Link>
              {openDropdown === "tools" && (
                <div className="absolute left-0 top-full pt-1.5 w-56 z-50">
                  <div className="bg-white text-slate-800 rounded-xl shadow-2xl py-1.5 border border-slate-200">
                    <Link
                      href="/tools?tool=converter"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-font text-indigo-600 w-4 text-center"></i> Krutidev to Unicode
                    </Link>
                    <Link
                      href="/tools?tool=keyboard"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-keyboard text-indigo-600 w-4 text-center"></i> Virtual Keyboard
                    </Link>
                    <Link
                      href="/tools?tool=translator"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-semibold whitespace-nowrap transition"
                    >
                      <i className="fa-solid fa-language text-indigo-600 w-4 text-center"></i> Translator
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Word Blaster Game */}
            <Link href="/word-blaster" className={navItemClass(isGame)}>
              <i className="fa-solid fa-gamepad text-xs"></i>
              <span>Word Blaster Game</span>
            </Link>

            {/* Blog & FAQ */}
            <Link href="/blog" className={navItemClass(isBlog)}>
              <i className="fa-solid fa-blog text-xs"></i>
              <span>Blog &amp; FAQ</span>
            </Link>
          </nav>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={() => onOpenAuth("pricing")}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <i className="fa-solid fa-crown text-amber-800"></i>
              <span>{authButtonText}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#172554] border-t border-blue-800/80 px-4 pt-3 pb-5 space-y-1.5 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link href="/home" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isHome)}>
            <i className="fa-solid fa-house w-5 text-center"></i>
            <span>Home</span>
          </Link>

          <Link href="/typing-test" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isTypingTest)}>
            <i className="fa-solid fa-stopwatch w-5 text-center"></i>
            <span>Typing Tests</span>
          </Link>
          <div className="pl-9 grid grid-cols-2 gap-1 pb-1">
            {[
              { label: "English Test", href: "/typing-test?lang=english" },
              { label: "Hindi Test", href: "/typing-test?lang=hindi" },
              { label: "Punjabi Test", href: "/typing-test?lang=punjabi" },
              { label: "Marathi Test", href: "/typing-test?lang=marathi" },
            ].map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-blue-200 hover:text-white py-1 px-2 rounded-lg hover:bg-white/10 transition"
              >
                {sub.label}
              </Link>
            ))}
          </div>

          <Link href="/exam-mode" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isExamMode)}>
            <i className="fa-solid fa-bullhorn w-5 text-center text-amber-300"></i>
            <span>Exam Mode</span>
          </Link>

          <Link href="/typing-tutor" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isTutor)}>
            <i className="fa-solid fa-chalkboard-user w-5 text-center"></i>
            <span>Typing Tutor</span>
          </Link>

          <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isTools)}>
            <i className="fa-solid fa-screwdriver-wrench w-5 text-center"></i>
            <span>Tools &amp; Converters</span>
          </Link>

          <Link href="/word-blaster" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isGame)}>
            <i className="fa-solid fa-gamepad w-5 text-center"></i>
            <span>Word Blaster Game</span>
          </Link>

          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className={mobileItemClass(isBlog)}>
            <i className="fa-solid fa-blog w-5 text-center"></i>
            <span>Blog &amp; FAQ</span>
          </Link>
        </div>
      )}
    </header>
  );
}
