export interface WebSocketMessage {
  type: 'register' | 'update' | 'heartbeat';
  data: {
    id: string;
    name: string;
    roomCount: number;
    userCount: number;
    status: 'online' | 'offline';
    timestamp: string;
  };
}

export interface ServerInstance {
  id: string;
  name: string;
  roomCount: number;
  userCount: number;
  status: 'online' | 'offline';
  lastUpdate: string;
  lastHeartbeat: string;
} 