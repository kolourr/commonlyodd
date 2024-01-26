import {
  JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Button } from "@suid/material";
import { createReconnectingWS } from "@solid-primitives/websocket";
import CommonDialog from "../common_dialog";
import {
  WebSocketMessage,
  Objects_Images,
  Timer,
  Odd_Reason_for_Similarity,
  messageData,
} from "./types";
import Score, { openScoreDialog } from "./score";
import NewGameEndSession, { handleClickOpenNewGameEndSession } from "../end";
import Complete, { handleCompleteOpen } from "./complete";
import { setScoreSubmittedDialogOpen } from "./score";

export const [objectsImages, setObjectsImages] =
  createSignal<Objects_Images | null>(null);
export const [gameTime, setGameTime] = createSignal<Timer | null>(null);
export const [oddReasonForSimilarity, setOddReasonForSimilarity] =
  createSignal<Odd_Reason_for_Similarity | null>(null);
export const [teamName, setTeamName] = createSignal<string | undefined>(
  undefined
);
export const [timerUp, setTimerUp] = createSignal(false);
export const [teamID, setTeamID] = createSignal<number | undefined>(undefined);
export const [numberOfTeams, setNumberOfTeams] = createSignal<
  number | undefined
>(undefined);
export const [targetScore, setTargetScore] = createSignal<number | undefined>(
  undefined
);

const [isSessionActive, setIsSessionActive] = createSignal(false);
export const [isSessionStarter, setIsSessionStarter] = createSignal(false);
const [isGameInProgress, setIsGameInProgress] = createSignal(false);
let gameWebSocket: WebSocket | null = null;
const BASE_API = import.meta.env.CO_API_URL;
const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();
const [dialogTitle, setDialogTitle] = createSignal<string | JSX.Element>();
const [enterScore, setEnterScore] = createSignal(false);
const [readyToContinue, setReadyToContinue] = createSignal(false);
const [gameWinner, setGameWinner] = createSignal(false);
const [teamGameWinner, setTeamGameWinner] = createSignal<string | undefined>();
const [gameComplete, setGameComplete] = createSignal(false);
const [newGameStarted, setNewGameStarted] = createSignal(false);
const [complete, setComplete] = createSignal(false);

export const sendMessage = (message: messageData) => {
  if (isSessionActive() && isSessionStarter() && gameWebSocket) {
    setIsGameInProgress(true);
    gameWebSocket.send(JSON.stringify(message));
    if (message.game_state === "reveal") {
      setIsGameInProgress(false);
    }
  }
};

