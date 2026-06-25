'use client';

import React from 'react';
import { Tile } from '@/lib/mahjongTypes';

interface MahjongTileProps {
  tile: Tile;
  className?: string;
  isWait?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isDrawn?: boolean;
}

export default function MahjongTile({
  tile,
  className = '',
  isWait,
  onClick,
  disabled,
  isDrawn,
}: MahjongTileProps) {
  const sharedClasses = `relative bg-white overflow-hidden ${className}`;

  const imgClasses = `w-full h-full object-contain ${
    isWait
      ? 'ring-2 md:ring-6 ring-blue-500 shadow-blue-500/80 shadow-md md:shadow-3xl'
      : ''
  }`;

  const img = (
    <img
      src={`/tiles/${tile.suit}${tile.value}.svg`}
      className={imgClasses}
      alt={`${tile.suit}${tile.value}`}
    />
  );

  const watermark = (
    <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[12px] text-gray-300 pointer-events-none uppercase opacity-15 font-black tracking-widest italic">
      {tile.suit}{tile.value}
    </span>
  );

  const pingDot = isDrawn ? (
    <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-yellow-400 w-4 h-4 md:w-9 md:h-9 rounded-full border-2 md:border-3 border-white animate-ping" />
  ) : null;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${sharedClasses} transition-all duration-300 ${
          disabled ? 'opacity-80 grayscale-[0.4]' : ''
        }`}
      >
        {img}
        {watermark}
        {pingDot}
      </button>
    );
  }

  return (
    <div className={sharedClasses}>
      {img}
      {watermark}
      {pingDot}
    </div>
  );
}
