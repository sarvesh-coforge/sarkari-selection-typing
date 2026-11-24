"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface IImportantDate {
  label: string;
  value: string;
}

interface IApplicationFee {
  category: string;
  value: string;
  fee?: string;
}

interface IVacancyDetail {
  postName: string;
  totalPost: string;
  eligibility: string;
}

interface IImportantLink {
  title: string;
  url: string;
  actionText?: string;
  isOfficial?: boolean;
}

interface IPostDetailData {
  slug: string;
  sourceUrl?: string;
  boardName: string;
  postTitle: string;
  shortDetails: string;
  importantDates: IImportantDate[];
  applicationFee: IApplicationFee[];
  feePaymentNote?: string;
  ageLimit: {
    minAge?: string;
    maxAge?: string;
    asOfDate?: string;
    relaxationRules?: string;
  };
  totalPostsSummary?: string;
  vacancyDetails: IVacancyDetail[];
  howToFill: string[];
  importantLinks: IImportantLink[];
  fetchedAt?: string;
}

export default function SarkariResultDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<IPostDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/post-detail?slug=${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.detail) {
            setDetail(json.detail);
          } else {
            setError(json.error || "Failed to load notification details.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Network error loading notification.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share && detail) {
      try {
        await navigator.share({
          title: detail.postTitle,
          text: `Check ${detail.postTitle} notification on Sarkari Selection`,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <Link
              href="/?tab=exam"
              className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#660000] text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-sm hover-lift"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>Back to Exam Mode</span>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
              <span>Home</span>
              <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
              <span>Exam Mode</span>
              <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
              <span className="text-slate-800 font-bold truncate max-w-[200px]">Notification</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition"
              title="Print Notification or Save as PDF"
            >
              <i className="fa-solid fa-print text-slate-600"></i>
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition"
              title="Share this recruitment"
            >
              <i className="fa-solid fa-share-nodes text-slate-600"></i>
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl hidden sm:flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Govt Redirection
            </span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-base">Loading Official Notification</h3>
              <p className="text-xs text-slate-500">
                Fetching structured recruitment data and resolving official government portal URLs...
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {!loading && error && (
          <div className="bg-red-50 border-2 border-red-300 p-5 rounded-2xl shadow-sm text-sm text-red-900 space-y-2">
            <div className="flex items-center gap-2 font-black text-base text-red-800">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Unable to Load Notification Details</span>
            </div>
            <p className="text-xs text-red-700">{error}</p>
            <div className="pt-2">
              <Link
                href="/?tab=exam"
                className="inline-flex items-center gap-1.5 bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-800 transition"
              >
                &larr; Return to Exam Mode
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* EXACT SARKARI RESULT CLASSIC NOTIFICATION TABLE LAYOUT */}
        {/* ============================================================== */}
        {!loading && detail && (
          <div className="space-y-4">
            {/* Sticky Floating Quick Action Pill for Mobile & Desktop */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white p-3 sm:p-4 rounded-2xl shadow-md border border-blue-700 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow">
                  <i className="fa-solid fa-bolt text-sm"></i>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-amber-300 font-extrabold uppercase tracking-wide truncate">
                    Direct Official Portals
                  </div>
                  <div className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                    {detail.postTitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={detail.importantLinks?.[0]?.url || "https://www.india.gov.in/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-4 py-2 rounded-xl text-xs transition shadow flex items-center gap-1.5 hover-lift whitespace-nowrap"
                >
                  <span>Apply / Check Official Portal</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              </div>
            </div>

            {/* Main Bordered Notification Card */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-400 overflow-hidden text-sm print-clean">
              {/* 1. Header Information Block */}
              <div className="bg-[#800000] text-white text-center py-5 px-4 sm:px-8 border-b-2 border-slate-400 space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest bg-black/20 px-3 py-0.5 rounded-full mb-1">
                  <i className="fa-solid fa-building-columns text-[10px]"></i>
                  <span>Official Recruitment Notification</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide leading-tight">
                  {detail.boardName}
                </h1>
                <h2 className="text-base sm:text-xl font-extrabold text-amber-300 leading-snug pt-1">
                  {detail.postTitle}
                </h2>
              </div>

              {/* Short Details of Notification Banner */}
              <div className="p-4 sm:p-5 bg-amber-50/70 border-b-2 border-slate-300 space-y-1">
                <div className="font-black text-red-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-info text-red-700"></i>
                  <span>Short Details of Notification</span>
                </div>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                  {detail.shortDetails}
                </p>
              </div>

              {/* 2. Two-Column Box: Important Dates & Application Fee */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-slate-300 border-b-2 border-slate-300">
                {/* Left Column: Important Dates */}
                <div className="p-4 sm:p-5 space-y-3 bg-white">
                  <h3 className="font-black text-red-900 text-base uppercase border-b-2 border-red-800 pb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-calendar-days text-red-800"></i>
                      <span>Important Dates</span>
                    </span>
                    <span className="text-[10px] font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded">
                      Deadlines
                    </span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {detail.importantDates && detail.importantDates.length > 0 ? (
                      detail.importantDates.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-dashed border-slate-200"
                        >
                          <span className="font-bold text-slate-700">{item.label}:</span>
                          <span className="font-black text-red-700">{item.value}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Dates notified on official portal</li>
                    )}
                  </ul>
                </div>

                {/* Right Column: Application Fee */}
                <div className="p-4 sm:p-5 space-y-3 bg-white">
                  <h3 className="font-black text-blue-900 text-base uppercase border-b-2 border-blue-900 pb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-indian-rupee-sign text-blue-900"></i>
                      <span>Application Fee</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      Fee Breakdown
                    </span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {detail.applicationFee && detail.applicationFee.length > 0 ? (
                      detail.applicationFee.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between py-1.5 border-b border-dashed border-slate-200"
                        >
                          <span className="font-bold text-slate-700">{item.category}:</span>
                          <span className="font-black text-blue-800">{item.value || item.fee}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">As per notification</li>
                    )}
                  </ul>
                  {detail.feePaymentNote && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2 leading-relaxed">
                      <strong className="text-slate-900 font-bold">Payment Mode: </strong>
                      {detail.feePaymentNote}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Age Limit Box */}
              <div className="p-4 sm:p-5 bg-slate-50 border-b-2 border-slate-300 space-y-2.5">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider text-center bg-slate-200/80 py-2 rounded-xl flex items-center justify-center gap-2">
                  <i className="fa-solid fa-user-clock text-slate-700"></i>
                  <span>
                    {detail.boardName} Recruitment : Age Limit {detail.ageLimit?.asOfDate ? `as on ${detail.ageLimit.asOfDate}` : ""}
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <span className="font-bold text-slate-700">Minimum Age:</span>
                    <span className="font-black text-red-700 text-sm">
                      {detail.ageLimit?.minAge || "18 Years"}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <span className="font-bold text-slate-700">Maximum Age:</span>
                    <span className="font-black text-red-700 text-sm">
                      {detail.ageLimit?.maxAge || "27-40 Years (Post Dependent)"}
                    </span>
                  </div>
                </div>
                {detail.ageLimit?.relaxationRules && (
                  <p className="text-xs text-slate-600 italic pt-1 leading-relaxed">
                    &bull; {detail.ageLimit.relaxationRules}
                  </p>
                )}
              </div>

              {/* 4. Vacancy Details Table */}
              <div className="p-4 sm:p-5 space-y-3 bg-white border-b-2 border-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-black text-red-900 text-base uppercase flex items-center gap-2">
                    <i className="fa-solid fa-table-list text-red-800"></i>
                    <span>Vacancy Details</span>
                  </h3>
                  {detail.totalPostsSummary && (
                    <span className="text-xs font-black bg-red-100 text-red-900 border border-red-300 px-3 py-1 rounded-full shadow-xs">
                      Total : {detail.totalPostsSummary}
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto border-2 border-slate-300 rounded-xl">
                  <table className="w-full text-left text-xs sm:text-sm divide-y-2 divide-slate-300">
                    <thead className="bg-[#800000] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold border-r border-slate-300">Post Name</th>
                        <th className="py-3 px-4 font-bold border-r border-slate-300 text-center w-32">
                          Total Post
                        </th>
                        <th className="py-3 px-4 font-bold">Eligibility Criteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {detail.vacancyDetails && detail.vacancyDetails.length > 0 ? (
                        detail.vacancyDetails.map((v, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/50 transition">
                            <td className="py-3 px-4 font-extrabold text-slate-900 border-r border-slate-200">
                              {v.postName}
                            </td>
                            <td className="py-3 px-4 text-center font-black text-red-700 border-r border-slate-200">
                              {v.totalPost}
                            </td>
                            <td className="py-3 px-4 text-slate-700 leading-relaxed">
                              {v.eligibility}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-slate-500">
                            Refer to official government notification for post breakdown.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. How to Fill Online Form Bullets */}
              <div className="p-4 sm:p-5 bg-amber-50/40 border-b-2 border-slate-300 space-y-2.5">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider text-center bg-amber-200/80 py-2 rounded-xl flex items-center justify-center gap-2">
                  <i className="fa-solid fa-list-check text-slate-800"></i>
                  <span>How to Fill {detail.boardName} Online Form</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside pt-1">
                  {detail.howToFill && detail.howToFill.length > 0 ? (
                    detail.howToFill.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))
                  ) : (
                    <li>Read the official notification carefully before applying.</li>
                  )}
                </ul>
              </div>

              {/* 6. Some Useful Important Links Table (Direct Official Government Redirection) */}
              <div className="p-4 sm:p-5 bg-white space-y-3">
                <div className="text-center bg-[#800000] text-white py-2.5 px-4 rounded-t-xl space-y-0.5">
                  <h3 className="font-black text-base uppercase tracking-wider flex items-center justify-center gap-2">
                    <i className="fa-solid fa-link text-amber-300"></i>
                    <span>Some Useful Important Links</span>
                  </h3>
                  <p className="text-[11px] text-amber-200 font-medium">
                    Direct Official Government Authority Portal Redirections (target=&quot;_blank&quot;)
                  </p>
                </div>

                <div className="overflow-x-auto border-2 border-slate-400 rounded-b-xl">
                  <table className="w-full text-left text-xs sm:text-sm divide-y-2 divide-slate-300">
                    <tbody className="divide-y divide-slate-200">
                      {detail.importantLinks && detail.importantLinks.length > 0 ? (
                        detail.importantLinks.map((link, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/40 transition">
                            <td className="py-3.5 px-4 font-black text-slate-900 w-2/3 border-r border-slate-300">
                              {link.title}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-black px-4 sm:px-5 py-2 rounded-xl shadow transition hover-lift active:scale-95 text-xs"
                              >
                                <span>{link.actionText || "Click Here"}</span>
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-slate-500">
                            Official links available on the government recruitment portal.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Verified Official Notice Footer */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-shield-halved text-emerald-600 text-xl shrink-0"></i>
                    <div>
                      <strong className="block font-black text-emerald-950">
                        100% Authentic Government Portal Redirection
                      </strong>
                      <span className="text-emerald-800 text-[11px]">
                        Every link connects directly to official government domains (.gov.in, .nic.in, .ac.in). No third-party ad loops.
                      </span>
                    </div>
                  </div>
                  <a
                    href={detail.importantLinks?.[0]?.url || "https://www.india.gov.in/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs hover-lift"
                  >
                    Open Official Portal ↗
                  </a>
                </div>
              </div>

              {/* Bottom Exam Practice Promotion */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-slate-400 no-print">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-black text-amber-300 text-base flex items-center justify-center sm:justify-start gap-2">
                    <i className="fa-solid fa-keyboard"></i>
                    <span>Preparing for this Government Typing Skill Test?</span>
                  </h4>
                  <p className="text-xs text-blue-100 max-w-xl">
                    Practice on real government examination paragraphs with WPM calculation, accuracy tracking, and backspace evaluation.
                  </p>
                </div>
                <Link
                  href="/?tab=test"
                  className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow hover-lift"
                >
                  Start Typing Practice &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
