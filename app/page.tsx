'use client';

import GameHeader from '@/components/GameHeader';
import MahjongTable from '@/components/MahjongTable';
import GameOverOverlay from '@/components/GameOverOverlay';
import useMahjongGame from '@/hooks/useMahjongGame';

export default function MahjongGame() {
  const game = useMahjongGame();

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center text-white font-sans select-none relative z-0
  before:fixed before:inset-0 before:z-0 before:bg-[url('/bg.webp')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-15 before:pointer-events-none
  after:fixed after:inset-0 after:z-[1] after:bg-gradient-to-b after:from-[#040608]/95 after:via-[#040608]/85 after:to-[#040608]/95 after:pointer-events-none">
    {/* Content sits above the fixed overlays */}
    <div className="relative z-10 w-full flex flex-col items-center min-h-screen px-1 md:px-4">
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
        aiWinnerInfo={game.aiWinnerInfo}
        onNewGame={game.handleGameInit}
      />
      </div>
      </main>
  );
}
