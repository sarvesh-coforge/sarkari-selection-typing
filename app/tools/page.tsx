"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppShell } from "@/components/AppShell";
import { ToolType } from "@/lib/typingData";

function ToolsContent() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool") as ToolType | null;
  const { triggerToast } = useAppShell();

  const [selectedTool, setSelectedTool] = useState<ToolType>("converter");
  const [inputKrutiText, setInputKrutiText] = useState<string>("");
  const [outputUnicodeText, setOutputUnicodeText] = useState<string>("");
  const [virtualKeyInput, setVirtualKeyInput] = useState<string>("");
  const [sourceTransText, setSourceTransText] = useState<string>("");
  const [outputTransText, setOutputTransText] = useState<string>("");

  useEffect(() => {
    if (toolParam && ["converter", "keyboard", "translator"].includes(toolParam)) {
      setSelectedTool(toolParam);
    }
  }, [toolParam]);

  const convertFontText = () => {
    const converted = inputKrutiText
      .replace(/d{k/g, "दक्ष")
      .replace(/Hkkjr/g, "भारत")
      .replace(/Ldwy/g, "स्कूल");
    setOutputUnicodeText(converted || "Converted Unicode Output: " + inputKrutiText);
  };

  const copyConvertedText = () => {
    navigator.clipboard.writeText(outputUnicodeText);
    triggerToast("Converted text copied to clipboard!");
  };

  const performTranslation = () => {
    setOutputTransText(sourceTransText ? "हिंदी अनुवाद: " + sourceTransText : "Please enter text to translate.");
  };

  return (
    <section className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setSelectedTool("converter")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              selectedTool === "converter" ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <i className="fa-solid fa-font mr-1.5"></i> Krutidev to Unicode
          </button>
          <button
            onClick={() => setSelectedTool("keyboard")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              selectedTool === "keyboard" ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <i className="fa-solid fa-keyboard mr-1.5"></i> Virtual Keyboard
          </button>
          <button
            onClick={() => setSelectedTool("translator")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              selectedTool === "translator" ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <i className="fa-solid fa-language mr-1.5"></i> Language Translator
          </button>
        </div>

        {selectedTool === "converter" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">KrutiDev / Chanakya to Unicode Converter</h3>
            <p className="text-sm text-slate-600">
              Convert legacy Hindi font text instantly into modern standard Unicode (Mangal) format.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Input KrutiDev Text</label>
                <textarea
                  value={inputKrutiText}
                  onChange={(e) => setInputKrutiText(e.target.value)}
                  placeholder="Paste KrutiDev text here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-sm h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Converted Unicode (Mangal)</label>
                <textarea
                  value={outputUnicodeText}
                  readOnly
                  placeholder="Unicode output appears here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-sm h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={convertFontText}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
              >
                Convert Now
              </button>
              <button
                onClick={copyConvertedText}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5 rounded-xl transition"
              >
                Copy Result
              </button>
            </div>
          </div>
        )}

        {selectedTool === "keyboard" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Online Multilingual Virtual Keyboard</h3>
            <p className="text-sm text-slate-600">
              Type in regional Indian languages directly using mouse clicks or your physical keyboard.
            </p>
            <textarea
              value={virtualKeyInput}
              onChange={(e) => setVirtualKeyInput(e.target.value)}
              placeholder="Click virtual keys below to type..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 grid grid-cols-10 gap-2 text-center font-bold">
              {["क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ"].map((k) => (
                <button
                  key={k}
                  onClick={() => setVirtualKeyInput((prev) => prev + k)}
                  className="bg-white p-3 rounded shadow hover:bg-blue-50 border"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTool === "translator" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Instant Language Translator</h3>
            <p className="text-sm text-slate-600">
              Translate sentences between English and Indian regional languages effortlessly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Source Text (English)</label>
                <textarea
                  value={sourceTransText}
                  onChange={(e) => setSourceTransText(e.target.value)}
                  placeholder="Type text to translate..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm h-36 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Translated Output (Hindi / Regional)
                </label>
                <textarea
                  value={outputTransText}
                  readOnly
                  placeholder="Translation appears here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm h-36 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={performTranslation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
              >
                Translate Text
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Tools...</div>}>
      <ToolsContent />
    </Suspense>
  );
}

