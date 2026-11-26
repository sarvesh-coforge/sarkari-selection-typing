"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppShell } from "@/components/AppShell";
import { IPortalItem, PortalDataResponse, getItemSlug } from "@/lib/typingData";

export default function ExamModePage() {
  const { triggerToast } = useAppShell();
  const [portalData, setPortalData] = useState<PortalDataResponse | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [liveBoardSearch, setLiveBoardSearch] = useState<string>("");
  const [liveBoardTab, setLiveBoardTab] = useState<
    "all" | "result" | "admitCard" | "latestJob" | "answerKey" | "syllabus" | "admission" | "certificate" | "important" | "outsourcing"
  >("all");

  const fetchPortalData = async () => {
    try {
      const res = await fetch("/api/sarkari-updates");
      const json = await res.json();
      if (json.success) {
        setPortalData(json);
        setSyncError(null);
      } else if (json.error) {
        setSyncError(json.error);
      }
    } catch (err: any) {
      console.warn("Portal data live load failed", err);
      setSyncError(err?.message || "Failed to connect to /api/sarkari-updates");
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/sync-sarkari", { method: "POST" });
      const json = await res.json();
      if (json.success && json.snapshot) {
        triggerToast(`Live Synced: v${json.snapshot.version} published (strictly 3 versions retained in MongoDB)!`);
        await fetchPortalData();
      } else {
        const msg = json.error || "Sync failed — previous active snapshot preserved.";
        setSyncError(msg);
        triggerToast(msg);
      }
    } catch (err: any) {
      console.error("Manual sync error", err);
      setSyncError(err?.message || "Network error during live sync.");
      triggerToast("Network error during live sync.");
    } finally {
      setIsSyncing(false);
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

  return (
    <section className="space-y-6">
      <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>LIVE 2026</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Real-time synced with sarkariresult.com
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Sarkari Result Recruitment &amp; Exam Updates
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Click any post to view its authentic SarkariResult notification table or redirect directly to verified official government recruitment portals (UPPSC, SSC, RRB, UPSC, High Courts, etc.).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
              title="Crawl https://www.sarkariresult.com/ in real time"
            >
              <i className={`fa-solid fa-arrows-rotate text-xs ${isSyncing ? "animate-spin" : ""}`}></i>
              <span>{isSyncing ? "Syncing..." : "Sync Live Updates"}</span>
            </button>
          </div>
        </div>

        {syncError && (
          <div className="bg-red-50 border border-red-300 text-red-900 rounded-xl p-3.5 text-xs sm:text-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <i className="fa-solid fa-triangle-exclamation text-red-600 mt-0.5"></i>
              <div>
                <strong className="font-bold block">Sync Notice:</strong>
                <span className="text-red-800">{syncError}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSyncError(null)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

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

        {quickAccessHotUpdates.length > 0 && (
          <div>
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-fire text-amber-500"></i>
                <span>Quick Access Hot Updates (Top {quickAccessHotUpdates.length} Colored Boards)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Click tile to view notification details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickAccessHotUpdates.map((item, idx) => {
                const slug = getItemSlug(item);
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
                    className="rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[110px] border border-black/15 hover-lift text-white"
                  >
                    <div className="space-y-1.5">
                      {item.badge && (
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 text-white">
                          {item.badge}
                        </span>
                      )}
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

        <div className="space-y-6">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>
              {liveBoardTab === "all"
                ? "Classic 3-Column Sarkari Recruitment Boards"
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
                          return (
                            <div key={idx} className={`p-3.5 ${col.hoverClass} transition flex items-start gap-2.5 text-xs`}>
                              <span className={`${col.dotColor} font-black mt-0.5`}>&bull;</span>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/post/${slug}`}
                                  className="font-bold text-blue-900 hover:text-blue-700 hover:underline leading-snug block line-clamp-2"
                                  title="View authentic SarkariResult notification table"
                                >
                                  {it.title}
                                </Link>
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
                          {liveBoardSearch ? `No ${col.title.toLowerCase()} items match your search.` : `Syncing ${col.title.toLowerCase()}...`}
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
                            return (
                              <div key={idx} className="p-3 hover:bg-slate-50 transition flex items-start gap-2 text-xs">
                                <span className="text-slate-600 font-black mt-0.5">&bull;</span>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/post/${slug}`}
                                    className="font-bold text-blue-900 hover:text-blue-700 hover:underline leading-snug block line-clamp-2"
                                  >
                                    {it.title}
                                  </Link>
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

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {currentCat.items.map((it, idx) => {
                    const slug = getItemSlug(it);
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
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

