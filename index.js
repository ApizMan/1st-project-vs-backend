import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.js";
import reservebayRouter from "./routes/reservebay.js";
import transactionRouter from "./routes/transaction.js";
import carplatenumRouter from "./routes/plateNumber.js";
import pbtRouter from "./routes/pbt.js";
import walletRouter from "./routes/wallet.js";
import paymentRouter from "./routes/payment.js";
import helpDeskRouter from "./routes/helpdesk.js";
import logger from "./utils/logger.js";
import { checkDbConnection } from "./utils/db.js";
import bodyParser from "body-parser";
import client from "./utils/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import compoundRouter from "./routes/compound.js";
import paymentfpxRouter from "./routes/paymentfpx.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(errorHandler);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
);

app.use("/auth", authRouter);
app.use("/reservebay", reservebayRouter);
app.use("/transaction", transactionRouter);
app.use("/carplatenumber", carplatenumRouter);
app.use("/pbt", pbtRouter);
app.use("/wallet", walletRouter);
app.use("/payment", paymentRouter);
app.use("/helpdesk", helpDeskRouter);
app.use("/compound", compoundRouter);
app.use("/paymentfpx", paymentfpxRouter);

const startupTime = new Date();

app.get("/health", async (_req, res) => {
  try {
    await client.user.findFirst();
  } catch (error) {
    return res.status(500).json({
      status: `Failed database initialization check with error: ${error?.message}`,
      time: new Date(),
      startupTime,
    });
  }
  return res.json({
    status: "healthy",
    time: new Date(),
    startupTime,
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  checkDbConnection();
});

export default app;
