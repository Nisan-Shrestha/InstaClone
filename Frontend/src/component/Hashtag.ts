// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { FollowStatus, IUser } from "../interfaces/User.interface";
import { router } from "../main";
import { fetchView, request } from "../utils/utils";

export class Hashtag {
  public static async create(name: string, parentDiv: HTMLElement) {
    let newUser = await fetchView("/component/UserSummary.html");

    let container = document.createElement("div");

    container.setAttribute(
      "class",
      "w-full border border-gray-300 p-2 cursor-pointer",
    );
    container.innerHTML = newUser;

    parentDiv.appendChild(container);

    container.textContent = "#"+name;
    this.setup(name, container);
  }

  static setup(name: string, container: HTMLElement) {
    container.addEventListener("click", async () => {
      router.navigate(`/explore/${name}`, window.history.state);
    });
  }
}
