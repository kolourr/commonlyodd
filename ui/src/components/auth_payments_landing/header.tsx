import { Router } from "solid-app-router";
import AccountMenu from "../settings";
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
