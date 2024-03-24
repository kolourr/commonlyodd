import { Component, createSignal, JSX, Show } from "solid-js";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";

interface CommonDialogProps {
  open: boolean;
  title: JSX.Element | string;
  content: JSX.Element | string;
  onClose: () => void;
  showCancelButton?: boolean;
  confirmButtonText?: string;
}

const dialogTextStyle = {
  color: "#f9fafb",
};

const CommonDialog: Component<CommonDialogProps> = (props) => {
  const [open, setOpen] = createSignal(props.open);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
    <Dialog
      open={open()}
      onClose={handleClose}
      aria-labelledby="common-dialog-title"
      aria-describedby="common-dialog-description"
      PaperProps={{
        sx: {
          backgroundImage:
            "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
        },
      }}
    >
      <DialogTitle
        id="common-dialog-title"
        class="flex justify-center items-center"
        style={dialogTextStyle}
      >
        {props.title}
      </DialogTitle>
      <DialogContent style={dialogTextStyle}>
        <DialogContentText
          id="common-dialog-description"
          style={dialogTextStyle}
        >
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        class="flex justify-center items-center"
        style={dialogTextStyle}
      >
        <Show when={props.showCancelButton}>
          <Button onClick={handleClose} style={dialogTextStyle}>
            {props.confirmButtonText || "OK"}
          </Button>
        </Show>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
