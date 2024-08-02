// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { FollowStatus, IUser } from "../interfaces/User.interface";
import { router } from "../main";
import { fetchView, request } from "../utils/utils";

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
    let followBtn = container.querySelector(
      "button[data-follow-btn]",
    ) as HTMLButtonElement;
    if (userDetails.username == localStorage.getItem("username")) {
      followBtn.style.display = "none";
      return;
    }
    console.log(userDetails.following);
    if (userDetails.following == FollowStatus.Notfollowing) {
      followBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
      followBtn.classList.remove("bg-red-600", "hover:bg-red-700");
      followBtn.innerText = "Follow";
      followBtn.addEventListener(
        "click",
        async () => this.follow(userDetails, followBtn),
        { once: true },
      );
    } else {
      followBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
      followBtn.classList.add("bg-red-600", "hover:bg-red-700");
      if (userDetails.following == FollowStatus.Following)
        followBtn.innerText = "Unfollow";
      else if (userDetails.following == FollowStatus.Pending)
        followBtn.innerText = "Remove Request";

      followBtn.addEventListener(
        "click",
        async () => this.unfollow(userDetails, followBtn),
        { once: true },
      );
    }
  }
  static async follow(
    userDetails: Partial<IUser>,
    followBtn: HTMLButtonElement,
  ) {
    let response = await request({
      url:
        import.meta.env.VITE_BACKEND_URL +
        `/api/follow/${userDetails.username}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== "success") {
      // TODO:
      console.log("Error following user");
      return;
    }
    followBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
    followBtn.classList.add("bg-red-600", "hover:bg-red-700");

    if (response.payload.followResult == "requested") {
      followBtn.innerText = "Remove Request";
    } else if (response.payload.followResult == "followed") {
      followBtn.innerText = "Unfollow";
    }
    followBtn.addEventListener(
      "click",
      async () => this.unfollow(userDetails, followBtn),
      { once: true },
    );

    // router.navigate(`/u/${userDetails.username}`, window.history.state);
  }

  static async unfollow(
    userDetails: Partial<IUser>,
    followBtn: HTMLButtonElement,
  ) {
    let response = await request({
      url:
        import.meta.env.VITE_BACKEND_URL +
        `/api/unfollow/${userDetails.username}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== "success") {
      console.log("Error following user");
      return;
    }
    followBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    followBtn.classList.remove("bg-red-600", "hover:bg-red-700");
    followBtn.innerText = "Follow";
    followBtn.addEventListener(
      "click",
      async () => this.follow(userDetails, followBtn),
      { once: true },
    );
    // router.navigate(`/u/${userDetails.username}`, window.history.state);
  }
}
