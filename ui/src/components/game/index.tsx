import { createSignal } from "solid-js";
import { Button } from "@suid/material";
import ContentCopyIcon from "@suid/icons-material/ContentCopy";
import PlaceholderIcon from "@suid/icons-material/Place";

export default function Game() {
  const [timer, setTimer] = createSignal("00:00");
  const [sessionLink, setSessionLink] = createSignal(
    "commonlyodd.com/join?session=12345"
  );

  return (
    <div class="flex flex-col h-screen md:max-w-5xl lg:max-w-7xl mx-auto">
      {/* Header */}
      <div class="bg-slate-50 text-center py-4">
        <h1 class="text-3xl font-bold">Commonly Odd</h1>
      </div>

      {/* Main Section */}
      <div class="flex flex-row bg-slate-50">
        <div class="flex w-1/5 justify-center items-center">
          <Button size="large">Start Session</Button>
        </div>
        <div class="flex w-3/5 flex-row items-center justify-center">
          <ContentCopyIcon
            onClick={() => navigator.clipboard.writeText(sessionLink())}
          />
          <input
            type="text"
            class="border p-2 rounded ml-2 w-full md:w-auto lg:w-5/12"
            readOnly
            value={sessionLink()}
          />
        </div>
        <div class="flex w-1/5 justify-center items-center">
          <div class="text-center">
            <p class="text-lg">Timer</p>
            <p class="text-lg font-bold">{timer()}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div class="flex flex-grow">
        <div class="flex flex-col items-center w-1/12 sm:pt-32 lg:pt-16 sm:justify-start lg:justify-center bg-slate-50">
          {/* Dummy Icons */}
          <div class="flex flex-col space-y-12">
            <PlaceholderIcon />
            <PlaceholderIcon />
            <PlaceholderIcon />
            <PlaceholderIcon />
            <PlaceholderIcon />
          </div>
        </div>
        <div class="flex w-10/12 flex-col lg:flex-row items-center lg:space-x-4 bg-slate-100">
          {/* Dummy Images */}
          <div class="py-4">
            <p class="text-center">Obj1</p>
            <img src="https://via.placeholder.com/400" alt="Obj1" />
          </div>
          <div class="py-4">
            <p class="text-center">Obj2</p>
            <img src="https://via.placeholder.com/400" alt="Obj2" />
          </div>
          <div class="py-4">
            <p class="text-center">Obj3</p>
            <img src="https://via.placeholder.com/400" alt="Obj3" />
          </div>
        </div>
        <div class="flex flex-col items-center w-1/12 sm:pt-32 lg:pt-16 sm:justify-start lg:justify-center bg-slate-50">
          {/* Dummy Icons */}
          <div class="flex flex-col space-y-12">
            <PlaceholderIcon />
            <PlaceholderIcon />
            <PlaceholderIcon />
            <PlaceholderIcon />
            <PlaceholderIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
