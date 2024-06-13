const BASE_API = import.meta.env.CO_API_URL;

export const createCheckoutSessionMonthly = async () => {
  try {
    const response = await fetch(
      `${BASE_API}/create-checkout-session?price_id=price_1PRHZdCXpxRc8OyGJ29HUhHq`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    // Assuming the response includes the URL to redirect to for Stripe checkout
    const { url } = await response.json();
    if (url) {
      window.location.href = url; // Redirect user to Stripe checkout
    } else {
      throw new Error("No URL received for Stripe checkout redirection");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};

// Function to initiate checkout session and redirect to Stripe
export const createCheckoutSessionYearly = async () => {
  try {
    const response = await fetch(
      `${BASE_API}/create-checkout-session?price_id=price_1PRHYzCXpxRc8OyG5pllC6sX`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    // Assuming the response includes the URL to redirect to for Stripe checkout
    const { url } = await response.json();
    if (url) {
      window.location.href = url; // Redirect user to Stripe checkout
    } else {
      throw new Error("No URL received for Stripe checkout redirection");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};
