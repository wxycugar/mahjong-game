'use client';

import { useState, useCallback } from 'react';
import { Tile, GamePhase, MatchScoringSummary, MASTER_METADATA_CENTER } from '@/lib/mahjongTypes';
import { evaluateDoraStatus, checkWinningAgari, calculateDiscardRiskScore, calculateDetailedYaku } from '@/lib/mahjongLogic';

/**
 * =============================================================================
 * 【游戏主引擎控制中心 - THE CORE ENGINE】
 * -----------------------------------------------------------------------------
 * 管理 136 张牌的全生命周期和异步回合流。
 * 核心升级：增加了"AI 鸣牌拦截"判定。
 * =============================================================================
 */
export default function useMahjongGame() {
  // --- 3.1 资产状态清单 ---
  const [deck, setDeck] = useState<Tile[]>([]);
  const [playerHand, setPlayerHand] = useState<Tile[]>([]);
  const [playerMelds, setPlayerMelds] = useState<Tile[][]>([]);
  const [aiHands, setAiHands] = useState<Tile[][]>([[], [], []]);
  const [aiMelds, setAiMelds] = useState<Tile[][][]>([[], [], []]); // AI 副露区存储
  const [drawnTile, setDrawnTile] = useState<Tile | null>(null);
  const [discards, setDiscards] = useState<Tile[]>([]);

  // --- 3.2 局势变量监控 ---
  const [doraIndicator, setDoraIndicator] = useState<Tile | null>(null);
  const [hints, setHints] = useState<Record<string, string[]>>({});
  const [gameState, setGameState] = useState<GamePhase>('idle');
  const [canPonTile, setCanPonTile] = useState<Tile | null>(null);
  const [canRonTile, setCanRonTile] = useState<Tile | null>(null);
  const [canKanTile, setCanKanTile] = useState<Tile | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [statusLog, setStatusLog] = useState('RIICHI NEOS PRO V2.0');
  const [finalStats, setFinalStats] = useState<MatchScoringSummary>({ han: 0, doraCount: 0, winType: '', yakuList: [] });

  // 工具：整理手牌算法
  const handleSortTiles = useCallback((tiles: Tile[]) => {
    const sMap = { m: 1, p: 2, s: 3, z: 4 };
    return [...tiles].sort((a, b) => {
      if (a.suit !== b.suit) return sMap[a.suit] - sMap[b.suit];
      return a.value - b.value;
    });
  }, []);

  /**
   * 功能：听牌分析扫描仪 (Scanner)
   */
  const performTenpaiScan = (hand: Tile[], drawn: Tile | null) => {
    const fullSet = drawn ? [...hand, drawn] : hand;
    const reportData: Record<string, string[]> = {};

    fullSet.forEach((discardTarget) => {
      const simulatedRemain = fullSet.filter(t => t.id !== discardTarget.id);
      const matchedWaits: string[] = [];
      MASTER_METADATA_CENTER.forEach(type => {
        const virtualTile = { ...type, id: 'sim-id' };
        if (checkWinningAgari([...simulatedRemain, virtualTile], playerMelds.length)) {
          matchedWaits.push(`${type.suit}${type.value}`);
        }
      });
      if (matchedWaits.length > 0) reportData[discardTarget.id] = matchedWaits;
    });
    setHints(reportData);
  };

  /**
   * 动作：初始化一场标准的对战
   */
  const handleGameInit = () => {
    const masterDeckArray: Tile[] = [];
    (['m', 'p', 's'] as const).forEach(suit => {
      for (let v = 1; v <= 9; v++) {
        for (let i = 0; i < 4; i++) {
          masterDeckArray.push({ suit, value: v, id: `Tile-${suit}${v}-${i}-${Math.random().toString(36).substring(2, 7)}` });
        }
      }
    });
    for (let v = 1; v <= 7; v++) {
      for (let i = 0; i < 4; i++) {
        masterDeckArray.push({ suit: 'z', value: v, id: `Tile-z${v}-${i}-${Math.random().toString(36).substring(2, 7)}` });
      }
    }

    // 强力洗牌
    for (let i = masterDeckArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [masterDeckArray[i], masterDeckArray[j]] = [masterDeckArray[j], masterDeckArray[i]];
    }

    setDoraIndicator(masterDeckArray[0]);
    setPlayerHand(handleSortTiles(masterDeckArray.slice(1, 14)));
    setAiHands([
      handleSortTiles(masterDeckArray.slice(14, 27)),
      handleSortTiles(masterDeckArray.slice(27, 40)),
      handleSortTiles(masterDeckArray.slice(40, 53))
    ]);
    setAiMelds([[], [], []]);
    setDeck(masterDeckArray.slice(53));
    setDiscards([]); setDrawnTile(null); setPlayerMelds([]); setHints({});
    setGameState('playing'); setCanPonTile(null); setCanRonTile(null); setCanKanTile(null); setIsAiProcessing(false);
    setStatusLog('对局已就绪，请点击摸牌开始');
  };

  /**
   * 动作：玩家摸牌
   */
  const handleUserDraw = () => {
    if (drawnTile || deck.length <= 14 || isAiProcessing || gameState !== 'playing') {
      if (deck.length <= 14 && gameState === 'playing') setGameState('draw');
      return;
    }
    const [newlyDrawnTile, ...restDeck] = deck;
    setDrawnTile(newlyDrawnTile);
    setDeck(restDeck);
    performTenpaiScan(playerHand, newlyDrawnTile);
    // 暗杠检测：摸牌后检查手牌中是否有某一种牌达到4张
    const fullHandCheck = [...playerHand, newlyDrawnTile];
    for (const checkTile of fullHandCheck) {
      const count = fullHandCheck.filter(t => t.suit === checkTile.suit && t.value === checkTile.value).length;
      if (count === 4) {
        setCanKanTile(checkTile);
        setStatusLog('检测到可"暗杠 (KAN!)"');
        break;
      }
    }

    // --- 重点修补 2.0：加杠 (Added Kan) 拦截检测 ---
    // 逻辑：扫描玩家已有的副露（Pon melds），看是否有任意一组碰子，与刚摸到的牌花色数值完全一致。
    const hasAddedKanMatch = playerMelds.some(meld =>
        // 1. 面子必须由3张牌组成 (碰子)
        meld.length === 3 &&
        // 2. 面子里的每一张牌必须是相同的花色和数值 (AAA)
        meld.every(t => t.suit === newlyDrawnTile.suit && t.value === newlyDrawnTile.value)
    );

    if (hasAddedKanMatch === true) {
        setCanKanTile(newlyDrawnTile); // 触发紫色杠按钮
        setStatusLog('抓牌成功，您的手牌满足"加杠"条件！杠！');
        return; // 中断流程，等待玩家点击杠按钮
    }

    setStatusLog('摸牌成功，请弃牌');
  };

  /**
   * 动作：玩家弃牌
   */
  const handleUserDiscard = (tile: Tile, index?: number) => {
    if (isAiProcessing || gameState !== 'playing') return;
    setDiscards(prev => [...prev, tile]);

    let nextHand = [...playerHand];
    if (index !== undefined) {
      nextHand.splice(index, 1);
      if (drawnTile) nextHand.push(drawnTile);
    }

    setPlayerHand(handleSortTiles(nextHand));
    setDrawnTile(null); setHints({}); setCanPonTile(null); setCanRonTile(null); setCanKanTile(null);
    initiateAiLoopCycle(nextHand);
  };

  /**
   * 核心重构：AI 回合自动化流处理 (带有 AI 鸣牌与拦截机制)
   */
  const initiateAiLoopCycle = async (updatedPlayerHand: Tile[]) => {
    setIsAiProcessing(true);
    let wallSnapshot = [...deck];
    let aiHandsSnapshots = [...aiHands];
    let aiMeldsSnapshots = [...aiMelds];

    // 处理三家对手
    for (let i = 0; i < 3; i++) {
      if (wallSnapshot.length <= 14) { setGameState('draw'); setIsAiProcessing(false); return; }
      setStatusLog(`对手 AI ${i + 1} 思考策略中...`);
      await new Promise(res => setTimeout(res, 950));

      // 1. AI 摸牌动作
      const aiDrawn = wallSnapshot.shift()!;
      const currentAiFullHand = [...aiHandsSnapshots[i], aiDrawn];

      // 2. AI 胡牌检测 (自摸)
      if (checkWinningAgari(currentAiFullHand, aiMeldsSnapshots[i].length)) {
        aiHandsSnapshots[i] = handleSortTiles(currentAiFullHand);
        setAiHands(aiHandsSnapshots);
        setGameState('ai_won');
        setIsAiProcessing(false);
        return;
      }

      // 3. AI 调用大脑评分计算最优弃牌
      let maxScoreValue = -1000, bestIdx = 0;
      for (let x = 0; x < currentAiFullHand.length; x++) {
        const weightScore = calculateDiscardRiskScore(currentAiFullHand[x], x, currentAiFullHand);
        if (weightScore > maxScoreValue) {
          maxScoreValue = weightScore;
          bestIdx = x;
        }
      }

      const discardedByAiTile = currentAiFullHand[bestIdx];
      currentAiFullHand.splice(bestIdx, 1);

      // 同步数据（AI 手牌、牌墙、弃牌）
      aiHandsSnapshots[i] = handleSortTiles(currentAiFullHand);
      setAiHands([...aiHandsSnapshots]);
      setDiscards(prev => [...prev, discardedByAiTile]);
      setDeck([...wallSnapshot]);

      // --- 拦截 1：玩家荣和胡牌判定 (RON) ---
      const isPlayerRonPossible = checkWinningAgari([...updatedPlayerHand, discardedByAiTile], playerMelds.length);
      if (isPlayerRonPossible) {
        setCanRonTile(discardedByAiTile);
        setIsAiProcessing(false);
        setStatusLog('检测到可"荣和 (胡!)"');
        return; // 中断流程
      }

      // --- 拦截 1b：玩家大明杠判定 (KAN) ---
      const playerKanCount = updatedPlayerHand.filter(t => t.suit === discardedByAiTile.suit && t.value === discardedByAiTile.value).length;
      if (playerKanCount === 3) {
        setCanKanTile(discardedByAiTile);
        setIsAiProcessing(false);
        setStatusLog('检测到可"大明杠 (KAN!)"');
        return;
      }

      // --- 拦截 2：玩家鸣牌拦截 (PON) ---
      const playerPonCount = updatedPlayerHand.filter(t => t.suit === discardedByAiTile.suit && t.value === discardedByAiTile.value).length;
      if (playerPonCount >= 2) {
        setCanPonTile(discardedByAiTile);
        setIsAiProcessing(false);
        setStatusLog('检测到可"碰 (PON)"');
        return;
      }

      // --- 拦截 3：其他 AI 鸣牌逻辑 (AI进攻性升级) ---
      for (let otherAiIdx = 0; otherAiIdx < 3; otherAiIdx++) {
        if (otherAiIdx === i) continue; // 不拦截自己
        const otherAiHand = aiHandsSnapshots[otherAiIdx];
        const matches = otherAiHand.filter(t => t.suit === discardedByAiTile.suit && t.value === discardedByAiTile.value).length;
        if (matches >= 2) {
          // AI 选择碰牌：赋予 AI 80% 的积极性进行碰牌
          if (Math.random() > 0.2) {
            setStatusLog(`对手 AI ${otherAiIdx + 1} 喊了"碰 (PON)！"`);
            const matchedTiles = otherAiHand.filter(t => t.suit === discardedByAiTile.suit && t.value === discardedByAiTile.value).slice(0, 2);
            const remainingHand = otherAiHand.filter(t => !matchedTiles.find(m => m.id === t.id));

            aiMeldsSnapshots[otherAiIdx].push([...matchedTiles, discardedByAiTile]);
            aiHandsSnapshots[otherAiIdx] = handleSortTiles(remainingHand);

            setAiMelds([...aiMeldsSnapshots]);
            setAiHands([...aiHandsSnapshots]);

            await new Promise(r => setTimeout(r, 600));
            // AI 碰完后也需要弃一张牌，流程跳转
            i = otherAiIdx - 1; // 顺次跳转
            break;
          }
        }
      }
    }

    setIsAiProcessing(false);
    setStatusLog('轮到您的回合了，点击摸牌开始');
  };

  /**
   * 动作：执行"荣和"胡牌
   */
  const handleRonAction = () => {
    if (!canRonTile) return;
    const finalSet = [...playerHand, canRonTile];
    const doraCount = finalSet.filter(t => evaluateDoraStatus(t, doraIndicator)).length;
    const { totalHan, yakuList } = calculateDetailedYaku(finalSet, playerMelds, false);
    setFinalStats({ han: totalHan + doraCount, doraCount, winType: 'RON', yakuList });
    setGameState('won');
  };

  /**
   * 动作：执行"碰牌"
   */
  const handlePonClick = () => {
    if (canPonTile === null) return;
    const target = canPonTile;
    const matchedTiles = playerHand.filter(t => t.suit === target.suit && t.value === target.value).slice(0, 2);
    const remainingHandArray = playerHand.filter(t => !matchedTiles.find(m => m.id === t.id));

    setPlayerMelds(prev => [...prev, [...matchedTiles, target]]);
    setPlayerHand(handleSortTiles(remainingHandArray));
    setDrawnTile(null); setCanPonTile(null); setIsAiProcessing(false);
    setCanKanTile(null);
    performTenpaiScan(remainingHandArray, null);
    setStatusLog('碰牌成功！请从手中弃掉一张不需要的牌');
  };

  /**
   * 动作：杠牌执行逻辑（含加杠/暗杠/大明杠 + 岭上摸牌）
   */
  const handleKanAction = () => {
    if (!canKanTile) return;
    const target = canKanTile;
    let nextHand = [...playerHand];
    let nextMelds = [...playerMelds];
    let newDrawnTile: Tile | null = drawnTile;
    let isDrawnTileUsed = false;

    // 1. 检测加杠 (Added Kan)：检查副露中是否已有 3 张同牌碰子
    const existingMeldIndex = nextMelds.findIndex(
      meld => meld.length === 3 && meld[0].suit === target.suit && meld[0].value === target.value
    );

    if (existingMeldIndex !== -1) {
      // 加杠：将第 4 张推入现有的碰面子
      const updatedMeld = [...nextMelds[existingMeldIndex], target];
      nextMelds[existingMeldIndex] = updatedMeld;
      if (drawnTile && drawnTile.id === target.id) {
        isDrawnTileUsed = true;
      } else {
        nextHand = nextHand.filter(t => !(t.id === target.id));
      }
    } else {
      // 2. 暗杠或大明杠：从手牌中找出所有同花色同数值的牌
      const handMatches = nextHand.filter(t => t.suit === target.suit && t.value === target.value);

      if (handMatches.length === 3 && drawnTile && drawnTile.id === target.id) {
        // 摸到的暗杠：手牌 3 张 + 摸到的 1 张
        nextMelds = [...nextMelds, [...handMatches, target]];
        nextHand = nextHand.filter(t => !handMatches.find(m => m.id === t.id));
        isDrawnTileUsed = true;
      } else if (handMatches.length === 4) {
        // 起手自带的暗杠：手牌中已有 4 张
        nextMelds = [...nextMelds, handMatches];
        nextHand = nextHand.filter(t => !handMatches.find(m => m.id === t.id));
      } else if (handMatches.length === 3) {
        // 大明杠：拦截 AI 弃牌，手牌 3 张 + 弃牌
        nextMelds = [...nextMelds, [...handMatches, target]];
        nextHand = nextHand.filter(t => !handMatches.find(m => m.id === t.id));
        // 从弃牌区移除被杠的牌，防止同一张牌同时出现在弃牌区和副露区
        setDiscards(prev => prev.filter(t => t.id !== target.id));
      }
    }

    // 3. 岭上摸牌 (Rinshan Draw)：从牌墙末尾抽取一张
    const newDeck = [...deck];
    const rinshanTile = newDeck.pop();

    // 如果消耗了 drawnTile，则替换为岭上牌，否则保留原有 drawnTile
    if (isDrawnTileUsed) {
      newDrawnTile = rinshanTile || null;
    } else {
      newDrawnTile = drawnTile;
    }

    // 4. 状态同步
    setDeck(newDeck);
    setPlayerHand(handleSortTiles(nextHand));
    setPlayerMelds(nextMelds);
    setDrawnTile(newDrawnTile);
    setCanKanTile(null);
    setIsAiProcessing(false);
    performTenpaiScan(nextHand, newDrawnTile);
    setStatusLog('杠牌成功！触发岭上摸牌，请选择弃牌或直接自摸。');
  };

  /**
   * 动作：自摸胡牌
   */
  const handleTsumoAction = () => {
    const finalSet = drawnTile ? [...playerHand, drawnTile] : playerHand;
    const doraCount = finalSet.filter(t => evaluateDoraStatus(t, doraIndicator)).length;
    const { totalHan, yakuList } = calculateDetailedYaku(finalSet, playerMelds, true);
    setFinalStats({ han: totalHan + doraCount, doraCount, winType: 'TSUMO', yakuList });
    setGameState('won');
  };

  // 变量校对
  const canPlayerCurrentlyDiscard = (playerHand.length + (drawnTile ? 1 : 0)) % 3 === 2;

  // 计算派生布尔值
  const derivedCanRon = !!canRonTile;
  const derivedCanPon = !!canPonTile;
  const derivedCanKan = !!canKanTile;
  const derivedCanTsumo = (drawnTile || canPlayerCurrentlyDiscard) &&
    checkWinningAgari(drawnTile ? [...playerHand, drawnTile] : playerHand, playerMelds.length);
  const deckSize = Math.max(0, deck.length - 14);
  const handSize = playerHand.length + (drawnTile ? 1 : 0);

  return {
    // -- 状态 --
    deck,
    playerHand,
    playerMelds,
    aiHands,
    aiMelds,
    drawnTile,
    discards,
    doraIndicator,
    hints,
    gameState,
    canPonTile,
    canRonTile,
    canKanTile,
    isAiProcessing,
    statusLog,
    finalStats,
    // -- 派生 --
    canPlayerCurrentlyDiscard,
    derivedCanRon,
    derivedCanPon,
    derivedCanKan,
    derivedCanTsumo,
    deckSize,
    handSize,
    // -- 动作 --
    handleSortTiles,
    performTenpaiScan,
    handleGameInit,
    handleUserDraw,
    handleUserDiscard,
    handleRonAction,
    handlePonClick,
    handleKanAction,
    handleTsumoAction,
  };
}
