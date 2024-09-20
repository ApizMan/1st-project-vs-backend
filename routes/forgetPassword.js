import { sendEmail, hashPassword } from "../utils/authUtils.js";
import crypto from "crypto"; // To generate the OTP
import client from "../utils/db.js";
import express from "express";

const forgetPasswordRouter = express.Router();

forgetPasswordRouter
  .post("/", async (req, res) => {
    const { email } = req.body;

    try {
      // Check if the email exists in the database
      const user = await client.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "Email not found" });
      }

      // Generate a 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();

      // Set OTP expiration (e.g., 10 minutes from now)
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update the user with the OTP and expiration time
      await client.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
      });

      // Send OTP via email
      const message = `Your OTP for password reset is: ${otp}`;
      await sendEmail(user.email, "Password Reset OTP", message);

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Error during forgot password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .post("/reset", async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
      // Find the user by email
      const user = await client.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the OTP matches and has not expired
      if (user.otp !== otp || user.otpExpiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Hash the new password
      const hashedPassword = hashPassword(newPassword);

      // Update the user with the new password and clear the OTP fields
      await client.user.update({
        where: { email },
        data: { password: hashedPassword, otp: null, otpExpiresAt: null },
      });

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

export default forgetPasswordRouter;
