import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Button, Typography } from "@suid/material";
import {
  SportsEsportsOutlined,
  RuleOutlined,
  SportsScoreOutlined,
  HeadsetMicOutlined,
  MicOutlined,
  PlayCircleOutlined,
} from "@suid/icons-material";
import InfoModal from "./info_modal";
import { gameRules } from "~/public/data/gamerules";
import StartSession from "./start_session";
import CopyLink from "./start_session/copy_link";
import EndGameSession from "./end_game_session";
import StartGame, {
  objectsImages,
  numberOfTeams,
  targetScore,
} from "./start_game";
import GameImages from "./start_game/images";
import Timer from "./start_game/timer";
import TeamScores from "./team_scores";
import { TeamScore, scoreMessageSent } from "./start_game/types";
import { createStore } from "solid-js/store";
import { Router } from "solid-app-router";
import Voice from "./voice";
import { checkAuth } from "../auth_payments_landing/use_auth";
import {
  checkSubStatus,
  userSubstatus,
} from "../auth_payments_landing/subscription_status";
import AccountMenu from "../settings";
import { isSessionStarted } from "./start_session";
import { JSX } from "solid-js";

const BASE_UI_URL = import.meta.env.CO_UI_URL;
const BASE_API_URL = import.meta.env.CO_API_URL;

export const [sessionLink, setSessionLink] = createSignal(
  `${BASE_UI_URL}/click-to-start`
);
export const [messageSent, setMessageSent] = createSignal<scoreMessageSent>();
export const [gameInfo, setGameInfo] = createSignal<JSX.Element>();

