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
import {
  WebSocketMessage,
  Objects_Images,
  Timer,
  Odd_Reason_for_Similarity,
  messageData,
} from "../start_game/types";
import { setMessageSent, setGameInfo } from "../index";
import { useNavigate } from "solid-app-router";
import { startNewTurn } from "./images";
import { PlayButtonSVG } from "../index";
import { PlayButtonSVGDEMO } from ".";

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
export const [gameType, setGameType] = createSignal("");
export const [isRevealInitiated, setIsRevealInitiated] = createSignal(false);
export const [isSessionActive, setIsSessionActive] = createSignal(false);

const [isGameInProgress, setIsGameInProgress] = createSignal(false);
let gameWebSocket: WebSocket | null = null;
const BASE_API = import.meta.env.CO_API_URL;
const BASE_UI = import.meta.env.CO_UI_URL;
const [readyToContinue, setReadyToContinue] = createSignal(false);
const [readyToContinueSolo, setReadyToContinueSolo] = createSignal(false);
const [isButtonProcessing, setIsButtonProcessing] = createSignal(false);

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
  const sessionUuid = localStorage.getItem("session_uuid_demo");
  const starterToken = localStorage.getItem("starter_token_demo");
  const gametype = localStorage.getItem("type_demo");
  setGameType(gametype);

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

function handleWebSocketMessage(event: MessageEvent) {
  const msg: WebSocketMessage = JSON.parse(event.data);
  switch (msg.game_state) {
    case "start-in-progress-solo":
      //update Team Score
      setIsRevealInitiated(false);
      setMessageSent(msg);
      setIsGameInProgress(true);
      setObjectsImages(msg);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            What's the odd one out and what's the commonality among the other
            three?
          </div>
        </div>
      );
      break;
    case "timer_update_solo":
      if (!isRevealInitiated()) {
        setGameTime(msg);
      }
      break;
    case "time_up_solo":
      //update Team Score
      if (!isRevealInitiated()) {
        setMessageSent(msg);
        setGameTime(msg);
        setTimerUp(true);
        setGameInfo(
          <div class="flex flex-col justify-center items-center">
            <div class="md:text-base lg:text-xl">
              What's the odd one out and what's the commonality among the other
              three?
            </div>
          </div>
        );
      }
      break;
    case "reveal-answer-solo":
      //update Team Score
      setGameTime(null);
      setIsRevealInitiated(true);
      setMessageSent(msg);
      setOddReasonForSimilarity(msg);
      setTimerUp(false);
      setReadyToContinueSolo(true);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {oddReasonForSimilarity()?.odd_reason_for_similarity?.reason}
          </div>
        </div>
      );
      break;

    case "continue":
      //update Team Score
      setIsRevealInitiated(false);
      setMessageSent(msg);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setTimerUp(false);
      setIsGameInProgress(true);
      setTeamID(msg.team_id);
      setTeamName(msg.team_name);
      setReadyToContinue(true);
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
    case "continue-answer-solo":
      setIsRevealInitiated(false);
      setGameTime(null);
      setMessageSent(msg);
      // Update game state with new objects and images
      setObjectsImages(msg);
      setIsGameInProgress(true);
      setReadyToContinue(false);
      setReadyToContinueSolo(false);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            What's the odd one out and what's the commonality among the other
            three?
          </div>
        </div>
      );
      startNewTurn();
      break;
    case "end-game":
      //update Team Score
      setIsRevealInitiated(false);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setMessageSent(msg);
      setTimerUp(false);
      setIsGameInProgress(false);
      setReadyToContinue(false);
      startNewTurn();
      break;
  }
}

export default function StartGameDemo() {
  const navigate = useNavigate();

  async function handleButtonClick() {
    if (isButtonProcessing()) return;

    setIsButtonProcessing(true);

    // Delay to ensure the processing state is properly set
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      if (timerUp() && !isRevealInitiated()) {
        sendMessage({ game_state: "reveal-solo" });
        setIsRevealInitiated(true);
      } else if (readyToContinue()) {
        sendMessage({ game_state: "continue-solo" });
      } else if (readyToContinueSolo()) {
        sendMessage({ game_state: "continue-solo" });
      } else {
        sendMessage({ game_state: "start-solo" });
      }
    } finally {
      setIsButtonProcessing(false);
    }
  }

  function isButtonDisabled() {
    // The button should be disabled if:
    // 1. The session is not active or the user is not the session starter.
    // 2. The game is in progress, but it's neither time to reveal the answer, enter the score, nor continue to the next round.

    const fun =
      !isSessionActive() ||
      !isSessionStarter() ||
      (isGameInProgress() &&
        !timerUp() &&
        !readyToContinue() &&
        !readyToContinueSolo());

    return fun;
  }

  function getButtonLabel() {
    if (timerUp()) {
      return "Reveal";
    } else if (readyToContinue()) {
      return "Next Round";
    } else if (readyToContinueSolo()) {
      return "Next Round";
    } else if (isGameInProgress()) {
      return "In Progress";
    } else {
      return "Start Demo";
    }
  }

  createEffect(() => {
    const interval = setInterval(checkSessionStatus, 1000);
    onCleanup(() => clearInterval(interval));
  });

  //Start game for non-starter
  onMount(() => {
    const sessionUuid = localStorage.getItem("session_uuid_demo");
    const starterToken = localStorage.getItem("starter_token_demo");
    const gametype = localStorage.getItem("type_demo");
    setGameType(gametype);

    setIsSessionActive(!!sessionUuid);
    setIsSessionStarter(!!starterToken);

    if (sessionUuid && starterToken && !gameWebSocket) {
      initializeWebSocket(sessionUuid, starterToken);
    }
    checkSessionStatus();
  });

  onCleanup(() => {
    gameWebSocket?.close();
  });

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
            <PlayButtonSVGDEMO />
          </Button>
        </div>
        <div class="text-center font-bold text-base lg:text-lg text-gray-300  ">
          {getButtonLabel()}
        </div>
      </div>
    </div>
  );
}
