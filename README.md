# 🧠 Whiteboard Core

O `whiteboard-core` atua como um **núcleo de monitoramento** de servidores backend que participam de um sistema de whiteboard colaborativo e distribuído. Ele coleta informações via **WebSocket**, armazena em **MongoDB**, e expõe uma **API REST** para consulta.

---

## 🚀 Funcionalidades

- Recebe dados de múltiplos servidores via WebSocket
- Armazena no MongoDB as seguintes informações:
  - `serverId`, `name` (nome do servidor)
  - `roomCount` (salas criadas), `userCount` (usuários ativos dentro das salas)
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

## ▶️ Como Rodar o Projeto

### 🌐 Em Produção

Consulte a documentação completa aqui:  
📄 [Guia de Produção](https://github.com/VictorAlves08/whiteboard-core/blob/main/README_whiteboard_core_prod.md)

### 🖥️ Localmente

Consulte a documentação completa aqui:  
📄 [Guia Local](https://github.com/VictorAlves08/whiteboard-core/blob/main/README_whiteboard_core_local.md)

---

## 📡 Rota REST

- `GET /servers`: lista os servidores conectados/desconectados com todas as informações armazenadas no MongoDB. Acesse: https://whiteboard-core.onrender.com/servers

---

## 📄 Licença

Este projeto está licenciado sob os termos da **MIT License**.
