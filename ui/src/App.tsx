import { Router } from "solid-app-router";
import { lazy, type Component } from "solid-js";
const Game = lazy(() => import("./components/game"));

const ConfirmStartDialog = lazy(
  () => import("./components/game/start_session/confirm_start")
);

const ConfirmStartNewGameDialog = lazy(
  () => import("./components/game/end/confirm_new_game_start")
);

const App: Component = () => {
  return (
    <>
      <Game />
      <ConfirmStartDialog />
      <ConfirmStartNewGameDialog />
    </>
  );
};

export default App;
