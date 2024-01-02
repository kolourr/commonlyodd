import { lazy, type Component } from "solid-js";
// import { A } from "@solidjs/router";
const Game = lazy(() => import("./components/game"));

const App: Component = () => {
  return (
    <>
      <Game />
    </>
  );
};

export default App;
