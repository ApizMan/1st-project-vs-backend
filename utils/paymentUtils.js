import { logger } from "./logger.js";

export async function generateOnboardingCode() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.PEGEPAY_TOKEN}`);

  const body = JSON.stringify({
    onboarding_key: process.env.ONBOARDING_KEY,
    connection_type: "npd-wa",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
  };

  try {
    const response = await fetch(
      "https://pegepay.com/api/onboard-merchant",
      requestOptions,
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

export async function generateRefreshToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.PEGEPAY_TOKEN}`);

  const body = JSON.stringify({
    onboarding_key: process.env.ONBOARDING_KEY,
    connection_type: "npd-wa",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
  };

  try {
    const response = await fetch(
      "https://pegepay.com/api/onboard-merchant",
      requestOptions,
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}
