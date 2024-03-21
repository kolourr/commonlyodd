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

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

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
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const [isSessionActive, setIsSessionActive] = createSignal(
    isSessionStarted()
  );

  const handleStartClick = () => {
    if (teams() > 0 && targetScore() > 0) {
      setOpen(false);
      openConfirmDialog(teams(), targetScore());
    } else {
      setDialogContent(
        <>
          Please select both the
          <span class="text-error-500"> number of teams</span> and a
          <span class="text-error-500"> target score</span> to start the
          session.
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
        fullWidth={false}
        style="    font-weight: bold;   text-align: center;  "
        color="success"
      >
        {isSessionActive() ? (
          <span class="text-error-700 italic sm:text-sm lg:text-2xl bg-gradient-to-r from-rose-200 via-pink-100 to-error-200 shadow-md">
            Session Active
          </span>
        ) : (
          <span class="text-success-600 text-xs bg-error-100">
            Create Session
          </span>
        )}
      </Button>
      <Dialog
        open={open()}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <DialogTitle>
          {"Select the target score and number of teams to start!"}
        </DialogTitle>
        <DialogContent>
          <NumberOfTeams setTeams={setTeams} />
          <TargetScore setTargetScore={setTargetScore} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStartClick}>Create Session</Button>
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
