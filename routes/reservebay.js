import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";
import logger from "../utils/logger.js";

const reservebayRouter = express.Router();

reservebayRouter.get("/public", async (req, res) => {
  try {
    const reserveBays = await client.reserveBay.findMany();
    res.status(200).json(reserveBays);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

reservebayRouter.use(tokenMiddleware);

reservebayRouter
  .get("/", async (req, res) => {
    try {
      const reserveBays = await client.reserveBay.findMany();
      res.status(200).json(reserveBays);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })

  .post("/create", async (req, res) => {
    const userId = req.user.userId;
    const id = uuidv4();
    try {
      const newReservebay = await client.reserveBay.create({
        data: {
          id,
          userId,
          ...req.body,
        },
      });
      res.status(201).json(newReservebay);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .post("/delete", async (req, res) => {
    try {
      const { reservedBayId } = req.body;
      const deleted = await client.reserveBay.delete({
        where: {
          id: reservedBayId,
        },
      });

      res.status(201).json(deleted);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  });

export default reservebayRouter;
