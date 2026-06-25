'use client';

import React from 'react';
import { Tile, GamePhase } from '@/lib/mahjongTypes';
import OpponentHands from './OpponentHands';
import DiscardPile from './DiscardPile';
import ActionBar from './ActionBar';
import HandTiles from './HandTiles';

interface MahjongTableProps {
  aiHands: Tile[][];
  discards: Tile[];
  canRon: boolean;
  canPon: boolean;
  canKan: boolean;
  canTsumo: boolean;
  playerHand: Tile[];
  playerMelds: Tile[][];
  drawnTile: Tile | null;
  hints: Record<string, string[]>;
  canDiscard: boolean;
  isAiProcessing: boolean;
  gameState: GamePhase;
  onRon: () => void;
  onPon: () => void;
  onKan: () => void;
  onTsumo: () => void;
  onDiscard: (tile: Tile, index?: number) => void;
  onDraw: () => void;
}

export default function MahjongTable({
  aiHands,
  discards,
  canRon,
  canPon,
  canKan,
  canTsumo,
  playerHand,
  playerMelds,
  drawnTile,
  hints,
  canDiscard,
  isAiProcessing,
  gameState,
  onRon,
  onPon,
  onKan,
  onTsumo,
  onDiscard,
  onDraw,
}: MahjongTableProps) {
  return (
    <div className="relative w-full max-w-6xl flex-1 flex flex-col bg-gradient-to-br from-[#1b4332] via-[#081c15] to-[#010c08] rounded-[3rem] md:rounded-[6rem] border-[10px] md:border-[22px] border-[#0a0f0d] shadow-[0_80px_150px_-20px_rgba(0,0,0,1)] p-2 md:p-12 pb-[40px] md:pb-12 overflow-hidden border-double">
      <OpponentHands aiHands={aiHands} />
      <DiscardPile discards={discards} />

      <ActionBar
        canRon={canRon}
        canPon={canPon}
        canKan={canKan}
        canTsumo={canTsumo}
        onRon={onRon}
        onPon={onPon}
        onKan={onKan}
        onTsumo={onTsumo}
      />

      <HandTiles
        playerHand={playerHand}
        playerMelds={playerMelds}
        drawnTile={drawnTile}
        hints={hints}
        canDiscard={canDiscard}
        isAiProcessing={isAiProcessing}
        gameState={gameState}
        onDiscard={onDiscard}
        onDraw={onDraw}
      />
    </div>
  );
}