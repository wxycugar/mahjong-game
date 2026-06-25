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
    <div className="fixed inset-0 bg-black/99 flex flex-col items-center justify-center z-[999] backdrop-blur-3xl animate-in fade-in duration-1000 px-4">
      <h2 className="text-[4rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-800 italic leading-none animate-in zoom-in duration-1000 tracking-tighter drop-shadow-[0_0_40px_rgba(249,115,22,0.6)] md:drop-shadow-[0_0_120px_rgba(249,115,22,0.6)]">
        {gameState === 'won' ? '和了' : gameState === 'draw' ? '流局' : '败北'}
      </h2>
      <div className="text-center mb-8 md:mb-32 px-4 md:px-16">
        {gameState === 'won' && (
          <div className="bg-white/5 border border-white/10 px-4 md:px-24 py-4 md:py-12 rounded-2xl md:rounded-[5rem] shadow-2xl backdrop-blur-md inline-block">
            <span className="text-yellow-500 font-black text-3xl md:text-8xl italic mr-2 md:mr-12 underline decoration-yellow-500/15">
              {finalStats.han} 番
            </span>
            <span className="text-slate-800 text-xl md:text-6xl mx-2 md:mx-12 font-thin">|</span>
            <span className="text-emerald-400 text-lg md:text-5xl font-bold tracking-[0.1em] md:tracking-[0.3em] uppercase">
              {finalStats.winType} +{finalStats.doraCount}
            </span>
            {finalStats.yakuList.length > 0 && (
              <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-4">
                {finalStats.yakuList.map((yaku, idx) => (
                  <span key={idx} className="bg-emerald-900/60 border border-emerald-500/40 px-2 md:px-5 py-1 md:py-2 rounded-lg md:rounded-xl text-emerald-300 text-xs md:text-xl font-bold tracking-wider">
                    {yaku}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={onNewGame}
        className="bg-white text-black px-10 md:px-40 py-6 md:py-14 rounded-2xl md:rounded-full font-black text-2xl md:text-7xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] md:shadow-[0_0_120px_rgba(255,255,255,0.4)] group relative overflow-hidden"
      >
        <span className="relative z-10 tracking-[0.2em] md:tracking-[0.4em]">TRY AGAIN</span>
        <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-1000 opacity-20" />
      </button>
    </div>
  );
}