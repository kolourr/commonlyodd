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

export default function EndSession() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const sessionUuid = localStorage.getItem("session_uuid");
  const starterToken = localStorage.getItem("starter_token");
  const navigate = useNavigate();
  const BASE_API = import.meta.env.CO_API_URL;

  async function endSession() {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_API}/end-session?sessionUUID=${sessionUuid}&starterToken=${starterToken}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Remove session UUID and starter token in local storage
      localStorage.removeItem("session_uuid");
      localStorage.removeItem("starter_token");

      // Reset session link and Notify user
      setSessionLink("https://co.com/click-to-start");
      setDialogContent(
        <>
          Session ended <span class="text-success-500">successfully</span>.
        </>
      );

      setDialogOpen(true);

      // Refresh the page after a short delay
      setTimeout(() => {
        location.reload();
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Failed to end session:", error);
      setDialogContent(
        <>
          <span class="text-error-500">Error</span>ending session. Please try
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
        End Session
      </Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogTitle class="flex justify-center items-center">
          Please Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            <span class="text-error-500"> end the session</span>? All game data
            will be deleted.
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
