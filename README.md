# 🧠 Whiteboard Core

Este serviço `whiteboard-core` atua como um **núcleo de monitoramento** de servidores backend que participam de um sistema de whiteboard colaborativo e distribuído. Ele coleta informações via **WebSocket**, armazena em **MongoDB**, e expõe uma **API REST** para consulta.

---

## 🚀 Funcionalidades

- Recebe dados de múltiplos servidores via WebSocket
- Armazena no MongoDB as seguintes informações:
  - `serverId`, `name`
  - `roomCount`, `userCount`
  - `status`: online/offline
  - `lastUpdate`: última atualização
- Atualiza status para `offline` automaticamente se a conexão for encerrada
- Disponibiliza rota REST `GET /servers` para frontend

---

## 🛠️ Pré-requisitos

- Node.js v18+
- MongoDB Atlas ou local
- NPM ou Yarn

---

## 📦 Instalação Local

```bash
git clone https://github.com/VictorAlves08/whiteboard-app.git
cd whiteboard-core
npm install
```

Crie um arquivo `.env` com:

```env
MONGODB_URI=mongodb+srv://<usuario>:<senha>@clusterwhiteboard.mongodb.net/whiteboard-core?retryWrites=true&w=majority
PORT=4000
```

Inicie o projeto:

```bash
npm run dev
```

Acesse:

- WebSocket: `ws://localhost:4000`
- REST API: `http://localhost:4000/servers`

---

## 🌐 Conectar um Backend ao Core

Cada backend deve:

1. Conectar-se via WebSocket:

   - Local: `ws://localhost:4000`
   - Produção: `ws://<seu-subdomínio>.onrender.com`

2. Enviar a cada 10 segundos:

```json
{
  "serverId": "main-server-001",
  "name": "Servidor Grupo_X",
  "roomCount": 3,
  "userCount": 5,
  "status": "online"
}
```

3. Ao desconectar, o core marcará automaticamente:
   - `status`: `"offline"`
   - `userCount`: `0`

---

## 📡 Rota REST

- `GET /servers`: lista os servidores conectados/desconectados com todas as informações.

---
