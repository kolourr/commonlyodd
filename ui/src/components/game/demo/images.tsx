import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Objects_Images } from "../start_game/types";
import "./styles.css";
import { gameInfo } from "..";
import {
  sendMessage,
  gameType,
  oddReasonForSimilarity,
  isSessionActive,
} from "./start";
import { VolumeDownOutlined, VolumeOffOutlined } from "@suid/icons-material";
import { Button } from "@suid/material";

interface GameImagesProps {
  gameData: Objects_Images | null;
}

interface ImageObject {
  name: string;
  url: string;
  animationClass: string;
}

export const [countReached, setCountReached] = createSignal<boolean>(false);
export const [countPlusOne, setCountPlusOne] = createSignal<boolean>(false);
const [imagesToShow, setImagesToShow] = createSignal<ImageObject[]>([]);
const [highlightName, setHighlightName] = createSignal<string>("");
const [selectedImage, setSelectedImage] = createSignal<string>("");
const [isSelectable, setIsSelectable] = createSignal<boolean>(true);
const [soundOn, setSoundOn] = createSignal<boolean>(true);

const correctSound = new Audio("https://media.commonlyodd.com/right.mp3");
const wrongSound = new Audio("https://media.commonlyodd.com/wrong.mp3");

const initializeTotalDemoCount = () => {
  localStorage.setItem("total_score_demo", "0");
};

const updateScores = (isCorrect) => {
  let total_score = parseInt(localStorage.getItem("total_score_demo") || "0");

  if (isCorrect || !isCorrect) {
    total_score++;
  }

  localStorage.setItem("total_score_demo", total_score.toString());
  if (total_score === 10) {
    setCountReached(true);
  }
  if (total_score === 11) {
    setCountPlusOne(true);
  }
};

export const startNewTurn = () => {
  setHighlightName("");
  setSelectedImage("");
  setIsSelectable(true);
};

const playSound = (sound) => {
  if (soundOn()) {
    sound.play();
  }
};

