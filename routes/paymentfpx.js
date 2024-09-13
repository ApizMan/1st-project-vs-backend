import express from "express";
import { tokenMiddleware } from "../utils/authUtils.js";
import client from "../utils/db.js";
import { v4 as uuidv4, validate } from "uuid";
import logger from "../utils/logger.js";
import axios from "axios";
import {
  saveTokens,
  getLatestToken,
  startRefreshLoop,
  refreshTokenFPX,
} from "../token/tokenService.js";

const paymentfpxRouter = express.Router();
paymentfpxRouter.use(tokenMiddleware);

let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: Math.floor(new Date().setDate(new Date().getDate() + 1) / 1000), // Set to tomorrow's timestamp
};

const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 2 minutes in milliseconds

paymentfpxRouter.post("/test", async (req, res) => {
  fpxLogin();
  res.send("fpxLogin success");
});

export async function fpxLogin() {
  try {
    const data = {
      grant_type: "password",
      client_id: "swittle.uat.integration",
      client_secret: "c1R73slo49vdvklJ94KBAYY",
      username: "VS63855419632142503020902",
      password:
        "9918a11c3afb5e52f7f14ba4a2825212af69bacbf56047869b59883e0ccf553a",
      scope: "openid api all_claims offline_access",
      acr_values: "app_release=34&language=en&pin=false&location=",
    };
    const response = await axios.post(
      "https://stg-identity.swittlelab.com/core/connect/token",
      new URLSearchParams(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-mock-response-id": "200",
        },
      },
    );

    const responseData = response.data;
    console.log(responseData);

    tokens.accessToken = responseData.access_token;
    tokens.refreshToken = responseData.refresh_token;
    tokens.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
    console.log("Expires at:", new Date(tokens.expiresAt).toLocaleString());

    // Save the tokens to the database
    console.log(
      "Saving tokens:",
      response.data.access_token,
      response.data.refresh_token,
    );
    await saveTokens(response.data.access_token, response.data.refresh_token);

    // Start monitoring token expiration
    startRefreshLoop();
  } catch (error) {
    console.error("Error during FPX login:", error);
    return;
  }
}

paymentfpxRouter.post("/recordBill-token", async (req, res) => {
  const userId = req.user.userId;
  const { NetAmount } = req.body;

  // Fetch the latest token from the database
  const latestToken = await getLatestToken();
  console.log(latestToken); // Ensure this function is available

  if (Date.now() >= latestToken.expiresIn) {
    console.log("Token expired, refreshing...");
    const refreshedTokens = await refreshTokenFPX();
    if (refreshedTokens) {
      latestToken = await getLatestToken(); // Fetch the latest token after refresh
    } else {
      return res.status(500).json({ error: "Failed to refresh token" });
    }
  }

  const { accessToken, refreshToken } = latestToken; // Retrieve the access token from the latest token

  console.log("Access_Token:", accessToken);
  console.log("Refresh_Token:", refreshToken);

  // Fetch user details from the database
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      secondName: true,
      phoneNumber: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const customerName = `${user.firstName} ${user.secondName}`;
  const customerPhone = user.phoneNumber;
  const customerEmail = user.email;

  function generateRandomId() {
    return Math.random().toString(36).slice(2);
  }

  const fpx_body = {
    ActivityTag: "RecordBill",
    LanguageCode: "en",
    AppReleaseId: 34,
    GMTTimeDifference: 8,
    PaymentTypeId: 6607,
    BillReference: `ParkingTokenBill${generateRandomId()}`,
    BatchName: null,
    NetAmount: NetAmount,
    BillAttributes: [
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_NAME",
        Value: customerName,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_MOBILE_NUMBER",
        Value: customerPhone,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_EMAIL_ADDRESS",
        Value: customerEmail,
      },
    ],
  };

  console.log("Request Body:", fpx_body);

  const fpxApi = process.env.FPX_RB_API;

  console.log("FPX Payment API URL:", fpxApi);

  try {
    const response = await axios.post(fpxApi, fpx_body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("FPX Response:", response.data);
    if (response.status !== 200) {
      console.error("API Response Error:", response.data);
      return res.status(response.status).json({
        error: "Failed to make a payment request",
        details: response.data,
      });
    }

    req.accessToken = response.data.access_token;
    req.refreshToken = response.data.refresh_token;

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Fetch Error:",
      error.response ? error.response.data : error.message,
    );
    return res.status(500).json({
      error: "Internal server error",
      details: error.response ? error.response.data : null,
    });
  }
});

