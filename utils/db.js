import { PrismaClient } from "@prisma/client";
import logger from "./logger.js";

const dev = process.env.NODE_ENV !== "production";
const LOGGING_EVENTS = [
  {
    emit: "event",
    level: "query",
  },
  {
    emit: "event",
    level: "error",
  },
  {
    emit: "event",
    level: "info",
  },
  {
    emit: "event",
    level: "warn",
  },
];

const prisma = new PrismaClient({
  log: LOGGING_EVENTS,
});

LOGGING_EVENTS.forEach((event) => {
  prisma.$on(event.level, (e) => {
    if (event.level === "error") {
      logger.error(e);
    } else if (event.level === "info") {
      logger.info(e);
    } else if (event.level === "warn") {
      logger.warn(e);
    } else if (event.level === "query") {
      logger.debug(
        `Query: ${e.query} Parameters: ${e.params} Duration: ${e.duration}ms`,
      );
    }
  });
});

export async function checkDbConnection() {
  try {
    await prisma.$connect();
    logger.info("Connected to the database");
  } catch (error) {
    logger.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
