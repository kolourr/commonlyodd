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
import { sendMessage, setIsSessionEndedEndpoint } from "../start_game";

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
  const BASE_UI = import.meta.env.CO_UI_URL;

  const dialogTextStyle = {
    color: "#f9fafb",
  };

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

      sendMessage({ game_state: "end" });
      setIsSessionEndedEndpoint(true);

      // Remove session UUID and starter token in local storage
      localStorage.removeItem("session_uuid");
      localStorage.removeItem("starter_token");

      // Reset session link and Notify user
      setSessionLink(`${BASE_UI}/click-to-start`);
      setDialogContent(
        <>
          Session ended <span class="text-success-700">successfully</span>.
        </>
      );

      setDialogOpen(true);

      // Navigate to the base URL
      navigate("/game");

      // Refresh the page after a short delay to ensure navigation is complete
      setTimeout(() => {
        location.reload();
      }, 500); // Adjust the delay as needed
    } catch (error) {
      console.error("Failed to end session:", error);
      setDialogContent(<>Error ending session. Please try again.</>);
      setDialogOpen(true);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div>
      <Button
        sx={{
          color: "#f9fafb",
          width: 150,
          height: 50,
        }}
        class="flex justify-center items-center bg-gradient-to-bl from-warning-800 to-error-800"
        onClick={() => setOpen(true)}
      >
        End Session
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
          class="flex justify-center items-center "
          style={dialogTextStyle}
        >
          Please Confirm
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            Are you sure you want to end the session? All game data will be
            deleted.
          </DialogContentText>
          <div class="flex flex-row justify-center py-4">
            {loading() && <CircularProgress color="success" />}{" "}
          </div>
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading()}
            sx={{ color: "#f9fafb" }}
          >
            Cancel
          </Button>
          <Button
            onClick={endSession}
            disabled={loading()}
            sx={{ color: "#f9fafb" }}
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
