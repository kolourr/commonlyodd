import { CancelOutlined } from "@suid/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import {
  createEffect,
  createSignal,
  JSXElement,
  onCleanup,
  Show,
} from "solid-js";
import EndSession from "./end_session";
import EndGame from "./end_game";
import { Router } from "solid-app-router";

const Transition = function Transition(
  props: TransitionProps & {
    children: JSXElement;
  }
) {
  return <Slide direction="down" {...props} />;
};

const [open, setOpen] = createSignal(false);
const [gameSessionStatus, setGameSessionStatus] = createSignal(
  checkGameSessionStatus()
);

export const handleClickOpenEndGameSession = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const dialogTextStyle = {
  color: "#f9fafb",
};

function checkGameSessionStatus() {
  const sessionUuid = localStorage.getItem("session_uuid");
  const starterToken = localStorage.getItem("starter_token");
  const urlParams = new URLSearchParams(window.location.search);
  const sessionInUrl = urlParams.has("session");

  if (sessionUuid && starterToken) {
    return "endSessionAndGame";
  } else if (sessionUuid || sessionInUrl) {
    return "endGameOnly";
  } else {
    return "noSessionOrGameToEnd";
  }
}

export default function EndGameSession() {
  // Periodically check the game session status
  function updateGameSessionStatus() {
    const interval = setInterval(() => {
      setGameSessionStatus(checkGameSessionStatus());
    }, 1000);

    onCleanup(() => clearInterval(interval));
  }

  updateGameSessionStatus();

  return (
    <div>
      <Dialog
        open={open()}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <Show when={gameSessionStatus() === "endSessionAndGame"}>
          <div>
            <div class="flex flex-col justify-center items-center ">
              <div>
                <DialogContent style={dialogTextStyle}>
                  <DialogTitle
                    class="flex justify-center items-center"
                    style={dialogTextStyle}
                  >
                    {"End Session"}
                  </DialogTitle>
                  <DialogContentText
                    id="alert-dialog-slide-description"
                    style={dialogTextStyle}
                  >
                    Before you end the game session, notify all players that the
                    game will be ending soon.
                  </DialogContentText>
                </DialogContent>
              </div>
              <div>
                <Router>
                  <EndSession />
                </Router>
              </div>
            </div>
            <DialogActions style={dialogTextStyle}>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </div>
        </Show>

        <Show when={gameSessionStatus() === "endGameOnly"}>
          <div>
            <div class="flex flex-col justify-center items-center ">
              <div>
                <DialogContent style={dialogTextStyle}>
                  <DialogTitle
                    class="flex justify-center items-center"
                    style={dialogTextStyle}
                  >
                    {"End Game"}
                  </DialogTitle>
                  <DialogContentText
                    id="alert-dialog-slide-description"
                    style={dialogTextStyle}
                  >
                    If you would like to leave this current game, click the
                    button below.
                  </DialogContentText>
                </DialogContent>
              </div>
              <div>
                <Router>
                  <EndGame />
                </Router>
              </div>
            </div>
            <DialogActions style={dialogTextStyle}>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </div>
        </Show>

        <Show when={gameSessionStatus() === "noSessionOrGameToEnd"}>
          <div>
            <div class="flex flex-col justify-center items-center ">
              <div>
                <DialogContent style={dialogTextStyle}>
                  <DialogTitle
                    class="flex justify-center items-center"
                    style={dialogTextStyle}
                  >
                    {"Nothing to see for now"}
                  </DialogTitle>
                  <div class="flex flex-col justify-center items-center ">
                    <div>
                      <DialogContentText
                        id="alert-dialog-slide-description"
                        class="mt-2"
                        style={dialogTextStyle}
                      >
                        The game is not active. Start a new game by clicking
                        play.
                      </DialogContentText>
                    </div>
                  </div>
                </DialogContent>
              </div>
            </div>
            <DialogActions style={dialogTextStyle}>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </div>
        </Show>
      </Dialog>
    </div>
  );
}
