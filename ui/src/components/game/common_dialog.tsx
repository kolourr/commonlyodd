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
    >
      <DialogTitle
        id="common-dialog-title"
        class="flex justify-center items-center"
      >
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="common-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Show when={props.showCancelButton}>
          <Button onClick={handleClose}>
            {props.confirmButtonText || "OK"}
          </Button>
        </Show>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
