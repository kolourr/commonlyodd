import { Router } from "solid-app-router";
import { Component } from "solid-js";
import AccountMenuMobile from "../settings/account_menu_mobile.jsx";

const HeaderMobile: Component = () => {
  return (
    <>
      <Router>
        <AccountMenuMobile />
      </Router>
    </>
  );
};

export default HeaderMobile;
