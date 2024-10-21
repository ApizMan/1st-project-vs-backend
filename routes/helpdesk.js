import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";
import logger from "../utils/logger.js";

const helpDeskRouter = express.Router();

helpDeskRouter
  .get("/public", async (req, res) => {
    try {
      const helpdesk = await client.helpdesk.findMany();

      res.status(200).json(helpdesk);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .get("/single/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const singleHelpDesk = await client.helpdesk.findUnique({
        where: { id },
      });
      res.status(200).json(singleHelpDesk);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  });

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
    // Destructure the relevant fields from req.body
    const { description, pbtId } = req.body;

    // Ensure that req.user and req.body contain the necessary data
    const userId = req.user?.userId;

    if (!userId || !pbtId || !description) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Create a new helpdesk entry in the database
    const newHelpDesk = await client.helpdesk.create({
      data: {
        id,
        description, // Provide the required description
        user: {
          connect: {
            id: userId, // Connect the user by their id
          },
        },
        pbt: {
          connect: {
            id: pbtId, // Connect the pbt by its id
          },
        },
      },
    });

    // Return the newly created helpdesk entry
    res.status(200).json(newHelpDesk);
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ error: error.message });
  }
});

export default helpDeskRouter;
