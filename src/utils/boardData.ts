import { BoardTile } from '../types';

// 32 Circular track slots matching the game UI screenshot
export const BOARD_TILES: BoardTile[] = [
  {
    id: 0,
    type: 'FREE_HIT',
    label: 'FH',
    sublabel: 'Free Hit',
    colorClass: 'border-emerald-400 bg-emerald-950/80 text-emerald-300',
    bgHex: '#064e3b',
    borderHex: '#34d399',
    textHex: '#6ee7b7',
    badge: 'FREE HIT'
  },
  {
    id: 1,
    type: 'DOT',
    label: '•',
    colorClass: 'border-stone-600 bg-stone-900/90 text-stone-200',
    bgHex: '#1c1917',
    borderHex: '#57534e',
    textHex: '#e7e5e4'
  },
  {
    id: 2,
    type: 'RUN_1',
    label: '1',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 3,
    type: 'RUN_2',
    label: '2',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 4,
    type: 'CATCH',
    label: 'C',
    sublabel: 'Catch',
    colorClass: 'border-amber-500 bg-amber-950/80 text-amber-300',
    bgHex: '#451a03',
    borderHex: '#f59e0b',
    textHex: '#fcd34d',
    badge: 'CATCH CHANCE'
  },
  {
    id: 5,
    type: 'WIDE',
    label: 'WD',
    sublabel: 'Wide',
    colorClass: 'border-cyan-500 bg-cyan-950/80 text-cyan-300',
    bgHex: '#083344',
    borderHex: '#06b6d4',
    textHex: '#67e8f9',
    badge: 'WIDE BALL'
  },
  {
    id: 6,
    type: 'RUN_4',
    label: '4',
    sublabel: 'Four',
    colorClass: 'border-amber-400 bg-stone-900/90 text-amber-200 font-bold',
    bgHex: '#262626',
    borderHex: '#fbbf24',
    textHex: '#fef08a'
  },
  {
    id: 7,
    type: 'RUN_2',
    label: '2',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 8,
    type: 'RUN_3',
    label: '3',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 9,
    type: 'WICKET',
    label: 'W',
    sublabel: 'Wicket',
    colorClass: 'border-rose-500 bg-rose-950/90 text-rose-200 font-bold',
    bgHex: '#450a0a',
    borderHex: '#f43f5e',
    textHex: '#fecdd3',
    badge: 'OUT!'
  },
  {
    id: 10,
    type: 'RUN_1',
    label: '1',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 11,
    type: 'RUN_6',
    label: '6',
    sublabel: 'Six',
    colorClass: 'border-amber-400 bg-amber-950/80 text-amber-300 font-bold',
    bgHex: '#451a03',
    borderHex: '#f59e0b',
    textHex: '#fef08a'
  },
  {
    id: 12,
    type: 'POWER_ROLL',
    label: 'PR',
    sublabel: 'Power Roll',
    colorClass: 'border-purple-400 bg-purple-950/80 text-purple-300',
    bgHex: '#3b0764',
    borderHex: '#c084fc',
    textHex: '#e9d5ff',
    badge: 'POWER ROLL'
  },
  {
    id: 13,
    type: 'RUN_2',
    label: '2',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 14,
    type: 'FREE_HIT',
    label: 'FH',
    sublabel: 'Free Hit',
    colorClass: 'border-emerald-400 bg-emerald-950/80 text-emerald-300',
    bgHex: '#064e3b',
    borderHex: '#34d399',
    textHex: '#6ee7b7'
  },
  {
    id: 15,
    type: 'RUN_3',
    label: '3',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 16,
    type: 'WICKET',
    label: 'W',
    sublabel: 'Wicket',
    colorClass: 'border-rose-500 bg-rose-950/90 text-rose-200 font-bold',
    bgHex: '#450a0a',
    borderHex: '#f43f5e',
    textHex: '#fecdd3'
  },
  {
    id: 17,
    type: 'RUN_1',
    label: '1',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 18,
    type: 'RUN_4',
    label: '4',
    sublabel: 'Four',
    colorClass: 'border-amber-400 bg-stone-900/90 text-amber-200 font-bold',
    bgHex: '#262626',
    borderHex: '#fbbf24',
    textHex: '#fef08a'
  },
  {
    id: 19,
    type: 'POWER_SHOT',
    label: 'PS',
    sublabel: 'Power Shot',
    colorClass: 'border-sky-400 bg-sky-950/80 text-sky-300',
    bgHex: '#082f49',
    borderHex: '#38bdf8',
    textHex: '#bae6fd',
    badge: 'POWER SHOT (+6)'
  },
  {
    id: 20,
    type: 'RUN_2',
    label: '2',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 21,
    type: 'RUN_6',
    label: '6',
    sublabel: 'Six',
    colorClass: 'border-amber-400 bg-amber-950/80 text-amber-300 font-bold',
    bgHex: '#451a03',
    borderHex: '#f59e0b',
    textHex: '#fef08a'
  },
  {
    id: 22,
    type: 'DOT',
    label: '•',
    colorClass: 'border-stone-600 bg-stone-900/90 text-stone-200',
    bgHex: '#1c1917',
    borderHex: '#57534e',
    textHex: '#e7e5e4'
  },
  {
    id: 23,
    type: 'CATCH',
    label: 'C',
    sublabel: 'Catch',
    colorClass: 'border-amber-500 bg-amber-950/80 text-amber-300',
    bgHex: '#451a03',
    borderHex: '#f59e0b',
    textHex: '#fcd34d'
  },
  {
    id: 24,
    type: 'RUN_2',
    label: '2',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 25,
    type: 'WICKET',
    label: 'W',
    sublabel: 'Wicket',
    colorClass: 'border-rose-500 bg-rose-950/90 text-rose-200 font-bold',
    bgHex: '#450a0a',
    borderHex: '#f43f5e',
    textHex: '#fecdd3'
  },
  {
    id: 26,
    type: 'RUN_4',
    label: '4',
    colorClass: 'border-amber-400 bg-stone-900/90 text-amber-200 font-bold',
    bgHex: '#262626',
    borderHex: '#fbbf24',
    textHex: '#fef08a'
  },
  {
    id: 27,
    type: 'WIDE',
    label: 'WD',
    sublabel: 'Wide',
    colorClass: 'border-cyan-500 bg-cyan-950/80 text-cyan-300',
    bgHex: '#083344',
    borderHex: '#06b6d4',
    textHex: '#67e8f9'
  },
  {
    id: 28,
    type: 'RUN_3',
    label: '3',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  },
  {
    id: 29,
    type: 'RUN_6',
    label: '6',
    colorClass: 'border-amber-400 bg-amber-950/80 text-amber-300 font-bold',
    bgHex: '#451a03',
    borderHex: '#f59e0b',
    textHex: '#fef08a'
  },
  {
    id: 30,
    type: 'POWER_ROLL',
    label: 'PR',
    colorClass: 'border-purple-400 bg-purple-950/80 text-purple-300',
    bgHex: '#3b0764',
    borderHex: '#c084fc',
    textHex: '#e9d5ff'
  },
  {
    id: 31,
    type: 'RUN_2',
    label: '2',
    colorClass: 'border-stone-500 bg-stone-900/90 text-stone-100',
    bgHex: '#262626',
    borderHex: '#737373',
    textHex: '#f5f5f5'
  }
];
