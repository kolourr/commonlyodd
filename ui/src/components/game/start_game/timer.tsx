import { createEffect, createSignal, onCleanup } from "solid-js";
import { gameTime } from "./";
import "./styles.css";
import {
  isRevealInitiated,
  sendMessage,
  setIsRevealInitiated,
  gameType,
} from "./index";
import { updateScores, selectedImage } from "./images";

export default function Timer() {
  const [timer, setTimer] = createSignal(gameTime()?.timer);
  const [showTimesUp, setShowTimesUp] = createSignal(false);
  let timeoutId: NodeJS.Timeout;

  createEffect(() => {
    onCleanup(() => {
      clearTimeout(timeoutId);
    });

    const currentGameTime = gameTime();
    if (currentGameTime && currentGameTime.timer !== undefined) {
      setTimer(currentGameTime.timer);
      if (currentGameTime.timer === 0) {
        setShowTimesUp(true);
        timeoutId = setTimeout(() => setShowTimesUp(false), 1000);

        if (!selectedImage()) {
          sendMessage({ game_state: "reveal-solo" });
          setIsRevealInitiated(true);
          updateScores(false);
        } else {
          sendMessage({ game_state: "reveal-solo" });
          setIsRevealInitiated(true);
        }
      }
    }
  });

  createEffect(() => {
    if (isRevealInitiated()) {
      // As soon as reveal is initiated, reset the timer and clear any timeouts
      setTimer(undefined);
      clearTimeout(timeoutId);
      setShowTimesUp(false);
    }
  });

  // This effect ensures that if gameTime() returns undefined, the timer is reset immediately
  createEffect(() => {
    if (gameTime()?.timer === undefined) {
      setTimer(undefined);
    }
  });

  return (
    <div class="flex flex-col items-center justify-start">
      {timer() !== undefined && (
        <div class="text-center">
          {timer() > 0 ? (
            <p
              class={`flex flex-col justify-center items-center text-5xl font-bold h-28 bg-gradient-to-r from-rose-600 via-pink-300 to-error-400 text-transparent bg-clip-text timerFlashing`}
            >
              {timer()}
            </p>
          ) : (
            showTimesUp() && (
              <p
                class={`flex flex-col justify-center items-center text-6xl font-bold h-32 text-white timerFlashingText`}
              >
                Time's Up
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
