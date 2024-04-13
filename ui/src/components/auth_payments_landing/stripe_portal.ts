const BASE_API = import.meta.env.CO_API_URL;

export const stripePortal = async () => {
  try {
    const response = await fetch(`${BASE_API}/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const { url } = await response.json();
    if (url) {
      window.open(url, "_blank");
    } else {
      throw new Error("No URL received for Stripe portal");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};