export default function GameImagesDemo(props: GameImagesProps) {
  createEffect(() => {
    correctSound.load();
    wrongSound.load();
  });

  createEffect(() => {
    const gameData = props.gameData;
    const defaultImages = [
      {
        // name: "Parsnip",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/c64e46b2-1df5-4919-197d-6ff7fbfc8900/public",
        animationClass: "image-slide-in-top",
      },
      {
        // name: "Potato",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/34a16638-8c88-401d-4aaf-63d6f14c9100/public",
        animationClass: "image-slide-in-side",
      },
      {
        // name: "Garlic",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/56f8af98-6ce6-48a0-0dfb-6ba371c2d700/public",
        animationClass: "image-slide-in-bottom",
      },
      {
        // name: "Carrot",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/54d6d568-021b-4352-f2d2-6b342646cf00/public",
        animationClass: "image-slide-in-other-side",
      },
    ];

    if (gameData && gameData.objs_image_links) {
      setImagesToShow([
        {
          name: gameData.objs_image_links.obj1 || "Obj1",
          url: gameData.objs_image_links.img_link1,
          animationClass: "image-slide-in-top",
        },
        {
          name: gameData.objs_image_links.obj2 || "Obj2",
          url: gameData.objs_image_links.img_link2,
          animationClass: "image-slide-in-side",
        },
        {
          name: gameData.objs_image_links.obj3 || "Obj3",
          url: gameData.objs_image_links.img_link3,
          animationClass: "image-slide-in-bottom",
        },
        {
          name: gameData.objs_image_links.obj4 || "Obj4",
          url: gameData.objs_image_links.img_link4,
          animationClass: "image-slide-in-other-side",
        },
      ]);
    } else {
      setImagesToShow(defaultImages);
    }

    const oddReason = oddReasonForSimilarity()?.odd_reason_for_similarity?.odd;
    if (oddReason !== undefined) {
      setHighlightName(oddReason);
    }
  });

  const clickCheck = (imageName) => {
    //Check to see if imagesToShow is set to default images
    const isDefaultImages =
      imagesToShow().length === 4 &&
      imagesToShow()[0].name === "Create Session";

    if (isSessionActive() && !isDefaultImages) {
      if (!isSelectable()) return;
      if (gameType() === "demo") {
        setIsSelectable(false);
        setSelectedImage(imageName);
        sendMessage({ game_state: "reveal-solo" });
      }
    }
  };

  createEffect(() => {
    if (gameType() === "demo") {
      if (selectedImage() && highlightName()) {
        const isCorrect = selectedImage() === highlightName();
        updateScores(isCorrect);
        playSound(isCorrect ? correctSound : wrongSound);
      }
    }
  });

  const shouldApplyBlur = (imageName) => {
    return highlightName() && highlightName() !== imageName;
  };

  onCleanup(() => {
    initializeTotalDemoCount();
  });

  return (
    <div class="flex flex-col items-center justify-center text-center">
      <div class="relative w-full flex justify-center items-center pb-2">
        <Button
          sx={{
            color: "#f9fafb",
          }}
          onClick={() => setSoundOn(!soundOn())}
        >
          {soundOn() ? (
            <VolumeDownOutlined fontSize="large" />
          ) : (
            <VolumeOffOutlined fontSize="large" />
          )}
        </Button>
      </div>

      <div class="grid grid-cols-2 gap-4 justify-center items-center">
        <For each={imagesToShow().slice(0, 2)}>
          {(obj, index) => (
            <div
              onClick={() => clickCheck(obj.name)}
              class={`px-1 relative ${obj.animationClass} ${
                obj.name === highlightName()
                  ? "border-6 border-bright-green glowing-border"
                  : shouldApplyBlur(obj.name)
                  ? "blur-effect"
                  : ""
              } text-gray-300`}
            >
              <p class="text-center">{obj.name}</p>
              <img
                src={obj.url}
                alt={obj.name}
                loading="lazy"
                class={`${
                  obj.name === highlightName()
                    ? "text-bright-green"
                    : shouldApplyBlur(obj.name)
                    ? "blur-effect"
                    : ""
                }`}
              />
              <div class="absolute top-0 left-0 w-full h-full">
                {obj.name === selectedImage() && (
                  <div
                    class={
                      obj.name === highlightName()
                        ? "absolute top-0 left-0 w-full h-full border-solid border-[12px] border-success-400 rounded-lg animate-pulse"
                        : "absolute top-0 left-0 w-full h-full border-solid border-[7px] border-warning-400 rounded-lg animate-pulse"
                    }
                  >
                    <p
                      class={
                        obj.name === highlightName()
                          ? "correct-text"
                          : "odd-overlay-subtext"
                      }
                    >
                      {obj.name === highlightName() ? "ODD" : "X"}
                    </p>
                  </div>
                )}
                {obj.name === highlightName() &&
                  selectedImage() !== obj.name && (
                    <div class="absolute top-0 left-0 w-full h-full border-[7px] border-solid border-bright-green rounded-lg animate-pulse">
                      <p class="odd-overlay">ODD</p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </For>
      </div>
      <div class="w-full py-4" id="gameInfo">
        {gameInfo()}
      </div>
      <div class="grid grid-cols-2 gap-4 justify-center items-center">
        <For each={imagesToShow().slice(2)}>
          {(obj, index) => (
            <div
              onClick={() => clickCheck(obj.name)}
              class={`px-1 relative ${obj.animationClass} ${
                obj.name === highlightName()
                  ? "border-6 border-bright-green glowing-border"
                  : shouldApplyBlur(obj.name)
                  ? "blur-effect"
                  : ""
              } text-gray-300`}
            >
              <p class="text-center">{obj.name}</p>
              <img
                src={obj.url}
                alt={obj.name}
                class={`${
                  obj.name === selectedImage() || obj.name === highlightName()
                    ? "text-bright-green"
                    : shouldApplyBlur(obj.name)
                    ? "blur-effect"
                    : ""
                }`}
              />

              <div class="absolute top-0 left-0 w-full h-full">
                {obj.name === selectedImage() && (
                  <div
                    class={
                      obj.name === highlightName()
                        ? "absolute top-0 left-0 w-full h-full border-solid border-[12px] border-success-400 rounded-lg animate-pulse"
                        : "absolute top-0 left-0 w-full h-full border-solid border-[7px] border-warning-400 rounded-lg animate-pulse"
                    }
                  >
                    <p
                      class={
                        obj.name === highlightName()
                          ? "correct-text"
                          : "odd-overlay-subtext"
                      }
                    >
                      {obj.name === highlightName() ? "ODD" : "X"}
                    </p>
                  </div>
                )}
                {obj.name === highlightName() &&
                  selectedImage() !== obj.name && (
                    <div class="absolute top-0 left-0 w-full h-full border-[7px] border-solid border-bright-green rounded-lg animate-pulse">
                      <p class="odd-overlay">ODD</p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
