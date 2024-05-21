import { scoreColor } from "../game";
import { Match, Switch } from "solid-js";

export default function LightsUp() {
  return (
    <>
      <Switch
        fallback={
          <span class="transform -rotate-12 border shadow-md shadow-gray-50 text-3xl hover:scale-105 transition-transform text-gray-200 duration-300 uppercase font-bold tracking-[0.1em]">
            Odd
          </span>
        }
      >
        <Match when={scoreColor() < 0}>
          <span class="transform -rotate-12 border shadow-md shadow-gray-50 text-3xl hover:scale-105 transition-transform text-gray-200 duration-300 uppercase font-bold tracking-[0.1em]">
            Odd
          </span>
        </Match>
        <Match when={scoreColor() == 0}>
          <span class="transform -rotate-12 border shadow-md shadow-gray-50 bg-error-800 text-3xl hover:scale-105 transition-transform text-gray-200 duration-300 uppercase font-bold tracking-[0.1em]">
            Odd
          </span>
        </Match>
        <Match when={scoreColor() == 1}>
          <span class="transform -rotate-12 border shadow-md shadow-gray-50 bg-warning-800 text-3xl hover:scale-105 transition-transform text-gray-200 duration-300 uppercase font-bold tracking-[0.1em]">
            Odd
          </span>
        </Match>
        <Match when={scoreColor() == 1.5}>
          <span class="transform -rotate-12 border shadow-md shadow-gray-50 bg-gray-500 text-3xl hover:scale-105 transition-transform text-gray-200 duration-300 uppercase font-bold tracking-[0.1em]">
            Odd
          </span>
        </Match>
        <Match when={scoreColor() == 2}>
          <span class="transform -rotate-12 border shadow-md shadow-gray-50 bg-warning-500 text-3xl hover:scale-105 transition-transform text-gray-200 duration-300 uppercase font-bold tracking-[0.1em]">
            Odd
          </span>
        </Match>
      </Switch>
    </>
  );
}
