import { Box, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal } from "solid-js";

interface TargetScoreProps {
  setTargetScore: (value: number) => void;
}

export default function TargetScore({ setTargetScore }: TargetScoreProps) {
  const [selectedScore, setSelectedScore] = createSignal("");

  const handleChange = (event: SelectChangeEvent) => {
    const value = parseInt(event.target.value as string);
    setSelectedScore(event.target.value as string);
    setTargetScore(value);
  };

  return (
    <Box
      sx={{
        minWidth: 120,
        marginTop: "20px",
        paddingRight: "5px",
        paddingTop: "5px",
        paddingLeft: "5px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="target-score-label" sx={{ color: "black" }}>
          Target Score
        </InputLabel>
        <Select
          labelId="target-score-label"
          id="target-score"
          value={selectedScore()}
          label="Target Score"
          onChange={handleChange}
          class="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300"
          sx={{ color: "black" }}
        >
          {[10, 20, 30, 40, 50].map((score) => (
            <MenuItem
              class="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300"
              value={score}
              sx={{ color: "black" }}
            >
              {score}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
