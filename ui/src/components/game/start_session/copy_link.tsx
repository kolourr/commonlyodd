import { ContentCopy, LinkOutlined } from "@suid/icons-material";
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

const dialogTextStyle = {
  color: "#f9fafb",
};
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
      <Button
        onClick={handleClickOpen}
        sx={{
          width: 50,
          height: 50,
          minWidth: 0,
        }}
      >
        <LinkOutlined />
      </Button>
      <Dialog
        open={open()}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          class="text-center"
          style={dialogTextStyle}
        >
          Session link has been copied
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText
            id="alert-dialog-description"
            style={dialogTextStyle}
          >
            Share the link before starting the game!
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
