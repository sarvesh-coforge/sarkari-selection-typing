"use client";

import React, { createContext, useContext, useState } from "react";
import SiteNavbar from "./SiteNavbar";
import SiteFooter from "./SiteFooter";

interface AppShellContextValue {
  triggerToast: (msg: string) => void;
  openAuthModal: (mode?: "login" | "pricing") => void;
  openFeedbackModal: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error("useAppShell must be used inside AppShell");
  }
  return ctx;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "pricing">("login");
  const [authButtonText, setAuthButtonText] = useState("Login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const openAuthModal = (mode: "login" | "pricing" = "pricing") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const openFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  return (
    <AppShellContext.Provider value={{ triggerToast, openAuthModal, openFeedbackModal }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 border border-slate-700 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      <SiteNavbar authButtonText={authButtonText} onOpenAuth={openAuthModal} />

      {/* AUTH & SUBSCRIPTION MODAL (₹100/mo + 1 Week Free) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl mx-auto shadow-sm">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Member Portal &amp; Subscriptions</h3>
              <p className="text-xs text-slate-500">Get unlimited exam simulations with 1 Week Free Trial!</p>
            </div>

            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAuthMode("login")}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  authMode === "login" ? "bg-white shadow text-slate-900" : "text-slate-600"
                }`}
              >
                Login / Signup
              </button>
              <button
                onClick={() => setAuthMode("pricing")}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  authMode === "pricing" ? "bg-white shadow text-slate-900" : "text-slate-600"
                }`}
              >
                Subscription Plan
              </button>
            </div>

            {authMode === "login" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!loginEmail) {
                      alert("Please enter your email address.");
                      return;
                    }
                    setAuthButtonText(loginEmail.split("@")[0]);
                    setShowAuthModal(false);
                    triggerToast(`Successfully logged in as ${loginEmail}!`);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
                >
                  Login to Account
                </button>
              </div>
            )}

            {authMode === "pricing" && (
              <div className="space-y-4">
                <div className="border-2 border-amber-500 bg-amber-50/40 p-5 rounded-2xl space-y-3 relative shadow-sm">
                  <span className="absolute -top-3 right-4 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase shadow">
                    1 Week Free Trial
                  </span>
                  <div className="font-black text-slate-900 text-lg">Sarkari Selection Pro Pass</div>
                  <div className="text-3xl font-black text-blue-600">
                    ₹100 <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unlock all official competitive exam boards (SSC, High Court, Banking), advanced analytics, and
                    ad-free practice.
                  </p>
                  <button
                    onClick={() => {
                      triggerToast("Congratulations! Your 1-Week Free Trial (₹100/mo after) has been activated!");
                      setShowAuthModal(false);
                      setAuthButtonText("Pro (Free Trial)");
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm shadow transition"
                  >
                    Start 1-Week Free Trial Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-200">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl mx-auto shadow-sm">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Share Your Feedback</h3>
              <p className="text-xs text-slate-500">We value your review to improve our typing platform.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Review / Message</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write your experience with Sarkari Selection..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  if (!feedbackName || !feedbackText) {
                    alert("Please fill in both your name and feedback message.");
                    return;
                  }
                  triggerToast(`Thank you, ${feedbackName}! Your feedback has been submitted.`);
                  setFeedbackName("");
                  setFeedbackText("");
                  setShowFeedbackModal(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      <SiteFooter onOpenFeedback={openFeedbackModal} />
    </AppShellContext.Provider>
  );
}

