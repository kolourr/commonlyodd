import { createEffect, createSignal } from "solid-js";
import { gameTime } from "./";

export default function Timer() {
  const [timer, setTimer] = createSignal(gameTime()?.timer || 15);

  createEffect(() => {
    // This will run whenever gameTime() changes
    const currentGameTime = gameTime();
    if (currentGameTime && currentGameTime.timer !== undefined) {
      setTimer(currentGameTime.timer);
    }
  });

  return (
    <div class="flex flex-col items-center justify-start   ">
      <div class="text-center">
        <p class="text-sm h-8">Timer</p>
        <p class="flex justify-center items-center text-6xl font-bold h-32 text-error-700 pb-8">
          {timer()}
        </p>
      </div>
    </div>
  );
}
