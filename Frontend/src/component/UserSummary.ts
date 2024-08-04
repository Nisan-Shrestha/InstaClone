// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { FollowStatus, IUser } from "../interfaces/User.interface";
import { router } from "../main";
import {
  fetchView,
  follow,
  request,
  setupFollowBtn,
  unfollow,
} from "../utils/utils";

export class UserSummary {
  public static async create(
    userDetails: Partial<IUser>,
    parentDiv: HTMLElement,
  ) {
    let newUser = await fetchView("/component/UserSummary.html");

    let container = document.createElement("div");

    container.setAttribute("class", "w-full border border-gray-300 p-2");
    container.innerHTML = newUser;

    parentDiv.appendChild(container);
    if (userDetails.pfpUrl)
      container
        .querySelector("img[data-userPfp]")
        ?.setAttribute("src", userDetails.pfpUrl);
    container.querySelector("[data-username]")!.textContent =
      userDetails.username!;
    container.querySelector("[data-fullname]")!.textContent = userDetails.name!;
    if (userDetails.pfpUrl)
      (
        container.querySelector("[data-userPfp") as HTMLImageElement
      ).setAttribute("src", userDetails.pfpUrl);
    this.setup(userDetails, container);
  }

  static setup(userDetails: Partial<IUser>, container: HTMLElement) {
    let profileBtn = container.querySelector(
      "button[data-profile-details]",
    ) as HTMLButtonElement;
    profileBtn.addEventListener("click", async () => {
      router.navigate(`/u/${userDetails.username}`, window.history.state);
    });
    setupFollowBtn(userDetails, container);
  }
}
