const express = require("express");
const cors = require("cors");
const serversRoute = require("./routes/servers");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/servers", serversRoute);

module.exports = app;
