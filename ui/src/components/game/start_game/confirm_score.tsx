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
import { setMessageSent } from "../index";

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
      timestamp: Date.now(),
    };
    sendMessage(message);
    setMessageSent(message);
    console.info("Sent message: ", message);
    props.onScoreSubmitted();
    props.onClose();
  };

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Confirm Score</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit a score of {props.score} for{" "}
            {props.teamName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
