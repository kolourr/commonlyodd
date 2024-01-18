import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { Show, createSignal } from "solid-js";
import { GameWinner } from "../start_game/types";
import EndSessionMessage from "./end_session";
import NewGame from "./new_game";

export default function NewGameEndSession(props: GameWinner) {
  const [open, setOpen] = createSignal(false);
  const [isSessionStarter, setIsSessionStarter] = createSignal(
    checkIfSessionStarter()
  );

  function checkIfSessionStarter() {
    const sessionUuid = localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");
    return !!sessionUuid && !!starterToken;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: Event, reason?: string) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Open Dialog</Button>
      <Dialog
        open={open()}
        onClose={handleClose}
        disableEscapeKeyDown={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Congrats{" "}
          <span class="font-bold text-success-500">{props.game_winner}</span> on
          winning the game!
        </DialogTitle>
        <Show when={isSessionStarter()}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              To start a new game in the same session with the same number of
              teams and have no repeat questions, click below
            </DialogContentText>
            <NewGame />
          </DialogContent>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you would like to end this session completely, click on the
              button below.
            </DialogContentText>
            <EndSessionMessage />
          </DialogContent>
        </Show>
        <Show when={!isSessionStarter()}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The session starter now has the option of ending the session or
              starting a new game. Please contact the session starter to
              continue.
            </DialogContentText>
            <NewGame />
          </DialogContent>
        </Show>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
