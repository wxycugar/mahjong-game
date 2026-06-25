'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';
import MahjongTile from './MahjongTile';

interface DiscardPileProps {
  discards: Tile[];
}

export default function DiscardPile({ discards }: DiscardPileProps) {
  return (
    <div className="flex-1 flex justify-center items-center py-2 md:py-6 z-10 relative min-h-0">
      <div className="flex flex-wrap justify-center gap-1 md:gap-1.5 p-0.5 md:p-10 bg-black/40 rounded-2xl md:rounded-[4.5rem] border border-white/10 max-h-[45vh] md:max-h-[280px] overflow-y-auto custom-scrollbar shadow-inner w-full mx-2 md:mx-0">
        {discards.map((tile) => (
          <MahjongTile
            key={tile.id}
            tile={tile}
            className="w-6 h-8 md:w-11 md:h-14 border-b-[2px] md:border-b-[5px] border-gray-400 rounded md:rounded shadow-md md:shadow-2xl transform hover:scale-110 transition-all cursor-help p-0.5 md:p-1.5"
          />
        ))}
      </div>
    </div>
  );
}