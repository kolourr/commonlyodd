import {
  Component,
  For,
  JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { Button } from "@suid/material";
import Footer from "./footer";
import PricingPlans from "./pricing_plans";
import "../game/start_game/styles.css";
import Header from "./header";
import { Router } from "solid-app-router";
import AccountMenu from "../settings";
import FAQitems from "./faq_items";
import HeaderMobile from "./header_mobile";
import { subscriptionStatus } from "./user";
import { isAuthenticated } from "./pricing_plans";
import Demo from "../game/demo";

const BASE_API = import.meta.env.CO_API_URL;
const BASE_UI = import.meta.env.CO_UI_URL;
const [highlightName, setHighlightName] = createSignal("Garlic");
const [timer, setTimer] = createSignal(10);

createEffect(() => {
  const interval = setInterval(() => {
    setTimer((t) => (t > 0 ? t - 1 : 10));
  }, 1000);

  onCleanup(() => clearInterval(interval));
});

export const landingHeroButton = () => {
  if (!isAuthenticated()) {
    return (window.location.href = `${BASE_API}/login`);
  } else if (
    (isAuthenticated() && subscriptionStatus()?.status) ||
    (isAuthenticated() && subscriptionStatus()?.trial)
  ) {
    return (window.location.href = `${BASE_UI}/game`);
  } else if (
    (isAuthenticated() && !subscriptionStatus()?.status) ||
    (isAuthenticated() && !subscriptionStatus()?.trial)
  ) {
    return (window.location.href = `${BASE_UI}/user#pricingplans`);
  }
};

export const buttonText = () => {
  if (!isAuthenticated()) {
    return "Start playing for Free";
  } else if (
    (isAuthenticated() && subscriptionStatus()?.status) ||
    (isAuthenticated() && subscriptionStatus()?.trial)
  ) {
    return "Go to Game";
  } else if (
    (isAuthenticated() && !subscriptionStatus()?.status) ||
    (isAuthenticated() && !subscriptionStatus()?.trial)
  ) {
    return "Explore Plan";
  }
};

const images = [
  {
    name: "Parsnip",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/688be032-60b9-43c0-2f3f-0ac1f7541300/public",
    animationClass: "",
  },
  {
    name: "Potato",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/c4ae542e-3146-4f56-e89e-c18c75786200/public",
    animationClass: "",
  },
  {
    name: "Garlic",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/aeecf0c5-f94d-4839-b306-75b30d093800/public",
    animationClass: "",
  },
  {
    name: "Carrot",
    url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/ede3a18b-cfea-492c-9bfc-f312bc683800/public",
    animationClass: "",
  },
];

interface SectionProps {
  section: JSX.Element;
}

interface Feature {
  title: JSX.Element;
  video: JSX.Element;
  description: JSX.Element;
}

function renderTopImagesGrid() {
  // This will render the top two images
  return (
    <div class="grid grid-cols-2 gap-2 justify-center items-center">
      {images.slice(0, 2).map((image) => (
        <div key={image.name} class={`px-1 relative ${image.animationClass}`}>
          <p class="text-center text-md text-gray-300">{image.name}</p>
          <img src={image.url} alt={image.name} />
        </div>
      ))}
    </div>
  );
}

function renderBottomImagesGrid() {
  // This will render the bottom two images
  return (
    <div class="grid grid-cols-2 gap-2 justify-center items-center">
      {images.slice(2).map((image) => (
        <div key={image.name} class={`px-1 relative ${image.animationClass}`}>
          <p class="text-center text-md text-gray-300">{image.name}</p>
          <img src={image.url} alt={image.name} />
        </div>
      ))}
    </div>
  );
}

function renderBlurTopImagesGrid(blurOthers) {
  // This will render the top two images with conditional effects
  return (
    <div class="grid grid-cols-2 gap-2 justify-center items-center">
      {images.slice(0, 2).map((image) => (
        <div
          key={image.name}
          class={`px-1 relative ${image.animationClass} ${
            image.name === highlightName()
              ? "border-6 border-bright-green glowing-border"
              : blurOthers
              ? "blur-effect"
              : ""
          }`}
        >
          <p class="text-center text-md text-gray-300">{image.name}</p>
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
}

function renderBlurBottomImagesGrid(blurOthers) {
  // This will render the bottom two images with conditional effects
  return (
    <div class="grid grid-cols-2 gap-2 justify-center items-center">
      {images.slice(2).map((image) => (
        <div
          key={image.name}
          class={`px-1 relative ${image.animationClass} ${
            image.name === highlightName()
              ? "border-6 border-bright-green glowing-border"
              : blurOthers
              ? "blur-effect"
              : ""
          }`}
        >
          <p class="text-center text-md text-gray-300">{image.name}</p>
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
}

const SectionOne = () => (
  <div>
    <div class="flex justify-center">{renderTopImagesGrid()}</div>
    <div class="text-2xl text-slate-400 flex items-center justify-center my-2 p-6 h-20">
      You're shown 4 items
    </div>
    <div class="flex justify-center">{renderBottomImagesGrid()}</div>
  </div>
);

const SectionTwo = () => (
  <div>
    <div class="flex justify-center">{renderBlurTopImagesGrid(true)}</div>
    <div class="text-2xl flex text-slate-400 flex-row items-center justify-center my-2 p-6 h-20">
      <div>
        Then, given{" "}
        <span
          class="timerFlashingTextLanding text-3xl"
          style={{ color: "white" }}
        >
          {timer()}{" "}
        </span>
        seconds to spot the odd one out and...
      </div>
    </div>
    <div class="flex justify-center">{renderBlurBottomImagesGrid(true)}</div>
  </div>
);

const SectionThree = () => (
  <div>
    <div class="flex  justify-center">{renderBlurTopImagesGrid(false)}</div>
    <div class="text-2xl text-center text-slate-400 flex flex-col items-center justify-center p-6 my-2 h-20">
      <div>Identify the commonality among the other 3 items.</div>
      <span class="text-sm font-bold text-success-300">
        The others are root vegetables.
      </span>
    </div>
    <div class="flex justify-center">{renderBlurBottomImagesGrid(false)}</div>
  </div>
);

const bottomSection: SectionProps[] = [
  {
    section: (
      <div class="section-container">
        <div
          id="pricing-plans"
          class="  text-gray-300 mb-3 flex justify-center text-4xl font-bold  "
        >
          <Show when={!isAuthenticated()}>Start Playing for Free</Show>
          <Show when={isAuthenticated() && !subscriptionStatus()?.status}>
            Explore Plan
          </Show>
        </div>
        <div class="flex flex-col items-center justify-center">
          <Show when={!isAuthenticated()}>
            <span class="mt-2 text-gray-400">No credit card required</span>
          </Show>
          <Show when={isAuthenticated()}>
            <span class="mt-2 text-gray-400">
              No lock in. Cancel anytime. No questions asked.
            </span>
          </Show>
          <div class="flex jsutify-center items-center">
            {" "}
            <PricingPlans />
          </div>
        </div>
      </div>
    ),
  },
];

const features: Feature[] = [
  {
    title: <>Play Anywhere, Anytime</>,
    video: (
      <video
        autoplay
        loop
        muted
        playsinline
        class="w-full h-auto"
        src="https://media.commonlyodd.com/co_browser_landing.mp4"
      ></video>
    ),
    description: (
      <>
        No download required. Jump right into your browser. If it connects to
        the internet, you're good!
      </>
    ),
  },

  {
    title: <>Built-In Group Voice Chat</>,
    video: (
      <video
        autoplay
        loop
        muted
        playsinline
        class="w-full h-auto"
        src="https://media.commonlyodd.com/co_group_call_final_update.mp4"
      ></video>
    ),
    description: (
      <>
        Skip Zoom and ditch Discord! Our browser-based voice chat lets everyone
        talk right from the game.
      </>
    ),
  },
  {
    title: <>Only One Subscription Needed for Group Play</>,
    video: (
      <video
        autoplay
        loop
        muted
        playsinline
        class="w-full h-auto"
        src="https://media.commonlyodd.com/co_session_link_nowww.mp4"
      ></video>
    ),
    description: (
      <>
        No screen sharing needed—just send over the game link! Your crew can
        join instantly, for free, no login required.
      </>
    ),
  },

  {
    title: <>Frequent Updates</>,
    video: (
      <video
        autoplay
        loop
        muted
        playsinline
        class="w-full h-auto"
        src="https://media.commonlyodd.com/co_frequent_updates_landing.mp4"
      ></video>
    ),
    description: (
      <>
        We frequently update our catalog, bringing quirkier questions and
        crazier categories. Learn, laugh, and level up!
      </>
    ),
  },
];

const LandingPage: Component = () => {
  const [activeSection, setActiveSection] = createSignal(1);
  const cycleSections = () => {
    setActiveSection((prev) => (prev % 3) + 1);
  };

  createEffect(() => {
    const interval = setInterval(cycleSections, 4000);
    return () => clearInterval(interval);
  });

  const desktopView = () => {
    return (
      <>
        <Header />
        <div class="flex flex-row my-4">
          <div class="w-6/12 flex flex-col justify-end items-center mb-10">
            <div class="flex flex-col items-center">
              <div class="text-7xl  text-center text-gray-300  font-bold flex flex-col justify-center items-center pt-2  px-2 pb-2">
                <span class="bg-gray-200 text-slate-900 font-bold     my-2 px-2 py-1">
                  Trivia nights
                </span>
                <div class="text-gray-300">anywhere, anytime</div>
              </div>
            </div>
            <div>
              <div class="text-2xl  text-center  text-gray-400  flex justify-center items-center pt-6 px-8">
                A multiplayer browser trivia game that educates and entertains.
              </div>
              <div class="flex flex-col justify-center items-center p-4">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={landingHeroButton}
                  sx={{
                    width: "300px",
                    height: "60px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  class="flex justify-center items-center text-gray-300 bg-slate-900"
                >
                  {buttonText()}
                </Button>
                {/* <Show when={!isAuthenticated()}>
                  <span class="mt-2 text-gray-400">
                    No credit card required
                  </span>
                </Show> */}
              </div>
            </div>
          </div>
          <div class="w-6/12 ">
            <div class="flex flex-col space-y-6   pb-10  ">
              {activeSection() === 1 && <SectionOne />}
              {activeSection() === 2 && <SectionTwo />}
              {activeSection() === 3 && <SectionThree />}
            </div>
          </div>
        </div>
      </>
    );
  };

  const mobileView = () => {
    return (
      <>
        <HeaderMobile />
        <div class="flex flex-col my-4">
          <div class="flex flex-col items-center">
            <div class="text-6xl text-center text-gray-300 font-bold flex flex-col justify-center items-center py-2">
              <span class="bg-gray-200 text-slate-900 font-bold   text-6xl my-2 px-2 py-1">
                Trivia nights
              </span>
              <div class="text-gray-300">anywhere, anytime</div>
            </div>
          </div>
          <div class="text-2xl  text-center  text-gray-400   flex justify-center items-center mt-2 mb-4">
            A multiplayer browser trivia game that educates and entertains.
          </div>

          <div class="flex flex-col space-y-6   mb-6  ">
            {activeSection() === 1 && <SectionOne />}
            {activeSection() === 2 && <SectionTwo />}
            {activeSection() === 3 && <SectionThree />}
          </div>

          <div class="flex flex-col justify-center items-center p-4">
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={landingHeroButton}
                sx={{
                  width: "300px",
                  height: "60px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                class="flex justify-center items-center text-gray-300 bg-slate-900"
              >
                {buttonText()}
              </Button>
            </div>
            {/* <Show when={!isAuthenticated()}>
              <span class="mt-2 text-gray-400">No credit card required</span>
            </Show> */}
          </div>
        </div>
      </>
    );
  };

  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
        <div class="hidden md:block">{desktopView()}</div>
        <div class="block md:hidden">{mobileView()}</div>

        <div
          id="howitworks"
          class="mb-10 text-center text-4xl font-bold  text-gray-200 "
        >
          How it Works
        </div>
        <div class="w-full mb-4 text-base md:text-lg">
          <video controls class="w-full h-auto shadow-lg">
            <source
              src="https://media.commonlyodd.com/how_it_works_jun7.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        <div
          id="features"
          class="my-8 text-center text-4xl font-bold  text-gray-200  "
        >
          Features
        </div>

        <div class="w-full flex justify-center   text-center">
          <div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-2 p-2   w-full justify-center   items-center">
            <For each={features}>
              {(feature, index) => (
                <div
                  key={index()}
                  class="flex flex-col items-center   w-full  "
                >
                  <h2 class="  text-2xl font-bold text-gray-300 flex justify-center p-4">
                    {feature.title}
                  </h2>
                  <div class="flex justify-center items-center">
                    {feature.video}
                  </div>

                  <p class="text-xl text-slate-400  flex justify-center items-center p-6  ">
                    {feature.description}
                  </p>
                </div>
              )}
            </For>
          </div>
        </div>
        <Demo />

        <FAQitems />

        {/* <Show when={!subscriptionStatus()?.status}>
          <div class="flex flex-col space-y-6 divide-y pt-8 ">
            {bottomSection.map((section) => (
              <div>{section.section}</div>
            ))}
          </div>
        </Show> */}
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
