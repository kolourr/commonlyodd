import {
  Component,
  For,
  JSX,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { Button } from "@suid/material";
import Footer from "./footer";
import PricingPlans from "./pricing_plans";
import "../game/start_game/styles.css";

const BASE_API = import.meta.env.CO_API_URL;
const [highlightName, setHighlightName] = createSignal("Garlic");
const [timer, setTimer] = createSignal(10);

createEffect(() => {
  const interval = setInterval(() => {
    setTimer((t) => (t > 0 ? t - 1 : 10));
  }, 1000);

  onCleanup(() => clearInterval(interval));
});

const images = [
  {
    name: "Parsnip",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/688be032-60b9-43c0-2f3f-0ac1f7541300/public",
    animationClass: "image-slide-in-top",
  },
  {
    name: "Potato",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/c4ae542e-3146-4f56-e89e-c18c75786200/public",
    animationClass: "image-slide-in-side",
  },
  {
    name: "Garlic",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/aeecf0c5-f94d-4839-b306-75b30d093800/public",
    animationClass: "image-slide-in-bottom",
  },
  {
    name: "Carrot",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/ede3a18b-cfea-492c-9bfc-f312bc683800/public",
    animationClass: "image-slide-in-other-side",
  },
];

interface SectionProps {
  section: JSX.Element;
}

interface Feature {
  title: JSX.Element;
  description: JSX.Element;
  image: JSX.Element;
}

const simpleImages = () => (
  <div class="grid grid-cols-2 gap-2 justify-center items-center">
    {images.map((image) => (
      <div>
        <p class="text-center text-md text-gray-50">{image.name}</p>
        <img src={image.url} alt={image.name} />
      </div>
    ))}
  </div>
);

const renderImages = (blurOthers) => (
  <div class="grid grid-cols-2 gap-2 justify-center items-center">
    {images.map((image) => (
      <div
        class={`px-1 relative ${image.animationClass} ${
          image.name === highlightName()
            ? "border-6 border-bright-green glowing-border"
            : blurOthers
            ? "blur-effect"
            : ""
        }`}
      >
        <p class="text-center text-md text-gray-50">{image.name}</p>
        <img
          src={image.url}
          alt={image.name}
          class={
            image.name === highlightName()
              ? "glowing-border"
              : blurOthers
              ? "blur-effect"
              : ""
          }
        />
        {image.name === highlightName() && (
          <div class="absolute top-0 left-0 w-full h-full border-[7px] border-solid border-bright-green rounded-lg animate-pulse">
            <p class="odd-overlay">ODD</p>
          </div>
        )}
      </div>
    ))}
  </div>
);

// Use within the component
const topSection: SectionProps[] = [
  {
    section: (
      <div class="section-container  flex flex-col justify-center items-center ">
        <div class="text-4xl font-bold text-gray-50   flex justify-center items-center p-4">
          Love Trivia?
        </div>
        <div class="text-lg mb-3 flex justify-center italic">
          Here's how Commonly Odd works...
        </div>
        <div class=" text-gray-50">
          <div class="text-2xl   flex items-center justify-center  p-4">
            You're shown 4 items
          </div>
          <div class="flex justify-center">{simpleImages()}</div>
        </div>

        <div class=" text-gray-50">
          <div class="text-2xl flex flex-row items-center justify-center p-4 ">
            <div>
              Then, given{" "}
              <span class="timerFlashingTextLanding" style={{ color: "white" }}>
                {" "}
                {timer()}{" "}
              </span>
              seconds to spot the odd one out
            </div>
          </div>
          <div class="flex justify-center"> {renderImages(true)}</div>
        </div>

        <div class=" text-gray-50">
          <div class="text-2xl   flex items-center justify-center  p-4">
            Identify the commonlity among the other three
          </div>
          <div class="text-xl font-bold text-success-300 mb-3 flex justify-center">
            The others are root vegetables.
          </div>
          <div class="flex justify-center"> {renderImages(false)}</div>
        </div>

        <div class="text-3xl text-gray-50  flex justify-center pt-10 underline decoration-double">
          That's it.
        </div>
        <div class="text-3xl text-gray-50   flex justify-center items-center p-6 uppercase ">
          ⚠️ Fair warning ⚠️
        </div>

        <div class="text-xl text-gray-50  flex justify-center items-center p-4  ">
          The game is intense when the clock's ticking and your competing with
          others.
        </div>
        <div class="text-3xl text-gray-50  flex justify-center items-center p-4  font-bold   ">
          <span>Up for the </span> <span class="italic pl-2"> challenge?</span>
        </div>
        <div class="flex justify-center items-center p-4">
          <Button
            variant="contained"
            color="secondary"
            href={`${BASE_API}/login`}
            sx={{
              width: "300px",
              height: "60px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            class="flex justify-center items-center bg-gradient-to-bl from-warning-800 to-error-800"
          >
            Start Your Free 7-day Trial
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
        <div class="  text-gray-50 mb-3 flex justify-center text-4xl font-bold uppercase">
          Play Risk Free
        </div>
        <div class="text-lg mb-3 flex justify-center">
          Enjoy a full week on us, no strings attached.
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
    title: <>Play Anywhere, Anytime</>,
    description: (
      <>
        Jump into the fun from any browser—no need for fancy gear. If it
        connects to the internet, you're game!
      </>
    ),
    image: (
      <img
        src="https://via.placeholder.com/400"
        alt="Anywhere"
        class="rounded-lg shadow-lg  w-full object-cover"
      />
    ),
  },
  {
    title: <>Your People Play for FREE</>,
    description: (
      <>
        Toss a game link to friends and family and get the party started—perfect
        for game nights, reunions, or those “just because” hangouts.
      </>
    ),
    image: (
      <img
        src="https://via.placeholder.com/400"
        alt="Party"
        class="rounded-lg shadow-lg  w-full object-cover"
      />
    ),
  },
  {
    title: <>Built-In Group Voice Chat</>,
    description: (
      <>
        Got pals in far-flung places? No sweat! Our browser-based voice chat
        means everyone’s in the room, no extra apps needed.
      </>
    ),
    image: (
      <img
        src="https://via.placeholder.com/400"
        alt="Worldwide"
        class="rounded-lg shadow-lg   w-full object-cover"
      />
    ),
  },
  {
    title: <>Frequent Updates</>,
    description: (
      <>
        Get your brain buzzing! Our questions keep getting quirkier and the
        categories crazier. Learn, laugh, and level up!
      </>
    ),
    image: (
      <img
        src="https://via.placeholder.com/400"
        alt="Smarty Pants"
        class="rounded-lg shadow-lg   w-full object-cover"
      />
    ),
  },
];

const LandingPage: Component = () => {
  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4">
      <div class="flex flex-col    max-w-5xl  mx-auto min-h-screen     bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900 text-gray-200  ">
        <header class="text-center font-bold mb-6">
          <div class="flex flex-row items-center justify-center">
            <span class="pr-2 text-4xl">Commonly</span>
            <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-4xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em] ">
              Odd
            </span>
          </div>
        </header>
        <div class="flex flex-col space-y-6   pb-10  ">
          {topSection.map((section) => (
            <div>{section.section}</div>
          ))}
        </div>
        <div class="mb-10 text-center text-4xl font-bold uppercase ">
          Features
        </div>
        <div class="w-full flex justify-center">
          <div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-2 p-2   w-full justify-center   items-center">
            <For each={features}>
              {(feature, index) => (
                <div
                  key={index()}
                  class="flex flex-col items-center   w-full  "
                >
                  <h2 class="  text-2xl font-bold text-gray-50 flex justify-center p-4">
                    {feature.title}
                  </h2>
                  <div class="overflow-hidden rounded-lg shadow-lg flex justify-center p-4 ">
                    {feature.image}
                  </div>
                  <p class="text-xl   flex justify-center items-center p-6  ">
                    {feature.description}
                  </p>
                </div>
              )}
            </For>
          </div>
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