export default function Game() {
  const [showTeamScores, setShowTeamScores] = createSignal(false);
  const [teamScores, setTeamScores] = createStore<number[]>([]);
  const [isTargetScoreReached, setIsTargetScoreReached] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [nonSessionNotStarter, setNonSessionNotStarter] = createSignal(false);

  // Check if the session has started
  const sessionStarted = () =>
    numberOfTeams() !== undefined && targetScore() !== undefined;

  // Initialize or update the teamScores array length based on numberOfTeams
  createEffect(() => {
    const numTeams = numberOfTeams() || 0;
    if (teamScores.length !== numTeams) {
      setTeamScores(Array(numTeams).fill(0));
    }
  });

  const updateTeamScores = (teamScores: TeamScore[]) => {
    setTeamScores(teamScores.map((score) => score.score));
  };

  createEffect(() => {
    const message = messageSent();
    if (message?.game_teams_score) {
      updateTeamScores(message.game_teams_score);
      const target = targetScore();
      if (target !== undefined) {
        const reached = message.game_teams_score.some(
          (score) => score.score >= target
        );
        setIsTargetScoreReached(reached);
      }
    }
  });

  const handleOpenTeamScores = () => {
    setShowTeamScores(!showTeamScores());
    //after button click, reset button state
    if (showTeamScores()) {
      setShowTeamScores(showTeamScores());
    } else {
      setShowTeamScores(!showTeamScores());
    }
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
    checkSubStatus();
  });

  createEffect(() => {
    if (!isSessionStarted() && isAuthenticated() && userSubstatus()) {
      setGameInfo(
        <div class="flex flex-col justify-start">
          <div class="pb-2">
            Click on <span class="font-bold">Create Session</span> to begin.
          </div>
          <div class="pb-2">
            Each game requires you to set the target score and number of teams.
          </div>
          <div>Only the session starter can do so.</div>
        </div>
      );
    }
  });

  createEffect(() => {
    if (isSessionStarted()) {
      setGameInfo(
        <div class="flex flex-col  justify-start">
          <div class="pb-2">
            Share the link above with all players prior to starting the game.
          </div>
          <div>
            Once all players are in the game, click the{" "}
            <PlayCircleOutlined fontSize="small" /> Button to begin.
          </div>
        </div>
      );
    }
  });

  createEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search);
    // const sessionUuid =
    //   urlParams.get("session") || localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");

    if (!isAuthenticated() && !userSubstatus() && !starterToken) {
      setGameInfo(
        <div class="flex flex-col  justify-start">
          <div class="pb-2">
            The game has not yet started. This message here will update when it
            does.
          </div>
          <div>
            Also, you can join the voice channel once the session starter joins
            the channel.
          </div>
        </div>
      );
    }
  });

  createEffect(() => {
    if (isTargetScoreReached()) {
      setGameInfo(
        <div class="flex flex-col items-center justify-center">
          <div class="text-center pb-2">Head's up!</div>
          <div>
            The target score has been reached! The game will continue until a
            clear winner emerges.
          </div>
        </div>
      );
    }
  });

  onMount(() => {
    checkSubStatus();
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid =
      urlParams.get("session") || localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");

    if (!starterToken && !sessionUuid) {
      setNonSessionNotStarter(true);
    }
  });

  return (
    <div class="flex flex-col h-screen md:max-w-5xl lg:max-w-5xl mx-auto">
      <div class="flex flex-grow bg-slate-50">
        <div class="flex flex-row w-1/12 justify-center items-center">
          <Router>
            <AccountMenu />
          </Router>
        </div>
        <div class="flex flex-row w-11/12 justify-center items-center text-2xl font-bold ">
          Commonly Odd
        </div>
      </div>

      <div class="flex flex-grow bg-slate-50">
        <div class="flex flex-row h-8 w-[20%] justify-center items-center ">
          <Show when={isAuthenticated() && userSubstatus()}>
            <StartSession />
          </Show>
          <Show when={!isAuthenticated() && !userSubstatus()}>
            <Button
              variant="outlined"
              disabled={true}
              fullWidth={false}
              style="border: none; width: 35px; height: 30px;padding: 0; font-size: 18px; font-weight: bold;   text-align: center;  "
              color="success"
            >
              {nonSessionNotStarter() ? (
                <span class="text-error-700 italic text-xs bg-error-100">
                  Session InActive
                </span>
              ) : (
                <span class="text-error-700 italic text-xs bg-error-100">
                  Session Active
                </span>
              )}
            </Button>
          </Show>
        </div>
        <div class="flex flex-row h-8 w-[60%] justify-center items-center ">
          <div class="flex flex-row items-center justify-center     ">
            <CopyLink />
            <input
              type="text"
              class="border-2 border-dashed border-slate-100 p-2 rounded w-full h-[30px]"
              readOnly
              value={sessionLink()}
            />
          </div>
        </div>
        <div class="flex flex-row h-8 w-[20%] justify-center items-center ">
          <EndGameSession />
        </div>
      </div>

      <div class="flex flex-grow  bg-slate-50">
        <div class="flex flex-row h-40 w-[20%] justify-center items-center ">
          <Router>
            <StartGame />
          </Router>
        </div>
        <div class="flex flex-row h-40 w-[60%] justify-center items-center ">
          <div
            class="flex flex-col justify-start items-center w-[90%] h-[80%] border-2 border-slate-300 bg-slate-200 p-2 text-xs break-words"
            id="gameInfo"
          >
            {gameInfo()}
          </div>
        </div>

        <div class="flex flex-row h-40 w-[20%] justify-center items-center ">
          <Timer />
        </div>
      </div>

      <div class="flex flex-grow bg-slate-50">
        <Voice />
        <div class="flex flex-row h-32 w-[20%] justify-center items-center ">
          <Button onClick={handleOpenTeamScores}>
            <SportsScoreOutlined fontSize="large" />
          </Button>
        </div>
      </div>

      <div class="flex flex-grow justify-center items-center bg-slate-50 px-10 pb-20">
        <GameImages gameData={objectsImages()} />
      </div>
      <Show when={showTeamScores()}>
        <TeamScores teamScores={teamScores} sessionStarted={sessionStarted()} />
      </Show>
    </div>
  );
}
