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
import { useNavigate } from "solid-app-router";

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function EndSessionMessage() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();
  const navigate = useNavigate();

  async function endSession() {
    setLoading(true);
    try {
      sendMessage({ game_state: "end" });
      // Remove session UUID and starter token in local storage
      localStorage.removeItem("session_uuid");
      localStorage.removeItem("starter_token");
      localStorage.removeItem("type");

      setDialogContent(<>Session has ended successfully .</>);
      setDialogOpen(true);

      // Navigate to the base URL
      navigate("/game");

      // Refresh the page after a short delay to ensure navigation is complete
      setTimeout(() => {
        location.reload();
      }, 1000); // Adjust the delay as needed
    } catch (error) {
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
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          width: "200px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "white",
          backgroundColor: "#7c2d12",
        }}
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
          class="flex justify-center items-center"
          style={dialogTextStyle}
        >
          Please Confirm
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            Are you sure you want to end the session?
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
          title="Ending Session Status"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
