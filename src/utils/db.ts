import { Client } from "pg";

export const connectToDb = () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.ENVIRONMENT !== "development" ? true : false,
  });

  client.connect();
};
