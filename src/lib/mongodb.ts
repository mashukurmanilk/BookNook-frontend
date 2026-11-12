import dns from "node:dns";
import { MongoClient } from "mongodb";

// Configure reliable DNS servers for Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const uri =
  process.env.MONGODB_URI ||
  "mongodb://mashukurmanik_booknook:0lr2CpeFzLVvG5Nd@ac-s0yaqn0-shard-00-00.jcsvfv3.mongodb.net:27017,ac-s0yaqn0-shard-00-01.jcsvfv3.mongodb.net:27017,ac-s0yaqn0-shard-00-02.jcsvfv3.mongodb.net:27017/BookNook?ssl=true&authSource=admin&retryWrites=true&w=majority";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
