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

const TermsOfUse = lazy(
  () => import("./components/auth_payments_landing/terms_of_use")
);

const PrivacyPolicy = lazy(
  () => import("./components/auth_payments_landing/privacy_policy")
);

const ContactUs = lazy(
  () => import("./components/auth_payments_landing/contact_us")
);

const Faq = lazy(() => import("./components/auth_payments_landing/faq"));

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <>
      <Router>
        <Routes>
          <Route path="/user" component={User} />
          <Route path="/" component={LandingPage} />
          <Route path="/game" component={App} />
          <Route path="/game/join" component={App} />
          <Route path="/success" component={Success} />
          <Route path="/cancel" component={Failure} />
          <Route path="/terms-of-use" component={TermsOfUse} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/contact-us" component={ContactUs} />
          <Route path="/faq" component={Faq} />
        </Routes>
      </Router>
    </>
  ),
  root!
);
