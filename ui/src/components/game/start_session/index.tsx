import { createSignal, JSX, onCleanup, Show } from "solid-js";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import NumberOfTeams from "./number_of_teams";
import TargetScore from "./target_score";
import { openConfirmDialog } from "./confirm_start";
import CommonDialog from "../common_dialog";
import { sessionLink } from "../index";
import { EditOutlined, PlayCircleOutlined } from "@suid/icons-material";
import Countdown from "./countdown";

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

export default function StartSession() {
  const [open, setOpen] = createSignal(false);
  const [teams, setTeams] = createSignal<number>(0);
  const [targetScore, setTargetScore] = createSignal<number>(0);
  const [countdown, setCountdown] = createSignal<number>(0);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const [isSessionActive, setIsSessionActive] = createSignal(
    isSessionStarted()
  );

  const handleStartClick = () => {
    if (teams() > 0 && targetScore() > 0 && countdown() > 0) {
      setOpen(false);
      openConfirmDialog(teams(), targetScore(), countdown());
    } else {
      setDialogContent(
        <>
          Please select the number of teams, target score and countdown time per
          round.
        </>
      );

      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <PlayCircleOutlined
          fontSize="large"
          sx={{ width: "100px", height: "100px" }}
        />
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
      >
        <DialogTitle
          class="flex justify-center items-center"
          style={dialogTextStyle}
          sx={{ textAlign: "center" }}
        >
          {
            "Select the target score, number of teams and countdown time per round to start the game."
          }
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <NumberOfTeams setTeams={setTeams} />
          <TargetScore setTargetScore={setTargetScore} />
          <Countdown setCountdown={setCountdown} />
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button class="font-bold" onClick={handleStartClick}>
            Create Game Session
          </Button>
        </DialogActions>
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
