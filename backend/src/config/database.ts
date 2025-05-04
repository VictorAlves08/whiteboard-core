import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "sua_uri_mongodb_aqui";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let mongoClient: MongoClient;

export async function connectToMongoDB() {
  if (mongoClient) return mongoClient;
  
  try {
    mongoClient = await client.connect();
    console.log("Conectado ao MongoDB!");
    return mongoClient;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

export async function getDatabase(dbName: string = "Core") {
  const client = await connectToMongoDB();
  return client.db(dbName);
}