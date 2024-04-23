import { JSX, Show, createSignal } from "solid-js";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@suid/material";
import CommonDialog from "../game/common_dialog";
import ConfirmDeleteAccount from "./confirm_delete_account";

const BASE_API = import.meta.env.CO_API_URL;

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function DeleteAccount() {
  const [open, setOpen] = createSignal(false);

  //Logout
  const handleOpenDeleteAccount = () => {
    setOpen(true);
  };
  const handleCloseDeleteAccount = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        sx={{
          color: "#f9fafb",
          width: 150,
          height: 50,
        }}
        class="flex justify-center items-center bg-gradient-to-bl from-warning-800 to-error-800"
        onClick={handleOpenDeleteAccount}
      >
        Delete Account
      </Button>
      <Dialog
        open={open()}
        onClose={handleCloseDeleteAccount}
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
        >
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText
            style={dialogTextStyle}
            class="flex justify-center items-center"
          >
            Are you 100% sure you want to delete your account? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <div class="flex justify-center items-center">
          <ConfirmDeleteAccount />
        </div>
        <DialogActions style={dialogTextStyle}>
          <Button onClick={handleCloseDeleteAccount} style={dialogTextStyle}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
