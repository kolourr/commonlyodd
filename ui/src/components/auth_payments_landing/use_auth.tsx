import { createSignal, createEffect } from "solid-js";

const BASE_API = import.meta.env.CO_API_URL;

export async function checkAuth() {
  try {
    const response = await fetch(`${BASE_API}/check-auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent
    });

    if (!response.ok) {
      throw new Error(`Authentication check failed: status ${response.status}`);
    }

    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}
