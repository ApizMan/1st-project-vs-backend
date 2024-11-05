import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import logger from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";
import client from "../utils/db.js";

const promotionRouter = express.Router();

promotionRouter
  .get("/public", async (req, res) => {
    try {
      const promotion = await client.promotion.findMany();
      res.status(200).json(promotion);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .get("/single/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const singlePromotion = await client.promotion.findUnique({
        where: { id },
      });
      res.status(200).json(singlePromotion);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  })
  .post("/public/create", async (req, res) => {
    const {
      title,
      description,
      type,
      rate,
      frequency,
      date,
      expiredDate,
      image,
      createdAt,
    } = req.body; // Destructure relevant data from req.body
    const id = uuidv4(); // Generate unique ID for MonthlyPass

    try {
      // Create a new MonthlyPass
      const newPromotion = await client.promotion.create({
        data: {
          id,
          title: title,
          description: description,
          type: type,
          rate: rate,
          frequency: frequency,
          date: date,
          expiredDate: expiredDate,
          image: image,
          createdAt: createdAt || new Date(),
        },
      });

      res.status(201).json({ status: "success", data: newPromotion });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const {
      title,
      description,
      rate,
      frequency,
      date,
      expiredDate,
      image,
      createdAt,
    } = req.body; // Data to update

    try {
      // Check if the monthly pass exists and belongs to the user
      const existingPromotion = await client.promotion.findUnique({
        where: { id },
      });

      if (!existingPromotion) {
        return res.status(404).json({
          error: "Promotion not found.",
        });
      }

      // Update the monthly pass entry
      const updatedPromotion = await client.promotion.update({
        where: { id },
        data: {
          title: title || existingPromotion.title,
          description: description || existingPromotion.description,
          rate: rate || existingPromotion.rate,
          frequency: frequency || existingPromotion.frequency,
          date: date || existingPromotion.date,
          expiredDate: expiredDate || existingPromotion.expiredDate,
          image: image || existingPromotion.image,
          createdAt: createdAt || existingPromotion.createdAt,
        },
      });

      res.status(200).json({ status: "success", data: updatedPromotion });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .delete("/delete/:id", async (req, res) => {
    const { id } = req.params; // The Parking ID from the URL parameter
    try {
      // Check if the monthly pass entry exists and belongs to the user
      const existingPromotion = await client.promotion.findUnique({
        where: { id },
      });

      if (!existingPromotion) {
        return res.status(404).json({
          error: "Promotion not found.",
        });
      }

      // Delete the monthly pass entry
      await client.promotion.delete({
        where: { id },
      });

      res.status(200).json({
        status: "success",
        message: "Promotion deleted successfully.",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default promotionRouter;
