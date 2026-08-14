import { io, Socket } from 'socket.io-client';

// Replace with your actual server URL in production if different
const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

class SocketService {
  public socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (!this.socket) {
      this.socket = io(SERVER_URL);
      
      this.socket.on('connect', () => {
        console.log('Connected to server with ID:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Pass all events to listeners
      this.socket.onAny((event, ...args) => {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
          eventListeners.forEach(listener => listener(...args));
        }
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
