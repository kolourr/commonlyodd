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
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
      <Router>
        <ThemeProvider theme={theme}>
          <Game />
          <ConfirmStartDialog />
          <ConfirmStartNewGameDialog />
        </ThemeProvider>
      </Router>
    </div>
  );
};

export default App;
