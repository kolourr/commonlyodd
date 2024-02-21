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
import { useNavigate } from "solid-app-router";

export default function EndGame() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const navigate = useNavigate();
  const BASE_API = import.meta.env.CO_API_URL;

  async function endSession() {
    setLoading(true);
    try {
      // Remove session UUID from local storage
      localStorage.removeItem("session_uuid");

      //incase they left and joined someone else's game
      localStorage.removeItem("starter_token");

      // Reset session link and Notify user
      setSessionLink(`${BASE_API}/click-to-start`);
      setDialogContent(
        <>
          Game ended <span class="text-success-500">successfully</span>.
        </>
      );

      setDialogOpen(true);

      // Navigate to the base URL
      navigate("/");

      // Refresh the page after a short delay to ensure navigation is complete
      setTimeout(() => {
        location.reload();
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      setDialogContent(
        <>
          <span class="text-error-500">Error</span>ending game. Please try
          again.
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
        End Game
      </Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogTitle class="flex justify-center items-center">
          Please Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            <span class="text-error-500"> end this game</span>?
          </DialogContentText>
          <div class="flex flex-row justify-center py-4">
            {loading() && <CircularProgress color="success" />}{" "}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading()}>
            Cancel
          </Button>
          <Button onClick={endSession} disabled={loading()}>
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
