import { Box, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal } from "solid-js";

interface CategoryProps {
  setCategory: (value: string) => void;
}

export default function Category({ setCategory }: CategoryProps) {
  const [selectedCategory, setSelectedCategory] = createSignal("");

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSelectedCategory(value);
    setCategory(value);
  };

  return (
    <Box
      sx={{
        minWidth: 120,
        marginBottom: "20px",
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
          id="category-label"
          sx={{
            color: "#f9fafb",
          }}
        >
          Category
        </InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={selectedCategory()}
          label="Choose Category"
          onChange={handleChange}
          class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900"
          sx={{
            color: "#f9fafb",
          }}
        >
          {[
            "Random",
            "Bible",
            "Baseball",
            "Hockey",
            "Basketball",
            "Football",
            "80s",
            "Harry Potter",
          ].map((category) => (
            <MenuItem
              class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900"
              value={category}
              sx={{
                color: "#f9fafb",
                "& .MuiMenuItem-root": {
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                },
              }}
            >
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
