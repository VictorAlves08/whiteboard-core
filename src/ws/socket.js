const WebSocket = require("ws");
const Server = require("../models/Server");

const socketToServerMap = new Map();

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("[core] Nova conexão recebida");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        const { serverId, name, roomCount, userCount, status } = data;

        // Salva o vínculo socket <-> serverId
        socketToServerMap.set(ws, serverId);

        await Server.findOneAndUpdate(
          { serverId },
          {
            name,
            roomCount,
            userCount,
            status,
            lastUpdate: new Date(),
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error("[core] Erro ao processar mensagem:", err.message);
      }
    });

    ws.on("close", async () => {
      const serverId = socketToServerMap.get(ws);
      if (serverId) {
        console.log(`[core] Conexão com ${serverId} encerrada`);

        await Server.findOneAndUpdate(
          { serverId },
          {
            status: "offline",
            userCount: 0,
            lastUpdate: new Date(),
          }
        );

        socketToServerMap.delete(ws);
      }
    });
  });

  return wss;
}

module.exports = initWebSocket;
