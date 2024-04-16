import { Component, JSX } from "solid-js";
import { Button } from "@suid/material";
import Footer from "./footer";
import PricingPlans from "./pricing_plans";

const BASE_API = import.meta.env.CO_API_URL; // Ensure this is correctly set in your .env file

interface SectionProps {
  section: JSX.Element;
}

const sections: SectionProps[] = [
  {
    section: (
      <div class="section-container   h-[250px]">
        <div class="flex flex-col"></div>
        <div class="text-4xl font-bold text-gray-50 mb-3 flex justify-center">
          Love Trivia? You’re in the right place!
        </div>
        <div class="text-lg mb-3">
          Four items, one oddball. Spot the misfit and decipher the connection
          among the others.
        </div>

        <div class="flex justify-center mt-5">
          <Button
            component="a"
            href={`${BASE_API}/login`}
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        </div>

        {/* <div class="flex justify-end">
          <video
            src="path/to/trivia-intro.mp4"
            controls
            class="rounded-lg shadow-lg h-[250px]    w-full object-cover "
          />{" "}
        </div> */}
      </div>
    ),
  },
  {
    section: (
      <div class="section-container">
        <div class="text-2xl font-bold text-gray-50 mb-3">
          Play Anywhere, Anytime
        </div>
        <div class="text-lg mb-3">
          Jump into the fun from any browser—no need for fancy gear. If it
          connects to the internet, you're game!
        </div>
        <img
          src="path/to/anywhere.jpg"
          alt="Anywhere"
          class="rounded-lg shadow-lg max-h-60 w-full object-cover"
        />
      </div>
    ),
  },
  {
    section: (
      <div class="section-container">
        <div class="text-2xl font-bold text-gray-50 mb-3">Party Central</div>
        <div class="text-lg mb-3">
          Toss a game link to friends and family and get the party
          started—perfect for game nights, reunions, or those “just because”
          hangouts.
        </div>
        <img
          src="path/to/party.jpg"
          alt="Party"
          class="rounded-lg shadow-lg max-h-60 w-full object-cover"
        />
      </div>
    ),
  },
  {
    section: (
      <div class="section-container">
        <div class="text-2xl font-bold text-gray-50 mb-3">
          Worldwide Shenanigans
        </div>
        <div class="text-lg mb-3">
          Got pals in far-flung places? No sweat! Our browser-based voice chat
          means everyone’s in the room, no extra apps needed.
        </div>
        <img
          src="path/to/worldwide.jpg"
          alt="Worldwide"
          class="rounded-lg shadow-lg max-h-60 w-full object-cover"
        />
      </div>
    ),
  },
  {
    section: (
      <div class="section-container">
        <div class="text-2xl font-bold text-gray-50 mb-3">
          Smarty Pants Mode: ON
        </div>
        <div class="text-lg mb-3">
          Get your brain buzzing! Our questions keep getting quirkier and the
          categories crazier. Learn, laugh, and level up!
        </div>
        <video
          src="path/to/smarty-pants.mp4"
          controls
          class="rounded-lg shadow-lg max-h-60 w-full object-cover"
        />
      </div>
    ),
  },
  {
    section: (
      <div class="section-container">
        <div class="text-2xl font-bold text-gray-50 mb-3">Freebie Week!</div>
        <div class="text-lg mb-3">
          Take 'Commonly Odd' out for a spin—no penny needed. Enjoy a full week
          on us, and get hooked without any hooks!
        </div>

        <div class="flex justify-center mt-10">
          <PricingPlans />
        </div>
      </div>
    ),
  },
];

const LandingPage: Component = () => {
  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4">
      <div class="flex flex-col    max-w-5xl  mx-auto min-h-screen     bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900 text-gray-200  ">
        <header class="text-center font-bold mb-10">
          <div class="flex flex-row items-center justify-center">
            <span class="pr-2 text-4xl">Commonly</span>
            <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-4xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em]">
              Odd
            </span>
          </div>
        </header>
        <div class="flex flex-col space-y-6 divide-y ">
          {sections.map((section) => (
            <div>{section.section}</div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
