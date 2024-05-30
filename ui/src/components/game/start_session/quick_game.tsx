import { createSignal, JSX, onCleanup, Show } from "solid-js";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import CommonDialog from "../common_dialog";
import { setSessionLink } from "..";
import { sendMessage } from "../start_game";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function QuickGame() {
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();

  const numberOfTeams = 1;
  const targetScore = 1000;
  const countdownTimer = 7;

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
            number_of_teams: numberOfTeams,
            target_score: targetScore,
            countdown: countdownTimer,
            category: "random",
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
      localStorage.setItem("type", "fun");

      // Update session link
      setSessionLink(data.join_link);
      setDialogOpen(true);
      sendMessage({ game_state: "start-solo" });
    } catch (error) {
      console.error("Failed to start session:", error);
      setDialogContent(<>Error starting session. Please try again.</>);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={startSession}
        sx={{
          width: "200px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
          backgroundColor: "#15803d",
        }}
      >
        Play Quick Game
      </Button>

      <Dialog
        open={dialogOpen()}
        onClose={() => setDialogOpen(false)}
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
          Game Status!
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            Session created successfully. If you are inviting others to join,
            send all players the session link prior to starting the game.
            <div class="flex flex-row justify-center py-4">
              {loading() && <CircularProgress color="success" />}{" "}
            </div>{" "}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
