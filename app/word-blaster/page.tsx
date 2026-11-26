"use client";

import React, { useMemo, useState } from "react";

export default function WordBlasterPage() {
  const gameWordsList = useMemo(
    () => [
      "KEYBOARD", "SPEED", "ACCURACY", "PRACTICE", "EXAM", "SUCCESS", "PYTHON", "REACT",
      "TYPING", "MASTER", "DEVELOP", "FUTURE", "LEARN", "DIGITAL", "OFFICE"
    ],
    []
  );
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameMissed, setGameMissed] = useState<number>(0);
  const [targetWord, setTargetWord] = useState<string>("READY?");
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameInput, setGameInput] = useState<string>("");

  const startWordGame = () => {
    setGameScore(0);
    setGameMissed(0);
    setGameActive(true);
    setGameInput("");
    const randomIndex = Math.floor(Math.random() * gameWordsList.length);
    setTargetWord(gameWordsList[randomIndex]);
  };

  const handleWordGameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedVal = e.target.value.trim().toUpperCase();
    setGameInput(e.target.value);
    if (typedVal === targetWord) {
      setGameScore((prev) => prev + 10);
      setGameInput("");
      const randomIndex = Math.floor(Math.random() * gameWordsList.length);
      setTargetWord(gameWordsList[randomIndex]);
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
        <div>
          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Arcade Typing Game
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">Word Blaster Typing Challenge</h2>
          <p className="text-sm text-slate-600 mt-1">
            Type the falling words correctly before they hit the bottom line to score points!
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl h-96 relative overflow-hidden flex flex-col items-center justify-between p-6 border-4 border-slate-800 shadow-inner">
          {!gameActive && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
              <div className="text-amber-400 text-5xl font-black">WORD BLASTER</div>
              <p className="text-slate-300 text-sm max-w-md">
                Improve your typing speed and reflexes with this fast-paced word game!
              </p>
              <button
                onClick={startWordGame}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-xl shadow-lg transition text-lg"
              >
                <i className="fa-solid fa-play mr-2"></i> Start Game
              </button>
            </div>
          )}

          <div className="w-full flex justify-between text-white font-bold text-base z-10">
            <span>
              Score: <span className="text-amber-400">{gameScore}</span>
            </span>
            <span>
              Missed: <span className="text-red-400">{gameMissed} / 5</span>
            </span>
          </div>

          <div className="my-auto text-center space-y-2 z-10">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Target Word</span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-wider">
              {targetWord}
            </div>
          </div>

          <div className="w-full max-w-md z-10">
            <input
              type="text"
              value={gameInput}
              onChange={handleWordGameInput}
              disabled={!gameActive}
              placeholder="Type word and press space/enter..."
              className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-xl p-3 text-center font-mono text-lg font-bold uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

