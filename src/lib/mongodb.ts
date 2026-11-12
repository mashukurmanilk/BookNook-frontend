import dns from "node:dns";
import { MongoClient } from "mongodb";

// Configure reliable DNS servers for Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mashukurmanik_booknook:0lr2CpeFzLVvG5Nd@cluster0.jcsvfv3.mongodb.net/BookNook?retryWrites=true&w=majority";

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
