'use client';

import React from 'react';
import { Tile, GamePhase } from '@/lib/mahjongTypes';

interface HandTilesProps {
  playerHand: Tile[];
  playerMelds: Tile[][];
  drawnTile: Tile | null;
  hints: Record<string, string[]>;
  canDiscard: boolean;
  isAiProcessing: boolean;
  gameState: GamePhase;
  onDiscard: (tile: Tile, index?: number) => void;
  onDraw: () => void;
}

export default function HandTiles({
  playerHand,
  playerMelds,
  drawnTile,
  hints,
  canDiscard,
  isAiProcessing,
  gameState,
  onDiscard,
  onDraw,
}: HandTilesProps) {
  return (
    <div className="w-full flex items-end justify-center px-4 gap-6 z-[250] pb-6 relative h-[150px]">
      {/* 左侧：副露独立区 */}
      <div className="flex gap-4 pb-6 min-w-[150px]">
        {playerMelds.map((meld, mi) => (
          <div
            key={`meld-gp-${mi}`}
            className="flex gap-1.5 bg-black/60 p-4 rounded-[2rem] border border-white/10 shadow-2xl transform rotate-1"
          >
            {meld.map((tile, ti) => (
              <div
                key={`meld-t-${ti}`}
                className="w-[clamp(28px,2.5vw,48px)] h-auto bg-white rounded-md overflow-hidden border-b-[4px] border-gray-400 shrink-0"
              >
                <img
                  src={`/tiles/${tile.suit}${tile.value}.svg`}
                  className="w-full h-full p-2"
                  alt="meld"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 中间容器：网格等比缩放系统 */}
      <div className="flex items-end bg-black/80 p-8 rounded-[5rem] border border-white/10 backdrop-blur-3xl shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] max-w-full">
        <div className="flex gap-1 items-end overflow-visible flex-nowrap">
          {/* 13 张主手牌物理阵列：引入物理包装感应底座 */}
          {playerHand.map((tile, i) => {
            const waitList = hints[tile.id];
            const isActionable = canDiscard && !isAiProcessing;
            return (
              <div
                key={`pedestal-${tile.id}`}
                className="relative h-28 w-[clamp(28px,2.8vw,56px)] shrink group"
              >
                {waitList && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] px-4 py-1.5 rounded-xl shadow-2xl animate-pulse whitespace-nowrap z-[310] border border-white/30 font-black">
                    听:{' '}
                    {waitList
                      .map((w) =>
                        w
                          .replace('m', '万')
                          .replace('p', '筒')
                          .replace('s', '条')
                          .replace('z', '')
                      )
                      .join(' ')}
                  </div>
                )}
                <button
                  onClick={() => onDiscard(tile, i)}
                  disabled={!isActionable}
                  className={`absolute bottom-0 left-0 w-full bg-white border-b-[7px] border-gray-400 rounded-xl shadow-2xl transition-all duration-300 ${
                    isActionable
                      ? 'group-hover:-translate-y-16 cursor-pointer active:scale-95'
                      : 'opacity-80 grayscale-[0.4]'
                  }`}
                >
                  <img
                    src={`/tiles/${tile.suit}${tile.value}.svg`}
                    className={`w-full h-auto p-2 ${
                      waitList
                        ? 'ring-6 ring-blue-500 rounded-lg shadow-blue-500/80 shadow-3xl'
                        : ''
                    }`}
                    alt="hand"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[12px] text-gray-300 pointer-events-none uppercase opacity-15 font-black tracking-widest italic">
                    {tile.suit}
                    {tile.value}
                  </span>
                </button>
              </div>
            );
          })}

          {/* 精准 40px 物理隔离 */}
          <div className="w-10 shrink-0" />

          <div className="w-[clamp(32px,2.9vw,62px)] h-28 shrink-0 relative group">
            {drawnTile ? (
              <div className="w-full h-full relative">
                {hints[drawnTile.id] && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-600 text-[12px] px-6 py-2.5 rounded-2xl shadow-2xl animate-pulse z-[310] border border-white/30 font-black uppercase">
                    TENPAI!
                  </div>
                )}
                <button
                  onClick={() => onDiscard(drawnTile)}
                  disabled={isAiProcessing}
                  className="absolute bottom-0 left-0 w-full bg-white border-b-[7px] border-yellow-500 rounded-xl shadow-[0_0_100px_rgba(234,179,8,0.8)] group-hover:-translate-y-16 transition-all relative z-10"
                >
                  <img
                    src={`/tiles/${drawnTile.suit}${drawnTile.value}.svg`}
                    className="w-full h-auto p-2.5"
                    alt="drawn"
                  />
                  <div className="absolute -top-4 -right-4 bg-yellow-400 w-9 h-9 rounded-full border-3 border-white animate-ping" />
                </button>
              </div>
            ) : (
              gameState === 'playing' && !canDiscard && (
                <button
                  onClick={onDraw}
                  disabled={isAiProcessing}
                  className="absolute bottom-0 left-0 w-full aspect-[3/4] border-[8px] border-dashed border-emerald-400/20 rounded-[3rem] flex items-center justify-center group hover:bg-emerald-400/10 transition-all shadow-inner"
                >
                  <span className="text-sm text-emerald-400/40 font-black vertical-text uppercase tracking-widest">
                    Draw
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 右侧平衡占位符 */}
      <div className="flex-1 min-w-[150px]" />
    </div>
  );
}