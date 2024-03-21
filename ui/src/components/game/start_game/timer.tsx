import { createEffect, createSignal } from "solid-js";
import { gameTime } from "./";

export default function Timer() {
  const [timer, setTimer] = createSignal(gameTime()?.timer);

  createEffect(() => {
    // This will run whenever gameTime() changes
    const currentGameTime = gameTime();
    if (currentGameTime && currentGameTime.timer !== undefined) {
      setTimer(currentGameTime.timer);
    }
  });

  return (
    <div class="flex flex-col items-center justify-start">
      {timer() !== undefined && timer() > 0 && (
        <div class="text-center">
          <p class="flex flex-col justify-center items-center text-6xl font-bold h-32 text-error-700">
            {timer()}
          </p>
        </div>
      )}
    </div>
  );
}
