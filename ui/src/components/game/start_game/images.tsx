import { For, createEffect, createSignal } from "solid-js";
import { Objects_Images } from "./types";
import { oddReasonForSimilarity } from "./index";
import "./styles.css";

interface GameImagesProps {
  gameData: Objects_Images | null;
}

interface ImageObject {
  name: string;
  url: string;
}
const [imagesToShow, setImagesToShow] = createSignal<ImageObject[]>([]);
const [highlightName, setHighlightName] = createSignal("");

export const startNewTurn = () => {
  setHighlightName("");
};
export default function GameImages(props: GameImagesProps) {
  createEffect(() => {
    const gameData = props.gameData;
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
      setImagesToShow([
        {
          name: "Create Session",
          url: "https://via.placeholder.com/180",
          animationClass: "image-slide-in-top",
        },
        {
          name: "Share Link",
          url: "https://via.placeholder.com/180",
          animationClass: "image-slide-in-side",
        },
        {
          name: "Join Call",
          url: "https://via.placeholder.com/180",
          animationClass: "image-slide-in-bottom",
        },
        {
          name: "Start Game",
          url: "https://via.placeholder.com/180",
          animationClass: "image-slide-in-other-side",
        },
      ]);
    }

    const oddReason = oddReasonForSimilarity()?.odd_reason_for_similarity?.odd;
    setHighlightName(oddReason);
  });

  const shouldApplyBlur = (imageName) => {
    return (
      highlightName() && highlightName() !== "" && highlightName() !== imageName
    );
  };

  return (
    <div class="grid grid-cols-2 gap-2 justify-center items-center">
      <For each={imagesToShow()}>
        {(obj, index) => (
          <div
            class={`px-1 relative ${obj.animationClass} ${
              obj.name === highlightName()
                ? "border-6 border-bright-green glowing-border"
                : shouldApplyBlur(obj.name)
                ? "blur-effect"
                : ""
            } text-gray-50`}
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
            {obj.name === highlightName() && (
              <>
                <div class="absolute  top-0 left-0 w-full h-full border-[7px] border-solid border-bright-green rounded-lg animate-pulse"></div>
                <p class="odd-overlay">ODD</p>
              </>
            )}
          </div>
        )}
      </For>
    </div>
  );
}
