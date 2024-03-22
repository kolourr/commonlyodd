import { createEffect, createSignal } from "solid-js";
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

export default function GameImages(props: GameImagesProps) {
  const [imagesToShow, setImagesToShow] = createSignal<ImageObject[]>([]);
  const [highlightName, setHighlightName] = createSignal("");

  createEffect(() => {
    const gameData = props.gameData;
    if (gameData && gameData.objs_image_links) {
      setImagesToShow([
        {
          name: gameData.objs_image_links.obj1 || "Obj1",
          url: gameData.objs_image_links.img_link1,
        },
        {
          name: gameData.objs_image_links.obj2 || "Obj2",
          url: gameData.objs_image_links.img_link2,
        },
        {
          name: gameData.objs_image_links.obj3 || "Obj3",
          url: gameData.objs_image_links.img_link3,
        },
        {
          name: gameData.objs_image_links.obj3 || "Obj3",
          url: gameData.objs_image_links.img_link3,
        },
      ]);
    } else {
      setImagesToShow([
        { name: "Obj1", url: "https://via.placeholder.com/180" },
        { name: "Obj2", url: "https://via.placeholder.com/180" },
        { name: "Obj3", url: "https://via.placeholder.com/180" },
        { name: "Obj4", url: "https://via.placeholder.com/180" },
      ]);
    }

    const oddReason = oddReasonForSimilarity()?.odd_reason_for_similarity?.odd;
    setHighlightName(oddReason);
  });

  return (
    <div class="grid  grid-cols-2 lg:grid-cols-4  gap-1   justify-center items-center">
      {imagesToShow().map((obj, index) => (
        <div
          class={`px-1 relative ${
            obj.name === highlightName()
              ? "border-6 border-bright-green glowing-border"
              : ""
          }`}
        >
          <p class="text-center">{obj.name}</p>
          <img
            src={obj.url}
            alt={obj.name}
            class={obj.name === highlightName() ? "text-bright-green" : ""}
          />
          {obj.name === highlightName() && (
            <div class="absolute top-0 left-0 w-full h-full border-4 border-solid border-bright-green rounded-lg animate-pulse"></div>
          )}
        </div>
      ))}
    </div>
  );
}
