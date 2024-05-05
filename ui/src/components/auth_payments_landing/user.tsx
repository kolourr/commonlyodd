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
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
        <div class="hidden md:block">
          {" "}
          <Header />
        </div>
        <div class="block md:hidden">
          <HeaderMobile />
        </div>

        <Show when={!subscriptionStatus() && paymentFailed()}>
          <div class=" max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="text-center">
              <p class="mb-4 text-2xl md:text-3xl font-bold">
                Oops, there seems to be a hiccup,{" "}
                <span class="font-bold">{userProfile()?.firstName}</span>.
              </p>
            </div>

            <p class="mb-4 ml-8 text-left text-base md:text-lg">
              We noticed a snag while setting up your access, but no
              worries—we've got you covered!
            </p>
            <p class="mb-4 ml-8 text-left text-base md:text-lg">
              Remember, you can still enjoy a{" "}
              <span class="font-bold">7-day free trial</span> of Commonly Odd
              with all its features. Feel free to continue exploring and if you
              decide it's not for you, cancelling is easy at any time.
            </p>

            <div
              id="pricingplans"
              class="text-gray-300 mb-3 text-4xl font-bold flex justify-center w-full"
            >
              Explore Plans
            </div>
            <div class="flex justify-center items-center">
              <PricingPlans />
            </div>

            <p class="mb-4 ml-8 text-base md:text-lg">
              If you have any questions or need further assistance, don't If you
              have any questions or need further assistance, don't hesitate to
              reach out.
            </p>
            <p class="ml-8 text-base md:text-lg">
              Feel free to drop me an email at{" "}
              <a
                href="mailto:commonlyoddtrivia@gmail.com"
                class="text-blue-500 hover:text-blue-700"
              >
                commonlyoddtrivia@gmail.com
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
        </Show>

        <Show when={subscriptionStatus() && paymentSuccess()}>
          <div class="  max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="text-center text-base md:text-lg">
              <p class="mb-4 text-2xl md:text-3xl  ">
                Hi <span class="font-bold">{userProfile()?.firstName}</span>,
                you're all set!
              </p>
            </div>
            <div class="text-left text-base md:text-lg">
              <p class="mb-4 ml-8 ">
                Here's a quick tutorial on how to get started
              </p>
            </div>
            <div class="w-full mb-4 text-base md:text-lg">
              <video controls class="w-full h-auto shadow-lg">
                <source src="https://media.commonlyodd.com/payment_succes_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="p-4 flex   justify-center items-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePlayGame}
                sx={{
                  width: "150px",
                  height: "45px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                class="flex justify-center items-center text-gray-300 bg-slate-900"
              >
                Play Game
              </Button>
            </div>
            <p class="mb-4 ml-8 text-base md:text-lg ">
              If you prefer reading, here's the{" "}
              <a
                onClick={handleNavigateRules}
                class="text-blue-500 hover:text-blue-700"
              >
                link to the rules
              </a>{" "}
              pages.
            </p>{" "}
            <p class="mb-4 ml-8 text-base md:text-lg">
              If you have any questions or need further assistance, don't If you
              have any questions or need further assistance, don't hesitate to
              reach out.
            </p>
            <p class="ml-8 text-base md:text-lg">
              Feel free to drop me an email at{" "}
              <a
                href="mailto:commonlyoddtrivia@gmail.com"
                class="text-blue-500 hover:text-blue-700"
              >
                commonlyoddtrivia@gmail.com
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
        </Show>

        <Show when={!subscriptionStatus() && userPage()}>
          <div class="  max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="text-center text-base md:text-lg">
              <p class="mb-4 text-2xl md:text-3xl  ">
                <span class="font-bold">{userProfile()?.firstName}</span>,
                welcome to{" "}
                <span class="font-bold text-white">Commonly Odd</span>
              </p>
            </div>

            <div class="text-left text-base md:text-lg">
              <p class="mb-4 ml-8 ">
                As our newest member, you're granted an exclusive{" "}
                <span class="font-bold">7-day free trial</span> to dive into the
                full Commonly Odd experience.
              </p>
            </div>

            <p class="mb-4 text-2xl md:text-3xl font-bold text-center ">
              Get ready to
            </p>
            <ul class="list-disc pl-8 mb-4 text-left text-base md:text-lg">
              <li class="mb-2">
                Test your wits with our wide-ranging trivia questions across
                various categories.
              </li>
              <li class="mb-2">
                Connect and compete by inviting friends and family to join you
                in the game, all equipped with group voice chat for a livelier
                challenge!
              </li>
              <li class="mb-2">
                Enjoy continuous updates, including fresh questions and new
                categories, to keep the gameplay exciting and engaging.
              </li>
            </ul>
            <p class="mb-4  text-center text-base md:text-lg">
              Here's a quick word from Bruce (founder of Commonly Odd):
            </p>

            <div class="w-full mb-4 text-base md:text-lg">
              <video controls class="w-full h-auto shadow-lg">
                <source src="path_to_your_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <p class="mb-4 ml-8 text-left text-base md:text-lg">
              Ready to start playing? Choose a plan below to begin your free
              trial and play to your heart's content!
            </p>

            <div class="flex flex-col items-center justify-center ">
              <div
                id="pricingplans"
                class="text-gray-300 mb-3 text-4xl font-bold flex justify-center w-full"
              >
                Explore Plans
              </div>
              <div class="flex flex-row justify-center mb-4">
                <PricingPlans />
              </div>
            </div>

            <p class="mb-4 ml-8 text-base md:text-lg">
              If you have any questions or need further assistance, don't If you
              have any questions or need further assistance, don't hesitate to
              reach out.
            </p>
            <p class="ml-8 text-base md:text-lg">
              Feel free to drop me an email at{" "}
              <a
                href="mailto:commonlyoddtrivia@gmail.com"
                class="text-blue-500 hover:text-blue-700"
              >
                commonlyoddtrivia@gmail.com
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
        </Show>

        <Show when={subscriptionStatus() && userPage()}>
          <div class="  max-w-4xl md:mx-auto text-gray-300 flex flex-col items-center px-4 py-4">
            <div class="text-center text-base md:text-lg">
              <p class="mb-4 text-2xl md:text-3xl  ">
                Hi <span class="font-bold">{userProfile()?.firstName}</span>,
                welcome back 😊 You're all set!
              </p>
            </div>

            <div class="text-left text-base md:text-lg">
              <p class="mb-4 ml-8 ">
                Here's a quick tutorial on how to get started
              </p>
            </div>

            <div class="w-full mb-4 text-base md:text-lg">
              <video controls class="w-full h-auto shadow-lg">
                <source src="path_to_your_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div class="p-4 flex   justify-center items-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePlayGame}
                sx={{
                  width: "150px",
                  height: "45px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                class="flex justify-center items-center text-gray-300 bg-slate-900"
              >
                Play Game
              </Button>
            </div>

            <p class="mb-4 ml-8 text-base md:text-lg">
              If you prefer reading, here's the{" "}
              <a
                onClick={handleNavigateRules}
                class="text-blue-500 hover:text-blue-700"
              >
                link to the rules
              </a>{" "}
              pages.
            </p>

            <p class="mb-4 ml-8 text-base md:text-lg">
              If you have any questions or need further assistance, don't If you
              have any questions or need further assistance, don't hesitate to
              reach out.
            </p>
            <p class="ml-8 text-base md:text-lg">
              Feel free to drop me an email at{" "}
              <a
                href="mailto:commonlyoddtrivia@gmail.com"
                class="text-blue-500 hover:text-blue-700"
              >
                commonlyoddtrivia@gmail.com
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
        </Show>
      </div>
      <Footer />
    </div>
  );
};

export default User;
