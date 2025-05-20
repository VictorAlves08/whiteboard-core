# 🧠 whiteboard-core (Ambiente Local)

Este guia explica como executar o serviço `whiteboard-core` localmente e conectar um backend ao WebSocket para fins de desenvolvimento e testes.

---

## 📥 1. Clonando o repositório

```bash
git clone https://github.com/VictorAlves08/whiteboard-core.git
cd whiteboard-core
```

---

## ⚙️ 2. Instalando dependências

```bash
npm install
```

---

## 🔐 3. Criando o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=4000
MONGODB_URI=mongodb:
```

> 💡 Solcite a `MONGODB_URI` ao admin do repositório.

---

## 🚀 4. Rodando o servidor local

```bash
npm run dev
```

> O backend iniciará em `http://localhost:4000` e aceitará conexões WebSocket em `ws://localhost:4000`.

---

## 🧩 5. Estrutura local

- **MongoDB**: armazena dados dos servidores conectados
- **WebSocket**: recebe conexões e atualizações periódicas
- **REST API**: expõe rota `GET /servers` com dados dos servidores registrados

---

## 🔌 6. Conectando um backend-app ao WebSocket local

> Siga o mesmo passo a passo descrito na documentação de produção:
> https://github.com/VictorAlves08/whiteboard-core/blob/main/README_whiteboard_core_prod.md
> Apenas **substitua a `SERVER_URL` para `ws://localhost:4000`** ao implementar a conexão local.

---

## 🌐 7. Testando a API REST

### Endpoint

```
GET http://localhost:4000/servers
```

### Exemplo de resposta:

```json
[
  {
    "serverId": "local-server-X",
    "lastUpdate": "2025-05-19T00:00:00.000Z",
    "name": "Servidor Local",
    "roomCount": 2,
    "status": "online",
    "userCount": 4
  }
]
```

---

## 🧪 8. Verificando a persistência

1. Conecte um servidor via WebSocket com JSON válido
2. Acesse `http://localhost:4000/servers` no navegador
3. Pare o cliente → o status será atualizado para `offline` automaticamente

---

## ✅ 9. Requisitos

- Node.js v18+
- MongoDB local rodando (ou URI de Atlas)
- Porta `4000` disponível

---

## 🧠 Arquitetura

- `server.js`: ponto de entrada, inicializa HTTP + WebSocket
- `app.js`: configura Express e rotas
- `ws/socket.js`: gerencia conexões WebSocket e persistência
- `models/Server.js`: schema Mongoose
- `routes/servers.js`: rota REST para listar servidores
- `config/db.js`: conexão com MongoDB

---