paymentfpxRouter.post("/recordBill-seasonpass", async (req, res) => {
  const userId = req.user.userId;
  const { NetAmount } = req.body;

  // Fetch the latest token from the database
  const latestToken = await getLatestToken(); // Ensure this function is available

  if (!latestToken) {
    return res.status(500).json({ error: "No token available" });
  }

  const { accessToken, refreshToken } = latestToken; // Retrieve the access token from the latest token

  console.log("Access Token:", accessToken, refreshToken);

  // Fetch user details from the database
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      secondName: true,
      phoneNumber: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const customerName = `${user.firstName} ${user.secondName}`;
  const customerPhone = user.phoneNumber;
  const customerEmail = user.email;

  function generateRandomId() {
    return Math.random().toString(36).slice(2);
  }

  const fpx_body = {
    ActivityTag: "RecordBill",
    LanguageCode: "en",
    AppReleaseId: 34,
    GMTTimeDifference: 8,
    PaymentTypeId: 6608,
    BillReference: `ParkingTokenBill${generateRandomId()}`,
    BatchName: null,
    NetAmount: NetAmount,
    BillAttributes: [
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_NAME",
        Value: customerName,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_MOBILE_NUMBER",
        Value: customerPhone,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_EMAIL_ADDRESS",
        Value: customerEmail,
      },
    ],
  };

  console.log("Request Body:", fpx_body);

  const fpxApi = process.env.FPX_RB_API;

  console.log("FPX Payment API URL:", fpxApi);

  try {
    const response = await axios.post(fpxApi, fpx_body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("FPX Response:", response.data);
    if (response.status !== 200) {
      console.error("API Response Error:", response.data);
      return res.status(response.status).json({
        error: "Failed to make a payment request",
        details: response.data,
      });
    }

    req.accessToken = response.data.access_token;
    req.refreshToken = response.data.refresh_token;

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Fetch Error:",
      error.response ? error.response.data : error.message,
    );
    return res.status(500).json({
      error: "Internal server error",
      details: error.response ? error.response.data : null,
    });
  }
});

paymentfpxRouter.post("/recordBill-compound", async (req, res) => {
  const userId = req.user.userId;
  const { NetAmount } = req.body;

  // Fetch the latest token from the database
  const latestToken = await getLatestToken(); // Ensure this function is available

  if (!latestToken) {
    return res.status(500).json({ error: "No token available" });
  }

  const { accessToken, refreshToken } = latestToken; // Retrieve the access token from the latest token

  console.log("Access Token:", accessToken, refreshToken);

  // Fetch user details from the database
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      secondName: true,
      phoneNumber: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const customerName = `${user.firstName} ${user.secondName}`;
  const customerPhone = user.phoneNumber;
  const customerEmail = user.email;

  function generateRandomId() {
    return Math.random().toString(36).slice(2);
  }

  const fpx_body = {
    ActivityTag: "RecordBill",
    LanguageCode: "en",
    AppReleaseId: 34,
    GMTTimeDifference: 8,
    PaymentTypeId: 6610,
    BillReference: `ParkingTokenBill${generateRandomId()}`,
    BatchName: null,
    NetAmount: NetAmount,
    BillAttributes: [
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_NAME",
        Value: customerName,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_MOBILE_NUMBER",
        Value: customerPhone,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_EMAIL_ADDRESS",
        Value: customerEmail,
      },
    ],
  };

  console.log("Request Body:", fpx_body);

  const fpxApi = process.env.FPX_RB_API;

  console.log("FPX Payment API URL:", fpxApi);

  try {
    const response = await axios.post(fpxApi, fpx_body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("FPX Response:", response.data);
    if (response.status !== 200) {
      console.error("API Response Error:", response.data);
      return res.status(response.status).json({
        error: "Failed to make a payment request",
        details: response.data,
      });
    }

    req.accessToken = response.data.access_token;
    req.refreshToken = response.data.refresh_token;

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Fetch Error:",
      error.response ? error.response.data : error.message,
    );
    return res.status(500).json({
      error: "Internal server error",
      details: error.response ? error.response.data : null,
    });
  }
});

