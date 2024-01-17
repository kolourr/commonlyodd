import { createEffect, createSignal } from "solid-js";
import { gameTime } from "./";

export default function Timer() {
  const [timer, setTimer] = createSignal(gameTime()?.timer || 0);

  createEffect(() => {
    // This will run whenever gameTime() changes
    const currentGameTime = gameTime();
    if (currentGameTime && currentGameTime.timer !== undefined) {
      setTimer(currentGameTime.timer);
    }
  });

  return (
    <div class="flex flex-col items-center justify-start space-y-20 ">
      <div class="text-center">
        <p class="text-lg">Timer</p>
        <p class="text-lg font-bold">{timer()}</p>
      </div>
    </div>
  );
}
