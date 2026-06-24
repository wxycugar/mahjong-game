'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';

interface ActionBarProps {
  canRon: boolean;
  canPon: boolean;
  canTsumo: boolean;
  onRon: () => void;
  onPon: () => void;
  onTsumo: () => void;
}

export default function ActionBar({ canRon, canPon, canTsumo, onRon, onPon, onTsumo }: ActionBarProps) {
  return (
    <div className="min-h-16 md:h-24 flex flex-wrap justify-center items-center gap-2 md:gap-10 mb-2 md:mb-4 z-[300] relative px-2 md:px-0">
      {canRon && (
        <button
          onClick={onRon}
          className="w-full md:w-auto bg-orange-600 hover:bg-orange-500 text-white px-4 md:px-32 py-4 md:py-6 rounded-2xl md:rounded-full font-black animate-bounce shadow-[0_0_40px_rgba(234,88,12,1)] md:shadow-[0_0_120px_rgba(234,88,12,1)] border-2 md:border-4 border-white text-lg md:text-3xl uppercase z-[400]"
        >
          荣和 (胡!)
        </button>
      )}
      {canPon && (
        <button
          onClick={onPon}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 md:px-28 py-4 md:py-5 rounded-2xl md:rounded-full font-black animate-pulse shadow-[0_0_30px_rgba(37,99,235,1)] md:shadow-[0_0_80px_rgba(37,99,235,1)] border-2 md:border-2 border-white/40 text-lg md:text-3xl uppercase"
        >
          碰 (PON!)
        </button>
      )}
      {canTsumo && (
        <button
          onClick={onTsumo}
          className="w-full md:w-auto bg-orange-500 hover:bg-orange-400 text-white px-4 md:px-32 py-4 md:py-6 rounded-2xl md:rounded-full font-black animate-bounce shadow-[0_0_40px_rgba(249,115,22,1)] md:shadow-[0_0_100px_rgba(249,115,22,1)] border-2 md:border-4 border-white text-lg md:text-3xl uppercase z-[400]"
        >
          自摸 (胡!)
        </button>
      )}
    </div>
  );
}