export default function StartGame() {
  const checkSessionStatus = () => {
    const sessionUuid = localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");
    setIsSessionActive(!!sessionUuid && !!starterToken);
    setIsSessionStarter(!!starterToken);

    if (sessionUuid && starterToken && !gameWebSocket) {
      initializeWebSocket(sessionUuid, starterToken);
    }
  };

  function handleWebSocketMessage(event: MessageEvent) {
    const msg: WebSocketMessage = JSON.parse(event.data);
    switch (msg.game_state) {
      case "start-in-progress":
        setIsGameInProgress(true);
        setObjectsImages(msg);
        setTeamID(msg.team_id);
        setTeamName(msg.team_name);
        setNumberOfTeams(msg.number_of_teams);
        setTargetScore(msg.target_score);
        break;
      case "timer_update":
        setGameTime(msg);
        break;
      case "time_up":
        setGameTime(msg);
        setTimerUp(true);
        setDialogTitle("Time's Up!!");
        setDialogContent(
          <>
            <div class="flex flex-col p-6 justify-start">
              <div>
                Which one of is{" "}
                <span class="text-error-500 font-bold">odd</span>?
              </div>
              <div>
                What do the other two have in{" "}
                <span class="text-error-500 font-bold">common</span>?
              </div>
            </div>
          </>
        );
        setDialogOpen(true);
        break;
      case "reveal-answer":
        setOddReasonForSimilarity(msg);
        setDialogTitle("Answer Revealed!!");
        setDialogContent(
          <>
            <div class="flex flex-col p-6 justify-start">
              <div>
                The odd one is{" "}
                <span class="text-error-500 font-bold">
                  {oddReasonForSimilarity()?.odd_reason_for_similarity?.odd}
                </span>
              </div>
              <div>
                Reson for commonality:{" "}
                <span class="text-error-500 font-bold">
                  {" "}
                  {oddReasonForSimilarity()?.odd_reason_for_similarity?.reason}
                </span>
              </div>
            </div>
          </>
        );
        setDialogOpen(true);
        break;
      case "continue":
        console.info(msg);
        // Prepare for the next round
        setEnterScore(false);
        setTimerUp(false);
        setIsGameInProgress(true);
        setTeamID(msg.team_id);
        setTeamName(msg.team_name);
        setReadyToContinue(true);
        setScoreSubmittedDialogOpen(false);
        setNewGameStarted(false);
        break;
      case "continue-answer":
        // Update game state with new objects and images
        setGameWinner(false);
        setObjectsImages(msg);
        setIsGameInProgress(true);
        setReadyToContinue(false);
        setScoreSubmittedDialogOpen(false);
        setNewGameStarted(false);
        break;
      case "end-game":
        setEnterScore(false);
        setTimerUp(false);
        setScoreSubmittedDialogOpen(false);
        setNewGameStarted(false);
        setIsGameInProgress(false);
        setReadyToContinue(false);
        setGameWinner(true);
        setTeamGameWinner(msg.game_winner);
        console.info(teamGameWinner());
        break;
      case "new-game-started":
        setNewGameStarted(true);
        setIsGameInProgress(true);
        setGameWinner(false);
        setReadyToContinue(false);
        setScoreSubmittedDialogOpen(false);
        setObjectsImages(msg);
        setTeamID(msg.team_id);
        console.info(msg.team_id);
        setTeamName(msg.team_name);
        setNumberOfTeams(msg.number_of_teams);
        setTargetScore(msg.target_score);
        break;
      case "complete":
        console.info("complete");
        setComplete(true);
        setIsGameInProgress(false);
        setGameComplete(true);
        break;
    }
  }

  function initializeWebSocket(sessionUuid: string, starterToken: string) {
    gameWebSocket = createReconnectingWS(
      BASE_API.replace("http", "ws") +
        `/ws?sessionUUID=${sessionUuid}&starterToken=${starterToken}`
    );
    gameWebSocket.addEventListener("message", handleWebSocketMessage);
  }

  function handleButtonClick() {
    if (enterScore()) {
      openScoreDialog();
    } else if (gameWinner()) {
      handleClickOpenNewGameEndSession();
    } else if (timerUp()) {
      sendMessage({ game_state: "reveal" });
      setEnterScore(true);
    } else if (readyToContinue()) {
      sendMessage({ game_state: "continue" });
    } else if (complete()) {
      handleCompleteOpen();
    } else {
      sendMessage({ game_state: "start" });
    }
  }

  function isButtonDisabled() {
    // The button should be disabled if:
    // 1. The session is not active or the user is not the session starter.
    // 2. The game is in progress, but it's neither time to reveal the answer, enter the score, nor continue to the next round.
    return (
      !isSessionActive() ||
      !isSessionStarter() ||
      (isGameInProgress() &&
        !timerUp() &&
        !enterScore() &&
        !readyToContinue() &&
        !newGameStarted() &&
        !gameWinner() &&
        !gameComplete())
    );
  }

  function getButtonLabel() {
    if (enterScore()) {
      return "Enter Score";
    } else if (timerUp()) {
      return "Reveal";
    } else if (readyToContinue()) {
      return "Continue";
    } else if (isGameInProgress()) {
      return "Game in Progress";
    } else if (gameWinner()) {
      return "End Session or Start New Game";
    } else {
      return "Start Game";
    }
  }

  createEffect(() => {
    const interval = setInterval(checkSessionStatus, 1000);
    onCleanup(() => clearInterval(interval));
  });

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid =
      urlParams.get("session") || localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");

    setIsSessionActive(!!sessionUuid);
    setIsSessionStarter(!!starterToken);

    if (sessionUuid && !gameWebSocket) {
      initializeWebSocket(sessionUuid, starterToken || "");
    }

    checkSessionStatus();
  });

  onCleanup(() => {
    gameWebSocket?.close();
  });

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleButtonClick}
        disabled={isButtonDisabled()}
      >
        {getButtonLabel()}
      </Button>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title={dialogTitle()}
          content={dialogContent()}
          onClose={() => setDialogOpen(false)}
          showCancelButton={true}
        />
      </Show>
      <Show when={enterScore()}>
        <Score />
      </Show>
      <Show when={gameWinner()}>
        <NewGameEndSession game_winner={teamGameWinner()} />
      </Show>
      <Show when={gameComplete()}>
        <Complete />
      </Show>
    </div>
  );
}
