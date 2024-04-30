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
import { setMessageSent, setSessionLink, setGameInfo } from "../index";
import { useNavigate } from "solid-app-router";
import { PlayCircleOutlined } from "@suid/icons-material";
import { setCanJoinVoiceCall } from "../voice";
import { startNewTurn } from "./images";
import { setScoreColor } from "..";

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
export const [isSessionStarter, setIsSessionStarter] = createSignal(false);
export const [isSessionEndedEndpoint, setIsSessionEndedEndpoint] =
  createSignal(false);
export const [gameWinner, setGameWinner] = createSignal(false);

const [isSessionActive, setIsSessionActive] = createSignal(false);
const [isGameInProgress, setIsGameInProgress] = createSignal(false);
let gameWebSocket: WebSocket | null = null;
const BASE_API = import.meta.env.CO_API_URL;
const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();
const [dialogTitle, setDialogTitle] = createSignal<string | JSX.Element>();
const [enterScore, setEnterScore] = createSignal(false);
const [readyToContinue, setReadyToContinue] = createSignal(false);
const [teamGameWinner, setTeamGameWinner] = createSignal<string | undefined>();
const [gameComplete, setGameComplete] = createSignal(false);
const [newGameStarted, setNewGameStarted] = createSignal(false);
const [complete, setComplete] = createSignal(false);

export const sendMessage = (message: messageData) => {
  checkSessionStatus();
  if (isSessionActive() && isSessionStarter() && gameWebSocket) {
    // setIsGameInProgress(true);
    gameWebSocket.send(JSON.stringify(message));
    if (message.game_state === "reveal") {
      setIsGameInProgress(false);
    }
  }
};

const checkSessionStatus = () => {
  const sessionUuid = localStorage.getItem("session_uuid");
  const starterToken = localStorage.getItem("starter_token");
  setIsSessionActive(!!sessionUuid && !!starterToken);
  setIsSessionStarter(!!starterToken);

  if (sessionUuid && starterToken && !gameWebSocket) {
    initializeWebSocket(sessionUuid, starterToken);
  }
};

function initializeWebSocket(sessionUuid: string, starterToken?: string) {
  if (starterToken) {
    gameWebSocket = createReconnectingWS(
      BASE_API.replace("http", "ws") +
        `/ws?sessionUUID=${sessionUuid}&starterToken=${starterToken}`
    );
    gameWebSocket.addEventListener("message", handleWebSocketMessage);
  } else {
    gameWebSocket = createReconnectingWS(
      BASE_API.replace("http", "ws") + `/ws?sessionUUID=${sessionUuid}`
    );
    gameWebSocket.addEventListener("message", handleWebSocketMessage);
  }
}

// function initializeWebSocket(sessionUuid: string, starterToken?: string) {
//   // Define how often to send heartbeat messages (e.g., every 30 seconds)
//   const heartbeatInterval = 5000;
//   let heartbeatTimer: NodeJS.Timeout;

//   const startHeartbeat = () => {
//     heartbeatTimer = setInterval(() => {
//       if (gameWebSocket && gameWebSocket.readyState === WebSocket.OPEN) {
//         gameWebSocket.send(JSON.stringify({ type: "ping" }));
//       }
//     }, heartbeatInterval);
//   };

//   const stopHeartbeat = () => {
//     clearInterval(heartbeatTimer);
//   };

//   if (starterToken) {
//     gameWebSocket = createReconnectingWS(
//       BASE_API.replace("http", "ws") +
//         `/ws?sessionUUID=${sessionUuid}&starterToken=${starterToken}`
//     );
//   } else {
//     gameWebSocket = createReconnectingWS(
//       BASE_API.replace("http", "ws") + `/ws?sessionUUID=${sessionUuid}`
//     );
//   }

//   // Start sending heartbeat messages upon connection
//   gameWebSocket.addEventListener("open", () => {
//     console.log("WebSocket connection established");
//     startHeartbeat();
//   });

//   // Stop sending heartbeat messages when the connection is closed
//   gameWebSocket.addEventListener("close", () => {
//     console.log("WebSocket connection closed");
//     stopHeartbeat();
//   });

//   gameWebSocket.addEventListener("message", (event) => {
//     handleWebSocketMessage(event);
//   });

//   // Add cleanup to stop heartbeat on component unmount
//   onCleanup(() => {
//     if (gameWebSocket) {
//       gameWebSocket.close();
//       stopHeartbeat();
//     }
//   });

//   return gameWebSocket;
// }

