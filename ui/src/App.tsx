import { Router } from "solid-app-router";
import { lazy, type Component } from "solid-js";
const Game = lazy(() => import("./components/game"));
import { ThemeProvider } from "@suid/material/styles";
import theme from "./theme";

const ConfirmStartDialog = lazy(
  () => import("./components/game/start_session/confirm_start")
);

const ConfirmStartNewGameDialog = lazy(
  () => import("./components/game/end/confirm_new_game_start")
);

const App: Component = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Game />
        <ConfirmStartDialog />
        <ConfirmStartNewGameDialog />
      </ThemeProvider>
    </Router>
  );
};

export default App;
