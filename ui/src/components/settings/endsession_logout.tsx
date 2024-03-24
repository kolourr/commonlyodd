import { JSX, Show, createSignal } from "solid-js";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@suid/material";
import CommonDialog from "../game/common_dialog";
import { sendMessage, setIsSessionEndedEndpoint } from "../game/start_game";

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function EndSessionLogout() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const sessionUuid = localStorage.getItem("session_uuid");
  const starterToken = localStorage.getItem("starter_token");
  const BASE_API = import.meta.env.CO_API_URL;

  async function endSession() {
    setLoading(true);
    try {
      if (sessionUuid && starterToken) {
        const response = await fetch(
          `${BASE_API}/end-session?sessionUUID=${sessionUuid}&starterToken=${starterToken}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        sendMessage({ game_state: "end" });
        setIsSessionEndedEndpoint(true);

        // Remove session UUID and starter token in local storage
        localStorage.removeItem("session_uuid");
        localStorage.removeItem("starter_token");
      }
      window.location.href = `${BASE_API}/logout`;
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
    <div class="bg-slate-200">
      <Button
        class="flex justify-center items-center "
        sx={{
          bgColor: "rgb(226 232 240 / var(--tw-bg-opacity))",
          width: 150,
          height: 50,
        }}
        onClick={() => setOpen(true)}
        color="error"
      >
        End Game
      </Button>
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
        <DialogTitle
          class="flex justify-center items-center"
          style={dialogTextStyle}
        >
          Please Confirm
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            Before you end the game session and logout, notify all players that
            the game will be ending soon. Click on{" "}
            <span class="text-error-500"> confirm</span> to end the game session
            and logout.
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
            onClick={endSession}
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
          title="Session Status"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
