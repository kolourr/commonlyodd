import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Objects_Images } from "./types";
import "./styles.css";
import { gameInfo } from "..";
import {
  sendMessage,
  gameType,
  oddReasonForSimilarity,
  isSessionActive,
} from "./index";
import { create } from "domain";

interface GameImagesProps {
  gameData: Objects_Images | null;
}

interface ImageObject {
  name: string;
  url: string;
  animationClass: string;
}

const [imagesToShow, setImagesToShow] = createSignal<ImageObject[]>([]);
const [highlightName, setHighlightName] = createSignal<string>("");
const [selectedImage, setSelectedImage] = createSignal<string>("");
const [isSelectable, setIsSelectable] = createSignal<boolean>(true);

//Initialize local storage for scoring
const initializeScores = () => {
  localStorage.setItem("total_score", "0");
  localStorage.setItem("user_score", "0");
};
// Update scores in local storage
const updateScores = (isCorrect) => {
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

export default function GameImages(props: GameImagesProps) {
  createEffect(() => {
    const gameData = props.gameData;
    const defaultImages = [
      {
        name: "Create Session",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/8209e650-8b9c-44a2-544e-36bf9eb9e800/public",
        animationClass: "image-slide-in-top",
      },
      {
        name: "Share Link",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/31465145-654c-48fc-2849-1da652707200/public",
        animationClass: "image-slide-in-side",
      },
      {
        name: "Join Call",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/946e2998-786c-4fab-25ed-7863412bf700/public",
        animationClass: "image-slide-in-bottom",
      },
      {
        name: "Start Game",
        url: "https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3b86ed8a-e91d-4880-b414-377316989b00/public",
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
      if (gameType() === "fun") {
        setIsSelectable(false);
        setSelectedImage(imageName);
        sendMessage({ game_state: "reveal-solo" });
      }
    }
  };

  createEffect(() => {
    if (gameType() === "fun") {
      if (selectedImage() && highlightName()) {
        const isCorrect = selectedImage() === highlightName();
        updateScores(isCorrect);
      }
    }
  });

  const shouldApplyBlur = (imageName) => {
    return highlightName() && highlightName() !== imageName;
  };

  onCleanup(() => {
    initializeScores();
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
