import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
   throw new Error("Missing MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;

declare global {
   // eslint-disable-next-line no-var
   var _mongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === "development") {
   if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri, options);
   }
   client = global._mongoClient;
} else {
   client = new MongoClient(uri, options);
}

export const mongoClient = client;
export const db = client.db(process.env.DB_NAME || "plantShopDB");
