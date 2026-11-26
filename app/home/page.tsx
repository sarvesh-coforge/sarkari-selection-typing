"use client";

import React from "react";
import Link from "next/link";
import { useAppShell } from "@/components/AppShell";

export default function HomePage() {
  const { openAuthModal, openFeedbackModal } = useAppShell();

  return (
    <section className="space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl">
          <i className="fa-solid fa-keyboard"></i>
        </div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            India&apos;s #1 Typing Suite
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Master Your Speed with <span className="text-amber-400">Sarkari Selection</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Comprehensive typing tests, government exam simulations, multilingual tutors, and typing arcade
            games in one lightning-fast platform.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/typing-test"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <i className="fa-solid fa-play"></i> Start Typing Test
            </Link>
            <button
              onClick={() => openAuthModal("pricing")}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <i className="fa-solid fa-gift"></i> Claim 1-Week Free Trial (₹100/mo)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Tool Cards */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-th-large text-blue-600"></i> Explore Our Suite of Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/typing-test"
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <i className="fa-solid fa-stopwatch"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Typing Tests</h3>
            <p className="text-sm text-slate-600">
              Practice tests in English, Hindi, Punjabi &amp; Marathi with instant speed analytics.
            </p>
          </Link>

          <Link
            href="/exam-mode"
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4 group-hover:bg-amber-500 group-hover:text-slate-900 transition">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Exam Mode</h3>
            <p className="text-sm text-slate-600">
              Official exam pattern simulation for SSC, Banking, and State Govt recruitment.
            </p>
          </Link>

          <Link
            href="/typing-tutor"
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4 group-hover:bg-green-600 group-hover:text-white transition">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Typing Tutors</h3>
            <p className="text-sm text-slate-600">
              Step-by-step lessons for English, KrutiDev Hindi, and Mangal Inscript layouts.
            </p>
          </Link>

          <Link
            href="/word-blaster"
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Word Blaster Game</h3>
            <p className="text-sm text-slate-600">
              Play our exciting typing game to boost your reflexes and keyboard muscle memory.
            </p>
          </Link>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            About Sarkari Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Empowering Aspirants Across India with Precision Typing
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>Sarkari Selection</strong> was engineered with a singular mission: to provide candidates
            preparing for competitive government examinations and corporate careers with the most accurate,
            reliable, and user-friendly typing practice environment. Whether you are aiming for SSC CHSL,
            Allahabad High Court RO/ARO, or banking positions, our platform matches exact government examination
            evaluation algorithms.
          </p>
          <p>
            We combine cutting-edge web technologies with clean interfaces to ensure zero input lag. From
            multilingual transliteration tools to legacy font converters (KrutiDev to Unicode) and arcade typing
            games, everything you need to transform from a novice to a professional touch-typist is available in
            one place.
          </p>
        </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Our Core Strengths
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Choose Sarkari Selection?</h2>
          <p className="text-sm text-slate-600">
            Discover what makes our platform the preferred choice for over 50,000 aspirants.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Exam-Accurate Evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our speed and error calculation formulas replicate exact standard guidelines used by recruitment
              boards.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Affordable Pricing with Trial</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enjoy a 1-week free trial with full Pro access, followed by just ₹100/month for unlimited practice.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-language"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Multilingual Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive support for English, Hindi (KrutiDev &amp; Mangal Inscript), Punjabi, and Marathi
              layouts.
            </p>
          </div>
        </div>
      </div>

      {/* CUSTOMER FEEDBACK & TESTIMONIALS SECTION */}
      <div className="bg-slate-100 rounded-2xl p-8 sm:p-10 border border-slate-200 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              User Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">What Our Aspirants Say</h2>
          </div>
          <button
            onClick={openFeedbackModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow text-sm transition flex items-center gap-2"
          >
            <i className="fa-solid fa-comment-dots"></i> Submit Your Feedback
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex text-amber-400 text-sm">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              “I cleared my SSC CHSL typing test with ease thanks to the exact exam simulation mode here. Highly
              recommended!”
            </p>
            <div className="font-bold text-slate-900 text-xs">— Rakesh Kumar, Lucknow</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex text-amber-400 text-sm">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              “The KrutiDev to Unicode converter and Hindi tutors are top-notch. Best platform for government exam
              prep.”
            </p>
            <div className="font-bold text-slate-900 text-xs">— Priya Sharma, Delhi</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex text-amber-400 text-sm">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              “At just ₹100/mo with a free trial, it&apos;s unbelievable value. The word blaster game makes
              practicing fun!”
            </p>
            <div className="font-bold text-slate-900 text-xs">— Amit Verma, Kanpur</div>
          </div>
        </div>
      </div>
    </section>
  );
}

