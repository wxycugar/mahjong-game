/**
 * =============================================================================
 * 【逻辑计算引擎 - THE BRAIN ENGINE】
 * -----------------------------------------------------------------------------
 * 包含胡牌判定、计番扫描、AI 智力加持评分。
 * =============================================================================
 */

import { Tile } from './mahjongTypes';

/**
 * 逻辑：判定某张牌是否为当前局的宝牌 (Dora Active)
 */
export function evaluateDoraStatus(tile: Tile, indicator: Tile | null): boolean {
  if (indicator === null) return false;
  let targetVal: number = 0;
  if (indicator.suit === 'z') {
    if (indicator.value >= 1 && indicator.value <= 4) {
      targetVal = indicator.value === 4 ? 1 : indicator.value + 1;
    } else {
      targetVal = indicator.value === 7 ? 5 : indicator.value + 1;
    }
  } else {
    targetVal = indicator.value === 9 ? 1 : indicator.value + 1;
  }
  return tile.suit === indicator.suit && tile.value === targetVal;
}

/**
 * 核心算法：日本麻将胡牌检测系统 (Standard Agari Engine)
 * 公式：(手牌 + 副露*3) === 14。
 */
export function checkWinningAgari(hand: Tile[], meldsCount: number): boolean {
  // 【硬性防御拦截】手牌 + 副露牌总数必须恰好为 14，否则直接判负
  if (hand.length + meldsCount * 3 !== 14) return false;

  const tileFreq: Record<string, number> = {};
  for (let i = 0; i < hand.length; i++) {
    const key = `${hand[i].suit}${hand[i].value}`;
    tileFreq[key] = (tileFreq[key] || 0) + 1;
  }

  const distinctKeys = Object.keys(tileFreq).sort();
  for (let j = 0; j < distinctKeys.length; j++) {
    const k = distinctKeys[j];
    if (tileFreq[k] >= 2) {
      const simMap = { ...tileFreq };
      simMap[k] -= 2;
      if (recursiveMentsuDecompose(simMap)) return true;
    }
  }
  return false;
}

export function recursiveMentsuDecompose(counts: Record<string, number>): boolean {
  const remainingKeys = Object.keys(counts).filter((k) => counts[k] > 0).sort();
  if (remainingKeys.length === 0) return true;

  const fKey = remainingKeys[0];

  // AAA 刻子提取
  if (counts[fKey] >= 3) {
    const nextMap = { ...counts };
    nextMap[fKey] -= 3;
    if (recursiveMentsuDecompose(nextMap)) return true;
  }

  // ABC 顺子提取
  const suit = fKey[0];
  const val = parseInt(fKey.substring(1));
  if (suit !== 'z' && val <= 7) {
    const k2 = `${suit}${val + 1}`, k3 = `${suit}${val + 2}`;
    if (counts[k2] > 0 && counts[k3] > 0) {
      const nextMap = { ...counts };
      nextMap[fKey]--; nextMap[k2]--; nextMap[k3]--;
      if (recursiveMentsuDecompose(nextMap)) return true;
    }
  }
  return false;
}

/**
 * AI 智力升级：进阶评分权衡系统 (AI Strategic Brain V2)
 * 相比上一版，增加了"断幺九"倾向权重。
 */
export function calculateDiscardRiskScore(tile: Tile, index: number, hand: Tile[]): number {
  let riskScore = 0;

  // 1. 【核心逻辑】断幺九倾向：极度厌恶字牌和 1, 9
  if (tile.suit === 'z') {
    riskScore += 450; // 字牌弃置权重最高
  } else if (tile.value === 1 || tile.value === 9) {
    riskScore += 200; // 1, 9 弃置权重次高
  } else {
    // 2-8 之间的牌分值减低（AI 倾向于保留中张）
    riskScore += 50;
  }

  // 2. 联络力交叉扫描
  for (let m = 0; m < hand.length; m++) {
    if (index === m) continue;
    const other = hand[m];
    if (tile.suit === other.suit) {
      if (tile.value === other.value) riskScore -= 300; // 对子价值巨大，AI 极力保留
      else if (Math.abs(tile.value - other.value) <= 2) riskScore -= 120; // 顺子搭子价值大
    }
  }

  return riskScore;
}