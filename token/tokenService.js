import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

export async function saveTokens(accessToken, refreshToken) {
  try {
    const latestToken = await prisma.token.findFirst({
      where: {
        type: "FPX SWITTLE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const currentTime = new Date();

    if (latestToken) {
      // Update the existing token record
      console.log("Updating existing token with ID:", latestToken.id);
      await prisma.token.update({
        where: { id: latestToken.id },
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: TOKEN_EXPIRATION_TIME / 1000,
          createdAt: currentTime,
        },
      });
      console.log("Tokens updated successfully.");
    } else {
      // Create a new token record if none exists
      console.log("Creating new token record.");
      await prisma.token.create({
        data: {
          type: "FPX SWITTLE",
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: TOKEN_EXPIRATION_TIME / 1000,
          createdAt: currentTime,
        },
      });
      console.log("Tokens saved successfully.");
    }
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
}

export async function getLatestToken() {
  try {
    const latestToken = await prisma.token.findFirst({
      where: {
        type: "FPX SWITTLE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (latestToken) {
      console.log("Latest token found:", latestToken);
    } else {
      console.log("No token found.");
    }
    return latestToken;
  } catch (error) {
    console.error("Error retrieving latest token:", error);
    return null;
  }
}

export async function updateTokens(id, newAccessToken, newRefreshToken) {
  try {
    const currentTime = new Date();
    console.log("Updating tokens for ID:", id);
    await prisma.token.update({
      where: { id: id },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
        createdAt: currentTime,
      },
    });
    console.log("Tokens updated successfully.");
  } catch (error) {
    console.error("Error updating tokens:", error);
  }
}

export async function refreshTokenFPX() {
  try {
    const latestToken = await getLatestToken();
    const data = {
      grant_type: "refresh_token",
      client_id: "swittle.uat.integration",
      client_secret: "c1R73slo49vdvklJ94KBAYY",
      refresh_token: latestToken.refreshToken,
    };

    const response = await axios.post(
      "https://stg-identity.swittlelab.com/core/connect/token",
      new URLSearchParams(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const responseData = response.data;

    console.log("Token refresh response data:", responseData);

    if (responseData.access_token && responseData.refresh_token) {
      // Update the tokens in the database
      await updateTokens(
        latestToken.id,
        responseData.access_token,
        responseData.refresh_token,
      );

      // Update the global tokens object
      tokens.accessToken = responseData.access_token;
      tokens.refreshToken = responseData.refresh_token;
      tokens.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

      return responseData;
    } else {
      console.error("Invalid response data:", responseData);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

async function refreshToken() {
  const refreshedTokens = await refreshTokenFPX();
  if (refreshedTokens) {
    console.log("Token refreshed at:", new Date().toLocaleString());
    console.log("New access token:", refreshedTokens.access_token);
    console.log("Expires at:", new Date(tokens.expiresAt).toLocaleString());
    console.log("-----------------------");
  } else {
    console.error("Failed to refresh token.");
  }
}

export function startRefreshLoop() {
  setInterval(() => {
    refreshToken();
  }, TOKEN_EXPIRATION_TIME);
}
