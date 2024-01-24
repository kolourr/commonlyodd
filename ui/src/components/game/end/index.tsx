import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@suid/material";
import { Show, createEffect, createSignal } from "solid-js";
import { GameWinner } from "../start_game/types";
import EndSessionMessage from "./end_session";
import NewGame from "./new_game";
import { Router } from "solid-app-router";
import { isSessionStarter } from "../start_game";

const [open, setOpen] = createSignal(false);

const handleClose = () => {
  setOpen(false);
};

export const handleClickOpenNewGameEndSession = () => {
  setOpen(true);
};

export default function NewGameEndSession(props: GameWinner) {
  // Automatically open the dialog when gameWinner is true
  createEffect(() => {
    if (props.game_winner) {
      setOpen(true);
    }
  });
  return (
    <div>
      <Dialog open={open()} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Congrats{" "}
          <span class="font-bold text-success-500">{props.game_winner}</span> on
          winning the game!
        </DialogTitle>
        <Show when={isSessionStarter()}>
          <div class="fles flex-row">
            <div>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  To start a new game in the same session with the same number
                  of teams and have no repeat questions, click below
                </DialogContentText>
                <div class="flex justify-center">
                  <Router>
                    <NewGame />
                  </Router>
                </div>
              </DialogContent>
            </div>
            <div>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  If you would like to end this session completely, click on the
                  button below.
                </DialogContentText>
                <div class="flex justify-center">
                  <Router>
                    <EndSessionMessage />
                  </Router>
                </div>
              </DialogContent>
            </div>
          </div>
        </Show>
        <Show when={!isSessionStarter()}>
          <div class="fles flex-row">
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The session starter now has the option of ending the session or
                starting a new game. Please contact the session starter to
                continue.
              </DialogContentText>
            </DialogContent>
          </div>
        </Show>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
