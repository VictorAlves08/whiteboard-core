const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Core"
    });
    console.log("MongoDB conectado com sucesso");
  } catch (err) {
    console.error("Erro ao conectar MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
