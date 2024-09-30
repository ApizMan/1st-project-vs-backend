import express from "express";
import {
  generateToken,
  hashPassword,
  comparePasswords,
  tokenMiddleware,
} from "../utils/authUtils.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";
import client from "../utils/db.js";

const authRouter = express.Router();

authRouter.get("/users", async (req, res) => {
  try {
    const users = await client.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

authRouter.use(tokenMiddleware);

authRouter
  .get("/user-profile", async (req, res) => {
    try {
      const user = await client.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          secondName: true,
          idNumber: true,
          phoneNumber: true,
          address1: true,
          address2: true,
          address3: true,
          city: true,
          state: true,
          postcode: true,
          wallet: {
            select: {
              amount: true,
            },
          },
          plateNumbers: {
            select: {
              id: true,
              plateNumber: true,
              isMain: true,
            },
          },
          reserveBays: true,
          transactions: true,
          helpdesks: true,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      logger.error(error);
      return res.status(500).send({
        message: error.message,
        error: "Internal server error",
      });
    }
  })
  .post("/signup", async (req, res) => {
    try {
      const { password, email } = req.body;
      const userId = uuidv4();
      const existing = await client.user.findFirst({
        where: { email },
        select: false,
      });

      if (existing) {
        return res.status(400).json({ error: "Email already exists" });
      }

      let body;
      const hashed = hashPassword(password);

      if (hashed) {
        body = {
          ...req.body,
          password: hashed,
          id: userId,
        };
      }

      try {
        await client.$transaction(async (prisma) => {
          const newSignup = await prisma.user.create({
            data: {
              id: userId,
              password: hashed,
              ...body,
            },
          });

          if (newSignup) {
            await prisma.wallet.create({
              data: {
                id: uuidv4(),
                userId: newSignup.id,
                amount: 0,
              },
            });

            const token = generateToken({
              email: req.body.email,
              userId: newSignup.id,
            });

            res.status(201).json({
              message: "User registered successfully",
              token,
            });
          }
        });
      } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await client.user.findFirst({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not exist" });
      }

      const isValid = comparePasswords(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken({ email, userId: user.id });
      res.status(200).json({ message: "Login Success", token });
    } catch (error) {
      console.error("Error during sign-in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .put("/update", async (req, res) => {
    const userId = req.user.userId;

    try {
      const updatedUser = await client.user.update({
        where: { id: userId },
        data: {
          ...req.body,
        },
        include: {
          wallet: true,
          plateNumbers: true,
          reserveBays: true,
          transactions: true,
          helpdesks: true,
        },
      });

      res.status(201).json({
        message: "Updade success",
        user: updatedUser,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
    }
  });

export default authRouter;
