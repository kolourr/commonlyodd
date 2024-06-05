import { createSignal, Show, For, createEffect, onMount } from "solid-js";
import CommonDialog from "../common_dialog";
import { numberOfTeams, targetScore } from "../start_game";
import "./styles.css";

type TeamScoresProps = {
  teamScores?: number[];
  sessionStarted: boolean;
  onClose: () => void;
};

export default function TeamScores(props: TeamScoresProps) {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [gameType, setGameType] = createSignal("");
  const [userScore, setUserScore] = createSignal(0);
  const [totalScore, setTotalScore] = createSignal(0);

  const scoreCalculation = () => {
    const total_score = parseInt(localStorage.getItem("total_score") || "0");
    const user_score = parseInt(localStorage.getItem("user_score") || "0");
    setUserScore(user_score);
    setTotalScore(total_score);
  };

  const handleClose = () => {
    setDialogOpen(false);
    props.onClose();
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  onMount(() => {
    const gametype = localStorage.getItem("type");
    setGameType(gametype || "");
  });

  createEffect(() => {
    const gametype = localStorage.getItem("type");
    setGameType(gametype || "");
  });

  createEffect(() => {
    scoreCalculation();
  });

  const scoresWithIndices = props.teamScores.map((score, index) => ({
    score,
    index,
  }));
  scoresWithIndices.sort((a, b) => b.score - a.score);

  // Assuming no ties, this would give medals based on ranking
  const [goldIndex, silverIndex, bronzeIndex] = scoresWithIndices
    .slice(0, 3)
    .map((item) => item.index);

  const teamColors = [
    "bg-error-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-warning-500",
    "bg-success-500",
    "bg-info-500",
    "bg-indigo-500",
    "bg-purple-500",
  ];
  // Content for the CommonDialog
  const scoresContent = (
    <div class="flex flex-col items-center justify-center">
      <div
        class="scores-container overflow-auto"
        style={{
          "grid-template-columns": `repeat(${Math.min(
            numberOfTeams(),
            5
          )}, 1fr)`,
        }}
      >
        <For each={Array(numberOfTeams())}>
          {(team, index) => (
            <div class="team-container  ">
              <div
                class={`team-number ${teamColors[index() % teamColors.length]}`}
              >
                {index() === goldIndex && <span class="medal">🥇</span>}
                {index() === silverIndex && <span class="medal">🥈</span>}
                {index() === bronzeIndex && <span class="medal">🥉</span>}
                {index() + 1}
              </div>
              <div class="team-score">{props.teamScores[index()]}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );

  const scoresContentDialog = () => {
    return (
      <div class="flex justify-center text-center items-center">
        <div>Scores are only available for when a game is underway.</div>
      </div>
    );
  };

  const funScoresContent = () => {
    return (
      <div class="flex justify-center text-center items-center">
        <div class="flex flex-col">
          <div class="mb-4">
            You have successfully identified {userScore()} odd items out of{" "}
            {totalScore()} rounds played.
          </div>
          <div>
            We hope you're also noting the commonalities among the other items.
          </div>{" "}
        </div>
      </div>
    );
  };

  return (
    <>
      <Show when={handleOpen}>
        <CommonDialog
          open={true}
          title="Scores"
          content={scoresContentDialog()}
          onClose={handleClose}
          showCancelButton={false}
        />
      </Show>
      <Show when={props.sessionStarted && gameType() == "competitive"}>
        <CommonDialog
          open={true}
          onClose={handleClose}
          title={`Target Score: ${targetScore()}`}
          content={scoresContent}
          showCancelButton={false}
        />
      </Show>

      <Show
        when={
          (props.sessionStarted && gameType() == "fun") ||
          (props.sessionStarted && gameType() == "quick")
        }
      >
        <CommonDialog
          open={true}
          onClose={handleClose}
          title={`Your Score`}
          content={funScoresContent()}
          showCancelButton={false}
        />
      </Show>
    </>
  );
}
