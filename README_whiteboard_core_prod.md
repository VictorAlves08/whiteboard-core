# 🧠 whiteboard-core (Ambiente de Produção)

O `whiteboard-core` é um serviço de monitoramento de servidores backend que participam de um sistema de whiteboard colaborativo e distribuído. Ele recebe dados via **WebSocket**, armazena em um **MongoDB**, e expõe uma **API REST** para consulta dos servidores ativos.

## 🌐 Ambiente de Produção

Este guia apresenta como conectar seu servidor backend ao `whiteboard-core` **em produção**.

### 🔗 Endpoints de Produção

- **WebSocket**: `wss://whiteboard-core.onrender.com`
- **REST API**: `https://whiteboard-core.onrender.com/servers`

---

## 📡 Conectando via WebSocket

Seu servidor deve se conectar via WebSocket e enviar um JSON a cada 10 segundos contendo o status atual.

### 🎯 Estrutura do JSON

```json
{
  "serverId": "main-server-X",
  "name": "Servidor Grupo_X",
  "roomCount": 1,
  "userCount": 0,
  "status": "online"
}
```

### ⚠️ Considerações Importantes!

- A hospedagem Render pode estar inativa inicialmente. Verifique o status: `https://whiteboard-core.onrender.com/servers`
- É recomendável implementar **reconexão automática** com retry a cada **30 segundos**.
- O envio dos dados deve ser repetido a cada **10 segundos** enquanto o servidor estiver online.

---

## 🧑‍💻 Exemplo em Node.js

> Requisitos:

```bash
npm install ws
```

```js
// wsClient.js
const WebSocket = require("ws");

const SERVER_URL = "wss://whiteboard-core.onrender.com";
const RETRY_INTERVAL = 30000;
const SEND_INTERVAL = 10000;

let ws;

function connect() {
  ws = new WebSocket(SERVER_URL);

  ws.on("open", () => {
    console.log("[✓] Conectado ao whiteboard-core");

    setInterval(() => {
      const data = {
        serverId: "main-server-X",
        name: "Servidor Grupo_X",
        roomCount: 1, //numero de salas, por default pode ser 1
        userCount: 0, //numero de usuarios ativos em sala/whiteboard
        status: "online",
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
        console.log("[→] Dados enviados:", data);
      }
    }, SEND_INTERVAL);
  });

  ws.on("close", () => {
    console.warn("[!] Conexão fechada. Tentando reconectar...");
    setTimeout(connect, RETRY_INTERVAL);
  });

  ws.on("error", (err) => {
    console.error("[x] Erro na conexão:", err.message);
    ws.close();
  });
}

connect();
```

---

## 🐍 Exemplo em Python

> Requisitos:

```bash
pip install websocket-client
```

```python
# ws_client.py
import websocket
import threading
import json
import time

WS_URL = "wss://whiteboard-core.onrender.com"
RETRY_INTERVAL = 30
SEND_INTERVAL = 10

def send_data(ws):
    while True:
        data = {
            "serverId": "main-server-X",
            "name": "Servidor Grupo_X",
            "roomCount": 1, ## numero de salas, por default pode ser 1
            "userCount": 0, ## numero de usuarios ativos em sala/whiteboard
            "status": "online"
        }
        ws.send(json.dumps(data))
        print("[→] Dados enviados:", data)
        time.sleep(SEND_INTERVAL)

def on_open(ws):
    print("[✓] Conectado ao whiteboard-core")
    thread = threading.Thread(target=send_data, args=(ws,))
    thread.start()

def on_close(ws, close_status_code, close_msg):
    print("[!] Conexão fechada. Tentando reconectar em 30s...")
    time.sleep(RETRY_INTERVAL)
    start_connection()

def on_error(ws, error):
    print("[x] Erro:", error)

def start_connection():
    ws = websocket.WebSocketApp(WS_URL, on_open=on_open, on_close=on_close, on_error=on_error)
    ws.run_forever()

start_connection()
```

---

## 🔍 Consultando via API REST

Para consultar os servidores conectados ao `whiteboard-core`:

### Endpoint

```
GET https://whiteboard-core.onrender.com/servers
```

### Exemplo de resposta:

```json
[
  {
    "serverId": "main-server-G8",
    "lastUpdate": "2025-05-16T01:36:07.045Z",
    "name": "Servidor do G8",
    "roomCount": 1,
    "status": "offline",
    "userCount": 0
  }
]
```

### Em Node.js

```js
const fetch = require("node-fetch");

fetch("https://whiteboard-core.onrender.com/servers")
  .then((res) => res.json())
  .then((data) => console.log("[✓] Servidores conectados:", data));
```

### Em Python

```python
import requests

res = requests.get("https://whiteboard-core.onrender.com/servers")
print("[✓] Servidores conectados:", res.json())
```

---

## ✅ Boas Práticas

- Verifique a disponibilidade da rota `/servers` antes de tentar conectar via WebSocket.
- Mantenha o `serverId` como identificador **único e constante**.
- Use `status: "offline"` se seu backend estiver desconectando ou sendo reiniciado.
- Implemente reconexão com `exponential backoff` em ambientes instáveis.

---
