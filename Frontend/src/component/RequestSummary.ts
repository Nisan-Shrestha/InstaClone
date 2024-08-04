// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { FollowStatus, IUser } from "../interfaces/User.interface";
import { router } from "../main";
import { fetchView, getCookie, request } from "../utils/utils";

export class RequestSummary {
  public static async create(
    userDetails: Partial<IUser>,
    parentDiv: HTMLElement,
  ) {
    let newUser = await fetchView("/component/UserRequestSummary.html");

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

    let acceptBtn = container.querySelector(
      "button[data-accept-btn]",
    ) as HTMLButtonElement;
    let rejectBtn = container.querySelector(
      "button[data-reject-btn]",
    ) as HTMLButtonElement;

    acceptBtn.addEventListener(
      "click",
      async () => {
        acceptBtn.disabled = true;
        acceptBtn.classList.add("cursor-not-allowed", "bg-indigo-700");
        acceptBtn.classList.remove("hover:bg-blue-700", "bg-blue-600");
        acceptBtn.innerText = "Following";
        rejectBtn.hidden = true;
        let result = await this.accept(userDetails);
        if (!result) {
          acceptBtn.disabled = false;
          acceptBtn.classList.remove("cursor-not-allowed", "bg-indigo-700");
          acceptBtn.classList.add("hover:bg-blue-700", "bg-blue-600");
          acceptBtn.innerText = "Accept";
        }
      },
      {
        once: true,
      },
    );
    rejectBtn.addEventListener(
      "click",
      async () => {
        acceptBtn.disabled = true;
        acceptBtn.classList.add(
          "cursor-not-allowed",
          "bg-neutral-100",
          "text-red-500",
          "border-red-500",
          "border-2",
        );
        acceptBtn.classList.remove("hover:bg-blue-700", "bg-blue-600");
        acceptBtn.innerText = "Rejected";
        rejectBtn.hidden = true;
        let result = await this.reject(userDetails);
        if (!result) {
          acceptBtn.disabled = false;
          acceptBtn.classList.remove(
            "cursor-not-allowed",
            "bg-neutral-100",
            "text-red-500",
            "border-red-500",
            "border-2",
          );
          acceptBtn.classList.add("hover:bg-blue-700", "bg-blue-600");
          acceptBtn.innerText = "Accept";
        }
      },
      {
        once: true,
      },
    );
  }

  static async accept(userDetails: Partial<IUser>) {
    let response = await request({
      url:
        import.meta.env.VITE_BACKEND_URL +
        `/api/follow-requests/${userDetails.username}?decision=Accepted`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== "success") {
      return false;
    }
    return true;
  }

  static async reject(userDetails: Partial<IUser>) {
    let response = await request({
      url:
        import.meta.env.VITE_BACKEND_URL +
        `/api/follow-requests/${userDetails.username}?decision=Rejected`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log('response:', response)
    if (response.status !== "success") {
      return false;
    }
    return true;
  }
}