function handleWebSocketMessage(event: MessageEvent) {
  const msg: WebSocketMessage = JSON.parse(event.data);
  switch (msg.game_state) {
    case "session-starter-update":
      console.info(msg);
      setCanJoinVoiceCall(msg.starter_in_call);
      break;
    case "start-in-progress":
      //update Team Score
      setMessageSent(msg);
      setIsGameInProgress(true);
      setObjectsImages(msg);
      setCanJoinVoiceCall(msg.starter_in_call);
      setTeamID(msg.team_id);
      setTeamName(msg.team_name);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {teamName()}, what's odd and what's the commonality?
          </div>
        </div>
      );
      break;
    case "timer_update":
      setGameTime(msg);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setCanJoinVoiceCall(msg.starter_in_call);
      break;
    case "time_up":
      console.info(msg);
      //update Team Score
      setMessageSent(msg);
      setGameTime(msg);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setTimerUp(true);
      setCanJoinVoiceCall(msg.starter_in_call);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {teamName()}, what's odd and what's the commonality among the other
            three?
          </div>
        </div>
      );
      break;

    case "reveal-answer":
      //update Team Score
      setMessageSent(msg);
      setOddReasonForSimilarity(msg);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setCanJoinVoiceCall(msg.starter_in_call);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {oddReasonForSimilarity()?.odd_reason_for_similarity?.reason}
          </div>
        </div>
      );
      break;
    case "continue":
      console.info(msg);
      //update Team Score
      setScoreColor(msg.individual_team_score_received);
      setMessageSent(msg);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setEnterScore(false);
      setTimerUp(false);
      setIsGameInProgress(true);
      setTeamID(msg.team_id);
      setCanJoinVoiceCall(msg.starter_in_call);
      setTeamName(msg.team_name);
      setReadyToContinue(true);
      setScoreSubmittedDialogOpen(false);
      setNewGameStarted(false);
      startNewTurn();

      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            Session starter, continue to {teamName()}
            's round.
          </div>
        </div>
      );

      break;
    case "continue-answer":
      console.info(msg);
      //update Team Score
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setMessageSent(msg);
      setScoreColor(-1);
      // Update game state with new objects and images
      setGameWinner(false);
      setObjectsImages(msg);
      setIsGameInProgress(true);
      setReadyToContinue(false);
      setScoreSubmittedDialogOpen(false);
      setNewGameStarted(false);
      setCanJoinVoiceCall(msg.starter_in_call);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {teamName()}, what's odd and what's the commonality?
          </div>
        </div>
      );
      startNewTurn();
      break;
    case "end-game":
      console.info(msg);
      //update Team Score
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setMessageSent(msg);
      setEnterScore(false);
      setTimerUp(false);
      setScoreSubmittedDialogOpen(false);
      setNewGameStarted(false);
      setIsGameInProgress(false);
      setReadyToContinue(false);
      setGameWinner(true);
      setTeamGameWinner(msg.game_winner);
      setCanJoinVoiceCall(msg.starter_in_call);
      startNewTurn();
      break;
    case "new-game-started":
      console.info(msg);
      //update Team Score
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setMessageSent(msg);
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
      setCanJoinVoiceCall(msg.starter_in_call);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {teamName()}, what's odd and what's the commonality?
          </div>
        </div>
      );
      startNewTurn();
      break;
    case "complete":
      console.info(msg);
      //update Team Score
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setMessageSent(msg);
      setComplete(true);
      setScoreColor(2);
      setIsGameInProgress(false);
      setGameComplete(true);
      setCanJoinVoiceCall(msg.starter_in_call);
      break;
  }
}

export default function StartGame() {
  const navigate = useNavigate();

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
      return "In Progress";
    } else if (gameWinner()) {
      return "End Session or Start New Game?";
    } else {
      return "Start Game";
    }
  }

  createEffect(() => {
    const interval = setInterval(checkSessionStatus, 1000);
    onCleanup(() => clearInterval(interval));
  });

  //End game for non-starter user if session is ended by starter
  createEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid = urlParams.get("session");

    if (complete() && sessionUuid) {
      // Navigate to the base URL
      navigate("/game");

      // Refresh the page after a short delay to ensure navigation is complete
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  });

  //Start game for non-starter
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid =
      urlParams.get("session") || localStorage.getItem("session_uuid");

    setIsSessionActive(!!sessionUuid);

    if (sessionUuid) {
      initializeWebSocket(sessionUuid);
      setSessionLink(window.location.href);
    }
  });

  // //Start game for non-starter
  // onMount(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const sessionUuid =
  //     urlParams.get("session") || localStorage.getItem("session_uuid");
  //   const starterToken = localStorage.getItem("starter_token");

  //   setIsSessionActive(!!sessionUuid);
  //   setIsSessionStarter(!!starterToken);

  //   if (sessionUuid && !gameWebSocket) {
  //     initializeWebSocket(sessionUuid);
  //     setSessionLink(window.location.href);
  //   }
  //   checkSessionStatus();
  // });

  // onCleanup(() => {
  //   gameWebSocket?.close();
  // });

  return (
    <div>
      <div class="flex flex-col justify-center items-center   ">
        <div>
          <Button
            variant="outlined"
            onClick={handleButtonClick}
            disabled={isButtonDisabled()}
            style="border: none;  "
          >
            <PlayCircleOutlined fontSize="large" />
          </Button>
        </div>
        <div class="text-center font-bold text-xs lg:text-sm text-gray-300  ">
          {getButtonLabel()}
        </div>
      </div>

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
