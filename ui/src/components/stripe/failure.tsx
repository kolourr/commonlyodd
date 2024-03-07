import { createEffect, createResource } from "solid-js";
import { Button } from "@suid/material";

const BASE_API = import.meta.env.CO_API_URL; // Ensure this is correctly set in your .env file

const Failure = () => {
  // Function to fetch user profile
  const fetchUserProfile = async () => {
    const response = await fetch(`${BASE_API}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "/";
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  };

  // Create resource to fetch user profile
  const [userProfile] = createResource(fetchUserProfile);

  // Function to initiate checkout session and redirect to Stripe
  const createCheckoutSession = async () => {
    try {
      const response = await fetch(
        `${BASE_API}/create-checkout-session?price_id=price_1OqOBPCXpxRc8OyGd2BQGkSV`,
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

  return (
    <div class="flex flex-col items-center justify-center ">
      <h1 class="mb-4 text-2xl font-bold">
        Sorry, {userProfile()?.firstName}, the payment failed!
      </h1>
      <img src={userProfile()?.pictureURL} alt="Profile Picture" class="mb-4" />
      <div class="p-4">
        <Button variant="contained" color="primary" href={`${BASE_API}/logout`}>
          Logout
        </Button>
      </div>
      <div class="p-4">
        <Button variant="contained" color="secondary" href="/game">
          Play Game
        </Button>
      </div>
      <div class="p-4">
        <Button
          variant="contained"
          color="secondary"
          onClick={createCheckoutSession}
        >
          Start Checkout
        </Button>
      </div>
    </div>
  );
};

export default Failure;
