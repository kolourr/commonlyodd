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

const dialogTextStyle = {
  color: "#f9fafb",
};
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
      localStorage.removeItem("type");
      localStorage.removeItem("total_score");
      localStorage.removeItem("user_score");

      // Reset session link and Notify user
      setSessionLink(`${BASE_API}/click-to-start`);
      setDialogContent(
        <>
          Game ended <span class="text-success-700">successfully</span>.
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
      setDialogContent(<>Error ending game. Please try again.</>);
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
          backgroundColor: "#075985",
        }}
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
          class="flex justify-center items-center "
          style={dialogTextStyle}
        >
          Please Confirm
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            Are you sure you want to end this game?
          </DialogContentText>
          <div class="flex flex-row justify-center py-4">
            {loading() && <CircularProgress color="success" />}{" "}
          </div>
        </DialogContent>
        <DialogActions
          class="flex justify-center items-center "
          style={dialogTextStyle}
        >
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
