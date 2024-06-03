import { Button } from "@suid/material";
import { objectsImages } from "./start";
import GameImagesDemo from "./images";

import StartSessionDemo, { isSessionActiveDemo } from "./session";
import EndSessionDemo from "./end";
import { Router } from "solid-app-router";
import StartGameDemo from "./start";
import TimerDemo from "./timer";
import { Show, onMount } from "solid-js";
import { setGameInfo } from "..";
import {
  buttonText,
  landingHeroButton,
} from "~/components/auth_payments_landing/landing";

export const PlayButtonSVGDEMO = () => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon points="10 8, 16 12, 10 16" fill="currentColor" />
    </svg>
  </>
);

export default function Demo() {
  setGameInfo(
    <div class="flex flex-col  justify-center items-center">
      <div class="md:text-base lg:text-xl">Click play to begin.</div>
    </div>
  );

  onMount(() => {
    // Set session UUID and starter token in local storage
    localStorage.removeItem("session_uuid_demo");
    localStorage.removeItem("starter_token_demo");
    localStorage.removeItem("type_demo");
    localStorage.removeItem("total_score_demo");
  });

  return (
    <div class="flex flex-col justify-center items-center ">
      <h3 class="text-4xl font-bold my-4 text-center" id="demo">
        Quick Mode - Demo
      </h3>
      <p class="text-xl text-slate-400    flex justify-center items-center text-center py-2 lg:px-44 ">
        This demo is a simplified version of quick mode.
      </p>
      <p class="text-xl text-slate-400  mb-8  flex justify-center items-center text-center pb-2 lg:px-44 ">
        It features a mix of trivia categories, including baseball, basketball,
        football, harry potter and the Bible.
      </p>

      <div class="flex  flex-col justify-center items-center    ">
        <GameImagesDemo gameData={objectsImages()} />
        <div class="flex justify-center items-center">
          <div class="flex flex-col  justify-center items-center   text-gray-300">
            <div class="mt-4">
              <Show when={!isSessionActiveDemo()}>
                <StartSessionDemo />
              </Show>
            </div>
            <div class="mt-4">
              <Show when={isSessionActiveDemo()}>
                <Router>
                  <StartGameDemo />
                </Router>
              </Show>
            </div>
            <div>
              <Router>
                <EndSessionDemo />
              </Router>
            </div>
            <div class="flex flex-col justify-center items-center mt-10 ">
              <Button
                variant="contained"
                color="secondary"
                onClick={landingHeroButton}
                sx={{
                  width: "300px",
                  height: "60px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                class="flex justify-center items-center text-gray-300 bg-slate-900"
              >
                {buttonText()}
              </Button>
            </div>
          </div>
          <TimerDemo />
        </div>
      </div>
    </div>
  );
}
