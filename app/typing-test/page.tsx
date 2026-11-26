"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  EXAM_HISTORY_KEY,
  ExamHistoryItem,
  ExamPattern,
  Language,
  TestStats,
  examPatterns,
  formatTime,
  getExamParagraph,
  getRequiredSpeed,
  sampleParagraphs,
} from "@/lib/typingData";

function TypingTestContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as Language | null;
  const examParam = searchParams.get("exam");

  const [testLang, setTestLangState] = useState<Language>("english");
  const [testDuration, setTestDuration] = useState<number>(5);
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(300);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(false);
  const [testParagraph, setTestParagraph] = useState<string>(sampleParagraphs.english);
  const [typedInput, setTypedInput] = useState<string>("");
  const [testStatusMsg, setTestStatusMsg] = useState<string>(
    "Click in the text area above or press Start to begin test."
  );

  const [examPracticeMode, setExamPracticeMode] = useState<boolean>(false);
  const [examPracticePattern, setExamPracticePattern] = useState<ExamPattern | null>(null);
  const [examPracticeParagraph, setExamPracticeParagraph] = useState<string>("");

  const [showResult, setShowResult] = useState<boolean>(false);
  const [lastResultStats, setLastResultStats] = useState<TestStats | null>(null);
  const [lastResultQualified, setLastResultQualified] = useState<boolean | null>(null);
  const [lastResultRequired, setLastResultRequired] = useState<number | null>(null);

  const testTimerRef = useRef<NodeJS.Timeout | null>(null);
  const testInputRef = useRef<HTMLTextAreaElement>(null);

  // Sync URL query params (?lang=... or ?exam=...)
  useEffect(() => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setTestStarted(false);
    setIsFullscreenActive(false);
    setShowResult(false);
    setTypedInput("");

    if (examParam) {
      const pattern = examPatterns.find((e) => e.id === examParam);
      if (pattern) {
        const p = getExamParagraph(pattern);
        const lang: Language =
          /hindi/i.test(pattern.language || "") && !/english/i.test(pattern.language || "") ? "hindi" : "english";
        setExamPracticeMode(true);
        setExamPracticePattern(pattern);
        setExamPracticeParagraph(p);
        setTestParagraph(p);
        setTestLangState(lang);
        setTestDuration(pattern.duration);
        setTestTimeRemaining(pattern.duration * 60);
        setTestStatusMsg(`${pattern.name} selected. Click Start Test to begin typing in full-screen view.`);
        return;
      }
    }

    const validLang: Language =
      langParam && ["english", "hindi", "punjabi", "marathi"].includes(langParam) ? langParam : "english";
    setExamPracticeMode(false);
    setExamPracticePattern(null);
    setExamPracticeParagraph("");
    setTestLangState(validLang);
    setTestParagraph(sampleParagraphs[validLang]);
    setTestTimeRemaining(testDuration * 60);
    setTestStatusMsg("Test ready. Type in the text area above or press Start Test for full-screen view.");
  }, [langParam, examParam]);

  const calculateTestStats = (): TestStats => {
    const target = examPracticeMode ? examPracticeParagraph : sampleParagraphs[testLang];
    const typed = typedInput;

    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {
      if (i < target.length) {
        if (typed[i] === target[i]) {
          correctChars++;
        } else {
          errors++;
        }
      } else {
        errors++;
      }
    }

    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : testDuration;
    const elapsedSec = Math.max(1, durationMin * 60 - testTimeRemaining);
    const elapsedMin = elapsedSec / 60;

    const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
    const grossWpm = Math.round(typed.length / 5 / elapsedMin);
    const netWpm = Math.max(0, Math.round(correctChars / 5 / elapsedMin));
    const accuracy = typed.length > 0 ? Math.max(0, Math.round((correctChars / typed.length) * 100)) : 100;

    return {
      typedText: typed,
      correctChars,
      errors,
      wordsTyped,
      grossWpm,
      netWpm,
      accuracy,
      elapsedSec: testStarted ? elapsedSec : 0,
    };
  };

  const liveStats = useMemo(() => {
    return calculateTestStats();
  }, [typedInput, testTimeRemaining, testLang, examPracticeMode, examPracticeParagraph, testDuration]);

  const saveExamHistoryItem = (item: ExamHistoryItem) => {
    try {
      const saved = localStorage.getItem(EXAM_HISTORY_KEY);
      const existing: ExamHistoryItem[] = saved ? JSON.parse(saved) : [];
      const updated = [item, ...existing].slice(0, 100);
      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const finishTypingTest = () => {
    const wasStarted = testStarted;
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setTestStarted(false);
    setIsFullscreenActive(false);

    const stats = calculateTestStats();
    setLastResultStats(stats);

    const timeUsed = wasStarted ? stats.elapsedSec : 0;

    if (examPracticeMode && examPracticePattern) {
      const e = examPracticePattern;
      const required = getRequiredSpeed(e);
      const qualified = required ? wasStarted && stats.netWpm >= required : null;
      const status = qualified === null ? "Practice / Cutoff varies" : qualified ? "QUALIFIED" : "NOT QUALIFIED";

      setLastResultRequired(required);
      setLastResultQualified(qualified);

      saveExamHistoryItem({
        id: Date.now(),
        examId: e.id,
        examName: e.name,
        date: new Date().toLocaleString("en-IN"),
        duration: timeUsed,
        grossWpm: wasStarted ? stats.grossWpm : 0,
        netWpm: wasStarted ? stats.netWpm : 0,
        accuracy: stats.accuracy,
        errors: stats.errors,
        words: stats.wordsTyped,
        required,
        status,
        language: e.language,
      });
    } else {
      setLastResultRequired(null);
      setLastResultQualified(null);
    }

    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (testStarted && testTimeRemaining > 0) {
      testTimerRef.current = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(testTimerRef.current!);
            finishTypingTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    }
    return () => {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, [testStarted, testTimeRemaining]);

  const resetTest = (overrideLang?: Language, overrideDuration?: number) => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setTestStarted(false);
    setIsFullscreenActive(false);
    setShowResult(false);

    const lang = overrideLang ?? testLang;
    const dur = overrideDuration ?? testDuration;
    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : dur;
    setTestTimeRemaining(durationMin * 60);
    setTypedInput("");
    setTestParagraph(examPracticeMode ? examPracticeParagraph : sampleParagraphs[lang] || sampleParagraphs.english);
    setTestStatusMsg(
      examPracticeMode && examPracticePattern
        ? `Ready for ${examPracticePattern.name}. Click Start Test or begin typing in full-screen mode.`
        : "Test ready. Type in the text area above or press Start Test for full-screen view."
    );
  };

  const startTypingTest = (preserveTyped = false) => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : testDuration;
    setTestTimeRemaining(durationMin * 60);
    setShowResult(false);

    setTestParagraph(examPracticeMode ? examPracticeParagraph : sampleParagraphs[testLang] || sampleParagraphs.english);
    if (!preserveTyped) setTypedInput("");
    setTestStatusMsg("Test in progress (Full-Screen Mode)...");
    setTestStarted(true);
    setIsFullscreenActive(true);

    setTimeout(() => {
      if (testInputRef.current) {
        testInputRef.current.focus();
      }
    }, 100);
  };

  if (showResult && lastResultStats) {
    return (
      <section className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                <i className="fa-solid fa-award"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Typing Test Result Scorecard</h2>
                <p className="text-xs text-slate-500">
                  {examPracticeMode && examPracticePattern
                    ? `Exam Pattern Report: ${examPracticePattern.name}`
                    : "Complete performance evaluation summary."}
                </p>
              </div>
            </div>
            <button
              onClick={() => resetTest()}
              className="text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-sm transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-xmark"></i> Close Result
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Gross Speed</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{lastResultStats.grossWpm} WPM</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Net Speed</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{lastResultStats.netWpm} WPM</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Accuracy</span>
              <div className="text-2xl font-black text-green-600 mt-1">{lastResultStats.accuracy}%</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Errors</span>
              <div className="text-2xl font-black text-red-600 mt-1">{lastResultStats.errors}</div>
            </div>
          </div>

          {examPracticeMode && examPracticePattern && (
            <div
              className={`rounded-xl border p-4 ${
                lastResultQualified === true
                  ? "bg-green-50 border-green-200"
                  : lastResultQualified === false
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Qualifying Status</div>
                  <div className="text-lg font-black text-slate-900">
                    {lastResultQualified === null
                      ? "Practice / Cutoff varies"
                      : lastResultQualified
                      ? "QUALIFIED"
                      : "NOT QUALIFIED"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">Required Speed</div>
                  <div className="text-sm font-bold text-slate-700">
                    {lastResultRequired ? `${lastResultRequired} WPM minimum` : "Notification-specific"}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {lastResultRequired
                  ? `${examPracticePattern.name}: practice qualification is based on ${lastResultRequired} WPM minimum for this configured pattern.`
                  : `${examPracticePattern.name}: cutoff depends on the official post notification.`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Words Typed</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">{lastResultStats.wordsTyped}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Correct Chars</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">{lastResultStats.correctChars}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Time Used</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">{formatTime(lastResultStats.elapsedSec)}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Language / Mode</span>
              <div className="text-sm font-black text-slate-900 mt-1 truncate">
                {examPracticeMode && examPracticePattern
                  ? examPracticePattern.name
                  : `${testLang.toUpperCase()} (${testDuration} min)`}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => {
                resetTest();
                startTypingTest();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate-right"></i> Retake Test
            </button>
            <button
              onClick={() => resetTest()}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl transition"
            >
              Back to Typing Test
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tab-test" className={`space-y-6 ${isFullscreenActive ? "test-fullscreen-active" : ""}`}>
      <div className="test-card-wrapper bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {examPracticeMode && examPracticePattern ? examPracticePattern.name : "Interactive Typing Test"}
            </h2>
            <p className="text-sm text-slate-500">
              {examPracticeMode && examPracticePattern
                ? `${examPracticePattern.duration} min • ${examPracticePattern.speed} • ${examPracticePattern.language}`
                : "Select language, duration, and test mode to evaluate your typing speed."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              disabled={examPracticeMode}
              value={testLang}
              onChange={(e) => {
                const newLang = e.target.value as Language;
                setTestLangState(newLang);
                resetTest(newLang, testDuration);
              }}
              className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi (Mangal)</option>
              <option value="punjabi">Punjabi</option>
              <option value="marathi">Marathi</option>
            </select>
            <select
              disabled={examPracticeMode}
              value={testDuration}
              onChange={(e) => {
                const newDur = Number(e.target.value);
                setTestDuration(newDur);
                resetTest(testLang, newDur);
              }}
              className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={1}>1 Minute</option>
              <option value={2}>2 Minutes</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
            </select>
            <button
              onClick={() => resetTest()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-1.5 shadow"
            >
              <i className="fa-solid fa-rotate-right"></i> Reset Test
            </button>
            {isFullscreenActive && (
              <button
                onClick={finishTypingTest}
                title="Close & Exit Test"
                className="bg-red-600 hover:bg-red-700 text-white font-bold w-9 h-9 rounded-lg shadow transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            )}
          </div>
        </div>

        <div id="testStatsGrid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Time Left</span>
            <div className="text-2xl font-black text-blue-600 mt-0.5">{formatTime(testTimeRemaining)}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Speed (WPM)</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{liveStats.netWpm}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Accuracy</span>
            <div className="text-2xl font-black text-green-600 mt-0.5">{liveStats.accuracy}%</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Errors</span>
            <div className="text-2xl font-black text-red-600 mt-0.5">{liveStats.errors}</div>
          </div>
        </div>

        <div
          id="testParagraphBox"
          className="bg-slate-100 border border-slate-300 rounded-xl p-5 max-h-96 overflow-y-auto font-mono text-lg text-slate-700 leading-relaxed custom-scrollbar select-none mb-4"
        >
          {testParagraph.split("").map((ch, i) => {
            let cls = "text-slate-700";
            if (i < typedInput.length) {
              cls = typedInput[i] === ch ? "text-emerald-700 font-bold bg-emerald-100" : "text-red-700 font-bold bg-red-100";
            } else if (i === typedInput.length) {
              cls = "bg-amber-300 animate-pulse text-black font-bold";
            }
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            );
          })}
        </div>

        <div className="shrink-0">
          <textarea
            ref={testInputRef}
            id="testInputArea"
            rows={3}
            value={typedInput}
            onChange={(e) => {
              if (!testStarted) {
                startTypingTest(true);
              }
              setTypedInput(e.target.value);
            }}
            disabled={!testStarted && typedInput.length > 0 && testTimeRemaining === 0}
            placeholder="Click here and start typing the above paragraph..."
            className="w-full bg-white border border-slate-300 rounded-xl p-4 font-mono text-lg text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar resize-y"
          ></textarea>
        </div>

        <div className="flex justify-between items-center mt-3 shrink-0">
          <span className="text-sm font-semibold text-amber-600">{testStatusMsg}</span>
          <div className="flex items-center gap-2">
            {testStarted && (
              <button
                onClick={finishTypingTest}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition"
              >
                Finish &amp; View Result
              </button>
            )}
            {!testStarted && (
              <button
                onClick={() => startTypingTest()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
              >
                Start Test
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TypingTestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Typing Test...</div>}>
      <TypingTestContent />
    </Suspense>
  );
}

