import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { createSignal } from "solid-js";

export default function Complete() {
  const [open, setOpen] = createSignal(false);

  const handleClose = (event: Event, reason?: string) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
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
