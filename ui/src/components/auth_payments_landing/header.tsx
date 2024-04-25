import { Router } from "solid-app-router";
import AccountMenu from "../settings";
import { Component } from "solid-js";

const Header: Component = () => {
  const handleUserPage = () => {
    window.location.href = "/user";
  };

  return (
    <div class="flex pb-4">
      <div class="flex flex-row w-1/12 justify-center items-center">
        <Router>
          <AccountMenu />
        </Router>
      </div>
      <div class="flex flex-row w-11/12 justify-center items-center text-3xl font-bold text-gray-300 ">
        <div class="flex flex-row items-center justify-center">
          <span class="pr-2" onClick={handleUserPage}>
            Commonly
          </span>
        </div>
        <span
          class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-3xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em]"
          onClick={handleUserPage}
        >
          Odd
        </span>
      </div>
    </div>
  );
};

export default Header;
