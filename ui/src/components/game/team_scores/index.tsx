import { createSignal, Show, For, createEffect } from "solid-js";
import CommonDialog from "../common_dialog";
import { numberOfTeams, targetScore } from "../start_game";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@suid/material";
import { messageData } from "../start_game/types";
import { createStore } from "solid-js/store";

export const [messageSent, setMessageSent] = createSignal<messageData>();

// Global store for team scores
const [teamScores, setTeamScores] = createStore<number[]>([]);
let lastProcessedMessage: messageData | undefined;

export default function TeamScores() {
  const [dialogOpen, setDialogOpen] = createSignal(false);

  // Initialize or update the teamScores array length based on numberOfTeams
  createEffect(() => {
    const numTeams = numberOfTeams() || 0;
    if (teamScores.length !== numTeams) {
      setTeamScores(Array(numTeams).fill(0));
    }
  });

  const updateTeamScore = () => {
    const currentMessage = messageSent();
    const teamName = currentMessage?.team_name;
    const score = currentMessage?.individual_team_score;

    // Check if the current message is different from the last processed one
    if (
      teamName &&
      score !== undefined &&
      currentMessage !== lastProcessedMessage
    ) {
      const teamIndex = parseInt(teamName.split(" ")[1]) - 1;
      if (!isNaN(teamIndex)) {
        setTeamScores(teamIndex, (prevScore) => prevScore + score);
        lastProcessedMessage = currentMessage; // Update the last processed message
      }
    }
  };

  createEffect(() => {
    if (
      messageSent()?.team_name &&
      messageSent()?.individual_team_score !== undefined
    ) {
      updateTeamScore();
    }
  });

  // Check if the session has started
  const sessionStarted = () =>
    numberOfTeams() !== undefined && targetScore() !== undefined;

  createEffect(() => {
    setDialogOpen(!sessionStarted());
  });

  return (
    <>
      <Show when={dialogOpen()}>
        <CommonDialog
          open={dialogOpen()}
          title="Team Scores"
          content="Team scores and game information will be displayed when a session is underway."
          onClose={() => setDialogOpen(false)}
          showCancelButton={false}
        />
      </Show>

      <Show when={!dialogOpen() && sessionStarted()}>
        <TableContainer component={Paper}>
          <Table
            sx={{ backgroundColor: "#e0f2fe", border: "1px solid #38bdf8" }}
            aria-label="team scores"
          >
            <TableHead>
              <TableRow>
                <TableCell>Teams</TableCell>
                <For each={Array(numberOfTeams())}>
                  {(_, index) => (
                    <TableCell align="center">Team {index() + 1}</TableCell>
                  )}
                </For>
                <TableCell align="center">Target Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Score
                </TableCell>
                <For each={teamScores}>
                  {(score, index) => (
                    <TableCell align="center">{score}</TableCell>
                  )}
                </For>
                <TableCell align="center">{targetScore()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Show>
    </>
  );
}
