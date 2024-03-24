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
        color: "#f9fafb",
      }}
    >
      <FormControl
        fullWidth
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#f9fafb" },
        }}
      >
        <InputLabel id="target-score-label" sx={{ color: "#f9fafb" }}>
          Target Score
        </InputLabel>
        <Select
          labelId="target-score-label"
          id="target-score"
          value={selectedScore()}
          label="Target Score"
          onChange={handleChange}
          class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900"
          sx={{ color: "#f9fafb" }}
        >
          {[10, 20, 30, 40, 50].map((score) => (
            <MenuItem
              class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900"
              value={score}
              sx={{ color: "#f9fafb" }}
            >
              {score}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
