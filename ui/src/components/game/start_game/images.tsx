import { createEffect, createSignal } from "solid-js";
import { Objects_Images } from "./types";

interface GameImagesProps {
  gameData: Objects_Images | null;
}

interface ImageObject {
  name: string;
  url: string;
}

export default function GameImages(props: GameImagesProps) {
  const [imagesToShow, setImagesToShow] = createSignal<ImageObject[]>([]);

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
      ]);
    } else {
      setImagesToShow([
        { name: "Obj1", url: "https://via.placeholder.com/400" },
        { name: "Obj2", url: "https://via.placeholder.com/400" },
        { name: "Obj3", url: "https://via.placeholder.com/400" },
      ]);
    }
  });

  return (
    <div class="flex flex-col lg:flex-row justify-center items-center lg:space-x-4 lg:pt-20">
      {imagesToShow().map((obj, index) => (
        <div class="py-4">
          <p class="text-center">{obj.name}</p>
          <img src={obj.url} alt={obj.name} />
        </div>
      ))}
    </div>
  );
}
