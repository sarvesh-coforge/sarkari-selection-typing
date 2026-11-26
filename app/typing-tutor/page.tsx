"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TutorType, tutorLessons } from "@/lib/typingData";

function TypingTutorContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as TutorType | null;

  const [tutorType, setTutorType] = useState<TutorType>("english");
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>(tutorLessons.english[0]);
  const [tutorPrompt, setTutorPrompt] = useState<string>("asdf jkl; asdf jkl; asdf jkl;");
  const [tutorInput, setTutorInput] = useState<string>("");

  useEffect(() => {
    if (typeParam && ["english", "krutidev", "mangal"].includes(typeParam)) {
      setTutorType(typeParam);
      setCurrentLessonTitle(tutorLessons[typeParam][0]);
    }
  }, [typeParam]);

  return (
    <section className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Step-by-Step Typing Tutor</h2>
            <p className="text-sm text-slate-500">
              Master home rows, key combinations, and finger placement technique.
            </p>
          </div>
          <div className="flex gap-2">
            {(["english", "krutidev", "mangal"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTutorType(type);
                  setCurrentLessonTitle(tutorLessons[type][0]);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                  tutorType === type ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type === "english" ? "English Tutor" : type === "krutidev" ? "KrutiDev Hindi" : "Mangal Inscript"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Lesson Library ({tutorType.toUpperCase()})
            </h3>
            <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {tutorLessons[tutorType].map((lesson, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentLessonTitle(lesson);
                    setTutorPrompt(
                      lesson.includes("Home")
                        ? "asdf jkl; asdf jkl; asdf jkl;"
                        : "qwer tyuiop qwer tyuiop qwer tyuiop"
                    );
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    currentLessonTitle === lesson
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-white border border-slate-200 hover:bg-blue-50 text-slate-700"
                  }`}
                >
                  {lesson}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  {currentLessonTitle}
                </span>
                <p className="text-xs text-blue-600 mt-0.5">Keep fingers resting on ASDF and JKL; keys.</p>
              </div>
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Interactive Guide
              </span>
            </div>

            <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 font-mono text-xl tracking-widest text-center text-slate-800 select-none">
              {tutorPrompt}
            </div>

            <textarea
              value={tutorInput}
              onChange={(e) => setTutorInput(e.target.value)}
              placeholder="Click here and practice the lesson..."
              className="w-full bg-white border border-slate-300 rounded-xl p-4 font-mono text-slate-800 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TypingTutorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Typing Tutor...</div>}>
      <TypingTutorContent />
    </Suspense>
  );
}

