'use client';

import React from 'react';
import { GamePhase, MatchScoringSummary, AiWinnerInfo } from '@/lib/mahjongTypes';
import MahjongTile from './MahjongTile';

interface GameOverOverlayProps {
  gameState: GamePhase;
  finalStats: MatchScoringSummary;
  aiWinnerInfo: AiWinnerInfo | null;
  onNewGame: () => void;
}

export default function GameOverOverlay({ gameState, finalStats, aiWinnerInfo, onNewGame }: GameOverOverlayProps) {
  if (gameState === 'playing' || gameState === 'idle') return null;

  const isPlayerWon = gameState === 'won';
  const isDraw = gameState === 'draw';
  const isAiWon = gameState === 'ai_won';

  return (
    <div className="fixed inset-0 bg-black/99 flex flex-col items-center justify-center z-[999] backdrop-blur-3xl animate-in fade-in duration-1000 px-4">
      <h2 className="text-[4rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-800 italic leading-none animate-in zoom-in duration-1000 tracking-tighter drop-shadow-[0_0_40px_rgba(249,115,22,0.6)] md:drop-shadow-[0_0_120px_rgba(249,115,22,0.6)]">
        {isPlayerWon ? '和了' : isDraw ? '流局' : `${aiWinnerInfo ? `AI ${aiWinnerInfo.index + 1}` : ''} 和了`}
      </h2>

      <div className="text-center mb-4 md:mb-16 px-4 md:px-16 w-full max-w-5xl">
        {/* 玩家胜利 */}
        {isPlayerWon && (
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

        {/* AI 胜利 — 透明公开赢家手牌与计番 */}
        {isAiWon && aiWinnerInfo && (
          <div className="flex flex-col items-center gap-4 md:gap-8 w-full">
            {/* 副露区 */}
            {aiWinnerInfo.melds.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {aiWinnerInfo.melds.map((meld, mi) => (
                  <div key={`aw-meld-${mi}`} className="flex gap-0.5 md:gap-1.5 bg-white/5 p-1 md:p-3 rounded-xl md:rounded-[2rem] border border-white/10">
                    {meld.map((t, ti) => (
                      <MahjongTile
                        key={`aw-mt-${ti}`}
                        tile={t}
                        className="w-6 h-8 md:w-10 md:h-14 border-b-[2px] md:border-b-[4px] border-gray-400 rounded md:rounded-md shrink-0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* 手牌 14 张 */}
            <div className="flex flex-wrap justify-center gap-0.5 md:gap-2 bg-black/40 p-2 md:p-6 rounded-2xl md:rounded-[4rem] border border-white/10">
              {aiWinnerInfo.hand.map((t, idx) => (
                <MahjongTile
                  key={`aw-tile-${idx}`}
                  tile={t}
                  className="w-7 h-9 md:w-12 md:h-[4.5rem] border-b-[2px] md:border-b-[5px] border-gray-400 rounded md:rounded-lg shadow-md shrink-0"
                />
              ))}
            </div>

            {/* 计番明细 */}
            <div className="bg-white/5 border border-white/10 px-4 md:px-16 py-3 md:py-8 rounded-2xl md:rounded-[3rem] shadow-2xl backdrop-blur-md inline-block">
              <div className="flex items-center justify-center gap-2 md:gap-8 mb-2 md:mb-4">
                <span className="text-yellow-500 font-black text-2xl md:text-7xl italic underline decoration-yellow-500/15">
                  {aiWinnerInfo.yakuResult.totalHan + aiWinnerInfo.doraCount} 番
                </span>
                <span className="text-slate-700 text-lg md:text-5xl font-thin">|</span>
                <span className="text-emerald-400 text-base md:text-4xl font-bold tracking-wider uppercase">
                  {aiWinnerInfo.winType} +{aiWinnerInfo.doraCount}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-3">
                {aiWinnerInfo.yakuResult.yakuList.map((yaku, idx) => (
                  <span key={idx} className="bg-red-950/60 border border-red-500/40 px-2 md:px-4 py-0.5 md:py-1.5 rounded-lg md:rounded-xl text-red-300 text-[10px] md:text-xl font-bold tracking-wider">
                    {yaku}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 流局 */}
        {isDraw && (
          <div className="bg-white/5 border border-white/10 px-4 md:px-24 py-4 md:py-12 rounded-2xl md:rounded-[5rem] shadow-2xl backdrop-blur-md inline-block">
            <span className="text-slate-400 text-xl md:text-4xl font-thin tracking-[0.2em]">NO WINNER</span>
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