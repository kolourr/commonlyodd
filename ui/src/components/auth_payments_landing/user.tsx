import { createEffect, createResource, Show } from "solid-js";
import { Button } from "@suid/material";
import { stripePortal } from "./stripe_portal";
import { fetchUserProfile } from "./user_profile";
import {
  createCheckoutSessionMonthly,
  createCheckoutSessionYearly,
} from "./pricing";
import { Router } from "solid-app-router";
import AccountMenu from "../settings";

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
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
      <div class="flex flex-col    max-w-5xl  mx-auto min-h-screen    bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
        <div class="flex pb-4">
          <div class="flex flex-row w-1/12 justify-center items-center">
            <Router>
              <AccountMenu />
            </Router>
          </div>
          <div class="flex flex-row w-11/12 justify-center items-center text-3xl font-bold text-gray-50 ">
            <div class="flex flex-row items-center justify-center">
              <span class="pr-2">Commonly</span>
            </div>
            <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-3xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em]">
              Odd
            </span>
          </div>
        </div>
        <p class="text-xl lg:text-2xl text-gray-50 flex justify-center ">
          {userProfile()?.firstName}, start your
          <span class="font-bold px-2 ">FREE</span>
          <span class="underline decoration-double  pr-2">7-day</span> trial now
        </p>
        <div class="p-4">
          <Button
            variant="contained"
            color="primary"
            href={`${BASE_API}/logout`}
          >
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
    </div>
  );
};

export default User;
