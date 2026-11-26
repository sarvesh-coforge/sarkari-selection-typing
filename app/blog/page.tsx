"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PortalDataResponse } from "@/lib/typingData";

export default function BlogFaqPage() {
  const [portalData, setPortalData] = useState<PortalDataResponse | null>(null);

  useEffect(() => {
    fetch("/api/sarkari-updates")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPortalData(json);
      })
      .catch(() => {
        // ignore
      });
  }, []);

  const allSnapshotItems = useMemo(() => {
    const cats = portalData?.snapshot?.categories;
    if (!cats) return portalData?.snapshot?.hotUpdates || [];
    return [
      ...(cats.latestJob || []),
      ...(cats.admitCard || []),
      ...(cats.result || []),
      ...(cats.answerKey || []),
      ...(cats.syllabus || []),
      ...(cats.admission || []),
      ...(cats.certificate || []),
      ...(cats.important || []),
      ...(cats.outsourcing || []),
    ];
  }, [portalData]);

  return (
    <section className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
        <div>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Resources &amp; Knowledge
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            Typing Guides, Tips &amp; Frequently Asked Questions
          </h2>
        </div>

        {allSnapshotItems.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <i className="fa-solid fa-satellite-dish text-blue-600 animate-pulse"></i>
                <span>Live Active Government Portals (Direct Official Redirection)</span>
              </h3>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                Auto-Crawled
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {allSnapshotItems.slice(0, 8).map((it, idx) => (
                <a
                  key={idx}
                  href={it.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-800 hover:text-blue-700 flex items-center justify-between transition shadow-sm"
                >
                  <span className="truncate pr-2 font-semibold">{it.title}</span>
                  <span className="text-[10px] font-bold text-blue-600 whitespace-nowrap flex items-center gap-1">
                    Official <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Frequently Asked Questions</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-base">Q: How does the 1-Week Free Trial work?</h4>
            <p className="text-sm text-slate-600">
              A: You get full access to all Pro features for 7 days absolutely free. After the trial, the plan is
              ₹100 monthly. You can cancel anytime.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-base">Q: How is typing speed (WPM) calculated?</h4>
            <p className="text-sm text-slate-600">
              A: Speed is calculated based on standard industry formulas where 5 characters/keystrokes equal 1
              word. Net WPM subtracts error penalties from Gross WPM.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-base">Q: Does this platform redirect to official government portals?</h4>
            <p className="text-sm text-slate-600">
              A: Yes! Every active recruitment badge and link connects directly to official government recruitment authorities like ssc.gov.in, rrbcdg.gov.in, uppbpb.gov.in, and official High Court portals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

