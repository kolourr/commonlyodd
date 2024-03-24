import { createTheme } from "@suid/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f9fafb",
    },
    secondary: {
      main: "#d1d5db",
    },
    action: {
      disabled: "#3f3f46",
    },
    background: {
      default: "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
    },
  },
});
export default theme;
