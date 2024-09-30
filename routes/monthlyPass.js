import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import logger from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";

const monthlyPassRouter = express.Router();

monthlyPassRouter.get("/public", async (req, res) => {
  try {
    const monthlyPass = await client.monthlyPass.findMany();
    res.status(200).json(monthlyPass);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

monthlyPassRouter.use(tokenMiddleware);

monthlyPassRouter
  .get("/", async (req, res) => {
    const userId = req.user.userId; // Assuming this is obtained via authentication middleware
    try {
      const monthlyPass = await client.monthlyPass.findMany({
        where: { userId },
      });
      res.status(200).json(monthlyPass);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })

  .post("/create", async (req, res) => {
    const userId = req.user.userId; // Assuming this is obtained via authentication middleware
    const { plateNumber, pbt, amount, duration, location } = req.body; // Destructure relevant data from req.body
    const id = uuidv4(); // Generate unique ID for MonthlyPass

    try {
      // Create a new MonthlyPass
      const newMonthlyPass = await client.monthlyPass.create({
        data: {
          id,
          userId,
          plateNumber,
          pbt,
          location,
          amount: amount || 0, // Default to 0 if not provided
          duration: duration || "0 Month", // Default to "0 Month" if not provided
        },
      });

      res.status(201).json({ status: "success", data: newMonthlyPass });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  .put("/edit/:id", async (req, res) => {
    const { id } = req.params; // The MonthlyPass ID from the URL parameter
    const userId = req.user.userId; // Assuming user authentication middleware
    const { plateNumber, pbt, amount, duration } = req.body; // Data to update

    try {
      // Check if the MonthlyPass exists and belongs to the user
      const existingPass = await client.monthlyPass.findUnique({
        where: { id },
      });

      if (!existingPass || existingPass.userId !== userId) {
        return res.status(404).json({
          error:
            "MonthlyPass not found or you don't have permission to edit this pass.",
        });
      }

      // Update the MonthlyPass
      const updatedMonthlyPass = await client.monthlyPass.update({
        where: { id },
        data: {
          plateNumberId: plateNumber || existingPass.plateNumberId,
          pbtId: pbt || existingPass.pbtId,
          amount: amount !== undefined ? amount : existingPass.amount, // Update only if provided
          duration: duration || existingPass.duration, // Update only if provided
        },
      });

      res.status(200).json({ status: "success", data: updatedMonthlyPass });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  .delete("/delete/:id", async (req, res) => {
    const { id } = req.params; // The MonthlyPass ID from the URL parameter
    const userId = req.user.userId; // Assuming user authentication middleware

    try {
      // Check if the MonthlyPass exists and belongs to the user
      const existingPass = await client.monthlyPass.findUnique({
        where: { id },
      });

      if (!existingPass || existingPass.userId !== userId) {
        return res.status(404).json({
          error:
            "MonthlyPass not found or you don't have permission to delete this pass.",
        });
      }

      // Delete the MonthlyPass
      await client.monthlyPass.delete({
        where: { id },
      });

      res.status(200).json({
        status: "success",
        message: "MonthlyPass deleted successfully.",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default monthlyPassRouter;
