import { createEffect, createSignal, onCleanup } from "solid-js";
import { gameTime } from "./";
import "./styles.css";

export default function Timer() {
  const [timer, setTimer] = createSignal(gameTime()?.timer);
  const [showTimesUp, setShowTimesUp] = createSignal(false);
  let timeoutId: NodeJS.Timeout;

  createEffect(() => {
    const currentGameTime = gameTime();
    if (currentGameTime && currentGameTime.timer !== undefined) {
      setTimer(currentGameTime.timer);
      if (currentGameTime.timer === 0) {
        setShowTimesUp(true);
        timeoutId = setTimeout(() => setShowTimesUp(false), 1000);
      }
    }
  });

  onCleanup(() => {
    clearTimeout(timeoutId);
  });

  return (
    <div class="flex flex-col items-center justify-start">
      {timer() !== undefined && (
        <div class="text-center">
          {timer() > 0 ? (
            <p
              class={`flex flex-col justify-center items-center text-9xl font-bold h-32 bg-gradient-to-r from-rose-600 via-pink-300 to-error-400 text-transparent bg-clip-text timerFlashing`}
            >
              {timer()}
            </p>
          ) : (
            showTimesUp() && (
              <p
                class={`flex flex-col justify-center items-center text-6xl font-bold h-32 text-white timerFlashingText`}
              >
                Time's Up!
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
