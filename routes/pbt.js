import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";
import logger from "../utils/logger.js";

const pbtRouter = express.Router();

pbtRouter.get("/public", async (req, res) => {
  try {
    const pbt = await client.pbt.findMany();
    res.status(200).json(pbt);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

pbtRouter.use(tokenMiddleware);

pbtRouter
  .get("/", async (req, res) => {
    try {
      const pbt = await client.pbt.findMany();
      res.status(200).json(pbt);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .post("/create", async (req, res) => {
    const id = uuidv4();
    try {
      const newPbt = await client.pbt.create({
        data: {
          id,
          ...req.body,
        },
      });
      res.status(201).json(newPbt);
    } catch (error) {
      logger.error(error);
      return res.status(400).send(error);
    }
  })
  .put("/update/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedPbt = await client.pbt.update({
        where: {
          id,
          userId: req.user.userId,
        },
        data: {
          ...req.body,
        },
      });
      res.status(200).json(updatedPbt);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error.message);
    }
  })
  .post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await client.pbt.delete({
        where: {
          id,
          userId: req.user.userId,
        },
      });
      res.status(200).json({ message: "Delete success" });
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error.message);
    }
  });

export default pbtRouter;
