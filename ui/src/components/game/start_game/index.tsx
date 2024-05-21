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
import { setCanJoinVoiceCall } from "../voice";
import { startNewTurn } from "./images";
import { setScoreColor } from "..";
import { PlayButtonSVG } from "../index";
import { create } from "domain";

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
export const [gameType, setGameType] = createSignal("");
export const [isRevealInitiated, setIsRevealInitiated] = createSignal(false);
export const [isSessionActive, setIsSessionActive] = createSignal(false);

const [isGameInProgress, setIsGameInProgress] = createSignal(false);
let gameWebSocket: WebSocket | null = null;
const BASE_API = import.meta.env.CO_API_URL;
const BASE_UI = import.meta.env.CO_UI_URL;
const [dialogOpen, setDialogOpen] = createSignal(false);
const [dialogContent, setDialogContent] = createSignal<string | JSX.Element>();
const [dialogTitle, setDialogTitle] = createSignal<string | JSX.Element>();
const [enterScore, setEnterScore] = createSignal(false);
const [readyToContinue, setReadyToContinue] = createSignal(false);
const [readyToContinueSolo, setReadyToContinueSolo] = createSignal(false);
const [teamGameWinner, setTeamGameWinner] = createSignal<string | undefined>();
const [gameComplete, setGameComplete] = createSignal(false);
const [newGameStarted, setNewGameStarted] = createSignal(false);
const [complete, setComplete] = createSignal(false);
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
  const sessionUuid = localStorage.getItem("session_uuid");
  const starterToken = localStorage.getItem("starter_token");
  const gametype = localStorage.getItem("type");
  setGameType(gametype || "");

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
    case "session-starter-update":
      setCanJoinVoiceCall(msg.starter_in_call);
      break;
    case "start-in-progress":
      //update Team Score
      setIsRevealInitiated(false);
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
            {teamName()}, what's the odd one out and what's the commonality
            among the other three?
          </div>
        </div>
      );
      break;
    case "start-in-progress-solo":
      //update Team Score
      setIsRevealInitiated(false);
      setMessageSent(msg);
      setIsGameInProgress(true);
      setObjectsImages(msg);
      setCanJoinVoiceCall(msg.starter_in_call);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            What's the odd one out and what's the commonality among the other
            three?
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
    case "timer_update_solo":
      if (!isRevealInitiated()) {
        setGameTime(msg);
        setCanJoinVoiceCall(msg.starter_in_call);
      }
      break;
    case "time_up":
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
            {teamName()}, what's the odd one out and what's the commonality
            among the other three?
          </div>
        </div>
      );

      break;
    case "time_up_solo":
      //update Team Score
      if (!isRevealInitiated()) {
        setMessageSent(msg);
        setGameTime(msg);
        setTimerUp(true);
        setCanJoinVoiceCall(msg.starter_in_call);
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

    case "reveal-answer":
      //update Team Score
      setIsRevealInitiated(true);
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
    case "reveal-answer-solo":
      //update Team Score
      setGameTime(null);
      setIsRevealInitiated(true);
      setMessageSent(msg);
      setOddReasonForSimilarity(msg);
      setCanJoinVoiceCall(msg.starter_in_call);
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
      //update Team Score
      setIsRevealInitiated(false);
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
            {teamName()}, what's the odd one out and what's the commonality
            among the other three?
          </div>
        </div>
      );
      startNewTurn();
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
      setCanJoinVoiceCall(msg.starter_in_call);
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
      //update Team Score
      setIsRevealInitiated(false);
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
      setTeamName(msg.team_name);
      setNumberOfTeams(msg.number_of_teams);
      setTargetScore(msg.target_score);
      setCanJoinVoiceCall(msg.starter_in_call);
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="md:text-base lg:text-xl">
            {teamName()}, what's the odd one out and what's the commonality
            among the other three?
          </div>
        </div>
      );
      startNewTurn();
      break;
    case "complete":
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

  async function handleButtonClick() {
    if (isButtonProcessing()) return;

    setIsButtonProcessing(true);

    // Delay to ensure the processing state is properly set
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      if (gameType() === "competitive") {
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
      } else if (gameType() === "fun") {
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
      }
    } finally {
      setIsButtonProcessing(false);
    }
  }

  function isButtonDisabled() {
    // The button should be disabled if:
    // 1. The session is not active or the user is not the session starter.
    // 2. The game is in progress, but it's neither time to reveal the answer, enter the score, nor continue to the next round.

    const competitive =
      !isSessionActive() ||
      !isSessionStarter() ||
      (isGameInProgress() &&
        !timerUp() &&
        !enterScore() &&
        !readyToContinue() &&
        !newGameStarted() &&
        !gameWinner() &&
        !gameComplete());

    const fun =
      !isSessionActive() ||
      !isSessionStarter() ||
      (isGameInProgress() &&
        !timerUp() &&
        !readyToContinue() &&
        !readyToContinueSolo());

    return (
      isButtonProcessing() || (gameType() === "competitive" ? competitive : fun)
    );
  }

  function getButtonLabel() {
    if (gameType() === "competitive") {
      if (enterScore()) {
        return "Enter Score";
      } else if (timerUp()) {
        return "Reveal";
      } else if (readyToContinue()) {
        return "Next Round";
      } else if (isGameInProgress()) {
        return "In Progress";
      } else if (gameWinner()) {
        return "End Session or Start New Game?";
      } else {
        return "Start Game";
      }
    } else if (gameType() === "fun") {
      if (timerUp()) {
        return "Reveal";
      } else if (readyToContinue()) {
        return "Next Round";
      } else if (readyToContinueSolo()) {
        return "Next Round";
      } else if (isGameInProgress()) {
        return "In Progress";
      } else {
        return "Start Game";
      }
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
    const starterToken = localStorage.getItem("starter_token");
    const gametype = localStorage.getItem("type");
    setGameType(gametype || "");

    setIsSessionActive(!!sessionUuid);
    setIsSessionStarter(!!starterToken);

    const URL = `${BASE_UI}/game/join?session=${sessionUuid}`;

    if (sessionUuid && starterToken && !gameWebSocket) {
      initializeWebSocket(sessionUuid, starterToken);
      setSessionLink(URL);
    } else if (sessionUuid && !gameWebSocket) {
      initializeWebSocket(sessionUuid);
      setSessionLink(window.location.href);
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
            <PlayButtonSVG />
          </Button>
        </div>
        <div class="text-center font-bold text-base lg:text-lg text-gray-300  ">
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
