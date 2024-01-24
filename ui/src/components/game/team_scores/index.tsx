import {
  numberOfTeams,
  setNumberOfTeams,
  targetScore,
  setTargetScore,
  teamName,
  teamID,
} from "../start_game";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@suid/material";
import { mapArray } from "solid-js";

//team name and team id come from the continue message
//target score and number of teams come from the start message and new game started message

function createData(
  name: string,
  Team_1: string,
  Team_2: string,
  Team_3: string,
  Team_4: string,
  Total_Score: string
) {
  return { name, Team_1, Team_2, Team_3, Team_4, Total_Score };
}

const rows = [createData("Score", "10", "3", "4", "5", "60")];

export default function TeamScores() {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          // minWidth: 650,
          backgroundColor: "#e0f2fe",
          border: "1px solid #38bdf8",
        }}
        aria-label="team scores"
      >
        <TableHead>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: "1px solid #9ca3af",
              },
            }}
          >
            <TableCell>Teams</TableCell>
            <TableCell align="right">Team 1</TableCell>
            <TableCell align="right">Team 2</TableCell>
            <TableCell align="right">Team 3</TableCell>
            <TableCell align="right">Team 4</TableCell>
            <TableCell align="right">Total Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mapArray(
            () => rows,
            (row) => (
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: "1px solid #9ca3af",
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.Team_1}</TableCell>
                <TableCell align="right">{row.Team_2}</TableCell>
                <TableCell align="right">{row.Team_3}</TableCell>
                <TableCell align="right">{row.Team_4}</TableCell>
                <TableCell align="right">{row.Total_Score}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
