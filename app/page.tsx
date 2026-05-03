'use client'; // 告诉 Next.js 这是一个交互页面
import { useState } from 'react';

export default function MahjongGame() {
  // 1. 定义状态：我的手牌（初始为空数组）
  const [hand, setHand] = useState<string[]>([]);

  // 2. 发牌逻辑
  const drawCards = () => {
    const allTiles = ['1万', '9万', '东', '西', '南', '北', '一筒', '红中'];
    // 随机抽取 13 张牌
    const newHand = Array.from({ length: 13 }, () => 
      allTiles[Math.floor(Math.random() * allTiles.length)]
    );
    setHand(newHand); // 更新状态，屏幕会自动刷新
  };

  return (
    <div className="p-8 bg-green-800 min-h-screen text-white">
      <h1 className="text-2xl mb-4 text-center">我的单机麻将</h1>
      
      {/* 牌桌 */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {hand.map((tile, index) => (
          <div key={index} className="w-12 h-16 bg-white text-black rounded shadow-lg flex items-center justify-center font-bold">
            {tile}
          </div>
        ))}
      </div>

      {/* 交互按钮 */}
      <div className="text-center">
        <button 
          onClick={drawCards}
          className="bg-yellow-600 px-6 py-2 rounded-full hover:bg-yellow-500 transition"
        >
          重新发牌
        </button>
      </div>
    </div>
  );
}