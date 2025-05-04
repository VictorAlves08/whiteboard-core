require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initWebSocket = require("./ws/socket");

const PORT = process.env.PORT || 4000;

connectDB();
const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`whiteboard-core rodando na porta ${PORT}`);
});
