// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { IUser } from "../interfaces/User.interface";
import { router } from "../main";
import { fetchView, request } from "../utils/utils";

export class GridItem {
  public static async create(
    postDetail: Partial<IPost>,
    parentDiv: HTMLElement,
  ) {
    const gridItem = document.createElement("div");
    gridItem.className = "aspect-square cursor-pointer"; // Aspect ratio 1:1
    const img = document.createElement("img");

    img.src = postDetail.mediaUrl![0]; // Replace with your image source
    console.log(postDetail.mediaUrl);
    // img.alt = `Item ${i}`;
    img.className = "object-cover w-full h-full";
    gridItem.appendChild(img);
    parentDiv.appendChild(gridItem);

    this.setup(postDetail, gridItem);
  }

  static setup(postDetail: Partial<IPost>, container: HTMLElement) {
    container.addEventListener("click", async () => {
      router.navigate(`/p/${postDetail.id}`, window.history.state);
    });
  }
}
