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
import HeaderMobile from "./header_mobile";

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
    return { status: data.status, trial: data.trial };
  } catch (error) {
    console.error("Error getting user's sub status:", error);
    return { status: false, trial: false };
  }
};

export const [subscriptionStatus, { refetch: refetchSubStatus }] =
  createResource(fetchSubStatus);

const User = () => {
  const [userProfile] = createResource(fetchUserProfile);
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

  const handleNavigateRules = () => {
    window.location.href = `/rules`;
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
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200">
      <div class="flex flex-col max-w-7xl mx-auto min-h-screen">
        <div class="hidden md:block">
          <Header />
        </div>
        <div class="block md:hidden">
          <HeaderMobile />
        </div>

        <Show
          when={
            subscriptionStatus()?.trial &&
            !subscriptionStatus()?.status &&
            userPage()
          }
        >
          <div class="max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="flex flex-col text-center">
              <div class="text-center text-base md:text-lg">
                <p class="mb-4 text-2xl md:text-3xl">
                  Hi <span class="font-bold">{userProfile()?.firstName}</span>,
                  welcome to{" "}
                  <span class="font-bold text-white">Commonly Odd</span>
                </p>
              </div>

              <div class="text-left text-base md:text-lg">
                <p class="mb-4 ml-8 text-gray-400">
                  As our newest member, you're granted an exclusive{" "}
                  <span class="font-bold">1-day free trial</span> to dive into
                  the full Commonly Odd experience. You get access to all
                  premium features and unlimited games for 24 hours.
                </p>
              </div>

              <div class="p-4 my-4 flex justify-center items-center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePlayGame}
                  sx={{
                    width: "180px",
                    height: "40px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                  class="flex justify-center items-center text-gray-300 bg-slate-900"
                >
                  Go to Game
                </Button>
              </div>

              <div class="text-base md:text-lg">
                <p class="mb-4 ml-8">
                  Here's a quick tutorial on how to get started if needed.
                </p>
              </div>
              <div class="w-full mb-4 text-base md:text-lg">
                <video controls class="w-full h-auto shadow-lg">
                  <source
                    src="https://media.commonlyodd.com/how_it_works.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div class="flex flex-col text-left">
                <p class="text-base md:text-lg mb-4">
                  If you have any questions or need further assistance, don't
                  hesitate to reach out. For a detailed breakdown on the rules,
                  here's the{" "}
                  <a
                    onClick={handleNavigateRules}
                    class="text-blue-500 hover:text-blue-700"
                  >
                    link to the rules
                  </a>{" "}
                  page.
                </p>
                <p class="text-base md:text-lg">
                  Feel free to drop me an email at{" "}
                  <a
                    href="mailto:bruce@commonlyodd.com"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    bruce@commonlyodd.com
                  </a>{" "}
                  or send me a message on Twitter at{" "}
                  <a
                    href="https://twitter.com/kolourrmusic"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    @kolourrmusic
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Show>

        <Show when={subscriptionStatus()?.status && userPage()}>
          <div class="max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="flex flex-col text-center">
              <div class="text-center text-base md:text-lg">
                <p class="mb-4 text-2xl md:text-3xl">
                  Hi <span class="font-bold">{userProfile()?.firstName}</span>,
                  welcome back 😊 You're all set!
                </p>
              </div>

              <div class="p-4 flex my-4 justify-center items-center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePlayGame}
                  sx={{
                    width: "180px",
                    height: "40px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                  class="flex justify-center items-center text-gray-300 bg-slate-900"
                >
                  Go to Game
                </Button>
              </div>
              <div class="text-base md:text-lg">
                <p class="mb-4 ml-8">
                  Here's a quick tutorial on how to get started
                </p>
              </div>
              <div class="w-full mb-4 text-base md:text-lg">
                <video controls class="w-full h-auto shadow-lg">
                  <source
                    src="https://media.commonlyodd.com/how_it_works.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div class="flex flex-col text-left">
              <p class="text-base md:text-lg mb-4">
                If you have any questions or need further assistance, don't
                hesitate to reach out. For a detailed breakdown on the rules,
                here's the{" "}
                <a
                  onClick={handleNavigateRules}
                  class="text-blue-500 hover:text-blue-700"
                >
                  link to the rules
                </a>{" "}
                page.
              </p>
              <p class="text-base md:text-lg">
                Feel free to drop me an email at{" "}
                <a
                  href="mailto:bruce@commonlyodd.com"
                  class="text-blue-500 hover:text-blue-700"
                >
                  bruce@commonlyodd.com
                </a>{" "}
                or send me a message on Twitter at{" "}
                <a
                  href="https://twitter.com/kolourrmusic"
                  class="text-blue-500 hover:text-blue-700"
                >
                  @kolourrmusic
                </a>
                .
              </p>
            </div>
          </div>
        </Show>
        <Show when={subscriptionStatus()?.status && paymentSuccess()}>
          <div class="max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="flex flex-col text-center">
              <div class="text-center text-base md:text-lg">
                <p class="mb-4 text-2xl md:text-3xl">
                  Hi <span class="font-bold">{userProfile()?.firstName}</span>,
                  you're all set!
                </p>
              </div>
              <div class="text-base md:text-lg">
                <p class="mb-4 ml-8">
                  Here's a quick tutorial on how to get started
                </p>
              </div>
            </div>
            <div class="w-full mb-4 text-base md:text-lg">
              <video controls class="w-full h-auto shadow-lg">
                <source
                  src="https://media.commonlyodd.com/how_it_works.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="p-4 flex justify-center items-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePlayGame}
                sx={{
                  width: "180px",
                  height: "40px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                class="flex justify-center items-center text-gray-300 bg-slate-900"
              >
                Go to Game
              </Button>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-base md:text-lg mb-4">
                If you have any questions or need further assistance, don't
                hesitate to reach out. For a detailed breakdown on the rules,
                here's the{" "}
                <a
                  onClick={handleNavigateRules}
                  class="text-blue-500 hover:text-blue-700"
                >
                  link to the rules
                </a>{" "}
                page.
              </p>
              <p class="text-base md:text-lg">
                Feel free to drop me an email at{" "}
                <a
                  href="mailto:bruce@commonlyodd.com"
                  class="text-blue-500 hover:text-blue-700"
                >
                  bruce@commonlyodd.com
                </a>{" "}
                or send me a message on Twitter at{" "}
                <a
                  href="https://twitter.com/kolourrmusic"
                  class="text-blue-500 hover:text-blue-700"
                >
                  @kolourrmusic
                </a>
                .
              </p>
            </div>
          </div>
        </Show>
        <Show when={!subscriptionStatus()?.status && paymentFailed()}>
          <div class="max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="text-center">
              <p class="mb-4 text-2xl md:text-3xl font-bold">
                Oops, there seems to be a hiccup,{" "}
                <span class="font-bold">{userProfile()?.firstName}</span>.
              </p>
            </div>

            <p class="mb-4 ml-8 text-center text-base md:text-lg text-gray-400">
              To continue playing Commonly Odd, please pick one of the plans
              below
            </p>

            <div
              id="pricingplans"
              class="text-gray-300 mb-3 text-4xl font-bold flex justify-center w-full"
            ></div>
            <div class="flex justify-center items-center">
              <PricingPlans />
            </div>

            <div class="text-left">
              <p class="mb-4 ml-8 text-base md:text-lg">
                If you have any questions or need further assistance, don't
                hesitate to reach out.
              </p>
              <p class="ml-8 text-base md:text-lg">
                Feel free to drop me an email at{" "}
                <a
                  href="mailto:bruce@commonlyodd.com"
                  class="text-blue-500 hover:text-blue-700"
                >
                  bruce@commonlyodd.com
                </a>{" "}
                or send me a message on Twitter at{" "}
                <a
                  href="https://twitter.com/kolourrmusic"
                  class="text-blue-500 hover:text-blue-700"
                >
                  @kolourrmusic
                </a>
                .
              </p>
            </div>
          </div>
        </Show>
        <Show
          when={
            !subscriptionStatus()?.trial &&
            !subscriptionStatus()?.status &&
            userPage()
          }
        >
          <div class="max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="text-center text-base md:text-lg">
              <p class="mb-4 text-2xl md:text-3xl">
                Hi <span class="font-bold">{userProfile()?.firstName}</span>,
                your trial period or subscription has ended.
              </p>
            </div>

            <div class="text-left text-base md:text-lg">
              <p class="mb-4 ml-8 text-gray-400">
                To continue playing Commonly Odd, please pick one of the plans
                below.
              </p>
            </div>

            <div class="flex justify-center items-center">
              <PricingPlans />
            </div>

            <div class="text-left">
              <p class="mb-4 ml-8 text-base md:text-lg">
                If you have any questions or need further assistance, don't
                hesitate to reach out.
              </p>
              <p class="ml-8 text-base md:text-lg">
                Feel free to drop me an email at{" "}
                <a
                  href="mailto:bruce@commonlyodd.com"
                  class="text-blue-500 hover:text-blue-700"
                >
                  bruce@commonlyodd.com
                </a>{" "}
                or send me a message on Twitter at{" "}
                <a
                  href="https://twitter.com/kolourrmusic"
                  class="text-blue-500 hover:text-blue-700"
                >
                  @kolourrmusic
                </a>
                .
              </p>
            </div>
          </div>
        </Show>
      </div>
      <Footer />
    </div>
  );
};

export default User;
