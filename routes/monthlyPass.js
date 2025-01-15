import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import logger from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";
import { now } from "sequelize/lib/utils";

const monthlyPassRouter = express.Router();

monthlyPassRouter
  .get("/public", async (req, res) => {
    try {
      const monthlyPass = await client.monthlyPass.findMany();

      res.status(200).json(monthlyPass);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .get("/single/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const singleMonthlyPass = await client.monthlyPass.findUnique({
        where: { id },
      });

      res.status(200).json(singleMonthlyPass);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .post("/public/create", async (req, res) => {
    const {
      userId,
      promotionId,
      noReceipt,
      plateNumber,
      pbt,
      amount,
      duration,
      location,
      createdAt,
    } = req.body; // Destructure relevant data from req.body
    const id = uuidv4(); // Generate unique ID for MonthlyPass

    try {
      // Create a new MonthlyPass
      const newMonthlyPass = await client.monthlyPass.create({
        data: {
          id,
          userId: userId,
          promotionId: promotionId ?? null,
          noReceipt: noReceipt,
          plateNumber: plateNumber,
          pbt: pbt,
          location: location,
          amount: amount || 0, // Default to 0 if not provided
          duration: duration || "0 Month", // Default to "0 Month" if not provided
          createdAt: createdAt || new Date(),
        },
      });

      res.status(201).json({ status: "success", data: newMonthlyPass });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const {
      userId,
      promotionId,
      plateNumber,
      pbt,
      location,
      amount,
      duration,
    } = req.body; // Data to update

    try {
      // Check if the monthly pass exists and belongs to the user
      const existingMonthlyPass = await client.monthlyPass.findUnique({
        where: { id },
      });

      if (!existingMonthlyPass) {
        return res.status(404).json({
          error: "Monthly Pass not found.",
        });
      }

      // Update the monthly pass entry
      const updatedMonthlyPass = await client.monthlyPass.update({
        where: { id },
        data: {
          userId: userId || existingMonthlyPass.userId,
          promotionId: promotionId || existingMonthlyPass.promotionId,
          plateNumber: plateNumber || existingMonthlyPass.plateNumber,
          pbt: pbt || existingMonthlyPass.pbt,
          location: location || existingMonthlyPass.location,
          amount: amount || existingMonthlyPass.amount,
          duration: duration || existingMonthlyPass.duration,
          createdAt: new Date(),
        },
      });

      res.status(200).json({ status: "success", data: updatedMonthlyPass });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .delete("/delete/:id", async (req, res) => {
    const { id } = req.params; // The Parking ID from the URL parameter
    try {
      // Check if the monthly pass entry exists and belongs to the user
      const existingMonthlyPass = await client.monthlyPass.findUnique({
        where: { id },
      });

      if (!existingMonthlyPass) {
        return res.status(404).json({
          error: "Monthly Pass not found.",
        });
      }

      // Delete the monthly pass entry
      await client.monthlyPass.delete({
        where: { id },
      });

      res.status(200).json({
        status: "success",
        message: "Monthly Pass deleted successfully.",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
    const {
      plateNumber,
      promotionId,
      pbt,
      amount,
      duration,
      location,
      noReceipt,
    } = req.body; // Destructure relevant data from req.body
    const id = uuidv4(); // Generate unique ID for MonthlyPass

    try {
      // Create a new MonthlyPass
      const newMonthlyPass = await client.monthlyPass.create({
        data: {
          id,
          userId,
          promotionId: promotionId ?? null,
          noReceipt,
          plateNumber,
          pbt,
          location,
          amount: amount || 0, // Default to 0 if not provided
          duration: duration || "0 Month", // Default to "0 Month" if not provided
        },
      });

      // Fetch the current timeUse for the user and promotion
      let currentPromotionHistory = await client.promotionHistory.findFirst({
        where: {
          userId: userId,
          promotionId: promotionId,
        },
      });

      // If there is no history, set the initial value, otherwise increment timeUse
      if (!currentPromotionHistory) {
        currentPromotionHistory = await client.promotionHistory.create({
          data: {
            id,
            userId,
            promotionId,
            frequency: 1, // Initial time use
          },
        });
      } else {
        // Increment the existing timeUse
        await client.promotionHistory.update({
          where: {
            id: currentPromotionHistory.id,
          },
          data: {
            frequency: currentPromotionHistory.frequency + 1, // Increment time use by 1
          },
        });
      }

      let notify = await client.notification.create({
        data: {
          id: uuidv4(),
          title: "Monthly Pass",
          description:
            "Your Monthly Pass of RM " +
            parseFloat(amount) +
            " successfully been paid.",
          notifyTime: new Date(now()),
          userId: userId,
          monthlyPassId: newMonthlyPass.id,
        },
      });

      res.status(201).json({
        status: "success",
        data: newMonthlyPass,
        history: currentPromotionHistory,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .get("/all/promotion", async (req, res) => {
    const userId = req.user.userId; // Assuming this is obtained via authentication middleware
    try {
      const promotionHistory = await client.promotionHistory.findMany({
        where: { userId },
      });
      res.status(200).json(promotionHistory);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  });

// .put("/edit/:id", async (req, res) => {
//   const { id } = req.params; // The MonthlyPass ID from the URL parameter
//   const userId = req.user.userId; // Assuming user authentication middleware
//   const { plateNumber, pbt, amount, duration } = req.body; // Data to update

//   try {
//     // Check if the MonthlyPass exists and belongs to the user
//     const existingPass = await client.monthlyPass.findUnique({
//       where: { id },
//     });

//     if (!existingPass || existingPass.userId !== userId) {
//       return res.status(404).json({
//         error:
//           "MonthlyPass not found or you don't have permission to edit this pass.",
//       });
//     }

//     // Update the MonthlyPass
//     const updatedMonthlyPass = await client.monthlyPass.update({
//       where: { id },
//       data: {
//         plateNumberId: plateNumber || existingPass.plateNumberId,
//         pbtId: pbt || existingPass.pbtId,
//         amount: amount !== undefined ? amount : existingPass.amount, // Update only if provided
//         duration: duration || existingPass.duration, // Update only if provided
//       },
//     });

//     res.status(200).json({ status: "success", data: updatedMonthlyPass });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// })

// .delete("/delete/:id", async (req, res) => {
//   const { id } = req.params; // The MonthlyPass ID from the URL parameter
//   const userId = req.user.userId; // Assuming user authentication middleware

//   try {
//     // Check if the MonthlyPass exists and belongs to the user
//     const existingPass = await client.monthlyPass.findUnique({
//       where: { id },
//     });

//     if (!existingPass || existingPass.userId !== userId) {
//       return res.status(404).json({
//         error:
//           "MonthlyPass not found or you don't have permission to delete this pass.",
//       });
//     }

//     // Delete the MonthlyPass
//     await client.monthlyPass.delete({
//       where: { id },
//     });

//     res.status(200).json({
//       status: "success",
//       message: "MonthlyPass deleted successfully.",
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

export default monthlyPassRouter;
