import {
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Button } from "@suid/material";
import {
  CancelOutlined,
  CheckCircleOutline,
  LinkOutlined,
  RuleSharp,
  SportsScoreOutlined,
} from "@suid/icons-material";
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
import { isSessionStarted } from "./start_session";
import { JSX } from "solid-js";
import "./styles.css";
import { gameWinner } from "./start_game";
import confetti from "canvas-confetti";
import Footer from "../auth_payments_landing/footer";
import Header from "../auth_payments_landing/header";
import HeaderMobile from "../auth_payments_landing/header_mobile";
import CreateSession from "./start_session";
import CommonDialog from "./common_dialog";
import CopyLinkInactive from "./start_session/copy_link_inactive";

const BASE_UI_URL = import.meta.env.CO_UI_URL;

export const PlayButtonSVG = () => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon points="10 8, 16 12, 10 16" fill="currentColor" />
    </svg>
  </>
);

export const [sessionLink, setSessionLink] = createSignal(
  `${BASE_UI_URL}/click-to-start`
);
export const [messageSent, setMessageSent] = createSignal<scoreMessageSent>();
export const [gameInfo, setGameInfo] = createSignal<JSX.Element>();
export const [scoreColor, setScoreColor] = createSignal<number>(-1);

export default function Game() {
  const [showTeamScores, setShowTeamScores] = createSignal(false);
  const [teamScores, setTeamScores] = createStore<number[]>([]);
  const [isTargetScoreReached, setIsTargetScoreReached] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [nonSessionNotStarter, setNonSessionNotStarter] = createSignal(false);
  const [openRules, setOpenRules] = createSignal(false);

  // Check if the session has started
  const sessionStarted = () => isSessionStarted();

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

  const toggleTeamScores = () => {
    setShowTeamScores(showTeamScores() ? false : true);
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
          <div class="md:text-base lg:text-xl">
            Once you are ready, click the play button to get started.
          </div>
        </div>
      );
    }
  });

  createEffect(() => {
    if (isSessionStarted()) {
      setGameInfo(
        <div class="flex flex-col  justify-center items-center">
          <div class="md:text-base lg:text-xl">
            Play solo or invite others to the game by clicking <LinkOutlined />{" "}
            to copy the session link.
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
          <div class="md:text-base lg:text-xl">
            Once the game starts, this message will disappear.
          </div>
        </div>
      );
    }
  });

  createEffect(() => {
    if (isTargetScoreReached() && !gameWinner()) {
      setGameInfo(
        <div class="flex flex-col  justify-center items-center">
          <div class="md:text-base lg:text-xl">
            The target score has been reached! The game will continue until a
            clear winner emerges.
          </div>
        </div>
      );
    }
  });

  // Trigger confetti when the game winner is determined
  createEffect(() => {
    if (gameWinner()) {
      const confettiDuration = 10 * 1000;
      const end = Date.now() + confettiDuration;

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
        } else {
          confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2,
            },
          });
        }
      }, 100);

      onCleanup(() => clearInterval(interval));
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

  const handleOpenRules = () => {
    setOpenRules(true);
  };

  const handleGameRulesPage = () => {
    window.location.href = "/rules";
  };

  const rulesContent = () => (
    <div class="flex flex-col items-center text-center justify-center   ">
      <div class="md:text-base lg:text-xl">
        <div class="w-full mb-4 text-base md:text-lg flex justify-center items-center">
          <video controls class="w-[90%]  h-auto shadow-lg mx-4 ">
            <source
              src="https://media.commonlyodd.com/how_it_works_update_21.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="flex flex-col justify-center items-center text-center  ">
          <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-md  ">
              <caption class="p-5 text-xl font-semibold text-center  ">
                Competitive Game Scoring
              </caption>
              <thead class="text-base   uppercase mx-4 ">
                <tr>
                  <th scope="col" class="py-3 px-6">
                    Points
                  </th>
                  <th scope="col" class="py-3 px-6">
                    Odd
                  </th>
                  <th scope="col" class="py-3 px-6">
                    Reason for Commonality
                  </th>
                </tr>
              </thead>
              <tbody class="text-center text-base">
                <tr class=" ">
                  <td class="py-2 px-6 text-xl">2</td>
                  <td class="py-2 px-6">
                    <CheckCircleOutline
                      fontSize="large"
                      sx={{ color: "#4ade80" }}
                    />
                  </td>
                  <td class="py-2 px-6">
                    <CheckCircleOutline
                      fontSize="large"
                      sx={{ color: "#4ade80" }}
                    />
                  </td>
                </tr>
                <tr class=" ">
                  <td class="py-2 px-6 text-xl">1.5</td>
                  <td class="py-2 px-6">
                    <CheckCircleOutline
                      fontSize="large"
                      sx={{ color: "#4ade80" }}
                    />
                  </td>
                  <td class="py-2 px-6">
                    <CheckCircleOutline
                      fontSize="large"
                      sx={{ color: "#fde047" }}
                    />
                  </td>
                </tr>
                <tr class=" ">
                  <td class="py-2 px-6 text-xl">1</td>
                  <td class="py-2 px-6">
                    <CheckCircleOutline
                      fontSize="large"
                      sx={{ color: "#4ade80" }}
                    />
                  </td>
                  <td class="py-2 px-6">
                    <CancelOutlined
                      fontSize="large"
                      sx={{ color: "#f87171" }}
                    />
                  </td>
                </tr>
                <tr class=" ">
                  <td class="py-2 px-6 text-xl">0</td>
                  <td class="py-2 px-6">
                    <CancelOutlined
                      fontSize="large"
                      sx={{ color: "#f87171" }}
                    />
                  </td>
                  <td class="py-2 px-6">
                    <CancelOutlined
                      fontSize="large"
                      sx={{ color: "#f87171" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex flex-col items-center justify-center mt-4">
              <div class="text-base">
                <CheckCircleOutline
                  fontSize="large"
                  sx={{ color: "#fde047" }}
                />
                = Partially Correct
              </div>
              <div class="mt-4 text-sm mx-4">
                For a full breakdown of the rules, please read the{" "}
                <a
                  onClick={handleGameRulesPage}
                  class="text-blue-400 cursor-pointer"
                >
                  game rules
                </a>{" "}
                page.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const controlPanel = () => (
    <div class="flex   justify-around   items-center text-gray-300 text-center  w-[50%]  ">
      <div class="flex text-center   ">
        <Show when={isSessionStarted()}>
          <div>
            <CopyLink />
            <div>
              <input
                type="text"
                class=" rounded w-full  shadow-sm shadow-gray-50 "
                readOnly
                value={sessionLink()}
                hidden
              />
            </div>
            <div class="flex  flex-row items-center justify-center font-bold text-xs lg:text-sm text-gray-300  ">
              <div> Active</div>
            </div>
          </div>
        </Show>
        <Show when={!isSessionStarted()}>
          <div>
            <CopyLinkInactive />
            <div>
              <input
                type="text"
                class=" rounded w-full  shadow-sm shadow-gray-50 "
                readOnly
                value={sessionLink()}
                hidden
              />
            </div>
            <div class="flex  flex-col items-center justify-center font-bold text-xs lg:text-sm text-gray-300  ">
              <div>Inactive</div>
            </div>
          </div>
        </Show>
      </div>
      <div class="flex flex-col     ">
        <div>
          <Button onClick={handleOpenRules}>
            <RuleSharp fontSize="large" />
          </Button>
        </div>
        <span class="text-xs lg:text-sm text-center font-bold ">Rules</span>
      </div>
      <div class="flex flex-col  ">
        <div>
          <Button onClick={() => setShowTeamScores(!showTeamScores())}>
            <SportsScoreOutlined fontSize="large" />
          </Button>
        </div>
        <span class="text-xs lg:text-sm text-center font-bold ">Score</span>
      </div>
    </div>
  );

  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
        <div class="hidden md:block">
          {" "}
          <Header />
        </div>
        <div class="block md:hidden">
          <HeaderMobile />
        </div>

        <div class="flex   justify-center items-center    ">
          <GameImages gameData={objectsImages()} />
        </div>

        <div class="flex justify-center items-center">
          <div class="flex flex-row h-36   justify-center items-center py-6 my-4 ">
            <Show when={!isSessionStarted()}>
              <Show when={isAuthenticated() && userSubstatus()}>
                <CreateSession />
              </Show>
              <Show
                when={
                  (!isAuthenticated() && !userSubstatus()) ||
                  (isAuthenticated() && !userSubstatus())
                }
              >
                <div class="flex flex-col">
                  <Button
                    disabled={true}
                    fullWidth={false}
                    style="font-weight: bold; text-align: center;"
                    color="success"
                  >
                    <PlayButtonSVG />
                  </Button>
                  <div class="text-center font-bold  ">
                    {nonSessionNotStarter() ? (
                      <span class="italic text-center font-bold text-xs lg:text-sm text-gray-300 ">
                        Inactive
                      </span>
                    ) : (
                      <span class="italic text-center font-bold text-xs lg:text-sm text-gray-300 ">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </Show>
            </Show>
          </div>

          <div
            class={`${
              isSessionStarted() ? "" : "hidden"
            } flex flex-row h-24 justify-center items-center`}
          >
            <Router>
              <StartGame />
            </Router>
          </div>
        </div>

        <div class="flex mb-16 flex-col">
          <Voice controlPanel={controlPanel()} />
        </div>
        <div class="flex   flex-col justify-center items-center text-gray-300 ">
          <Show when={showTeamScores()}>
            <TeamScores
              teamScores={teamScores}
              sessionStarted={sessionStarted()}
              onClose={() => setShowTeamScores(false)}
            />
          </Show>
        </div>
        <div class="flex text-center  flex-col justify-center items-center text-gray-300 ">
          <Show when={openRules()}>
            <CommonDialog
              open={true}
              onClose={() => setOpenRules(false)}
              title={`Game Rules`}
              content={rulesContent()}
              showCancelButton={false}
            />
          </Show>
        </div>

        <EndGameSession />
        <Timer />
      </div>
      <Footer />
    </div>
  );
}
