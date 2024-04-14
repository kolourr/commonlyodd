import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";

const FAQ: Component = () => {
  return (
    <>
      <div class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
        <div class="flex flex-col  max-w-5xl mx-auto min-h-screen bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900">
          <Header />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
