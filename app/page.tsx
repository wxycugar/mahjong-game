'use client';

import GameHeader from '@/components/GameHeader';
import MahjongTable from '@/components/MahjongTable';
import GameOverOverlay from '@/components/GameOverOverlay';
import useMahjongGame from '@/hooks/useMahjongGame';

export default function MahjongGame() {
  const game = useMahjongGame();

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center bg-[#040608] text-white font-sans select-none relative">
      <GameHeader
        statusLog={game.statusLog}
        deckSize={game.deckSize}
        handSize={game.handSize}
        doraIndicator={game.doraIndicator}
        onNewGame={game.handleGameInit}
      />

      <MahjongTable
        aiHands={game.aiHands}
        discards={game.discards}
        canRon={game.derivedCanRon}
        canPon={game.derivedCanPon}
        canKan={game.derivedCanKan}
        canTsumo={game.derivedCanTsumo}
        playerHand={game.playerHand}
        playerMelds={game.playerMelds}
        drawnTile={game.drawnTile}
        hints={game.hints}
        canDiscard={game.canPlayerCurrentlyDiscard}
        isAiProcessing={game.isAiProcessing}
        gameState={game.gameState}
        onRon={game.handleRonAction}
        onPon={game.handlePonClick}
        onKan={game.handleKanAction}
        onTsumo={game.handleTsumoAction}
        onDiscard={game.handleUserDiscard}
        onDraw={game.handleUserDraw}
      />

      <GameOverOverlay
        gameState={game.gameState}
        finalStats={game.finalStats}
        onNewGame={game.handleGameInit}
      />
      </main>
  );
}
