import { lazy, type Component } from "solid-js";
const Game = lazy(() => import("./components/game"));

const ConfirmStartDialog = lazy(
  () => import("./components/game/start_session/confirm_start")
);

console.info("App.tsx");

const App: Component = () => {
  return (
    <>
      <Game />
      <ConfirmStartDialog />
    </>
  );
};

export default App;
