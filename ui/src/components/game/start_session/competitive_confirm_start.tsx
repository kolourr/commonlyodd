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

const [open, setOpen] = createSignal(false);
const [loading, setLoading] = createSignal(false);
const [selectedTeams, setSelectedTeams] = createSignal<number>(0);
const [selectedScore, setSelectedScore] = createSignal<number>(0);
const [category, setCategory] = createSignal<string>("");
const [countdown, setCountdown] = createSignal<number>(0);
const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();

const dialogTextStyle = {
  color: "#f9fafb",
};

export async function openConfirmDialog(
  teams: number,
  targetScore: number,
  countdown: number,
  category: string
) {
  setSelectedTeams(teams);
  setSelectedScore(targetScore);
  setCountdown(countdown);
  setCategory(category);
  setOpen(true);
}

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
          number_of_teams: selectedTeams(),
          target_score: selectedScore(),
          countdown: countdown(),
          category: category().split(" ").join("_").toLowerCase(),
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
    localStorage.setItem("type", "competitive");

    // Update session link and Notify user
    setSessionLink(data.join_link);
    setDialogContent(
      <>
        Session created successfully. If you are inviting others to join, send
        all players the session link prior to starting the game.
      </>
    );

    setDialogOpen(true);
  } catch (error) {
    console.error("Failed to start session:", error);
    setDialogContent(<>Error starting session. Please try again.</>);
    setDialogOpen(true);
  } finally {
    setLoading(false);
    setOpen(false);
  }
}

export default function ConfirmStartDialog() {
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
        <DialogTitle
          class="flex justify-center items-center"
          style={dialogTextStyle}
        >
          Confirm Game Settings
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            You have selected the {category()} category, {selectedTeams()} teams
            with a target score of {selectedScore()} and a countdown of{" "}
            {countdown()} seconds per round. Want to proceed with these
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
            sx={{ color: "#f4f4f5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={startSession}
            disabled={loading()}
            sx={{ color: "#f4f4f5" }}
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
