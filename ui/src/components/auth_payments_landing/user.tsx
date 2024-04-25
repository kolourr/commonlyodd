import {
  createEffect,
  createResource,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import { Button } from "@suid/material";
import { fetchUserProfile } from "./user_profile";

import { Router } from "solid-app-router";
import AccountMenu from "../settings";
import PricingPlans from "./pricing_plans";
import Footer from "./footer";
import Header from "./header";

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
  const [paymentFailed, setPaymentFailed] = createSignal(false);
  const [paymentSuccess, setPaymentSuccess] = createSignal(false);
  const [userPage, setUserPage] = createSignal(false);

  // Check if userProfile is loaded to decide whether to refetch subscription status
  createEffect(() => {
    if (userProfile.loading === false) {
      // Correctly wait for the userProfile to load
      refetchSubStatus();
    }
  });

  const handlePlayGame = () => {
    window.location.href = "/game";
  };

  onMount(() => {
    const path = window.location.pathname;

    // Set payment success if the URL path contains '/success'
    if (path.includes("/success")) {
      setPaymentSuccess(true);
    } else if (path.includes("/cancel")) {
      setPaymentFailed(true);
    } else if (path.includes("/user")) {
      setUserPage(true);
    }
  });

  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
      <div class="flex flex-col    max-w-5xl  mx-auto min-h-screen     bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
        <Header />

        <Show when={!subscriptionStatus() && paymentFailed()}>
          <div class="text-xl lg:text-2xl text-gray-300 flex justify-center px-4 ">
            {userProfile()?.firstName}, something went wrong 😔 Please try
            again.
          </div>

          <div class="flex flex-row justify-center">
            <PricingPlans />
          </div>
        </Show>

        <Show when={subscriptionStatus() && paymentSuccess()}>
          <div class="text-xl lg:text-2xl text-gray-300 flex justify-center p-4 ">
            {userProfile()?.firstName}, you are all clear 😊 You are all set to
            play.
          </div>
          <div class="flex flex-col justify-center items-center">
            <video controls class="w-[360px] lg:w-[710px]  h-auto">
              <source src="path_to_your_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="p-4 flex   justify-center items-center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePlayGame}
            >
              Play Game
            </Button>
          </div>
        </Show>

        <Show when={!subscriptionStatus() && userPage()}>
          <div class="text-xl lg:text-2xl text-gray-300 flex justify-center px-4 ">
            {userProfile()?.firstName}, start your
            <span class="font-bold px-2  ">FREE 7-day</span>
            trial now
          </div>

          <div class="flex flex-row justify-center">
            <PricingPlans />
          </div>
        </Show>

        <Show when={subscriptionStatus() && userPage()}>
          <div class="text-xl lg:text-2xl text-gray-300 flex justify-center p-4 ">
            Welcome back {userProfile()?.firstName}! You're all set 😊
          </div>
          <div class="flex flex-col justify-center items-center">
            <video controls class="w-[360px] lg:w-[710px]  h-auto">
              <source src="path_to_your_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="p-4 flex   justify-center items-center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePlayGame}
            >
              Play Game
            </Button>
          </div>
        </Show>
      </div>
      <Footer />
    </div>
  );
};

export default User;
