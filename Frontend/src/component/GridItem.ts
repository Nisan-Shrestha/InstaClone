// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { router } from "../main";

export class GridItem {
  public static async create(
    postDetail: Partial<IPost>,
    parentDiv: HTMLElement,
  ) {
    const gridItem = document.createElement("div");
    gridItem.className = "aspect-square cursor-pointer relative"; // Aspect ratio 1:1
    const img = document.createElement("img");

    img.src = postDetail.mediaUrl![0]; // Replace with your image source
    // img.alt = `Item ${i}`;
    img.className = "object-cover w-full h-full";
    gridItem.appendChild(img);
    if (postDetail.mediaUrl!.length > 1) {
      const svg = document.createElement("img");

      svg.src = "/assets/icons/multi-post.svg"; // Replace with your image source
      // img.alt = `Item ${i}`;
      svg.className = "absolute top-2 right-2 w-6 h-6";
      gridItem.appendChild(svg);
    }
    parentDiv.appendChild(gridItem);

    this.setup(postDetail, gridItem);
  }

  static setup(postDetail: Partial<IPost>, container: HTMLElement) {
    container.addEventListener("click", async () => {
      router.navigate(`/p/${postDetail.id}`, window.history.state);
    });
  }
}
