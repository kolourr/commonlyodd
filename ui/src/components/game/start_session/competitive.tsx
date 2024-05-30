import { createSignal, JSX, onCleanup, Show } from "solid-js";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import NumberOfTeams from "./number_of_teams";
import TargetScore from "./target_score";
import { openConfirmDialog } from "./competitive_confirm_start";
import CommonDialog from "../common_dialog";
import Countdown from "./countdown";
import Category from "./category";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function StartSession() {
  const [open, setOpen] = createSignal(false);
  const [teams, setTeams] = createSignal<number>(0);
  const [targetScore, setTargetScore] = createSignal<number>(0);
  const [countdown, setCountdown] = createSignal<number>(0);
  const [category, setCategory] = createSignal<string>("");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();

  const handleStartClick = () => {
    if (
      teams() > 0 &&
      targetScore() > 0 &&
      countdown() > 0 &&
      category() !== ""
    ) {
      setOpen(false);
      openConfirmDialog(teams(), targetScore(), countdown(), category());
    } else {
      setDialogContent(
        <>
          Please select the category, number of teams, target score and
          countdown time per round.
        </>
      );

      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          width: "200px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
          backgroundColor: "#7c2d12",
        }}
      >
        Play Competitively
      </Button>
      <Dialog
        open={open()}
        TransitionComponent={Transition}
        onClose={handleClose}
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
          sx={{ textAlign: "center" }}
        >
          {
            "Set the category, target score, number of teams, and countdown duration for each round to initiate the game."
          }
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <Category setCategory={setCategory} />
          <NumberOfTeams setTeams={setTeams} />
          <TargetScore setTargetScore={setTargetScore} />
          <Countdown setCountdown={setCountdown} />
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button class="font-bold" onClick={handleStartClick}>
            Create Game Session
          </Button>
        </DialogActions>
      </Dialog>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Wait a second!"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
