import { JSX, Show, createSignal } from "solid-js";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { setSessionLink } from "../index";
import CommonDialog from "../common_dialog";

const [open, setOpen] = createSignal(false);
const [loading, setLoading] = createSignal(false);
const [selectedTeams, setSelectedTeams] = createSignal<number>(0);
const [selectedScore, setSelectedScore] = createSignal<number>(0);
const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();

export async function openConfirmDialog(teams: number, targetScore: number) {
  setSelectedTeams(teams);
  setSelectedScore(targetScore);
  setOpen(true);
}

async function startSession() {
  setLoading(true);
  try {
    const response = await fetch(
      `${import.meta.env.CO_API_URL}/start-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          number_of_teams: selectedTeams(),
          target_score: selectedScore(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // Set session UUID and starter token in local storage
    localStorage.setItem("session_uuid", data.session_uuid);
    localStorage.setItem("starter_token", data.starter_token);

    // Update session link and Notify user
    setSessionLink(data.join_link);
    setDialogContent(
      <>
        Session created <span class="text-success-500">successfully</span>.
        Please copy the session link and send it to all players before starting
        the game.
      </>
    );

    setDialogOpen(true);
  } catch (error) {
    console.error("Failed to start session:", error);
    setDialogContent(
      <>
        <span class="text-error-500">Error</span> starting session. Please try
        again.
      </>
    );
    setDialogOpen(true);
  } finally {
    setLoading(false);
    setOpen(false);
  }
}

export default function ConfirmStartDialog() {
  return (
    <div>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Game Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected{" "}
            <span class="text-error-500">{selectedTeams()}</span> team(s) with a
            target score of{" "}
            <span class="text-error-500">{selectedScore()}</span>. Are you sure
            you want to start the session with these settings?
          </DialogContentText>
          <div class="flex flex-row justify-center py-4">
            {loading() && <CircularProgress color="success" />}{" "}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading()}>
            Cancel
          </Button>
          <Button onClick={startSession} disabled={loading()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Session Status"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
