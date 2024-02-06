import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Button, Typography } from "@suid/material";
import {
  SportsEsportsOutlined,
  RuleOutlined,
  PrivacyTipOutlined,
  SportsScoreOutlined,
  LockClockOutlined,
} from "@suid/icons-material";
import InfoModal from "./info_modal";
import { gameRules } from "~/public/data/gamerules";
import { legalDocuments } from "~/public/data/legal";
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

const BASE_API = import.meta.env.CO_UI_URL;

export const [sessionLink, setSessionLink] = createSignal(
  `${BASE_API}/click-to-start`
);
export const [messageSent, setMessageSent] = createSignal<scoreMessageSent>();

export default function Game() {
  const [showRulesModal, setShowRulesModal] = createSignal(false);
  const [showFAQModal, setShowFAQModal] = createSignal(false);
  const [showLegalModal, setShowLegalModal] = createSignal(false);
  const [showTeamScores, setShowTeamScores] = createSignal(false);
  const [teamScores, setTeamScores] = createStore<number[]>([]);
  const [isTargetScoreReached, setIsTargetScoreReached] = createSignal(false);

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

  return (
    <div class="flex flex-col h-screen md:max-w-5xl lg:max-w-7xl mx-auto">
      <div class="bg-slate-50 text-center py-4">
        <h1 class="text-3xl font-bold">Commonly Odd</h1>
      </div>

      <div class="flex flex-grow">
        <div class="flex flex-col w-2/12 justify-start bg-slate-50">
          <div class="flex flex-col items-center justify-start space-y-20 ">
            {" "}
            <StartSession />
          </div>
          <div class="flex flex-col space-y-20 items-center justify-center pt-44">
            <InfoModal
              title={gameRules.title}
              content={gameRules.content}
              icon={<SportsEsportsOutlined fontSize="large" />}
              openModal={showFAQModal()}
              setOpenModal={setShowFAQModal}
            />
            <InfoModal
              title={gameRules.title}
              content={gameRules.content}
              icon={<RuleOutlined fontSize="large" />}
              openModal={showRulesModal()}
              setOpenModal={setShowRulesModal}
            />
            <Button
              onClick={handleOpenTeamScores}
              sx={{ bgcolor: "#fecdd3", color: "#db2777" }}
            >
              <SportsScoreOutlined fontSize="large" />
            </Button>
          </div>
        </div>
        <div class="flex w-11/12 flex-col bg-slate-100 ">
          <div class="flex flex-row items-center justify-center bg-slate-50   ">
            <CopyLink />
            <input
              type="text"
              class="border p-2 rounded ml-2 w-full md:w-auto lg:w-5/12"
              readOnly
              value={sessionLink()}
            />
          </div>

          <div class="flex flex-row justify-between p-8   ">
            <div>
              {" "}
              <Router>
                <StartGame />
              </Router>
            </div>
            <div>
              <Voice />
            </div>
          </div>
          <Show when={isTargetScoreReached()}>
            <div class="flex flex-row items-center justify-center  ">
              <div class="text-center p-4">
                <Typography variant="h5" gutterBottom component="div">
                  Head's up!
                </Typography>
                <Typography variant="body1" gutterBottom>
                  The target score has been reached! The game will continue
                  until a clear winner emerges.
                </Typography>
              </div>
            </div>
          </Show>
          <GameImages gameData={objectsImages()} />
          <Show when={showTeamScores()}>
            <TeamScores
              teamScores={teamScores}
              sessionStarted={sessionStarted()}
            />
          </Show>
        </div>
        <div class="flex flex-col w-2/12 justify-start bg-slate-50">
          <Timer />
          <div class="flex flex-col space-y-20 items-center justify-center pt-40">
            <EndGameSession />
            <InfoModal
              title={legalDocuments.title}
              content={legalDocuments.content}
              icon={<PrivacyTipOutlined fontSize="large" />}
              openModal={showLegalModal()}
              setOpenModal={setShowLegalModal}
            />
            <InfoModal
              title={legalDocuments.title}
              content={legalDocuments.content}
              icon={<LockClockOutlined fontSize="large" />}
              openModal={showLegalModal()}
              setOpenModal={setShowLegalModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
