import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { createSignal } from "solid-js";

const [open, setOpen] = createSignal(false);

const handleClose = () => {
  setOpen(false);
};

const dialogTextStyle = {
  color: "#f9fafb",
};

export const handleCompleteOpen = () => {
  setOpen(true);
};

export default function Complete() {
  return (
    <div>
      <Dialog
        open={open()}
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
          id="alert-dialog-title"
          style={dialogTextStyle}
        >
          {"The game and session have ended!"}
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText
            id="alert-dialog-description"
            style={dialogTextStyle}
          >
            Thank you for playing Commonly Odd! The session you were in has now
            ended. If you would like to start your own session and play again,
            click the button 'Start Session'
          </DialogContentText>
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
