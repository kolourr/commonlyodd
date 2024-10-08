import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Objects_Images } from "./types";
import "./styles.css";
import { gameInfo } from "..";
import {
  sendMessage,
  gameType,
  oddReasonForSimilarity,
  isSessionActive,
  isSessionStarter,
} from "./index";
import { create } from "domain";
import { Button } from "@suid/material";
import { VolumeDownOutlined, VolumeOffOutlined } from "@suid/icons-material";

interface GameImagesProps {
  gameData: Objects_Images | null;
}

interface ImageObject {
  name: string;
  url: string;
  animationClass: string;
}

export const [soundOn, setSoundOn] = createSignal<boolean>(true);
export const [selectedImage, setSelectedImage] = createSignal<string>("");

const [imagesToShow, setImagesToShow] = createSignal<ImageObject[]>([]);
const [highlightName, setHighlightName] = createSignal<string>("");
const [isSelectable, setIsSelectable] = createSignal<boolean>(true);

const correctSound = new Audio("https://media.commonlyodd.com/right.mp3");
const wrongSound = new Audio("https://media.commonlyodd.com/wrong.mp3");

//Initialize local storage for scoring
const initializeScores = () => {
  localStorage.setItem("total_score", "0");
  localStorage.setItem("user_score", "0");
};
// Update scores in local storage
export const updateScores = (isCorrect) => {
  let total_score = parseInt(localStorage.getItem("total_score") || "0");
  let user_score = parseInt(localStorage.getItem("user_score") || "0");

  total_score++;
  if (isCorrect) {
    user_score++;
  }

  localStorage.setItem("total_score", total_score.toString());
  localStorage.setItem("user_score", user_score.toString());
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

export default function GameImages(props: GameImagesProps) {
  createEffect(() => {
    correctSound.load();
    wrongSound.load();
  });
  createEffect(() => {
    const gameData = props.gameData;
    const defaultImages = [
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
    const isDefaultImages =
      imagesToShow().length === 4 && imagesToShow()[0].name === "Parsnip";

    if (!isDefaultImages) {
      if (!isSelectable()) return;

      if (isSessionStarter()) {
        setIsSelectable(false);
        setSelectedImage(imageName);
        if (gameType() === "quick") {
          sendMessage({ game_state: "reveal-solo" });
        }
      } else {
        setIsSelectable(false);
        setSelectedImage(imageName);
      }
    }
  };

  createEffect(() => {
    if (selectedImage() && highlightName()) {
      const isCorrect = selectedImage() === highlightName();
      updateScores(isCorrect);
      playSound(isCorrect ? correctSound : wrongSound);
    }
  });

  const shouldApplyBlur = (imageName) => {
    return highlightName() && highlightName() !== imageName;
  };

  onCleanup(() => {
    initializeScores();
  });

  onMount(() => {
    if (!isSessionStarter()) {
      //check if local storage has game type and if not, set it to fun
      const gametype = localStorage.getItem("type");
      if (!gametype) {
        localStorage.setItem("type", "fun");
      }
    }
  });

  return (
    <div class="flex flex-col items-center justify-center text-center">
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
