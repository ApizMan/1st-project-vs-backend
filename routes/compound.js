import express from "express";
import client from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const compoundRouter = express.Router();

compoundRouter.post("/search", async (req, res) => {
  const { vehicleNo } = req.body;

  const body = {
    VehicleNo: vehicleNo,
  };

  console.log("Request Body:", body);

  const compoundAPI = process.env.COMPOUND_API || "http://localhost:8080";
  console.log("Compound API URL:", compoundAPI);

  try {
    const response = await fetch(compoundAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response Error:", errorText);
      return res
        .status(response.status)
        .json({ error: "Failed to generate Compound", details: errorText });
    }

    const result = await response.json();
    console.log("API Response:", result);

    res.status(201).json(result);
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default compoundRouter;
