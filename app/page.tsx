'use client';
import { useState, useEffect } from 'react';

// --- 1. 类型定义 ---
interface Tile {
  suit: 'm' | 'p' | 's' | 'z'; // 万, 筒, 条, 字
  value: number;
  id: string;
}

export default function MahjongGame() {
  // --- 2. 状态管理 ---
  const [deck, setDeck] = useState<Tile[]>([]);          // 牌墙
  const [playerHand, setPlayerHand] = useState<Tile[]>([]); // 玩家手牌
  const [aiHands, setAiHands] = useState<Tile[][]>([[], [], []]); // 三个AI的手牌
  const [drawnTile, setDrawnTile] = useState<Tile | null>(null); // 玩家刚摸的牌
  const [discards, setDiscards] = useState<Tile[]>([]); // 牌河
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [message, setMessage] = useState('欢迎来到单机麻将');

  // --- 3. 核心逻辑：排序 ---
  const sortTiles = (tiles: Tile[]) => {
    const order = { m: 1, p: 2, s: 3, z: 4 };
    return [...tiles].sort((a, b) => {
      if (a.suit !== b.suit) return order[a.suit] - order[b.suit];
      return a.value - b.value;
    });
  };

  // --- 4. 初始化游戏 ---
  const initGame = () => {
    const newDeck: Tile[] = [];
    const suits: ('m' | 'p' | 's')[] = ['m', 'p', 's'];
    
    // 生成136张牌
    suits.forEach(s => {
      for (let v = 1; v <= 9; v++) {
        for (let i = 0; i < 4; i++) newDeck.push({ suit: s, value: v, id: `${s}${v}-${i}` });
      }
    });
    for (let v = 1; v <= 7; v++) {
      for (let i = 0; i < 4; i++) newDeck.push({ suit: 'z', value: v, id: `z${v}-${i}` });
    }

    // 洗牌
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    // 分牌
    const pHand = sortTiles(newDeck.slice(0, 13));
    const ai1 = sortTiles(newDeck.slice(13, 26));
    const ai2 = sortTiles(newDeck.slice(26, 39));
    const ai3 = sortTiles(newDeck.slice(39, 52));

    setPlayerHand(pHand);
    setAiHands([ai1, ai2, ai3]);
    setDeck(newDeck.slice(52));
    setDiscards([]);
    setDrawnTile(null);
    setGameState('playing');
    setMessage('游戏开始，请摸牌');
  };

  // --- 5. 摸牌逻辑 ---
  const handleDraw = () => {
    if (drawnTile || deck.length === 0 || gameState !== 'playing') return;
    const [newTile, ...rest] = deck;
    setDrawnTile(newTile);
    setDeck(rest);
    setMessage('请选择一张牌打出');
  };

  // --- 6. 出牌逻辑 (玩家) ---
  const handleDiscard = (tile: Tile, index?: number) => {
    if (!drawnTile && playerHand.length !== 14) return;

    setDiscards(prev => [...prev, tile]);
    
    let newHand = [...playerHand];
    if (index !== undefined) {
      newHand.splice(index, 1);
      if (drawnTile) newHand.push(drawnTile);
    }
    
    setPlayerHand(sortTiles(newHand));
    setDrawnTile(null);
    setMessage('AI 正在思考...');

    // 触发 AI 回合
    setTimeout(runAiTurns, 800);
  };

  // --- 7. AI 简单逻辑 ---
  const runAiTurns = () => {
    // 这里简化处理：AI 摸一张立刻打一张
    let currentDeck = [...deck];
    const newDiscards: Tile[] = [];

    for (let i = 0; i < 3; i++) {
      if (currentDeck.length > 0) {
        const [aiDraw, ...rest] = currentDeck;
        newDiscards.push(aiDraw); // AI 摸了直接打出
        currentDeck = rest;
      }
    }

    setDeck(currentDeck);
    setDiscards(prev => [...prev, ...newDiscards]);
    setMessage('到你了，请摸牌');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-6 px-4 font-sans">
      
      {/* 顶部状态栏 */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-black text-emerald-500 uppercase tracking-tighter">Riichi Mahjong v1.0</h1>
          <p className="text-xs text-slate-400">{message}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="bg-black/30 px-4 py-2 rounded-lg border border-emerald-900">
            牌墙剩余: <span className="text-emerald-400 font-mono text-lg">{deck.length}</span>
          </div>
          <button onClick={initGame} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg font-bold transition-all">
            {gameState === 'idle' ? '开始游戏' : '重开'}
          </button>
        </div>
      </div>

      {/* 游戏主桌面 */}
      <div className="relative w-full max-w-5xl aspect-[16/9] bg-emerald-800 rounded-[2.5rem] border-[12px] border-emerald-950 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col p-8 overflow-hidden">
        
        {/* AI 区域 (顶部和两侧简化) */}
        <div className="flex justify-between mb-4">
          <div className="w-24 h-12 bg-black/20 rounded-lg flex items-center justify-center text-xs text-emerald-300 border border-white/5">AI 左</div>
          <div className="w-24 h-12 bg-black/20 rounded-lg flex items-center justify-center text-xs text-emerald-300 border border-white/5">AI 对家</div>
          <div className="w-24 h-12 bg-black/20 rounded-lg flex items-center justify-center text-xs text-emerald-300 border border-white/5">AI 右</div>
        </div>

        {/* 牌河 (中间区域) */}
        <div className="flex-1 bg-black/10 rounded-3xl border border-white/5 p-6 mb-6 overflow-y-auto">
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 justify-items-center">
            {discards.map((tile, i) => (
              <div key={`disc-${i}`} className="w-8 h-11 bg-white rounded-sm overflow-hidden shadow-sm opacity-90 transition-all">
                <img src={`/tiles/${tile.suit}${tile.value}.svg`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 玩家手牌区域 */}
        <div className="flex items-end justify-center gap-1.5 h-28">
          <div className="flex gap-1 bg-black/20 p-3 rounded-2xl border border-white/10 shadow-inner">
            {playerHand.map((tile, i) => (
              <button 
                key={tile.id}
                onClick={() => handleDiscard(tile, i)}
                disabled={!drawnTile}
                className={`w-11 sm:w-14 transition-all duration-300 ${drawnTile ? 'hover:-translate-y-6 cursor-pointer scale-100' : 'opacity-80 scale-95 cursor-not-allowed'}`}
              >
                <img src={`/tiles/${tile.suit}${tile.value}.svg`} className="w-full h-auto drop-shadow-xl rounded-sm" />
              </button>
            ))}
          </div>

          <div className="w-6" /> {/* 间隙 */}

          {/* 摸牌展示 */}
          <div className="w-14 h-20 flex flex-col items-center">
            {drawnTile ? (
              <button 
                onClick={() => handleDiscard(drawnTile)}
                className="w-11 sm:w-14 hover:-translate-y-6 transition-all"
              >
                <img src={`/tiles/${drawnTile.suit}${drawnTile.value}.svg`} className="w-full h-auto drop-shadow-2xl border-b-4 border-yellow-500 rounded-sm" />
                <span className="text-[10px] text-yellow-400 font-bold uppercase mt-1">Draw</span>
              </button>
            ) : (
              gameState === 'playing' && (
                <button 
                  onClick={handleDraw}
                  className="w-full h-full border-2 border-dashed border-emerald-400/30 rounded-xl flex items-center justify-center group hover:border-emerald-400/60 transition-all"
                >
                  <span className="text-[10px] text-emerald-400/50 group-hover:text-emerald-400 font-bold">摸牌</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="mt-8 text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        Handcrafted for Japanese Mahjong Enthusiasts
      </div>
    </main>
  );
}