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
 * 高级计番引擎：根据最终14张牌面 + 副露阵列 + 是否自摸，动态扫描役种。
 * 当前支持的役种：自摸 (Tsumo)、断幺九 (Tanyao)、碰碰胡 (Toi-Toi)、混一色 (Honitsu)、清一色 (Chinitsu)
 */
export function calculateDetailedYaku(
  hand: Tile[],
  melds: Tile[][],
  isTsumo: boolean
): { totalHan: number; yakuList: string[] } {
  const yakuList: string[] = [];
  let totalHan = 0;

  // 1. 自摸 (Tsumo) — 1番
  if (isTsumo) {
    yakuList.push('自摸 (Tsumo)');
    totalHan += 1;
  }

  // 收集手牌中所有牌的花色与数值信息
  const allTiles = [...hand, ...melds.flat()];
  const allKeys = allTiles.map(t => `${t.suit}${t.value}`);

  // 判断是否全是中张牌（2-8，不含字牌和1/9）
  const isAllMiddle = allTiles.every(t => t.suit !== 'z' && t.value >= 2 && t.value <= 8);

  // 2. 断幺九 (Tanyao) — 1番
  if (isAllMiddle) {
    yakuList.push('断幺九 (Tanyao)');
    totalHan += 1;
  }

  // 花色统计
  const suitCount: Record<string, number> = { m: 0, p: 0, s: 0, z: 0 };
  allTiles.forEach(t => { suitCount[t.suit] = (suitCount[t.suit] || 0) + 1; });

  // 数牌花色分布：哪些花色有牌
  const numberedSuits = ['m', 'p', 's'].filter(s => suitCount[s] > 0);
  const hasHonors = suitCount['z'] > 0;

  // 3. 混一色 (Honitsu) — 2番（门清状态下为3番，这里统一简化计2番）
  if (numberedSuits.length === 1 && hasHonors) {
    yakuList.push('混一色 (Honitsu)');
    totalHan += 2;
  }

  // 4. 清一色 (Chinitsu) — 5番（门清状态下为6番，这里统一简化计5番）
  if (numberedSuits.length === 1 && !hasHonors) {
    // 同时满足混一色条件时，清一色覆盖混一色
    if (yakuList[yakuList.length - 1]?.startsWith('混一色')) {
      yakuList.pop();
      totalHan -= 2;
    }
    yakuList.push('清一色 (Chinitsu)');
    totalHan += 5;
  }

  // 5. 碰碰胡 (Toi-Toi) — 2番
  // 条件：所有面子都是刻子（AAA），不能有顺子（ABC）
  // 利用递归拆解函数检查是否存在顺子组成可能
  const tileFreq: Record<string, number> = {};
  hand.forEach(t => {
    const key = `${t.suit}${t.value}`;
    tileFreq[key] = (tileFreq[key] || 0) + 1;
  });
  // 检查是否有顺子：遍历所有键，看是否存在连续的三张
  let hasSequence = false;
  const sortedKeys = Object.keys(tileFreq).filter(k => tileFreq[k] > 0).sort();
  for (const key of sortedKeys) {
    const suit = key[0];
    const val = parseInt(key.substring(1));
    if (suit !== 'z' && val <= 7) {
      const k2 = `${suit}${val + 1}`;
      const k3 = `${suit}${val + 2}`;
      if (tileFreq[k2] > 0 && tileFreq[k3] > 0) {
        hasSequence = true;
        break;
      }
    }
  }
  // 如果手牌不含顺子可能性，并且所有副露都是刻子（长度3），则为碰碰胡
  const allMeldsArePon = melds.every(m => m.length === 3 && m.every(t => t.suit === m[0].suit && t.value === m[0].value));
  if (!hasSequence && allMeldsArePon && melds.length > 0) {
    yakuList.push('碰碰胡 (Toi-Toi)');
    totalHan += 2;
  }

  return { totalHan, yakuList };
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
 * AI 智力升级 V3：联络力评估 + 孤张惩罚机制
 *
 * 分数越高 → 越优先丢弃。
 *
 * 维度一：联络力扫描（搭子与对子保护）
 *   遍历手牌中同花色的牌，计算数值差 diff：
 *     diff===0  → 对子，价值极高，-500（绝不拆）
 *     diff===1  → 两面/边张搭子，-280（强保留）
 *     diff===2  → 嵌张搭子，-140（普通保留）
 *
 * 维度二：孤张惩罚
 *   若没有任何联络，按牌型施加惩罚促使丢弃：
 *     孤张字牌 +200 | 孤张幺九 +120 | 孤张中张 +70
 */
export function calculateDiscardRiskScore(tile: Tile, index: number, hand: Tile[]): number {
  let score = 0;
  let hasConnection = false;

  // ---- 基底分值 ----
  if (tile.suit === 'z') {
    score += 350;  // 字牌
  } else if (tile.value === 1 || tile.value === 9) {
    score += 200;  // 幺九
  } else {
    score += 80;   // 中张 2-8
  }

  // ---- 联络力扫描 ----
  for (let m = 0; m < hand.length; m++) {
    if (index === m) continue;
    const other = hand[m];
    if (tile.suit !== other.suit) continue;

    const diff = Math.abs(tile.value - other.value);

    if (diff === 0) {
      // 对子 — 价值极高，几乎不拆
      score -= 500;
      hasConnection = true;
    } else if (diff === 1 && tile.suit !== 'z') {
      // 两面或边张搭子 — 进张率高，强保留
      score -= 280;
      hasConnection = true;
    } else if (diff === 2 && tile.suit !== 'z') {
      // 嵌张搭子 — 有一定进张率
      score -= 140;
      hasConnection = true;
    }
  }

  // ---- 孤张惩罚：完全没有联络的牌优先弃 ----
  if (!hasConnection) {
    if (tile.suit === 'z') {
      score += 200;   // 孤立字牌 — 废牌
    } else if (tile.value === 1 || tile.value === 9) {
      score += 120;   // 孤立幺九 — 边张，联络困难
    } else {
      score += 70;    // 孤立中张 — 也有概率等靠张，但最轻
    }
  }

  return score;
}