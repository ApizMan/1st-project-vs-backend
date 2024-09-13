import { getLatestToken, refreshToken } from "./tokenService.js";
import axios from "axios";

let expirationTimeoutId;

let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: Math.floor(new Date().setDate(new Date().getDate() + 1) / 1000), // Set to tomorrow's timestamp
};

const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000;
export async function monitorTokenExpiration() {
  try {
    const latestToken = await getLatestToken();
    if (!latestToken) {
      console.error("No token found in the database.");
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const tokenExpiryTime =
      latestToken.createdAt.getTime() / 1000 + latestToken.expiresIn;

    latestToken.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

    if (timeUntilExpiry <= 0) {
      console.log("Token has already expired. Refreshing now.");
      await refreshToken();
      monitorTokenExpiration(); // Continue monitoring after refreshing
    } else {
      console.log("Expires at:", new Date(tokens.expiresAt).toLocaleString());
      // Set up timeout to refresh the token just before it expires
      expirationTimeoutId = setTimeout(
        async () => {
          console.log("Token is about to expire. Refreshing...");
          await refreshToken();
          monitorTokenExpiration(); // Continue monitoring after refreshing
        },
        (timeUntilExpiry - 60) * 1000,
      ); // Refresh 60 seconds before expiry
    }
  } catch (error) {
    console.error("Error monitoring token expiration:", error);
  }
}

export function stopMonitoringTokenExpiration() {
  if (expirationTimeoutId) {
    clearTimeout(expirationTimeoutId);
    expirationTimeoutId = null;
    console.log("Stopped monitoring token expiration.");
  }
}
