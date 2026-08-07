export type TacticMode = 'DEFEND' | 'ROTATE' | 'ATTACK';

export type TileType = 
  | 'RUN_1' 
  | 'RUN_2' 
  | 'RUN_3' 
  | 'RUN_4' 
  | 'RUN_6' 
  | 'DOT' 
  | 'WICKET' 
  | 'CATCH' 
  | 'WIDE' 
  | 'FREE_HIT' 
  | 'POWER_ROLL' 
  | 'POWER_SHOT';

export interface BoardTile {
  id: number;
  type: TileType;
  label: string;
  sublabel?: string;
  colorClass: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  badge?: string;
}

export interface DeliveryRecord {
  id: string;
  overBall: string; // e.g. "0.5"
  player: 'YOU' | 'AI' | 'PLAYER_2';
  runs: number;
  isWicket: boolean;
  isWide: boolean;
  isPowerplay: boolean;
  isFreeHit: boolean;
  tileLabel: string;
  commentary: string;
  subCommentary?: string;
}

export interface PlayerState {
  name: string;
  avatar: 'helmet' | 'robot' | 'user';
  runs: number;
  wickets: number;
  overs: number; // e.g. 0.5 means 0 overs and 5 balls
  ballsBowled: number; // total legal balls
  history: DeliveryRecord[];
  fourCount: number;
  sixCount: number;
  dotsCount: number;
}

export type GamePhase = 
  | 'INNINGS_1' 
  | 'INNINGS_BREAK' 
  | 'INNINGS_2' 
  | 'MATCH_OVER';

export interface Ground {
  id: string;
  name: string;
  location: string;
  gradientClass: string;
  pitchColorClass: string;
  grassColorClass: string;
  pitchHex: string;
}

export type GameMode = 'VS_AI' | 'PASS_AND_PLAY' | 'TOURNAMENT';

export interface GameSettings {
  maxOvers: number; // Default 5
  maxWickets: number; // Default 10
  mode: GameMode;
  soundEnabled: boolean;
  aiDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
}
