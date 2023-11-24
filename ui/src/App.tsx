import type { Component } from "solid-js";
import Contact from "./components/contact";
import { Button } from "@suid/material";
import Home from "./components/home";
// import { A } from "@solidjs/router";

const App: Component = () => {
  return (
    <>
      <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
      <div class="flex justify-center">
        <div>
          <Home />
        </div>
        <div>
          <Contact />
        </div>
        <div>
          <Button variant="contained">Press Me</Button>
        </div>
      </div>
    </>
  );
};

export default App;
