import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { sendMessage } from ".";
import { messageData } from "./types";

const dialogTextStyle = {
  color: "#f9fafb",
};
interface ConfirmScoreDialogProps {
  open: boolean;
  onClose: () => void;
  onScoreSubmitted: () => void;
  teamId: number | undefined;
  teamName: string | undefined;
  score: number;
}

export default function ConfirmScoreDialog(props: ConfirmScoreDialogProps) {
  const handleConfirm = () => {
    const message: messageData = {
      game_state: "score",
      team_id: props.teamId,
      individual_team_score: props.score,
      team_name: props.teamName,
      time_stamp: Date.now(),
    };
    sendMessage(message);
    props.onScoreSubmitted();
    props.onClose();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
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
          Confirm Score
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText style={dialogTextStyle}>
            Are you sure you want to submit a score of{" "}
            <span class="text-error-700 font-bold  ">{props.score}</span> for{" "}
            <span class="text-error-700 font-bold  ">{props.teamName}</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button onClick={props.onClose} style={dialogTextStyle}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} style={dialogTextStyle}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
