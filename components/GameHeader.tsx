'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';

interface GameHeaderProps {
  statusLog: string;
  deckSize: number;
  handSize: number;
  doraIndicator: Tile | null;
  onNewGame: () => void;
}

export default function GameHeader({ statusLog, deckSize, handSize, doraIndicator, onNewGame }: GameHeaderProps) {
  return (
    <div className="w-full max-w-6xl flex justify-between items-end mb-4 px-8 bg-slate-900/90 p-6 rounded-[2.5rem] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,1)] backdrop-blur-2xl relative z-[100]">
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-emerald-400 italic tracking-tighter uppercase drop-shadow-[0_4px_12px_rgba(16,185,129,0.5)]">{statusLog}</h1>
        <div className="flex gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="bg-black/60 px-6 py-2.5 rounded-full border border-white/5 shadow-inner">
            牌墙余量: <span className="text-white font-mono text-lg ml-2">{deckSize}</span>
          </div>
          <div className="bg-black/60 px-6 py-2.5 rounded-full border border-white/5 text-emerald-500 shadow-inner">
            当前牌数: {handSize} / 14
          </div>
        </div>
      </div>

      {/* Dora Indicator */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-yellow-500 font-black mb-2 uppercase tracking-[0.4em] opacity-60 text-center">
          Dora Indicator
        </span>
        <div className="flex gap-2.5 bg-black/80 p-3.5 rounded-2xl border border-yellow-600/40 shadow-2xl">
          <div className="w-10 h-14 bg-white rounded-lg overflow-hidden border border-gray-300 shadow-xl transform hover:scale-105 transition-all">
            {doraIndicator && (
              <img
                src={`/tiles/${doraIndicator.suit}${doraIndicator.value}.svg`}
                className="w-full h-full p-1"
                alt="dora"
              />
            )}
          </div>
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={`dback-${idx}`}
              className="w-10 h-14 bg-emerald-950/80 rounded-lg border border-emerald-800/40 flex items-center justify-center text-[10px] font-black text-emerald-800/40 shadow-inner"
            >
              裏
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNewGame}
        className="bg-emerald-600 hover:bg-emerald-500 px-16 py-5 rounded-[2.2rem] font-black shadow-2xl active:scale-90 transition-all text-sm uppercase border-b-4 border-emerald-950"
      >
        New Game
      </button>
    </div>
  );
}