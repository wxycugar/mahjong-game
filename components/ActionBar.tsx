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
    <div className="h-24 flex justify-center items-center gap-14 mb-4 z-[300] relative">
      {canRon && (
        <button
          onClick={onRon}
          className="bg-orange-600 hover:bg-orange-500 text-white px-32 py-6 rounded-full font-black animate-bounce shadow-[0_0_120px_rgba(234,88,12,1)] border-4 border-white text-3xl uppercase z-[400]"
        >
          荣和 (胡!)
        </button>
      )}
      {canPon && (
        <button
          onClick={onPon}
          className="bg-blue-600 hover:bg-blue-500 text-white px-28 py-5 rounded-full font-black animate-pulse shadow-[0_0_80px_rgba(37,99,235,1)] border-2 border-white/40 text-3xl uppercase"
        >
          碰 (PON!)
        </button>
      )}
      {canTsumo && (
        <button
          onClick={onTsumo}
          className="bg-orange-500 hover:bg-orange-400 text-white px-32 py-6 rounded-full font-black animate-bounce shadow-[0_0_100px_rgba(249,115,22,1)] border-4 border-white text-3xl uppercase z-[400]"
        >
          自摸 (胡!)
        </button>
      )}
    </div>
  );
}