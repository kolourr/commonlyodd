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
import CommonDialog from "../common_dialog";
import { sendMessage } from "../start_game";

export default function NewGame() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();

  async function startNewGame() {
    setLoading(true);
    try {
      sendMessage({ game_state: "new-game" });
      setDialogContent(
        <>
          New game started <span class="text-success-500">successfully</span>.
        </>
      );
      setDialogOpen(true);
    } catch (error) {
      setDialogContent(
        <>
          <span class="text-error-500">Error</span> starting new game. Please
          try again.
        </>
      );
      setDialogOpen(true);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div>
      <Button
        class="flex justify-center items-center "
        sx={{
          bgcolor: "#881337",
          color: "#fecdd3",
          width: 150,
          height: 50,
        }}
        onClick={() => setOpen(true)}
      >
        Start New Game
      </Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogTitle class="flex justify-center items-center">
          Please Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            <span class="text-error-500"> start a new game</span>?
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
