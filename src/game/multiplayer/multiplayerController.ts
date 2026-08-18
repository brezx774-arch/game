import { socketService } from '../../utils/socket';

export const multiplayerController = {
  joinMatchmaking: () => {
    socketService.connect();
    socketService.emit('join_matchmaking');
  },
  cancelMatchmaking: () => {
    socketService.emit('cancel_matchmaking');
  },
  createRoom: (name: string, avatar: string) => {
    socketService.connect();
    socketService.emit('create_room', { name, avatar });
  },
  joinRoom: (roomCode: string) => {
    socketService.connect();
    socketService.emit('join_room', { roomCode });
  },
  leaveRoom: (roomId: string) => {
    socketService.emit('player_action', {
      roomId,
      action: 'LEAVE',
      payload: {}
    });
  },
  submitTurn: (roomId: string, action: any) => {
    socketService.emit('player_action', {
      roomId,
      action: 'SUBMIT_TURN',
      payload: action
    });
  },
  sendEmoji: (roomId: string, emoji: string) => {
    socketService.emit('player_action', {
      roomId,
      action: 'EMOJI',
      payload: { emoji }
    });
  },
  tossResult: (roomId: string, choice: string, result: string, winnerId: string) => {
    socketService.emit('player_action', {
      roomId,
      action: 'TOSS_RESULT',
      payload: { choice, result, winnerId }
    });
  }
};
