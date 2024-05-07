import { Box, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal } from "solid-js";

interface CountdownProps {
  setCountdown: (value: number) => void;
}

export default function Countdown({ setCountdown }: CountdownProps) {
  const [selectedCountdown, setSelectedCountDown] = createSignal("");

  const handleChange = (event: SelectChangeEvent) => {
    const value = parseInt(event.target.value as string);
    setSelectedCountDown(event.target.value as string);
    setCountdown(value);
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
        <InputLabel
          id="countdown-label"
          sx={{
            color: "#f9fafb",
          }}
        >
          Time in seconds per round
        </InputLabel>
        <Select
          labelId="target-score-label"
          id="target-score"
          value={selectedCountdown()}
          label="Target Score"
          onChange={handleChange}
          class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900"
          sx={{
            color: "#f9fafb",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((score) => (
            <MenuItem
              class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900"
              value={score}
              sx={{
                color: "#f9fafb",
                "& .MuiMenuItem-root": {
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                },
              }}
            >
              {score}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
