import { createSignal, JSX, Show } from "solid-js";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import NumberOfTeams from "../start_session/number_of_teams";
import TargetScore from "../start_session/target_score";
import CommonDialog from "../common_dialog";
import { openNewGameConfirmDialog } from "./confirm_new_game_start";
import Countdown from "../start_session/countdown";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function NewGame() {
  const [open, setOpen] = createSignal(false);
  const [teams, setTeams] = createSignal<number>(0);
  const [targetScore, setTargetScore] = createSignal<number>(0);
  const [countdown, setCountdown] = createSignal<number>(0);

  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();

  const handleStartClick = () => {
    if (teams() > 0 && targetScore() > 0 && countdown() > 0) {
      setOpen(false);
      openNewGameConfirmDialog(teams(), targetScore(), countdown());
    } else {
      setDialogContent(
        <>
          Please select the number of teams, a target score and countdown time
          per round to start a new game.
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
          backgroundColor: "#075985",
        }}
      >
        Start New Game
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
        <DialogTitle style={dialogTextStyle}>
          {"Select the target score and number of teams to start!"}
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <NumberOfTeams setTeams={setTeams} />
          <TargetScore setTargetScore={setTargetScore} />
          <Countdown setCountdown={setCountdown} />
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button onClick={handleStartClick} style={dialogTextStyle}>
            Start New Game
          </Button>
        </DialogActions>
      </Dialog>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Just making sure!"
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
