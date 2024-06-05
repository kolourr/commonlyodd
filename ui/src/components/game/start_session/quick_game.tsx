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
import ConfirmStartDialogQuick, {
  openConfirmDialogFun,
} from "./quick_game_confirm";
import CommonDialog from "../common_dialog";
import Countdown from "./countdown";
import Category from "./category";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function QuickGame() {
  const [open, setOpen] = createSignal(false);
  const [countdown, setCountdown] = createSignal<number>(0);
  const [category, setCategory] = createSignal<string>("");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogContent, setDialogContent] = createSignal<
    string | JSX.Element
  >();

  const handleStartClick = () => {
    if (countdown() > 0 && category() !== "") {
      setOpen(false);
      openConfirmDialogFun(countdown(), category());
    } else {
      setDialogContent(
        <>Please select the category and ideal countdown time per round.</>
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
          backgroundColor: "#15803d",
        }}
      >
        Play Quick
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
          {"Choose the category and countdown duration for the rounds."}
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <Category setCategory={setCategory} />
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
      <ConfirmStartDialogQuick />
    </div>
  );
}
