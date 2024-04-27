import { Router } from "solid-app-router";
import AccountMenu from "../settings/index.jsx";
import { Component } from "solid-js";

const Header: Component = () => {
  return (
    <>
      <Router>
        <AccountMenu />
      </Router>
    </>
  );
};

export default Header;
