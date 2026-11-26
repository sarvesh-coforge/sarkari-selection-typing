"use client";

import React from "react";
import Link from "next/link";

interface SiteFooterProps {
  onOpenFeedback: () => void;
}

export default function SiteFooter({ onOpenFeedback }: SiteFooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <svg
                width="32"
                height="32"
                style={{ width: "32px", height: "32px", minWidth: "32px", maxWidth: "32px", flexShrink: 0 }}
                className="w-8 h-8 shrink-0"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="100" height="100" rx="20" fill="#f59e0b" />
                <rect x="12" y="24" width="76" height="52" rx="10" fill="#1e3a8a" />
                <text x="50" y="58" fontSize="28" fontWeight="900" fill="#ffffff" textAnchor="middle">
                  SS
                </text>
              </svg>
              <span className="text-xl font-black text-white">
                Sarkari <span className="text-amber-400">Selection</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s leading platform for typing speed tests, government exam preparation, multilingual tutors,
              and font tools.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/typing-test" className="hover:text-white transition">
                  Typing Tests
                </Link>
              </li>
              <li>
                <Link href="/exam-mode" className="hover:text-white transition">
                  Exam Mode
                </Link>
              </li>
              <li>
                <Link href="/typing-tutor" className="hover:text-white transition">
                  Typing Tutor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Tools &amp; Converters</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/tools?tool=converter" className="hover:text-white transition">
                  KrutiDev to Unicode
                </Link>
              </li>
              <li>
                <Link href="/tools?tool=keyboard" className="hover:text-white transition">
                  Virtual Keyboard
                </Link>
              </li>
              <li>
                <Link href="/tools?tool=translator" className="hover:text-white transition">
                  Language Translator
                </Link>
              </li>
              <li>
                <Link href="/word-blaster" className="hover:text-white transition">
                  Word Blaster Game
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Support &amp; Legal</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  FAQ &amp; Help
                </Link>
              </li>
              <li>
                <button onClick={onOpenFeedback} className="hover:text-white transition">
                  Submit Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Sarkari Selection. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Official Government Examination Typing Practice Platform.</p>
        </div>
      </div>
    </footer>
  );
}

