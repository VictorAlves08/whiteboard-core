const express = require("express");
const router = express.Router();
const Server = require("../models/Server");

router.get("/", async (req, res) => {
  try {
    const servers = await Server.find().sort({ name: 1 });
    res.json(servers);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar servidores" });
  }
});

module.exports = router;
