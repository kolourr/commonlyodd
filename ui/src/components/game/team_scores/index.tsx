import { createSignal, Show, For, createEffect } from "solid-js";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@suid/material";
import CommonDialog from "../common_dialog";
import { numberOfTeams, targetScore } from "../start_game";

type TeamScoresProps = {
  teamScores: number[];
  sessionStarted: boolean;
};

export default function TeamScores(props: TeamScoresProps) {
  const [dialogOpen, setDialogOpen] = createSignal(false);

  // Update dialogOpen based on sessionStarted
  createEffect(() => {
    setDialogOpen(!props.sessionStarted);
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

      <Show when={props.sessionStarted}>
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
                <For each={props.teamScores}>
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
