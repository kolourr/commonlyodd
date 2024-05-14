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
import ConfirmStartDialogFun, {
  openConfirmDialogFun,
} from "./fun_confirm_start";
import CommonDialog from "../common_dialog";
import Countdown from "./countdown";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function StartSessionFun() {
  const [open, setOpen] = createSignal(false);
  const [countdown, setCountdown] = createSignal<number>(0);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();

  const handleStartClick = () => {
    if (countdown() > 0) {
      setOpen(false);
      openConfirmDialogFun(countdown());
    } else {
      setDialogContent(<>Please select the ideal countdown time per round.</>);

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
        Play Quick Game +
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
          {"Choose the countdown duration for each round to initiate the game."}
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
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
      <ConfirmStartDialogFun />
    </div>
  );
}
