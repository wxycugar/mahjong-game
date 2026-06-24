'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';

interface DiscardPileProps {
  discards: Tile[];
}

export default function DiscardPile({ discards }: DiscardPileProps) {
  return (
    <div className="flex-1 flex justify-center items-center py-6 z-10 relative">
      <div className="grid grid-cols-6 gap-x-4 gap-y-4 p-10 bg-black/40 rounded-[4.5rem] border border-white/10 max-h-[280px] overflow-y-auto custom-scrollbar shadow-inner">
        {discards.map((tile) => (
          <div
            key={tile.id}
            className="w-11 h-14 bg-white border-b-[5px] border-gray-400 rounded shadow-2xl transform hover:scale-110 transition-all cursor-help"
          >
            <img
              src={`/tiles/${tile.suit}${tile.value}.svg`}
              className="w-full h-auto p-1.5"
              alt="discard"
            />
          </div>
        ))}
      </div>
    </div>
  );
}