'use client';

import React from 'react';
import { GamePhase, MatchScoringSummary } from '@/lib/mahjongTypes';

interface GameOverOverlayProps {
  gameState: GamePhase;
  finalStats: MatchScoringSummary;
  onNewGame: () => void;
}

export default function GameOverOverlay({ gameState, finalStats, onNewGame }: GameOverOverlayProps) {
  if (gameState === 'playing' || gameState === 'idle') return null;

  return (
    <div className="fixed inset-0 bg-black/99 flex flex-col items-center justify-center z-[999] backdrop-blur-3xl animate-in fade-in duration-1000">
      <h2 className="text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-800 italic leading-none animate-in zoom-in duration-1000 tracking-tighter drop-shadow-[0_0_120px_rgba(249,115,22,0.6)]">
        {gameState === 'won' ? '和了' : gameState === 'draw' ? '流局' : '败北'}
      </h2>
      <div className="text-center mb-32 px-16">
        {gameState === 'won' && (
          <div className="bg-white/5 border border-white/10 px-24 py-12 rounded-[5rem] shadow-2xl backdrop-blur-md inline-block">
            <span className="text-yellow-500 font-black text-8xl italic mr-12 underline decoration-yellow-500/15">
              {finalStats.han} 番
            </span>
            <span className="text-slate-800 text-6xl mx-12 font-thin">|</span>
            <span className="text-emerald-400 text-5xl font-bold tracking-[0.3em] uppercase">
              {finalStats.winType} +{finalStats.doraCount}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={onNewGame}
        className="bg-white text-black px-40 py-14 rounded-full font-black text-7xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_120px_rgba(255,255,255,0.4)] group relative overflow-hidden"
      >
        <span className="relative z-10 tracking-[0.4em]">TRY AGAIN</span>
        <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-1000 opacity-20" />
      </button>
    </div>
  );
}