import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";
import logger from "../utils/logger.js";

const helpDeskRouter = express.Router();
helpDeskRouter.use(tokenMiddleware);

helpDeskRouter;
helpDeskRouter.get("/", async (req, res) => {
  try {
    const user = await client.helpdesk.findMany({
      where: {
        userId: req.user.userId,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

helpDeskRouter.post("/create-helpdesk", async (req, res) => {
  const id = uuidv4();
  try {
    const newHelpDesk = await client.helpdesk.create({
      data: {
        id,
        ...req.body,
        user: {
          connect: {
            id: req.user.userId,
          },
        },
        pbt: {
          connect: {
            id: req.body.pbt,
          },
        },
      },
    });
    res.status(200).json(newHelpDesk);
  } catch (error) {
    logger.error(error);
    return res.status(400).send(error);
  }
});

export default helpDeskRouter;
