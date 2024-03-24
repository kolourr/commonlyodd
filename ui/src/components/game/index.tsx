import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Button } from "@suid/material";
import {
  SportsScoreOutlined,
  PlayCircleOutlined,
  EditOutlined,
  LinkOutlined,
} from "@suid/icons-material";
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
import { gameTime } from "./start_game";

const BASE_UI_URL = import.meta.env.CO_UI_URL;

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
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
    checkSubStatus();
  });

  createEffect(() => {
    if (!isSessionStarted() && isAuthenticated() && userSubstatus()) {
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div class="text-base">
            <EditOutlined fontSize="medium" /> to create session prior to
            starting the game.
          </div>
        </div>
      );
    }
  });

  createEffect(() => {
    if (isSessionStarted()) {
      setGameInfo(
        <div class="flex flex-col  justify-center items-center">
          <div class="text-base">
            Share the game link prior to starting the game.
          </div>
        </div>
      );
    }
  });

  createEffect(() => {
    const starterToken = localStorage.getItem("starter_token");

    if (!isAuthenticated() && !userSubstatus() && !starterToken) {
      setGameInfo(
        <div class="flex flex-col justify-center items-center">
          <div>Once the game starts, this message will disappear.</div>
        </div>
      );
    }
  });

  createEffect(() => {
    if (isTargetScoreReached()) {
      setGameInfo(
        <div class="flex flex-col  justify-center items-center">
          <div class="text-base">
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
    <div
      class="flex flex-col    max-w-5xl  mx-auto min-h-screen    bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900
"
    >
      <div class="flex">
        <div class="flex flex-row w-1/12 justify-center items-center">
          <Router>
            <AccountMenu />
          </Router>
        </div>
        <div class="flex flex-row w-11/12 justify-center items-center text-3xl mr-12 font-bold text-gray-50 ">
          Commonly Odd
        </div>
      </div>

      <div class="flex  ">
        <div class="flex flex-row   w-[20%] justify-center items-center   ">
          <Show when={isAuthenticated() && userSubstatus()}>
            <StartSession />
          </Show>
          <Show when={!isAuthenticated() && !userSubstatus()}>
            <div class="flex flex-col">
              <Button
                disabled={true}
                fullWidth={false}
                style="font-weight: bold; text-align: center;"
                color="success"
              >
                <EditOutlined fontSize="large" />
              </Button>
              <div class="text-center font-bold  ">
                {nonSessionNotStarter() ? (
                  <span class="italic text-center font-bold text-xs lg:text-sm text-gray-50 ">
                    Session Inactive
                  </span>
                ) : (
                  <span class="italic text-center font-bold text-xs lg:text-sm text-gray-50 ">
                    Session Active
                  </span>
                )}
              </div>
            </div>
          </Show>
        </div>
        <div class="flex flex-row   w-[60%] justify-center items-center mr-8 ">
          <div class="flex flex-row justify-start items-start">
            <CopyLink />
            <div class="fle flex-col  ">
              <input
                type="text"
                class="  p-2 rounded w-full  shadow-md shadow-gray-50 "
                readOnly
                value={sessionLink()}
              />
              <Show when={isSessionStarted()}>
                <div class="flex items-center justify-center font-bold text-xs text-gray-50 p-2">
                  Game Session Link
                </div>
              </Show>
            </div>
          </div>
        </div>
        <div class="flex flex-row   w-[20%] justify-center items-center   ">
          <Router>
            <StartGame />
          </Router>
        </div>
      </div>

      <div class="flex flex-col ">
        <div
          class="flex mt-4 w-[100%] justify-center items-center    shadow-gray-50 text-gray-50 h-28    p-4 break-words "
          id="gameInfo"
        >
          {gameInfo()}
        </div>
      </div>

      <div class="flex   justify-center items-center    ">
        <GameImages gameData={objectsImages()} />
      </div>
      <div class="flex   py-4     ">
        <Voice />
        <div class="flex flex-col   w-[16%] justify-center items-center text-gray-50    ">
          <Button onClick={handleOpenTeamScores}>
            <SportsScoreOutlined fontSize="large" />
          </Button>
          <span class="text-xs lg:text-sm text-center font-bold ">Score</span>
        </div>
      </div>
      <div class="flex   flex-col justify-center items-center text-gray-50 ">
        <Show when={showTeamScores()}>
          <TeamScores
            teamScores={teamScores}
            sessionStarted={sessionStarted()}
          />
        </Show>
      </div>

      <EndGameSession />
      <Timer />
    </div>
  );
}
