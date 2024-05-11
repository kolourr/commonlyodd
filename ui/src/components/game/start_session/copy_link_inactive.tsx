import { ContentCopy, LinkOffOutlined } from "@suid/icons-material";
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
export default function CopyLinkInactive() {
  const [open, setOpen] = createSignal(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} style="border: none;      ">
        <LinkOffOutlined fontSize="large" />
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
          Session link is Not Available
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText
            id="alert-dialog-description"
            style={dialogTextStyle}
          >
            Create a new game session to get the link!
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
