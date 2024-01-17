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
        marginTop: "20px",
        paddingRight: "5px",
        paddingTop: "5px",
        paddingLeft: "5px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="number-of-teams-label">Number of Teams</InputLabel>
        <Select
          labelId="number-of-teams-label"
          id="number-of-teams"
          value={selectedTeams()}
          label="Number of Teams"
          onChange={handleChange}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <MenuItem value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
