import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const errorId = res.sentry;
  err.cause = err.cause || "Unknown";
  logger.error(err.message);
  res.status(500).send({ errors: err.message, errorId });
};
