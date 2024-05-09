import { createSignal, Show, For, createEffect, onMount } from "solid-js";
import CommonDialog from "../common_dialog";
import { numberOfTeams, targetScore } from "../start_game";
import "./styles.css";

type TeamScoresProps = {
  teamScores: number[];
  sessionStarted: boolean;
};

export default function TeamScores(props: TeamScoresProps) {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [gameType, setGameType] = createSignal("");

  createEffect(() => {
    setDialogOpen(!props.sessionStarted);
  });

  onMount(() => {
    const gametype = localStorage.getItem("type");
    setGameType(gametype || "");
  });

  createEffect(() => {
    const gametype = localStorage.getItem("type");
    setGameType(gametype || "");
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

  return (
    <>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Team Scores"
          content="Team scores is only available for competitive games when a session is underway."
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>
      <Show when={props.sessionStarted && gameType() == "competitive"}>
        <CommonDialog
          open={true}
          onClose={() => setDialogOpen(false)}
          title={`Target Score: ${targetScore()}`}
          content={scoresContent}
          showCancelButton={false}
        />
      </Show>
    </>
  );
}
