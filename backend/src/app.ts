import express from "express";
import cors from "cors";
import { createServer } from "http";
import serverRoutes from "./routes/serverRoutes";
import { WebSocketService } from "./services/WebSocketService";

const app = express();
const httpServer = createServer(app);

const PORT = 3002;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

new WebSocketService(httpServer);

app.use("/api", serverRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});