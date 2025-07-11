// src/logger.js
import axios from "axios";

let accessToken = null;

async function getToken() {
  if (accessToken) return accessToken;

  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      email: "22691A0585@mits.ac.in"  
    });
    accessToken = res.data.access_token;
    return accessToken;
  } catch (err) {
    console.error("Auth failed:", err.message);
  }
}

export async function Log(stack, level, pkg, message) {
  try {
    const token = await getToken();
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Log sent:", message);
  } catch (err) {
    console.error("❌ Log failed:", err.message);
  }
}
