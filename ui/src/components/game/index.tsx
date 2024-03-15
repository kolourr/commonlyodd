import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Button, Typography } from "@suid/material";
import {
  SportsEsportsOutlined,
  RuleOutlined,
  SportsScoreOutlined,
  HeadsetMicOutlined,
  MicOutlined,
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

const BASE_UI_URL = import.meta.env.CO_UI_URL;
const BASE_API_URL = import.meta.env.CO_API_URL;

export const [sessionLink, setSessionLink] = createSignal(
  `${BASE_UI_URL}/click-to-start`
);
export const [messageSent, setMessageSent] = createSignal<scoreMessageSent>();

export default function Game() {
  const [showRulesModal, setShowRulesModal] = createSignal(false);
  const [showTeamScores, setShowTeamScores] = createSignal(false);
  const [teamScores, setTeamScores] = createStore<number[]>([]);
  const [isTargetScoreReached, setIsTargetScoreReached] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);

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

  onMount(() => {
    checkSubStatus();
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
          5
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
      <Show when={isTargetScoreReached()}>
        <div class="flex flex-row items-center justify-center  ">
          <div class="text-center p-4">
            <Typography variant="h5" gutterBottom component="div">
              Head's up!
            </Typography>
            <Typography variant="body1" gutterBottom>
              The target score has been reached! The game will continue until a
              clear winner emerges.
            </Typography>
          </div>
        </div>
      </Show>
      <Show when={showTeamScores()}>
        <TeamScores teamScores={teamScores} sessionStarted={sessionStarted()} />
      </Show>
    </div>
  );
}
