const mongoose = require("mongoose");

const ServerSchema = new mongoose.Schema({
  serverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  roomCount: { type: Number, default: 0 },
  userCount: { type: Number, default: 0 },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Server", ServerSchema);
