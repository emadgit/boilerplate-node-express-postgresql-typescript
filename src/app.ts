import http from "http";
import express from "express";
import { Client } from "pg";
import { logger } from "./utils/logger";
import { applyMiddleware, applyRoutes } from "./utils/index";
import routes from "./services";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";

process.on("uncaughtException", e => {
  logger.error(e);
  process.exit(1);
});
process.on("unhandledRejection", e => {
  if (e) {
    logger.error(e);
  }
  process.exit(1);
});

const router = express();
applyMiddleware(middleware, router); // Apply our wrapped middlewares
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const server = http.createServer(router);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.ENVIRONMENT !== "development" ? true : false
});

client.connect();
logger.info("Connected to Postgresql!");

// start the Express server
server.listen(process.env.PORT, () => {
  logger.info(`Server started at http://localhost:${process.env.PORT}`);
});
