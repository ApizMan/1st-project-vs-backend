import express from "express";
import client from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";
import { tokenMiddleware } from "../utils/authUtils.js";
const transactionRouter = express.Router();

transactionRouter.get("/allTransactionWallet", async (req, res) => {
  try {
    const users = await client.walletTransaction.findMany();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

transactionRouter.use(tokenMiddleware);

transactionRouter
  .get("/", async (req, res) => {
    try {
      const allTransaction = await client.transaction.findMany({
        where: {
          userId: req.user.userId,
        },
        select: {
          description: true,
          amount: true,
          createdAt: true,
          pbt: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json(allTransaction);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  })
  .post("/create", async (req, res) => {
    const userId = req.user.userId;
    try {
      const newTransaction = await client.transaction.create({
        data: {
          id: uuidv4(),
          ...req.body,
          user: {
            connect: {
              id: userId,
            },
          },
          pbt: {
            connect: {
              id: req.body.pbt,
            },
          },
        },
      });
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default transactionRouter;
