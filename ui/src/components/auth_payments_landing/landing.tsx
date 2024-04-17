import { Component, For, JSX, createSignal } from "solid-js";
import { Button, Divider } from "@suid/material";
import Footer from "./footer";
import PricingPlans from "./pricing_plans";
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  KeyboardDoubleArrowRightOutlined,
} from "@suid/icons-material";

const BASE_API = import.meta.env.CO_API_URL;

interface SectionProps {
  section: JSX.Element;
}

interface Feature {
  title: JSX.Element;
  description: JSX.Element;
  image: JSX.Element;
}

const topSection: SectionProps[] = [
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
      </div>
    ),
  },
];

const bottomSection: SectionProps[] = [
  {
    section: (
      <div class="section-container">
        <div class="text-3xl font-bold text-gray-50 mb-3 flex justify-center">
          Play Risk Free for 7 days
        </div>
        <div class="text-lg mb-3 flex justify-center">
          Enjoy a full week on us, and get hooked without any hooks!
        </div>

        <div class="flex justify-center mt-10">
          <PricingPlans />
        </div>
      </div>
    ),
  },
];

const features: Feature[] = [
  {
    title: (
      <h2 class="text-xl font-bold text-gray-50">Play Anywhere, Anytime</h2>
    ),
    description: (
      <p class="text-md">
        Jump into the fun from any browser—no need for fancy gear. If it
        connects to the internet, you're game!
      </p>
    ),
    image: (
      <img
        src="path/to/anywhere.jpg"
        alt="Anywhere"
        class="rounded-lg shadow-lg   w-full object-cover"
      />
    ),
  },
  {
    title: (
      <h2 class="text-xl font-bold text-gray-50">Invite anyone with a link</h2>
    ),
    description: (
      <p class="text-md">
        Toss a game link to friends and family and get the party started—perfect
        for game nights, reunions, or those “just because” hangouts.
      </p>
    ),
    image: (
      <img
        src="path/to/party.jpg"
        alt="Party"
        class="rounded-lg shadow-lg  w-full object-cover"
      />
    ),
  },
  {
    title: <h2 class="text-xl font-bold text-gray-50">Group Voice Chat</h2>,
    description: (
      <p class="text-md">
        Got pals in far-flung places? No sweat! Our browser-based voice chat
        means everyone’s in the room, no extra apps needed.
      </p>
    ),
    image: (
      <img
        src="path/to/worldwide.jpg"
        alt="Worldwide"
        class="rounded-lg shadow-lg   w-full object-cover"
      />
    ),
  },
  {
    title: <h2 class="text-xl font-bold text-gray-50">Regular Updates</h2>,
    description: (
      <p class="text-md">
        Get your brain buzzing! Our questions keep getting quirkier and the
        categories crazier. Learn, laugh, and level up!
      </p>
    ),
    image: (
      <img
        src="path/to/smarty-pants.jpg"
        alt="Smarty Pants"
        class="rounded-lg shadow-lg   w-full object-cover"
      />
    ),
  },
];

const [selectedFeatureIndex, setSelectedFeatureIndex] = createSignal(0);

const LandingPage: Component = () => {
  const nextFeature = () =>
    setSelectedFeatureIndex((selectedFeatureIndex() + 1) % features.length);
  const prevFeature = () =>
    setSelectedFeatureIndex(
      (selectedFeatureIndex() + features.length - 1) % features.length
    );

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
          {topSection.map((section) => (
            <div>{section.section}</div>
          ))}
        </div>

        <div class="mb-10 text-center text-3xl font-bold">Features</div>
        <div class=" w-full flex flex-row items-center justify-center ">
          <div class="flex flex-col  items-center justify-center p-4   w-full h-[400px] space-y-4">
            <div class="flex  flex-row  ">
              <div class="flex justify-start items-center">
                <Button
                  onClick={prevFeature}
                  size="large"
                  sx={{ color: "#f9fafb" }}
                >
                  <ArrowCircleLeftOutlined
                    fontSize="large"
                    sx={{ width: "50px", height: "50px" }}
                  />
                </Button>
              </div>
              <div class="w-[300px] h-[300px] flex justify-center items-center">
                {features[selectedFeatureIndex()].image}
              </div>
              <div class="flex justify-end items-center">
                <Button
                  onClick={nextFeature}
                  size="large"
                  sx={{ color: "#f9fafb" }}
                >
                  <ArrowCircleRightOutlined
                    fontSize="large"
                    sx={{ width: "50px", height: "50px" }}
                  />
                </Button>
              </div>
            </div>
            <div>{features[selectedFeatureIndex()].title}</div>
            <div>{features[selectedFeatureIndex()].description}</div>
          </div>
        </div>
        <div class="flex justify-center mt-4 space-x-2">
          {features.map((_, i) => (
            <span
              class={`h-2 w-2 rounded-full ${
                i === selectedFeatureIndex() ? "bg-blue-500" : "bg-gray-500"
              }`}
            />
          ))}
        </div>

        <div class="flex flex-col space-y-6 divide-y pt-8 ">
          {bottomSection.map((section) => (
            <div>{section.section}</div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
