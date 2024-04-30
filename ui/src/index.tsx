/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Router, Routes, Route } from "@solidjs/router";
import App from "./App";

import User from "./components/auth_payments_landing/user";
import LandingPage from "./components/auth_payments_landing/landing";
import Success from "./components/auth_payments_landing/success";
import Failure from "./components/auth_payments_landing/failure";
import TermsOfUse from "./components/auth_payments_landing/terms_of_use";
import PrivacyPolicy from "./components/auth_payments_landing/privacy_policy";
import ContactUs from "./components/auth_payments_landing/contact_us";
import CookiePolicy from "./components/auth_payments_landing/cookie_policy";
import Faq from "./components/auth_payments_landing/faq";
import Rules from "./components/auth_payments_landing/rules";

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
        <Route path="/user" element={<User />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<App />} />
        <Route path="/game/join" element={<App />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Failure />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Router>
  ),
  root!
);
