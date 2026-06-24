'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';
import FullscreenToggle from './FullscreenToggle';

interface GameHeaderProps {
  statusLog: string;
  deckSize: number;
  handSize: number;
  doraIndicator: Tile | null;
  onNewGame: () => void;
}

export default function GameHeader({ statusLog, deckSize, handSize, doraIndicator, onNewGame }: GameHeaderProps) {
  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-end mb-2 md:mb-4 px-3 md:px-8 py-3 md:p-6 bg-slate-900/90 rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,1)] backdrop-blur-2xl relative z-[100] gap-2 md:gap-0 landscape:flex-row landscape:h-14 landscape:py-1 landscape:px-2 landscape:gap-1 landscape:scale-75 landscape:origin-top">
      <FullscreenToggle />
      {/* Top row on mobile: status + new game */}
      <div className="w-full flex flex-row items-center justify-between md:flex-col md:items-start md:space-y-4 gap-2">
        <h1 className="text-xs md:text-3xl font-black text-emerald-400 italic tracking-tighter uppercase drop-shadow-[0_4px_12px_rgba(16,185,129,0.5)] truncate max-w-[50vw] md:max-w-none">{statusLog}</h1>
        <div className="flex gap-2 md:gap-6 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="bg-black/60 px-2 md:px-6 py-1 md:py-2.5 rounded-full border border-white/5 shadow-inner whitespace-nowrap">
            牌墙: <span className="text-white font-mono text-xs md:text-lg ml-1">{deckSize}</span>
          </div>
          <div className="bg-black/60 px-2 md:px-6 py-1 md:py-2.5 rounded-full border border-white/5 text-emerald-500 shadow-inner whitespace-nowrap">
            牌数: {handSize}/14
          </div>
        </div>
        <button
          onClick={onNewGame}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 md:px-16 py-2 md:py-5 rounded-xl md:rounded-[2.2rem] font-black shadow-2xl active:scale-90 transition-all text-[10px] md:text-sm uppercase border-b-2 md:border-b-4 border-emerald-950 shrink-0"
        >
          New Game
        </button>
      </div>

      {/* Dora Indicator - compact row on mobile */}
      <div className="flex flex-row md:flex-col items-center gap-2 md:gap-0">
        <span className="text-[8px] md:text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60 text-center mr-2 md:mr-0 md:mb-2">
          Dora
        </span>
        <div className="flex gap-1 md:gap-2.5 bg-black/80 p-1.5 md:p-3.5 rounded-xl md:rounded-2xl border border-yellow-600/40 shadow-2xl">
          <div className="w-6 h-8 md:w-10 md:h-14 bg-white rounded md:rounded-lg overflow-hidden border border-gray-300 shadow-xl">
            {doraIndicator && (
              <img
                src={`/tiles/${doraIndicator.suit}${doraIndicator.value}.svg`}
                className="w-full h-full p-0.5 md:p-1"
                alt="dora"
              />
            )}
          </div>
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={`dback-${idx}`}
              className="w-5 h-8 md:w-10 md:h-14 bg-emerald-950/80 rounded md:rounded-lg border border-emerald-800/40 flex items-center justify-center text-[6px] md:text-[10px] font-black text-emerald-800/40 shadow-inner"
            >
              裏
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}