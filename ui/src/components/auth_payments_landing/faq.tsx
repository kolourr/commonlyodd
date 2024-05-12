import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import FAQitems from "./faq_items";
import HeaderMobile from "./header_mobile";

const FAQ: Component = () => {
  return (
    <>
      <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
        <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
          <div class="hidden md:block">
            <Header />
          </div>
          <div class="block md:hidden">
            <HeaderMobile />
          </div>
          <FAQitems />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default FAQ;
