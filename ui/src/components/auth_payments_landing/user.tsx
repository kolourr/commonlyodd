import { createEffect, createResource, onMount, Show } from "solid-js";
import { Button } from "@suid/material";
import { stripePortal } from "./stripe_portal";
import { fetchUserProfile } from "./user_profile";
import {
  createCheckoutSessionMonthly,
  createCheckoutSessionYearly,
} from "./pricing";
import { create } from "domain";

const BASE_API = import.meta.env.CO_API_URL;

export const fetchSubStatus = async () => {
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

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error("Error getting user's sub status:", error);
    return false;
  }
};

const User = () => {
  const [userProfile] = createResource(fetchUserProfile);
  const [subscriptionStatus, { refetch: refetchSubStatus }] =
    createResource(fetchSubStatus);

  // Check if userProfile is loaded to decide whether to refetch subscription status
  createEffect(() => {
    if (userProfile.loading === false) {
      // Correctly wait for the userProfile to load
      refetchSubStatus();
    }
  });

  return (
    <div class="flex flex-col items-center justify-center ">
      <h1 class="mb-4 text-2xl font-bold">
        Welcome, {userProfile()?.firstName}
      </h1>
      <img src={userProfile()?.pictureURL} alt="Profile Picture" class="mb-4" />
      <div class="p-4">
        <Button variant="contained" color="primary" href={`${BASE_API}/logout`}>
          Logout
        </Button>
      </div>
      <Show when={subscriptionStatus()}>
        <div class="p-4">
          <Button variant="contained" color="secondary" href="/game">
            Play Game
          </Button>
        </div>
      </Show>

      <Show when={!subscriptionStatus()}>
        <div class="p-4">
          <Button
            variant="contained"
            color="secondary"
            onClick={createCheckoutSessionMonthly}
          >
            Start Checkout Monthly
          </Button>
        </div>
      </Show>

      <Show when={!subscriptionStatus()}>
        <div class="p-4">
          <Button
            variant="contained"
            color="secondary"
            onClick={createCheckoutSessionYearly}
          >
            Start Checkout Yearly
          </Button>
        </div>
      </Show>
      <div class="p-4">
        <Button variant="contained" color="secondary" onClick={stripePortal}>
          Stripe Portal
        </Button>
      </div>
    </div>
  );
};

export default User;
