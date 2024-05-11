import { createEffect, createSignal, JSX, onCleanup, Show } from "solid-js";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import CommonDialog from "../common_dialog";
import { PlayButtonSVG, sessionLink } from "../index";
import StartSession from "./competitive";
import StartSessionFun from "./fun";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export function isSessionStarted() {
  // Check local storage for session UUID, URL for session parameter, session link contains the word "session"
  const sessionUuid = localStorage.getItem("session_uuid");
  if (sessionUuid) return true;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("session")) return true;

  return sessionLink().includes("session");
}

export default function CreateSession() {
  const [open, setOpen] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const [isSessionActive, setIsSessionActive] = createSignal(
    isSessionStarted()
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleDocumentClick = (event) => {
    const menuElement = document.getElementById("game-setup-dialog");
    if (!menuElement.contains(event.target)) {
      handleClose();
    }
  };

  createEffect(() => {
    if (open()) {
      document.addEventListener("click", handleDocumentClick);
      onCleanup(() =>
        document.removeEventListener("click", handleDocumentClick)
      );
    }
  });

  // Periodically check if the session has started
  function checkSessionStatus() {
    const interval = setInterval(() => {
      if (isSessionStarted()) {
        setIsSessionActive(true);
        clearInterval(interval);
      }
    }, 1000);

    onCleanup(() => clearInterval(interval));
  }

  // Start checking session status when component mounts
  checkSessionStatus();

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        disabled={isSessionActive()}
        fullWidth={true}
        style={{
          "font-weight": "bold",
          "text-align": "center",
        }}
      >
        <PlayButtonSVG />
      </Button>
      <div class="text-center font-bold text-base lg:text-md text-zinc-200">
        {isSessionActive() ? (
          <span class="italic  ">Active</span>
        ) : (
          <span class="text-center font-bold ">Get Started</span>
        )}
      </div>
      <Dialog
        open={open()}
        TransitionComponent={Transition}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
        class="game-setup-dialog"
      >
        <DialogTitle
          class="flex justify-center items-center"
          style={dialogTextStyle}
          sx={{ textAlign: "center" }}
        >
          {" "}
          <div class="flex flex-col items-center justify-center text-center ">
            <div class="text-2xl mb-2">Select the game you want to play</div>
            <div class="text-sm">
              You can invite others to the game via the session link.
            </div>
          </div>
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <div class="flex flex-col items-center   justify-center">
            <div class="flex flex-col items-center justify-center mb-6 w-80">
              <div class="text-2xl mb-2  ">Just for Fun</div>

              <ul class="list-disc text-left  mb-4">
                <div class="flex flex-col justify-start items-start">
                  <li>Ideal for playing solo</li>
                  <li>Can select odd one out</li>
                  <li>Scores are untracked</li>
                  <li>No target score</li>
                  <li>Rounds are much faster</li>
                  <li>Can still play multi-player</li>
                </div>
              </ul>

              <div class="StartSessionFun mb-6">
                <StartSessionFun />
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-80">
              <div class="text-2xl mb-2  ">Play Competitively</div>

              <ul class="list-disc text-left ml-8  mb-4">
                <div class="flex flex-col justify-start items-start ">
                  <li>Ideal for group play</li>
                  <li>Cannot select odd one out</li>
                  <li>Scoring is tracked</li>
                  <li>Target score must be set</li>
                  <li>Number of teams must be set</li>
                  <li>Can still play solo</li>
                </div>
              </ul>

              <div class="StartSession mb-6">
                <StartSession />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Wait a second!"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
