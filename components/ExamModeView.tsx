"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppShell } from "@/components/AppShell";
import {
  EXAM_HISTORY_KEY,
  ExamCategory,
  ExamHistoryItem,
  IPortalItem,
  PortalDataResponse,
  examPatterns,
  formatTime,
  getItemSlug,
} from "@/lib/typingData";

const SAVED_POSTS_KEY = "sarkariSelectionSavedPostsV1";

export default function ExamModeView() {
  const { triggerToast } = useAppShell();
  const [activeView, setActiveView] = useState<"boards" | "simulator">("boards");

  // Live Portal Data
  const [portalData, setPortalData] = useState<PortalDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [liveBoardSearch, setLiveBoardSearch] = useState<string>("");
  const [liveBoardTab, setLiveBoardTab] = useState<
    | "all"
    | "saved"
    | "result"
    | "admitCard"
    | "latestJob"
    | "answerKey"
    | "syllabus"
    | "admission"
    | "certificate"
    | "important"
    | "outsourcing"
  >("all");
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  // Exam Simulator States
  const [examCategory, setExamCategory] = useState<ExamCategory>("all");
  const [examSearch, setExamSearch] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>(examPatterns[0].id);
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const res = await fetch("/api/sarkari-updates");
        const json = await res.json();
        if (json.success) {
          setPortalData(json);
          setLoadError(null);
        } else if (json.error) {
          setLoadError(json.error);
        }
      } catch (err: any) {
        console.warn("Portal data live load failed", err);
        setLoadError(err?.message || "Failed to load live updates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalData();

    try {
      const saved = localStorage.getItem(SAVED_POSTS_KEY);
      if (saved) setSavedSlugs(JSON.parse(saved));
    } catch {
      // ignore
    }

    try {
      const history = localStorage.getItem(EXAM_HISTORY_KEY);
      if (history) setExamHistory(JSON.parse(history));
    } catch {
      // ignore
    }
  }, []);

  const toggleSavePost = (slug: string, title: string) => {
    setSavedSlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try {
        localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      triggerToast(exists ? `Removed from Saved` : `Saved: ${title.slice(0, 40)}${title.length > 40 ? "..." : ""}`);
      return next;
    });
  };

  const clearExamHistory = () => {
    if (confirm("Clear all saved typing test history?")) {
      setExamHistory([]);
      try {
        localStorage.removeItem(EXAM_HISTORY_KEY);
      } catch {
        // ignore
      }
      triggerToast("Exam practice history cleared.");
    }
  };

  const quickAccessHotUpdates = useMemo(() => {
    const base = portalData?.snapshot?.hotUpdates || [];
    const q = liveBoardSearch.toLowerCase().trim();
    if (!q) return base.slice(0, 8);
    return base.filter((x) => x.title.toLowerCase().includes(q)).slice(0, 8);
  }, [portalData, liveBoardSearch]);

  const filterCat = (arr?: IPortalItem[]) => {
    if (!arr || !Array.isArray(arr)) return [];
    const q = liveBoardSearch.toLowerCase().trim();
    return q ? arr.filter((x) => x.title.toLowerCase().includes(q)) : arr;
  };

  const resultBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.result), [portalData, liveBoardSearch]);
  const admitCardBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.admitCard), [portalData, liveBoardSearch]);
  const latestJobBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.latestJob), [portalData, liveBoardSearch]);
  const answerKeyBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.answerKey), [portalData, liveBoardSearch]);
  const syllabusBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.syllabus), [portalData, liveBoardSearch]);
  const admissionBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.admission), [portalData, liveBoardSearch]);
  const certificateBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.certificate), [portalData, liveBoardSearch]);
  const importantBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.important), [portalData, liveBoardSearch]);
  const outsourcingBoardItems = useMemo(() => filterCat(portalData?.snapshot?.categories?.outsourcing), [portalData, liveBoardSearch]);

  const allBoardItems = useMemo(() => {
    const seen = new Set<string>();
    const combined: IPortalItem[] = [];
    const lists = [
      ...(portalData?.snapshot?.hotUpdates || []),
      ...(portalData?.snapshot?.categories?.latestJob || []),
      ...(portalData?.snapshot?.categories?.admitCard || []),
      ...(portalData?.snapshot?.categories?.result || []),
      ...(portalData?.snapshot?.categories?.answerKey || []),
      ...(portalData?.snapshot?.categories?.syllabus || []),
      ...(portalData?.snapshot?.categories?.admission || []),
      ...(portalData?.snapshot?.categories?.certificate || []),
      ...(portalData?.snapshot?.categories?.important || []),
      ...(portalData?.snapshot?.categories?.outsourcing || []),
    ];
    for (const item of lists) {
      const slug = getItemSlug(item);
      if (!seen.has(slug)) {
        seen.add(slug);
        combined.push(item);
      }
    }
    return combined;
  }, [portalData]);

  const savedBoardItems = useMemo(() => {
    const q = liveBoardSearch.toLowerCase().trim();
    return allBoardItems.filter((item) => {
      const isSaved = savedSlugs.includes(getItemSlug(item));
      const matchesSearch = !q || item.title.toLowerCase().includes(q);
      return isSaved && matchesSearch;
    });
  }, [allBoardItems, savedSlugs, liveBoardSearch]);

  const totalCategoryCount =
    resultBoardItems.length +
    admitCardBoardItems.length +
    latestJobBoardItems.length +
    answerKeyBoardItems.length +
    syllabusBoardItems.length +
    admissionBoardItems.length +
    certificateBoardItems.length +
    importantBoardItems.length +
    outsourcingBoardItems.length;

  const filteredExams = useMemo(() => {
    const q = examSearch.toLowerCase().trim();
    return examPatterns.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(q) ||
        e.note.toLowerCase().includes(q) ||
        e.speed.toLowerCase().includes(q);
      const matchCat = examCategory === "all" || e.category === examCategory;
      return matchSearch && matchCat;
    });
  }, [examSearch, examCategory]);

  const activeSelectedExam = useMemo(() => {
    return examPatterns.find((e) => e.id === selectedExamId) || examPatterns[0];
  }, [selectedExamId]);

  return (
    <section className="space-y-6">
      <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        {/* Header with Interactive Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sarkari Selection Live Recruitment &amp; Exam Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Explore live recruitment notifications, bookmark your target exams, or launch official government typing exam simulations.
            </p>
          </div>

          {/* Interactive View Switcher */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveView("boards")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeView === "boards"
                  ? "bg-white text-blue-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-solid fa-newspaper text-blue-600"></i>
              <span>Recruitment Boards</span>
              {totalCategoryCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-black">
                  {totalCategoryCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveView("simulator")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeView === "simulator"
                  ? "bg-white text-amber-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-solid fa-keyboard text-amber-600"></i>
              <span>Exam Typing Simulator</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-black">
                {examPatterns.length}
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: LIVE RECRUITMENT BOARDS */}
        {/* ============================================================== */}
        {activeView === "boards" && (
          <div className="space-y-6">
            {loadError && (
              <div className="bg-red-50 border border-red-300 text-red-900 rounded-xl p-3.5 text-xs sm:text-sm flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mt-0.5"></i>
                  <div>
                    <strong className="font-bold block">Notice:</strong>
                    <span className="text-red-800">{loadError}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLoadError(null)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}

            {/* Interactive Quick-Stats Shortcut Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  key: "all" as const,
                  label: "All Active Boards",
                  count: totalCategoryCount,
                  icon: "fa-layer-group",
                  ring: "ring-slate-900 bg-slate-900 text-white",
                  idle: "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200",
                  iconColor: "text-slate-500",
                },
                {
                  key: "latestJob" as const,
                  label: "Latest Jobs",
                  count: latestJobBoardItems.length,
                  icon: "fa-briefcase",
                  ring: "ring-emerald-700 bg-[#065f46] text-white",
                  idle: "bg-emerald-50/60 hover:bg-emerald-50 text-emerald-950 border-emerald-200",
                  iconColor: "text-emerald-600",
                },
                {
                  key: "admitCard" as const,
                  label: "Admit Cards",
                  count: admitCardBoardItems.length,
                  icon: "fa-id-card",
                  ring: "ring-blue-800 bg-[#1e3a8a] text-white",
                  idle: "bg-blue-50/60 hover:bg-blue-50 text-blue-950 border-blue-200",
                  iconColor: "text-blue-600",
                },
                {
                  key: "result" as const,
                  label: "Declared Results",
                  count: resultBoardItems.length,
                  icon: "fa-square-poll-vertical",
                  ring: "ring-red-900 bg-[#800000] text-white",
                  idle: "bg-red-50/60 hover:bg-red-50 text-red-950 border-red-200",
                  iconColor: "text-red-700",
                },
              ].map((card) => {
                const isActive = liveBoardTab === card.key;
                return (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setLiveBoardTab(card.key)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isActive ? `ring-2 ${card.ring} border-transparent shadow-md` : card.idle
                    }`}
                  >
                    <div>
                      <div className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? "text-white/80" : "text-slate-500"}`}>
                        {card.label}
                      </div>
                      <div className="text-2xl font-black mt-0.5">
                        {isLoading ? "—" : card.count}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isActive ? "bg-white/15 text-white" : `bg-white shadow-sm ${card.iconColor}`}`}>
                      <i className={`fa-solid ${card.icon}`}></i>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Search & Category Filter Bar */}
            <div className="flex flex-col gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="relative w-full">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  value={liveBoardSearch}
                  onChange={(e) => setLiveBoardSearch(e.target.value)}
                  placeholder="Search recruitment, board (UPPSC, SSC, RRB, UPSC, DSSSB), admit card, result..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-inner"
                />
                {liveBoardSearch && (
                  <button
                    type="button"
                    onClick={() => setLiveBoardSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                    title="Clear search"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLiveBoardTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    liveBoardTab === "all"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                  }`}
                >
                  <span>All Boards</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-white">
                    {totalCategoryCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiveBoardTab("saved")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    liveBoardTab === "saved"
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "bg-white text-amber-800 hover:bg-amber-50 border border-amber-300"
                  }`}
                >
                  <i className="fa-solid fa-bookmark text-[10px]"></i>
                  <span>Saved</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900 text-white">
                    {savedBoardItems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiveBoardTab("latestJob")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    liveBoardTab === "latestJob"
                      ? "bg-[#065f46] text-white shadow-sm"
                      : "bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-300"
                  }`}
                >
                  <i className="fa-solid fa-briefcase text-[10px]"></i>
                  <span>Latest Jobs</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-800 text-white">
                    {latestJobBoardItems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiveBoardTab("admitCard")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    liveBoardTab === "admitCard"
                      ? "bg-[#1e3a8a] text-white shadow-sm"
                      : "bg-white text-blue-900 hover:bg-blue-50 border border-blue-300"
                  }`}
                >
                  <i className="fa-solid fa-id-card text-[10px]"></i>
                  <span>Admit Cards</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-800 text-white">
                    {admitCardBoardItems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiveBoardTab("result")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    liveBoardTab === "result"
                      ? "bg-[#800000] text-white shadow-sm"
                      : "bg-white text-red-900 hover:bg-red-50 border border-red-300"
                  }`}
                >
                  <i className="fa-solid fa-square-poll-vertical text-[10px]"></i>
                  <span>Results</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-900 text-white">
                    {resultBoardItems.length}
                  </span>
                </button>

                {[
                  { key: "answerKey" as const, label: "Answer Key", items: answerKeyBoardItems },
                  { key: "syllabus" as const, label: "Syllabus", items: syllabusBoardItems },
                  { key: "admission" as const, label: "Admission", items: admissionBoardItems },
                  { key: "certificate" as const, label: "Certificate", items: certificateBoardItems },
                  { key: "important" as const, label: "Important", items: importantBoardItems },
                  { key: "outsourcing" as const, label: "Outsourcing", items: outsourcingBoardItems },
                ]
                  .filter((cat) => cat.items.length > 0)
                  .map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setLiveBoardTab(cat.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        liveBoardTab === cat.key
                          ? "bg-purple-800 text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-white">
                        {cat.items.length}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Quick Access Hot Updates Tiles */}
            {quickAccessHotUpdates.length > 0 && liveBoardTab !== "saved" && (
              <div>
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-fire text-amber-500"></i>
                    <span>Quick Access Hot Updates (Top {quickAccessHotUpdates.length})</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Click tile to view details or bookmark</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickAccessHotUpdates.map((item, idx) => {
                    const slug = getItemSlug(item);
                    const isSaved = savedSlugs.includes(slug);
                    const fallbackPalette = [
                      "#dc2626",
                      "#ea580c",
                      "#c026d3",
                      "#1d4ed8",
                      "#65a30d",
                      "#0284c7",
                      "#7f1d1d",
                      "#15803d",
                    ];
                    const tileColor = item.bgColor || fallbackPalette[idx % fallbackPalette.length];
                    return (
                      <div
                        key={idx}
                        style={{ backgroundColor: tileColor }}
                        className="rounded-xl p-3.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[115px] border border-black/15 text-white"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            {item.badge ? (
                              <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 text-white">
                                {item.badge}
                              </span>
                            ) : (
                              <span></span>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleSavePost(slug, item.title)}
                              className="text-white/80 hover:text-amber-300 transition text-xs"
                              title={isSaved ? "Remove bookmark" : "Save for later"}
                            >
                              <i className={`${isSaved ? "fa-solid text-amber-300" : "fa-regular"} fa-bookmark`}></i>
                            </button>
                          </div>
                          <Link
                            href={`/post/${slug}`}
                            className="font-black text-xs sm:text-[13px] leading-snug line-clamp-2 hover:underline block text-white"
                            title={item.title}
                          >
                            {item.title}
                          </Link>
                        </div>

                        <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-white/25 text-[11px]">
                          <Link
                            href={`/post/${slug}`}
                            className="font-black hover:underline inline-flex items-center gap-1 text-white opacity-95 hover:opacity-100"
                          >
                            <span>View Details</span>
                            <span>&rarr;</span>
                          </Link>
                          <a
                            href={item.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline text-white/95 hover:text-white inline-flex items-center gap-1"
                            title={`Direct official government link: ${item.officialUrl}`}
                          >
                            <span>Govt Portal</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recruitment Boards */}
            <div className="space-y-6">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>
                  {liveBoardTab === "all"
                    ? "Sarkari Selection Recruitment Boards"
                    : liveBoardTab === "saved"
                    ? "Your Bookmarked Updates"
                    : `Official ${liveBoardTab.replace(/([A-Z])/g, " $1").trim()} Board`}
                </span>
                {liveBoardSearch && (
                  <span className="text-[11px] text-blue-600 font-bold">
                    Filtered by: &ldquo;{liveBoardSearch}&rdquo;
                  </span>
                )}
              </div>

              {liveBoardTab === "all" && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {[
                      {
                        title: "Result",
                        icon: "fa-square-poll-vertical",
                        items: resultBoardItems,
                        border: "border-red-900",
                        headerBg: "bg-[#800000]",
                        badgeBg: "bg-red-950/70",
                        dotColor: "text-red-700",
                        tagClass: "bg-red-100 text-red-800 border-red-200",
                        hoverClass: "hover:bg-amber-50/70",
                      },
                      {
                        title: "Admit Card",
                        icon: "fa-id-card",
                        items: admitCardBoardItems,
                        border: "border-blue-900",
                        headerBg: "bg-[#1e3a8a]",
                        badgeBg: "bg-blue-950/70",
                        dotColor: "text-blue-700",
                        tagClass: "bg-blue-100 text-blue-800 border-blue-200",
                        hoverClass: "hover:bg-blue-50/50",
                      },
                      {
                        title: "Latest Job",
                        icon: "fa-briefcase",
                        items: latestJobBoardItems,
                        border: "border-emerald-900",
                        headerBg: "bg-[#065f46]",
                        badgeBg: "bg-emerald-950/70",
                        dotColor: "text-emerald-700",
                        tagClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
                        hoverClass: "hover:bg-emerald-50/50",
                      },
                    ].map((col) => (
                      <div key={col.title} className={`flex flex-col border-2 ${col.border} rounded-xl overflow-hidden shadow-sm bg-white`}>
                        <div className={`${col.headerBg} text-white py-3 px-4 font-black text-sm uppercase tracking-wide flex items-center justify-between`}>
                          <span className="flex items-center gap-2">
                            <i className={`fa-solid ${col.icon}`}></i>
                            <span>{col.title}</span>
                          </span>
                          <span className={`text-[10px] ${col.badgeBg} px-2.5 py-0.5 rounded font-bold`}>
                            {col.items.length} Available
                          </span>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto custom-scrollbar flex-1">
                          {col.items.length > 0 ? (
                            col.items.map((it, idx) => {
                              const slug = getItemSlug(it);
                              const isSaved = savedSlugs.includes(slug);
                              return (
                                <div key={idx} className={`p-3.5 ${col.hoverClass} transition flex items-start gap-2.5 text-xs`}>
                                  <span className={`${col.dotColor} font-black mt-0.5`}>&bull;</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <Link
                                        href={`/post/${slug}`}
                                        className="font-bold text-blue-900 hover:text-blue-700 hover:underline leading-snug block line-clamp-2"
                                        title="View notification details on Sarkari Selection"
                                      >
                                        {it.title}
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => toggleSavePost(slug, it.title)}
                                        className={`shrink-0 transition ${isSaved ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`}
                                        title={isSaved ? "Remove bookmark" : "Save post"}
                                      >
                                        <i className={`${isSaved ? "fa-solid" : "fa-regular"} fa-bookmark`}></i>
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                      {it.badge && (
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${col.tagClass}`}>
                                          {it.badge}
                                        </span>
                                      )}
                                      <Link
                                        href={`/post/${slug}`}
                                        className="text-[10px] font-bold text-blue-700 hover:underline inline-flex items-center gap-0.5"
                                      >
                                        <span>Details</span> &rarr;
                                      </Link>
                                      <a
                                        href={it.officialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 ml-auto inline-flex items-center gap-1"
                                        title={`Official government portal: ${it.officialUrl}`}
                                      >
                                        <span>Govt Portal</span>
                                        <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                              {isLoading
                                ? `Loading ${col.title.toLowerCase()}...`
                                : liveBoardSearch
                                ? `No ${col.title.toLowerCase()} items match your search.`
                                : `No ${col.title.toLowerCase()} updates available right now.`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {[
                    { title: "Answer Key", items: answerKeyBoardItems, icon: "fa-key" },
                    { title: "Syllabus", items: syllabusBoardItems, icon: "fa-book-open" },
                    { title: "Admission", items: admissionBoardItems, icon: "fa-user-graduate" },
                    { title: "Certificate Verification", items: certificateBoardItems, icon: "fa-certificate" },
                    { title: "Important", items: importantBoardItems, icon: "fa-star" },
                    { title: "Outsourcing / Offline Jobs", items: outsourcingBoardItems, icon: "fa-file-signature" },
                  ].filter((sec) => sec.items.length > 0).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                      {[
                        { title: "Answer Key", items: answerKeyBoardItems, icon: "fa-key" },
                        { title: "Syllabus", items: syllabusBoardItems, icon: "fa-book-open" },
                        { title: "Admission", items: admissionBoardItems, icon: "fa-user-graduate" },
                        { title: "Certificate Verification", items: certificateBoardItems, icon: "fa-certificate" },
                        { title: "Important", items: importantBoardItems, icon: "fa-star" },
                        { title: "Outsourcing / Offline Jobs", items: outsourcingBoardItems, icon: "fa-file-signature" },
                      ]
                        .filter((sec) => sec.items.length > 0)
                        .map((sec) => (
                          <div key={sec.title} className="flex flex-col border-2 border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="bg-slate-800 text-white py-2.5 px-4 font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <i className={`fa-solid ${sec.icon}`}></i>
                                <span>{sec.title}</span>
                              </span>
                              <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded font-bold">
                                {sec.items.length} Available
                              </span>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto custom-scrollbar flex-1">
                              {sec.items.map((it, idx) => {
                                const slug = getItemSlug(it);
                                const isSaved = savedSlugs.includes(slug);
                                return (
                                  <div key={idx} className="p-3 hover:bg-slate-50 transition flex items-start gap-2 text-xs">
                                    <span className="text-slate-600 font-black mt-0.5">&bull;</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <Link
                                          href={`/post/${slug}`}
                                          className="font-bold text-blue-900 hover:text-blue-700 hover:underline leading-snug block line-clamp-2"
                                        >
                                          {it.title}
                                        </Link>
                                        <button
                                          type="button"
                                          onClick={() => toggleSavePost(slug, it.title)}
                                          className={`shrink-0 transition ${isSaved ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`}
                                          title={isSaved ? "Remove bookmark" : "Save post"}
                                        >
                                          <i className={`${isSaved ? "fa-solid" : "fa-regular"} fa-bookmark`}></i>
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1.5">
                                        <Link
                                          href={`/post/${slug}`}
                                          className="text-[10px] font-bold text-blue-700 hover:underline"
                                        >
                                          Details &rarr;
                                        </Link>
                                        <a
                                          href={it.officialUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-auto inline-flex items-center gap-1"
                                        >
                                          <span>Govt Portal</span>
                                          <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}

              {liveBoardTab !== "all" && (() => {
                const categoryMap: Record<string, { title: string; items: IPortalItem[]; headerBg: string; tagClass: string }> = {
                  saved: { title: "Saved / Bookmarked Updates", items: savedBoardItems, headerBg: "bg-amber-600", tagClass: "bg-amber-100 text-amber-800" },
                  result: { title: "All Results", items: resultBoardItems, headerBg: "bg-[#800000]", tagClass: "bg-red-100 text-red-800" },
                  admitCard: { title: "All Admit Cards", items: admitCardBoardItems, headerBg: "bg-[#1e3a8a]", tagClass: "bg-blue-100 text-blue-800" },
                  latestJob: { title: "All Latest Recruitment Jobs", items: latestJobBoardItems, headerBg: "bg-[#065f46]", tagClass: "bg-emerald-100 text-emerald-800" },
                  answerKey: { title: "Answer Keys", items: answerKeyBoardItems, headerBg: "bg-purple-800", tagClass: "bg-purple-100 text-purple-800" },
                  syllabus: { title: "Syllabus", items: syllabusBoardItems, headerBg: "bg-purple-800", tagClass: "bg-purple-100 text-purple-800" },
                  admission: { title: "Admissions", items: admissionBoardItems, headerBg: "bg-purple-800", tagClass: "bg-purple-100 text-purple-800" },
                  certificate: { title: "Certificate Verification", items: certificateBoardItems, headerBg: "bg-purple-800", tagClass: "bg-purple-100 text-purple-800" },
                  important: { title: "Important", items: importantBoardItems, headerBg: "bg-purple-800", tagClass: "bg-purple-100 text-purple-800" },
                  outsourcing: { title: "Outsourcing / Offline Jobs", items: outsourcingBoardItems, headerBg: "bg-purple-800", tagClass: "bg-purple-100 text-purple-800" },
                };
                const currentCat = categoryMap[liveBoardTab] || categoryMap.latestJob;
                return (
                  <div className="border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className={`${currentCat.headerBg} text-white py-3 px-5 font-black text-sm uppercase tracking-wide flex items-center justify-between`}>
                      <span>{currentCat.title}</span>
                      <span className="text-[10px] bg-black/40 px-2.5 py-0.5 rounded-full font-bold">
                        {currentCat.items.length} Entries
                      </span>
                    </div>

                    {currentCat.items.length > 0 ? (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {currentCat.items.map((it, idx) => {
                          const slug = getItemSlug(it);
                          const isSaved = savedSlugs.includes(slug);
                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-sm bg-slate-50/60 hover:bg-white transition flex flex-col justify-between space-y-3"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${currentCat.tagClass}`}>
                                    {it.badge || "LIVE 2026"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => toggleSavePost(slug, it.title)}
                                    className={`text-sm transition ${isSaved ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`}
                                    title={isSaved ? "Remove bookmark" : "Save post"}
                                  >
                                    <i className={`${isSaved ? "fa-solid" : "fa-regular"} fa-bookmark`}></i>
                                  </button>
                                </div>
                                <Link
                                  href={`/post/${slug}`}
                                  className="font-bold text-xs sm:text-sm text-blue-900 hover:text-blue-700 hover:underline leading-snug line-clamp-3 block"
                                >
                                  {it.title}
                                </Link>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                                <Link
                                  href={`/post/${slug}`}
                                  className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                                >
                                  <span>Details Table</span> &rarr;
                                </Link>
                                <a
                                  href={it.officialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 inline-flex items-center gap-1"
                                  title={`Direct link to government portal: ${it.officialUrl}`}
                                >
                                  <span>Govt Portal</span>
                                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-10 text-center text-sm text-slate-400">
                        {liveBoardTab === "saved"
                          ? "No bookmarked updates yet. Click the bookmark icon on any post to save it here."
                          : "No matching entries found."}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: INTERACTIVE EXAM TYPING SIMULATOR */}
        {/* ============================================================== */}
        {activeView === "simulator" && (
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="relative w-full">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="Search exam pattern (SSC CHSL, RRB NTPC, High Court, DSSSB, UPSSSC)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition shadow-inner"
                />
                {examSearch && (
                  <button
                    type="button"
                    onClick={() => setExamSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all" as const, label: "All Exams" },
                  { key: "central" as const, label: "Central Govt" },
                  { key: "railway" as const, label: "Railway (RRB)" },
                  { key: "court" as const, label: "High Courts" },
                  { key: "state" as const, label: "State Govt" },
                  { key: "institute" as const, label: "Institutes" },
                  { key: "police" as const, label: "Police" },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setExamCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      examCategory === cat.key
                        ? "bg-blue-900 text-white shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Exam Launcher Card + Exam Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
                {filteredExams.map((exam) => {
                  const isSelected = exam.id === activeSelectedExam.id;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setSelectedExamId(exam.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30 shadow-sm"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                            isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <i className={`fa-solid ${exam.icon}`}></i>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2">{exam.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{exam.note}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/70">
                        <span className="font-semibold text-blue-700">{exam.duration} min</span>
                        <span className="text-slate-600 truncate max-w-[160px]">{exam.language}</span>
                      </div>
                    </button>
                  );
                })}
                {filteredExams.length === 0 && (
                  <div className="col-span-full p-8 text-center text-sm text-slate-400">
                    No exam patterns match your filter.
                  </div>
                )}
              </div>

              {/* Active Exam Details & Launch Panel */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-lg font-black">
                      <i className={`fa-solid ${activeSelectedExam.icon}`}></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        Selected Exam Pattern
                      </span>
                      <h3 className="text-base font-black leading-snug">{activeSelectedExam.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-300">Duration:</span>
                      <span className="font-bold text-white">{activeSelectedExam.duration} Minutes</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-300">Required Speed:</span>
                      <span className="font-bold text-amber-300 text-right">{activeSelectedExam.speed}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-300">Language:</span>
                      <span className="font-bold text-white">{activeSelectedExam.language}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-300">Font / Mode:</span>
                      <span className="font-bold text-white text-right">{activeSelectedExam.font}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href={`/typing-test?exam=${activeSelectedExam.id}`}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                  >
                    <i className="fa-solid fa-play"></i>
                    <span>Start Official Exam Test</span>
                  </Link>
                  <a
                    href={activeSelectedExam.defaultOfficialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Official Board Website</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Practice History */}
            {examHistory.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <i className="fa-solid fa-clock-rotate-left text-blue-600"></i>
                    <span>Your Recent Exam Attempts ({examHistory.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={clearExamHistory}
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    Clear History
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Exam</th>
                        <th className="px-4 py-2.5">Net WPM</th>
                        <th className="px-4 py-2.5">Accuracy</th>
                        <th className="px-4 py-2.5">Time</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {examHistory.slice(0, 8).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-semibold text-slate-900">{item.examName}</td>
                          <td className="px-4 py-2.5 font-black text-blue-700">{item.netWpm} WPM</td>
                          <td className="px-4 py-2.5 font-bold text-emerald-700">{item.accuracy}%</td>
                          <td className="px-4 py-2.5 text-slate-600">{formatTime(item.duration)}</td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                item.status === "QUALIFIED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "NOT QUALIFIED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
