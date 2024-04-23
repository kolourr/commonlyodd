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

const BASE_API = import.meta.env.CO_API_URL;

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function ConfirmDeleteAccount() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);

  //Logout
  const handleOpenDeleteAccount = () => {
    setOpen(true);
  };
  const handleCloseDeleteAccount = () => {
    setOpen(false);
  };

  async function handleDeleteAccount() {
    const deleteUrl = `${BASE_API}/delete-account`;
    setLoading(true);

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        // Redirect to logout route on successful account deletion
        window.location.href = `${BASE_API}/logout`;
      } else {
        const data = await response.json();
        console.error("Failed to delete account:", data.message);
        alert("Failed to delete account: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    } finally {
      setLoading(false);
    }
  }
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
          class="flex justify-center items-center underline decoration-double "
          style={dialogTextStyle}
        >
          Confirm Account Deletion!!
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText
            style={dialogTextStyle}
            class="flex justify-center items-center"
          >
            Yes, I confirm that I want to delete my account. I understand that
            this action is irreversible and all my data will be lost.
          </DialogContentText>
          <div class="flex flex-row justify-center py-4">
            {loading() && <CircularProgress color="success" />}{" "}
          </div>
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button onClick={handleCloseDeleteAccount} style={dialogTextStyle}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={loading()}
            sx={{ color: "#f4f4f5" }}
          >
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Account Deletion Status"
          content={"Your account has been deleted."}
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
    </>
  );
}
