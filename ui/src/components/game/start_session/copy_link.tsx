import { ContentCopy } from "@suid/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { createSignal } from "solid-js";
import { sessionLink } from "../index";

export default function CopyLink() {
  const [open, setOpen] = createSignal(false);

  const handleClickOpen = () => {
    navigator.clipboard.writeText(sessionLink());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button>
        <ContentCopy onClick={handleClickOpen} />
      </Button>
      <Dialog
        open={open()}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Your Session link has been copied!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Share this link with all players before starting the game!
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
