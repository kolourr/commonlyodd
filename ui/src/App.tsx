import { Router } from "solid-app-router";
import { Component } from "solid-js";
import Game from "./components/game";
import { ThemeProvider } from "@suid/material/styles";
import theme from "./theme";
// import CookieConsent from "./components/auth_payments_landing/cookie_consent";
import ConfirmStartDialog from "./components/game/start_session/competitive_confirm_start";
import ConfirmStartNewGameDialog from "./components/game/end/confirm_new_game_start";

const App: Component = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Game />
        <ConfirmStartDialog />
        <ConfirmStartNewGameDialog />
        {/* <CookieConsent /> */}
      </Router>
    </ThemeProvider>
  );
};

export default App;
