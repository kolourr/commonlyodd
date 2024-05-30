import { Button } from "@suid/material";
import { objectsImages } from "./start";
import GameImagesDemo from "./images";

import StartSessionDemo, { isSessionActiveDemo } from "./session";
import EndSessionDemo from "./end";
import { Router } from "solid-app-router";
import StartGameDemo from "./start";
import TimerDemo from "./timer";
import { Show } from "solid-js";

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
        stroke=" #f9fafb"
        strokeWidth="2"
      />
      <polygon points="10 8, 16 12, 10 16" fill="#f9fafb" />
    </svg>
  </>
);

export default function Demo() {
  return (
    <div class="flex flex-col justify-center items-center">
      <h3 class="text-4xl font-bold mb-2  text-center">DEMO</h3>
      <div class="flex  flex-col justify-center items-center    ">
        <GameImagesDemo gameData={objectsImages()} />
        <div class="flex justify-center items-center">
          <div class="flex flex-col h-36   justify-center items-center py-6 mb-4 mt-12">
            <div>
              <Show when={!isSessionActiveDemo()}>
                <StartSessionDemo />
              </Show>
            </div>
            <div>
              <Show when={isSessionActiveDemo()}>
                <Router>
                  <StartGameDemo />
                </Router>
              </Show>
            </div>
            <div class="mt-4">
              <Router>
                <EndSessionDemo />
              </Router>
            </div>
          </div>
          <TimerDemo />
        </div>
      </div>
    </div>
  );
}
