import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { getDatabase } from '../config/database';
import { WebSocketMessage, ServerInstance } from '@/types/websocket';

export class WebSocketService {
  public io: Server;
  private httpServer: HttpServer;
  private instances: Map<string, { socket: Socket; lastHeartbeat: Date }> = new Map();
  private readonly HEARTBEAT_TIMEOUT = 30000; // 30 seconds
  private readonly UPDATE_RATE_LIMIT = 10; // 10 updates per second

  constructor(httpServer: HttpServer) { 
    this.httpServer = httpServer;
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ['GET', 'POST']
      }
    });

    this.setupEvents();
    this.startHeartbeatCheck();
  }
  

  private setupEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`New connection: ${socket.id}`);

      socket.on('register', async (data: WebSocketMessage) => {
        try {
          if (!this.validateInstanceData(data.data)) {
            socket.emit('error', {
              type: 'error',
              code: 'INVALID_DATA',
              message: 'Invalid instance data'
            });
            return;
          }

          const db = await getDatabase();
          const instancesCollection = db.collection('instances');
          
          const existingInstance = await instancesCollection.findOne({ id: data.data.id });
          if (existingInstance) {
            socket.emit('error', {
              type: 'error',
              code: 'DUPLICATE_ID',
              message: 'Instance ID already exists'
            });
            return;
          }

          const instance: ServerInstance = {
            ...data.data,
            lastUpdate: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          };

          await instancesCollection.insertOne(instance);
          this.instances.set(data.data.id, { socket, lastHeartbeat: new Date() });
          
          console.log(`Instance registered: ${data.data.id}`);
          socket.emit('registered', { success: true });
        } catch (error) {
          console.error('Registration error:', error);
          socket.emit('error', {
            type: 'error',
            code: 'INTERNAL_ERROR',
            message: 'Internal server error'
          });
        }
      });

      socket.on('update', async (data: WebSocketMessage) => {
        try {
          if (!this.validateInstanceData(data.data)) {
            socket.emit('error', {
              type: 'error',
              code: 'INVALID_DATA',
              message: 'Invalid instance data'
            });
            return;
          }

          const db = await getDatabase();
          const instancesCollection = db.collection('instances');
          
          const instance = this.instances.get(data.data.id);
          if (!instance) {
            socket.emit('error', {
              type: 'error',
              code: 'UNAUTHORIZED',
              message: 'Instance not registered'
            });
            return;
          }

          const updateData = {
            ...data.data,
            lastUpdate: new Date().toISOString()
          };

          await instancesCollection.updateOne(
            { id: data.data.id },
            { $set: updateData }
          );

          console.log(`Instance updated: ${data.data.id}`);
        } catch (error) {
          console.error('Update error:', error);
          socket.emit('error', {
            type: 'error',
            code: 'INTERNAL_ERROR',
            message: 'Internal server error'
          });
        }
      });

      socket.on('heartbeat', (data: WebSocketMessage) => {
        const instance = this.instances.get(data.data.id);
        if (instance) {
          instance.lastHeartbeat = new Date();
          console.log(`Heartbeat received from: ${data.data.id}`);
        }
      });

      socket.on('disconnect', () => {
        for (const [id, instance] of this.instances.entries()) {
          if (instance.socket === socket) {
            this.instances.delete(id);
            this.markInstanceAsOffline(id);
            console.log(`Instance disconnected: ${id}`);
          }
        }
      });
    });
  }

  private async markInstanceAsOffline(id: string) {
    try {
      const db = await getDatabase();
      const instancesCollection = db.collection('instances');
      await instancesCollection.updateOne(
        { id },
        { $set: { status: 'offline', lastUpdate: new Date().toISOString() } }
      );
    } catch (error) {
      console.error('Error marking instance as offline:', error);
    }
  }

  private startHeartbeatCheck() {
    setInterval(() => {
      const now = new Date();
      for (const [id, instance] of this.instances.entries()) {
        if (now.getTime() - instance.lastHeartbeat.getTime() > this.HEARTBEAT_TIMEOUT) {
          this.instances.delete(id);
          this.markInstanceAsOffline(id);
          console.log(`Instance timed out: ${id}`);
        }
      }
    }, 10000); // Check every 10 seconds
  }

  private validateInstanceData(data: any): boolean {
    return (
      typeof data.id === 'string' &&
      data.id.length > 0 &&
      typeof data.name === 'string' &&
      data.name.length > 0 &&
      typeof data.roomCount === 'number' &&
      data.roomCount >= 0 &&
      typeof data.userCount === 'number' &&
      data.userCount >= 0 &&
      ['online', 'offline'].includes(data.status) &&
      typeof data.timestamp === 'string' &&
      !isNaN(Date.parse(data.timestamp))
    );
  }
}