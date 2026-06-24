'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';

interface DiscardPileProps {
  discards: Tile[];
}

export default function DiscardPile({ discards }: DiscardPileProps) {
  return (
    <div className="flex-1 flex justify-center items-center py-2 md:py-6 z-10 relative">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-1 md:gap-x-4 md:gap-y-4 p-2 md:p-10 bg-black/40 rounded-xl md:rounded-[4.5rem] border border-white/10 max-h-[120px] md:max-h-[280px] overflow-y-auto custom-scrollbar shadow-inner">
        {discards.map((tile) => (
          <div
            key={tile.id}
            className="w-7 h-9 md:w-11 md:h-14 bg-white border-b-[2px] md:border-b-[5px] border-gray-400 rounded md:rounded shadow-md md:shadow-2xl transform hover:scale-110 transition-all cursor-help"
          >
            <img
              src={`/tiles/${tile.suit}${tile.value}.svg`}
              className="w-full h-auto p-0.5 md:p-1.5"
              alt="discard"
            />
          </div>
        ))}
      </div>
    </div>
  );
}