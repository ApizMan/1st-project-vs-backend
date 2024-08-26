import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const exportFormat = combine(json(), timestamp());

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: exportFormat,
    }),
    new winston.transports.File({
      filename: "./logs/combined.log",
      level: "info",
      format: exportFormat,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "./logs/exception.log",
      format: exportFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: "./logs/rejections.log",
      format: exportFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: "debug",
      handleExceptions: true,
    }),
  );
}

export default logger;
