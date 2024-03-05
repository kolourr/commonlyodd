/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route, Routes } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");
const User = lazy(() => import("./components/auth/user"));
const LandingPage = lazy(() => import("./components/auth/landing"));
const Success = lazy(() => import("./components/stripe/success"));
const Failure = lazy(() => import("./components/stripe/failure"));

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/user" component={User} />
        <Route path="/" component={LandingPage} />
        <Route path="/game" component={App} />
        <Route path="/game/join" component={App} />
        <Route path="/success" component={Success} />
        <Route path="/cancel" component={Failure} />
      </Routes>
    </Router>
  ),
  root!
);
