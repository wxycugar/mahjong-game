'use client';

import React from 'react';
import { Tile, GamePhase } from '@/lib/mahjongTypes';
import MahjongTile from './MahjongTile';

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
    <div className="relative bottom-0 left-0 w-full shrink-0 pb-2 md:pb-6 pl-0.5 md:px-4">
      {/* 手机端：整个手牌区悬浮在底部，与 melds 一起 */}
      <div className="flex items-end justify-start md:justify-center w-full gap-2 md:gap-6">
        {/* 左侧：副露独立区 */}
        <div className="flex gap-px md:gap-4 pb-0 md:pb-6 min-w-[10px] md:min-w-[150px] items-end shrink-0">
          {playerMelds.map((meld, mi) => (
            <div
              key={`meld-gp-${mi}`}
              className="flex gap-px md:gap-1.5 bg-black/60 p-0.5 md:p-4 rounded-lg md:rounded-[2rem] border border-white/10 shadow-2xl transform rotate-1"
            >
              {meld.map((tile, ti) => (
                  <MahjongTile
                    key={`meld-t-${ti}`}
                    tile={tile}
                    className="w-[clamp(16px,4vw,22px)] md:w-[clamp(28px,2.5vw,48px)] h-auto rounded md:rounded-md border-b-[2px] md:border-b-[4px] border-gray-400 shrink-0 p-0.5 md:p-2"
                  />
                ))}
            </div>
          ))}
        </div>

        {/* 中间容器：手机端大牌横向滑动，桌面端自然平铺 */}
        <div className="flex items-center bg-black/60 md:bg-black/80 p-2 md:p-8 rounded-[2rem] md:rounded-[5rem] border border-white/10 backdrop-blur-3xl shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] w-full md:max-w-none flex-1 md:flex-initial pl-1 pr-1 md:px-0">
          <div className="grid grid-cols-6 gap-x-1 gap-y-1 justify-items-start md:flex md:flex-nowrap md:w-auto md:justify-center md:mx-auto">
            {/* 13 张主手牌物理阵列 */}
            {playerHand.map((tile, i) => {
              const waitList = hints[tile.id];
              const isActionable = canDiscard && !isAiProcessing;
              return (
                <div
                  key={`pedestal-${tile.id}`}
                  className={`relative flex-shrink-0 w-[46px] md:w-auto ${isActionable ? 'md:min-w-[clamp(28px,2.8vw,56px)]' : 'md:min-w-[clamp(28px,2.8vw,56px)]'} h-[64px] md:h-28 group`}
                >
                  {waitList && (
                    <div className="absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 bg-blue-600 text-[7px] md:text-[10px] px-1 md:px-4 py-0.5 md:py-1.5 rounded md:rounded-xl shadow-2xl animate-pulse whitespace-nowrap z-[310] border border-white/30 font-black leading-tight">
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
                  <MahjongTile
                    tile={tile}
                    isWait={!!waitList}
                    onClick={() => onDiscard(tile, i)}
                    disabled={!isActionable}
                    className={`absolute bottom-0 left-0 w-full border-b-[4px] md:border-b-[7px] border-gray-400 rounded-lg md:rounded-xl shadow-2xl ${
                      isActionable
                        ? 'active:scale-95 md:group-hover:-translate-y-16 md:cursor-pointer'
                        : 'opacity-80 grayscale-[0.4]'
                    }`}
                  />
                </div>
              );
            })}

            {/* 间距 */}
            <div className="w-3 md:w-10 shrink-0" />

            {/* 摸到的牌 / Draw 按钮 */}
            <div className="flex-shrink-0 w-[46px] md:w-[clamp(32px,2.9vw,62px)] h-[64px] md:h-28 relative group">
              {drawnTile ? (
                <div className="w-full h-full relative">
                  {hints[drawnTile.id] && (
                    <div className="absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] md:text-[12px] px-2 md:px-6 py-1 md:py-2.5 rounded-lg md:rounded-2xl shadow-2xl animate-pulse z-[310] border border-white/30 font-black uppercase whitespace-nowrap">
                      TENPAI!
                    </div>
                  )}
                  <MahjongTile
                    tile={drawnTile}
                    isDrawn
                    isWait={!!hints[drawnTile.id]}
                    onClick={() => onDiscard(drawnTile)}
                    disabled={isAiProcessing}
                    className="absolute bottom-0 left-0 w-full border-b-[4px] md:border-b-[7px] border-yellow-500 rounded-lg md:rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.8)] md:shadow-[0_0_100px_rgba(234,179,8,0.8)] transition-all z-10"
                  />
                </div>
              ) : (
                gameState === 'playing' && !canDiscard && (
                  <button
                    onClick={onDraw}
                    disabled={isAiProcessing}
                    className="absolute bottom-0 left-0 w-full aspect-[3/4] border-[4px] md:border-[8px] border-dashed border-emerald-400/20 rounded-lg md:rounded-[3rem] flex items-center justify-center group hover:bg-emerald-400/10 transition-all shadow-inner"
                  >
                    <span className="text-[10px] md:text-sm text-emerald-400/40 font-black vertical-text uppercase tracking-widest">
                      Draw
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* 右侧平衡占位符 - 桌面端保留 */}
        <div className="hidden md:block flex-none md:flex-1 min-w-0 md:min-w-[150px]" />
      </div>
    </div>
  );
}