paymentfpxRouter.post("/recordBill-reservebay", async (req, res) => {
  const userId = req.user.userId;
  const { NetAmount } = req.body;

  // Fetch the latest token from the database
  const latestToken = await getLatestToken(); // Ensure this function is available

  if (!latestToken) {
    return res.status(500).json({ error: "No token available" });
  }

  const { accessToken, refreshToken } = latestToken; // Retrieve the access token from the latest token

  console.log("Access Token:", accessToken, refreshToken);

  // Fetch user details from the database
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      secondName: true,
      phoneNumber: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const customerName = `${user.firstName} ${user.secondName}`;
  const customerPhone = user.phoneNumber;
  const customerEmail = user.email;

  function generateRandomId() {
    return Math.random().toString(36).slice(2);
  }

  const fpx_body = {
    ActivityTag: "RecordBill",
    LanguageCode: "en",
    AppReleaseId: 34,
    GMTTimeDifference: 8,
    PaymentTypeId: 6609,
    BillReference: `ParkingTokenBill${generateRandomId()}`,
    BatchName: null,
    NetAmount: NetAmount,
    BillAttributes: [
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_NAME",
        Value: customerName,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_MOBILE_NUMBER",
        Value: customerPhone,
      },
      {
        PaymentTypeSettingsTypeTag: "CUSTOMER_EMAIL_ADDRESS",
        Value: customerEmail,
      },
    ],
  };

  console.log("Request Body:", fpx_body);

  const fpxApi = process.env.FPX_RB_API;

  console.log("FPX Payment API URL:", fpxApi);

  try {
    const response = await axios.post(fpxApi, fpx_body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("FPX Response:", response.data);
    if (response.status !== 200) {
      console.error("API Response Error:", response.data);
      return res.status(response.status).json({
        error: "Failed to make a payment request",
        details: response.data,
      });
    }

    req.accessToken = response.data.access_token;
    req.refreshToken = response.data.refresh_token;

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Fetch Error:",
      error.response ? error.response.data : error.message,
    );
    return res.status(500).json({
      error: "Internal server error",
      details: error.response ? error.response.data : null,
    });
  }
});

paymentfpxRouter.post("/callbackurl-fpx", async (req, res) => {
  const payload = req.body;
  if (!validatePayload(payload)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (payload.order_status === "Transaction was Successful") {
    await handlePaymentSuccess(payload);
  }
});

paymentfpxRouter.post("/payment-status", async (req, res) => {
  const { BillReference } = req.body;

  if (!BillReference) {
    return res.status(400).json({ error: "BillReference is required" });
  }

  try {
    // Prepare the parameter to send
    const parameter = { BillReference };

    // Call the integration API to retrieve the payment status
    const response = await axios.post(
      "https://stg-integrationapi.swittlelab.com/api/Integration/CheckPaymentStatus",
      parameter,
    );

    // Process the response
    const paymentStatus = response.data;

    // Perform any additional processing (e.g., update the database)

    // Send a response back
    res.status(200).json(paymentStatus);
  } catch (error) {
    console.error("Error retrieving payment status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function validatePayload(payload) {
  return (
    payload.ActivityTag &&
    payload.LanguageCode &&
    payload.AppReleaseId &&
    payload.GMTTimeDifference &&
    payload.PaymentTxnRef &&
    payload.BillId &&
    payload.BillReference
  );
}

async function handlePaymentSuccess(payload) {
  console.log("Payment successful for order:", payload.TransactionReference);
  console.log("Amount:", payload.PaymentAmount);
  console.log("Bill ID:", payload.BillId);
  console.log("Bill Reference:", payload.BillReference);
  console.log(
    "Transaction Status:",
    payload.TransactionExecutionStatusDescription,
  );
  console.log("Transaction Date:", payload.TransactionExecutionDate);
}

export default paymentfpxRouter;
