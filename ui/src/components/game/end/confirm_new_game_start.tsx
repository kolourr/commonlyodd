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
import { sendMessage } from "../start_game";
import CommonDialog from "../common_dialog";
import { messageData } from "../start_game/types";

const [open, setOpen] = createSignal(false);
const [loading, setLoading] = createSignal(false);
const [selectedTeams, setSelectedTeams] = createSignal<number>(0);
const [selectedScore, setSelectedScore] = createSignal<number>(0);
const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();

export async function openNewGameConfirmDialog(
  teams: number,
  targetScore: number
) {
  setSelectedTeams(teams);
  setSelectedScore(targetScore);
  setOpen(true);
}

async function startNewGame() {
  setLoading(true);
  try {
    const message: messageData = {
      game_state: "new-game",
      number_of_teams: selectedTeams(),
      target_score: selectedScore(),
    };
    sendMessage(message);

    //   Notify user
    setDialogContent(
      <>
        New game created <span class="text-success-500">successfully</span>.
      </>
    );

    setDialogOpen(true);
  } catch (error) {
    console.error("Failed to start new game:", error);
    setDialogContent(
      <>
        <span class="text-error-500">Error</span> starting new game. Please try
        again.
      </>
    );
    setDialogOpen(true);
  } finally {
    setLoading(false);
    setOpen(false);
  }
}

export default function ConfirmStartNewGameDialog() {
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
          <Button onClick={startNewGame} disabled={loading()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="New Game Status"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
