import { Box, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal } from "solid-js";

interface NumberOfTeamsProps {
  setTeams: (value: number) => void;
}

export default function NumberOfTeams({ setTeams }: NumberOfTeamsProps) {
  const [selectedTeams, setSelectedTeams] = createSignal("");

  const handleChange = (event: SelectChangeEvent) => {
    const value = parseInt(event.target.value as string);
    setSelectedTeams(event.target.value as string);
    setTeams(value);
  };

  return (
    <Box
      sx={{
        minWidth: 120,
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
          id="number-of-teams-label"
          sx={{
            color: "#f9fafb",
          }}
        >
          Number of Teams
        </InputLabel>
        <Select
          labelId="number-of-teams-label"
          id="number-of-teams"
          value={selectedTeams()}
          label="Number of Teams"
          onChange={handleChange}
          class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900"
          sx={{
            color: "#f9fafb",
          }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <MenuItem
              class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900"
              value={i + 1}
              sx={{
                color: "#f9fafb",
                "& .MuiMenuItem-root": {
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                },
              }}
            >
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
