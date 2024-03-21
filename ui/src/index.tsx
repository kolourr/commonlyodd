/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route, Routes } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");
const User = lazy(() => import("./components/auth_payments_landing/user"));
const LandingPage = lazy(
  () => import("./components/auth_payments_landing/landing")
);
const Success = lazy(
  () => import("./components/auth_payments_landing/success")
);
const Failure = lazy(
  () => import("./components/auth_payments_landing/failure")
);

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <div class="bg-gradient-to-bl from-purple-200 via-blue-100 to-cyan-100 min-h-screen">
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
    </div>
  ),
  root!
);
