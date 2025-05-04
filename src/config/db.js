const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    });
    console.log("MongoDB Atlas conectado com sucesso");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
