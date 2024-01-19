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

export const handleCompleteOpen = () => {
  setOpen(true);
};

export default function Complete() {
  return (
    <div>
      <Dialog
        open={open()}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"The game and session have ended!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Thank you for playing Commonly Odd! The session you were in has now
            ended. If you would like to start your own session and play again,
            click the button 'Start Session'
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
