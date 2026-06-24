import { checkWinningAgari } from './lib/mahjongLogic';
import { Tile } from './lib/mahjongTypes';

const hand: Tile[] = [
  {suit:'m',value:1,id:'m1a'},{suit:'m',value:2,id:'m2a'},{suit:'m',value:3,id:'m3a'},
  {suit:'m',value:4,id:'m4a'},{suit:'m',value:5,id:'m5a'},{suit:'m',value:6,id:'m6a'},
  {suit:'m',value:7,id:'m7a'},{suit:'m',value:8,id:'m8a'},{suit:'m',value:9,id:'m9a'},
  {suit:'p',value:1,id:'p1a'},{suit:'p',value:1,id:'p1b'},{suit:'p',value:1,id:'p1c'},
  {suit:'s',value:1,id:'s1a'},{suit:'s',value:1,id:'s1b'},
];
console.log('14 tiles, 0 melds:', checkWinningAgari(hand, 0));
console.log('13 tiles, 0 melds:', checkWinningAgari(hand.slice(0, 13), 0));
console.log('11 tiles, 1 meld:', checkWinningAgari(hand.slice(0, 11), 1));