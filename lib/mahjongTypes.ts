/**
 * =============================================================================
 * 【麻将物理数据协议中心 - THE CORE PROTOCOL】
 * -----------------------------------------------------------------------------
 * 每一张麻将牌在系统中都是一个具备唯一追踪 ID (UUID) 的实体对象。
 * 严禁使用 Array Index 作为 Key，必须使用此处的 ID 机制，确保渲染树的绝对稳定性。
 * =============================================================================
 */

// 单张麻将牌的数据接口规范
export interface Tile {
  /**
   * 花色定义：
   * m - 万子 (Manzu)
   * p - 筒子 (Pinzu)
   * s - 条子 (Souzu)
   * z - 字牌 (Jihai: 东南西北中发白)
   */
  suit: 'm' | 'p' | 's' | 'z';

  /**
   * 数值定义：
   * 数牌为 1-9
   * 字牌为 1-4 (风牌: 东南西北), 5-7 (三元牌: 白发中)
   */
  value: number;

  /**
   * 全局唯一身份标识：
   * 确保 React 渲染层的物理追踪。杜绝"点击时牌乱跳"或位移报错。
   */
  id: string;
}

// 游戏全局阶段状态机
export type GamePhase =
  | 'idle'       // 对局尚未开启
  | 'playing'    // 正在进行牌局对战
  | 'won'        // 玩家获胜 (自摸/荣和)
  | 'ai_won'     // AI 选手获胜
  | 'draw';      // 牌墙资源枯竭 (流局)

// 计番与结算数据结构
export interface MatchScoringSummary {
  han: number;
  doraCount: number;
  winType: 'TSUMO' | 'RON' | '';
}

// 静态数据：定义 34 种标准牌型的元数据模型
export const MASTER_METADATA_CENTER: { suit: 'm' | 'p' | 's' | 'z'; value: number }[] = [];

/**
 * 执行：全量牌型初始化逻辑
 * 逻辑完全展开，杜绝合并，确保牌库生成的透明度。
 */
export function buildInitialEngineMetadata() {
  const suits: ('m' | 'p' | 's')[] = ['m', 'p', 's'];
  for (let sIdx = 0; sIdx < suits.length; sIdx++) {
    for (let val = 1; val <= 9; val++) {
      MASTER_METADATA_CENTER.push({ suit: suits[sIdx], value: val });
    }
  }
  for (let val = 1; val <= 7; val++) {
    MASTER_METADATA_CENTER.push({ suit: 'z', value: val });
  }
}
buildInitialEngineMetadata();
