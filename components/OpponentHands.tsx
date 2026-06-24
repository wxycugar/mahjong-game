'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';

interface OpponentHandsProps {
  aiHands: Tile[][];
}

export default function OpponentHands({ aiHands }: OpponentHandsProps) {
  return (
    <>
      {/* AI 对手扣牌实体 - 顶部 */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full">
        <span className="text-[11px] font-black text-emerald-50 uppercase italic opacity-20 tracking-[1.1em] text-center w-full">
          Opponent Top
        </span>
        <div className="flex -space-x-1.5">
          {aiHands[1].map((_, idx) => (
            <div
              key={`at-${idx}`}
              className="w-8 h-12 bg-emerald-950 border border-emerald-800/30 rounded shadow-inner"
            />
          ))}
        </div>
      </div>

      {/* AI 对手扣牌实体 - 左侧 */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 rotate-90 opacity-20">
        <div className="flex -space-x-1.5">
          {aiHands[0].map((_, idx) => (
            <div
              key={`al-${idx}`}
              className="w-7 h-10 bg-emerald-950 border border-emerald-800/30 rounded shadow-inner"
            />
          ))}
        </div>
      </div>

      {/* AI 对手扣牌实体 - 右侧 */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 -rotate-90 opacity-20">
        <div className="flex -space-x-1.5">
          {aiHands[2].map((_, idx) => (
            <div
              key={`ar-${idx}`}
              className="w-7 h-10 bg-emerald-950 border border-emerald-800/30 rounded shadow-inner"
            />
          ))}
        </div>
      </div>
    </>
  );
}