import { createSignal } from "solid-js";

const BASE_API = import.meta.env.CO_API_URL;

export const [userSubstatus, setUserSubstatus] = createSignal(false);

export const checkSubStatus = async () => {
  try {
    const response = await fetch(`${BASE_API}/check-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get user's sub status");
    }

    const { status } = await response.json();
    setUserSubstatus(status);
  } catch (error) {
    console.error("Error getting user's sub status:", error);
  }
};
