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
const [countdown, setCountdown] = createSignal<number>(0);

const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();

const dialogTextStyle = {
  color: "#f9fafb",
};

export async function openNewGameConfirmDialog(
  teams: number,
  targetScore: number,
  countdown: number
) {
  setSelectedTeams(teams);
  setSelectedScore(targetScore);
  setCountdown(countdown);
  setOpen(true);
}

async function startNewGame() {
  setLoading(true);
  try {
    const message: messageData = {
      game_state: "new-game",
      number_of_teams: selectedTeams(),
      target_score: selectedScore(),
      countdown: countdown(),
    };
    sendMessage(message);

    //   Notify user
    setDialogContent(<>New game created successfully.</>);

    setDialogOpen(true);
  } catch (error) {
    console.error("Failed to start new game:", error);
    setDialogContent(<>Error starting new game. Please try again.</>);
    setDialogOpen(true);
  } finally {
    setLoading(false);
    setOpen(false);
  }
}

export default function ConfirmStartNewGameDialog() {
  return (
    <div>
      <Dialog
        open={open()}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <DialogTitle style={dialogTextStyle}>Confirm Game Settings</DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            You have selected {selectedTeams()} team(s) with a target score of{" "}
            {selectedScore()} and a countdown of {countdown()} seconds per
            round. Are you sure you want to start the session with these
            settings?
          </DialogContentText>
          <div class="flex flex-row justify-center py-4">
            {loading() && <CircularProgress color="success" />}{" "}
          </div>
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading()}
            style={dialogTextStyle}
          >
            Cancel
          </Button>
          <Button
            onClick={startNewGame}
            disabled={loading()}
            style={dialogTextStyle}
          >
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
