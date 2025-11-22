export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  volume: number; // 0 to 1
  isLoading: boolean;
  error: string | null;
}

export enum ConnectionStatus {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  CONNECTED = 'Live',
  ERROR = 'Stream Offline'
}