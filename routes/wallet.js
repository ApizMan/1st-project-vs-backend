import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import client from "../utils/db.js";
import logger from "../utils/logger.js";

const walletRouter = express.Router();
walletRouter.use(tokenMiddleware);

walletRouter
  .get("/", async (req, res) => {
    try {
      const wallets = await client.wallet.findMany();
      res.status(200).json(wallets);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .get("/wallet-info", async (req, res) => {
    const id = req.user.userId;
    try {
      const wallet = await client.wallet.findUnique({
        where: { userId: id },
      });
      res.status(200).json(wallet);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  });

export default walletRouter;
