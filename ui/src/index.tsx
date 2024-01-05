/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route, Routes } from "@solidjs/router";
import { lazy } from "solid-js";

const Contact = lazy(() => import("./components/contact"));
const Home = lazy(() => import("./components/home"));
const Rules = lazy(() => import("./components/faq"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={App} />
        <Route path="/contact" component={Contact} />
        <Route path="/home" component={Home} />
        <Route path="/rules" component={Rules} />
      </Routes>
    </Router>
  ),
  root!
);
