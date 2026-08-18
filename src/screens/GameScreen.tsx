import React from 'react';
import { Header } from '../components/Header';
import { MatchPlayersBanner } from '../components/MatchPlayersBanner';
import { Scoreboard } from '../components/Scoreboard';
import { CricketBoard } from '../components/CricketBoard';
import { ActionControls } from '../components/ActionControls';
import { DiceModal } from '../components/DiceModal';
import { RulesModal } from '../components/RulesModal';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { MatchEndModal } from '../components/MatchEndModal';
import { PlayerState, GamePhase, GameSettings, Ground, BoardTile, TacticMode } from '../types';
import { socketService } from '../utils/socket';

export interface GameScreenProps {
  settings: GameSettings;
  coins: number;
  playerLevel: number;
  xpProgress: number;
  selectedGround: Ground;
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
  isRulesOpen: boolean;
  setIsRulesOpen: (v: boolean) => void;
  handleToggleMute: () => void;
  youState: PlayerState;
  aiState: PlayerState;
  emojiEvent: any;
  isCurrentPowerplay: boolean;
  currentStrike: 'YOU' | 'AI';
  turnTimer: number | undefined;
  activeScreen: string;
  phase: GamePhase;
  isRolling: boolean;
  youTileIndex: number;
  aiTileIndex: number;
  selectedTactic: TacticMode;
  setSelectedTactic: (t: TacticMode) => void;
  handleActionSubmit: () => void;
  myTurnAction: any;
  opponentTurnAction: any;
  multiplayerRoomId: string | null;
  showDiceModal: boolean;
  diceVal: number;
  landedTileInfo: BoardTile | null;
  handleRestartMatch: () => void;
  handleExitToLobby: () => void;
  targetRuns: number | undefined;
  setSettings: (updater: (prev: GameSettings) => GameSettings) => void;
  setEmojiEvent: (event: any) => void;
}

export const GameScreen: React.FC<GameScreenProps> = (props) => {
  return (
    <>
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-2xl mx-auto pb-4 h-full overflow-hidden">
        {/* Header */}
        <Header
          onOpenMenu={() => props.setIsMenuOpen(true)}
          onOpenSettings={() => props.setIsSettingsOpen(true)}
          onOpenRules={() => props.setIsRulesOpen(true)}
          isMuted={!props.settings.soundEnabled}
          onToggleMute={props.handleToggleMute}
          coins={props.coins}
          playerLevel={props.playerLevel}
          xpProgress={props.xpProgress}
          selectedGround={props.selectedGround}
        />

        <div className="flex-1 min-h-0 flex flex-col">
          <MatchPlayersBanner 
            youState={props.youState} 
            aiState={props.aiState} 
            emojiEvent={props.emojiEvent} 
            playerLevel={props.playerLevel} 
            opponentLevel={props.settings.mode === 'MULTIPLAYER' ? 5 : 10} 
          />
          <Scoreboard
            youState={props.youState}
            aiState={props.aiState}
            isPowerplay={props.isCurrentPowerplay}
            currentStrike={props.currentStrike}
            turnTimer={props.activeScreen === 'GAME' && props.phase !== 'MATCH_OVER' && !props.isRolling ? props.turnTimer : undefined}
          />

          {/* Center Circular Cricket Board */}
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <CricketBoard
              youTileIndex={props.youTileIndex}
              aiTileIndex={props.aiTileIndex}
              youIsRolling={props.isRolling && props.currentStrike === 'YOU'}
              aiIsRolling={props.isRolling && props.currentStrike !== 'YOU'}
              ground={props.selectedGround}
            />
          </div>
        </div>
        
        {/* Action Controls (Defend, Rotate, Attack, ROLL) */}
        <div className="flex flex-col items-center">
          <ActionControls
            selectedTactic={props.selectedTactic}
            onSelectTactic={props.setSelectedTactic}
            onRoll={() => props.handleActionSubmit()}
            isRolling={props.isRolling || (props.currentStrike === 'YOU' ? props.myTurnAction !== null : props.opponentTurnAction !== null)}
            disabled={props.phase === 'MATCH_OVER' || (props.settings.mode !== 'PASS_AND_PLAY' && props.currentStrike !== 'YOU')}
            showEmoji={!!props.multiplayerRoomId}
            isBatting={true}
            onSendEmoji={(emoji) => {
              if (props.multiplayerRoomId) {
                socketService.emit('player_action', {
                  roomId: props.multiplayerRoomId,
                  action: 'EMOJI',
                  payload: { emoji }
                });
                props.setEmojiEvent({ player: 'YOU', emoji, id: Date.now() });
              }
            }}
          />
        </div>
      </div>

      {/* Animated Roll Modal Overlay */}
      <DiceModal
        isOpen={props.showDiceModal}
        diceValue={props.diceVal}
        landedTile={props.landedTileInfo}
        tactic={props.selectedTactic}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={props.isRulesOpen}
        onClose={() => props.setIsRulesOpen(false)}
      />

      {/* Settings & Options Drawer */}
      <SettingsDrawer
        isOpen={props.isSettingsOpen || props.isMenuOpen}
        onClose={() => {
          props.setIsSettingsOpen(false);
          props.setIsMenuOpen(false);
        }}
        settings={props.settings}
        onUpdateSettings={(newSet) => props.setSettings((prev) => ({ ...prev, ...newSet }))}
        onRestartMatch={props.handleRestartMatch}
        onExitToLobby={props.handleExitToLobby}
        isMultiplayer={!!props.multiplayerRoomId}
        showLogout={props.activeScreen === 'LOBBY'}
        showExitToLobby={props.activeScreen === 'GAME'}
      />

      {/* Match End Summary Modal */}
      <MatchEndModal
        isOpen={props.phase === 'MATCH_OVER' && props.activeScreen === 'GAME'}
        youState={props.youState}
        aiState={props.aiState}
        targetRuns={props.targetRuns}
        onPlayAgain={props.multiplayerRoomId ? undefined : props.handleRestartMatch}
        onExitToLobby={props.handleExitToLobby}
      />
    </>
  );
};
