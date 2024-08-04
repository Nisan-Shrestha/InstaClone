import { GridItem } from "../component/GridItem";
import { IPost } from "../interfaces/Post.interface";
import { IUser } from "../interfaces/User.interface";
import { router } from "../main";
import {
  fetchView,
  getCookie,
  request,
  setupFollowBtn,
  updateNavbar,
} from "../utils/utils";

export class Profile {
  async load(username: string) {
    username = username.toLowerCase();
    if (
      !window.history.state ||
      window.history.state.currentView != "homeView"
    ) {
      let view = await fetchView("/views/Home.html");
      document.getElementById("app")!.innerHTML = view;
      window.history.replaceState(
        { ...window.history.state, currentView: "homeView" },
        "",
      );
    }
    if (window.history.state.currentTab != "profile") {
      document.getElementById("mainContainer")!.innerHTML = "";
      window.history.replaceState(
        { ...window.history.state, currentTab: "profile" },
        "",
      );
    }
    const mainContainer = document.getElementById(
      "mainContainer",
    ) as HTMLDivElement;
    mainContainer.innerHTML = "";
    window.history.replaceState(
      { ...window.history.state, currentTab: "profile" },
      "",
    );

    let view = await fetchView("/component/Profile.html");
    mainContainer.innerHTML = view;
    console.log("username", username);
    await updateNavbar("profile");
    let userInfo = (
      await request({
        url: import.meta.env.VITE_BACKEND_URL + "/user/" + username,
        method: "GET",
      })
    ).payload as Partial<IUser>;
    console.log("user", userInfo);
    this.setup(mainContainer, userInfo);
  }

  async setup(mainContainer: HTMLDivElement, userInfo: Partial<IUser>) {
    mainContainer.querySelector("[data-username]")!.textContent =
      userInfo.username!;
    // pfp data
    let pfpElem = mainContainer.querySelector("[data-pfp]") as HTMLImageElement;
    pfpElem.setAttribute("src", userInfo.pfpUrl!);

    // edit pfp
    pfpElem.parentElement!.addEventListener("click", () => {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.addEventListener("change", async () => {
        let file = input.files![0];
        let formData = new FormData();
        formData.append("photo", file);
        console.log(
          "hitting",
          import.meta.env.VITE_BACKEND_URL + "/user/changePfp",
        );
        let response = await request({
          url: import.meta.env.VITE_BACKEND_URL + "/user/changePfp",
          method: "PUT",
          body: formData,
          other: { contentType: "multipart/form-data" },
        });
        if (response.status == "success") {
          pfpElem.setAttribute("src", URL.createObjectURL(file));
        }
      });
    });

    // USer Data
    mainContainer.querySelector("[data-fullname]")!.textContent =
      userInfo.name!;
    mainContainer.querySelector("[data-bio]")!.textContent = userInfo.bio!;

    mainContainer.querySelector("[data-post-count]")!.textContent =
      userInfo.postCount?.toString() || "0";
    mainContainer.querySelector("[data-follower-count]")!.textContent =
      userInfo.followerCount?.toString() || "0";
    mainContainer.querySelector("[data-following-count]")!.textContent =
      userInfo.followingCount?.toString() || "0";

    // edit profile details button and modal
    let profileEditButton = mainContainer.querySelector(
      "[data-edit-button]",
    ) as HTMLButtonElement;
    setupFollowBtn(userInfo, mainContainer);

    if (getCookie("username") != userInfo.username) {
      profileEditButton.remove();
    } else {
      profileEditButton.addEventListener("click", () => {
        document.getElementById("edit-modal")?.classList.remove("hidden");
        document.addEventListener("keydown", (event) => {
          if (event.key == "Escape") {
            document.getElementById("edit-modal")?.classList.add("hidden");
          }
        });
      });
    }

    // Modal form submission handling
    const username = document.getElementById(
      "edit-username",
    ) as HTMLInputElement;
    const name = document.getElementById("edit-name") as HTMLInputElement;
    const bio = document.getElementById("edit-bio") as HTMLTextAreaElement;
    const privacy = document.getElementById(
      "edit-privacy",
    ) as HTMLTextAreaElement;
    username.value = userInfo.username!;
    name.value = userInfo.name!;
    bio.value = userInfo.bio!;
    privacy.value = userInfo.privacy!;

    // Validate data
    username?.addEventListener("input", async () => {
      username.value.toLowerCase();
      // valdiate username
      // if no error
      let errorSpan = document.getElementById(
        "usernameError",
      ) as HTMLSpanElement;
      if (username.value == userInfo.username) {
        errorSpan.classList.add("hidden");
        return;
      }
      if (await Profile.checkUsernameFree(username.value, errorSpan))
        document.getElementById("submitEdit")?.classList.remove("disabled");
      else document.getElementById("submitEdit")?.classList.add("disabled");
    });

    // Modal Submit or cancel
    const form = document.getElementById("editForm") as HTMLFormElement;
    form.onsubmit = async (event) => {
      event.preventDefault();
      username.value = username.value.toLowerCase();
      let submitBtn = document.getElementById(
        "submitEdit",
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.classList.add("bg-gray-400");
      submitBtn.classList.remove("bg-indigo-600", "hover:bg-indigo-500");
      console.log("sending: ", {
        username: username.value,
        name: name.value,
        bio: bio.value,
        privacy: privacy.value,
      });
      let res = await request({
        url: import.meta.env.VITE_BACKEND_URL + `/user/info`,
        method: "PUT",
        body: {
          username: username.value,
          name: name.value,
          bio: bio.value,
          privacy: privacy.value,
        },
        headers: { "Content-Type": "application/json" },
      });
      await res;
      if (res.status == "success") {
        document.getElementById("edit-modal")?.classList.add("hidden");

        router.navigate("/u/" + username.value);
      } else {
        alert("Some error occurred");
        submitBtn.disabled = false;
        submitBtn.innerText = "Update Details";
        submitBtn.classList.remove("bg-gray-400");
        submitBtn.classList.add("bg-indigo-600", "hover:bg-indigo-500");
      }
    };

    const cancelBtn = document.getElementById(
      "cancelEdit",
    ) as HTMLButtonElement;
    cancelBtn.addEventListener("click", () => {
      document.getElementById("edit-modal")?.classList.add("hidden");
    });
    this.renderPostTab(userInfo);

    // Post Tabs setup
    let postsTab = mainContainer.querySelector(
      "[data-posts-button]",
    ) as HTMLButtonElement;
    postsTab.addEventListener("click", () => {
      postsTab.classList.add("border-t");
      likedTab.classList.remove("border-t");
      savedTab.classList.remove("border-t");
      this.renderPostTab(userInfo);
    });

    let likedTab = mainContainer.querySelector(
      "[data-liked-button]",
    ) as HTMLButtonElement;
    let savedTab = mainContainer.querySelector(
      "[data-saved-button]",
    ) as HTMLButtonElement;

    if (getCookie("username") != userInfo.username) {
      likedTab.remove();
      savedTab.remove();
      return;
    }
    likedTab.addEventListener("click", () => {
      postsTab.classList.remove("border-t");
      likedTab.classList.add("border-t");
      savedTab.classList.remove("border-t");
      this.renderLikedTab();
      console.log("click");
    });
    savedTab.addEventListener("click", () => {
      postsTab.classList.remove("border-t");
      likedTab.classList.remove("border-t");
      savedTab.classList.add("border-t");
      this.renderSavedTab();
    });
  }

  async renderPostTab(userInfo: Partial<IUser>) {
    let posts = (
      await request({
        url:
          import.meta.env.VITE_BACKEND_URL + `/user/${userInfo.username}/posts`,
        method: "GET",
      })
    ).payload as IPost[];

    const postContainer = document.getElementById(
      "TabContainer",
    ) as HTMLDivElement;
    let view = await fetchView("/component/Gridbase.html");
    postContainer.innerHTML = view;
    const gridContainer = document.getElementById(
      "gridContainer",
    ) as HTMLDivElement;

    console.log("posts", posts);
    posts.forEach((post: Partial<IPost>) => {
      GridItem.create(post, gridContainer);
    });
  }

  async renderSavedTab() {
    let posts = (
      await request({
        url: import.meta.env.VITE_BACKEND_URL + `/user/likedposts`,
        method: "GET",
      })
    ).payload as IPost[];

    const tabContainer = document.getElementById(
      "TabContainer",
    ) as HTMLDivElement;
    let view = await fetchView("/component/Gridbase.html");
    tabContainer.innerHTML = view;
    const gridContainer = document.getElementById(
      "gridContainer",
    ) as HTMLDivElement;
    posts.forEach((post: Partial<IPost>) => {
      GridItem.create(post, gridContainer);
    });
  }

  async renderLikedTab() {
    let posts = (
      await request({
        url: import.meta.env.VITE_BACKEND_URL + `/user/savedposts`,
        method: "GET",
      })
    ).payload as IPost[];

    const tabContainer = document.getElementById(
      "TabContainer",
    ) as HTMLDivElement;
    let view = await fetchView("/component/Gridbase.html");
    tabContainer.innerHTML = view;
    const gridContainer = document.getElementById(
      "gridContainer",
    ) as HTMLDivElement;
    posts.forEach((post: Partial<IPost>) => {
      GridItem.create(post, gridContainer);
    });
  }

  static async checkUsernameFree(
    username: string,
    errorSpan: HTMLSpanElement,
  ): Promise<boolean> {
    username = username.toLowerCase();
    let res = await request({
      url:
        import.meta.env.VITE_BACKEND_URL +
        `/utils/checkFreeUsername/?username=${username}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status != "success") {
      console.log(res.message);
      errorSpan.classList.remove("hidden");
      errorSpan.innerText = res.message;
      return false;
    }
    if (!res.payload.isFree) {
      errorSpan.classList.remove("hidden");
      errorSpan.innerText = "Username is already taken.\n";
      errorSpan.innerHTML += `Free Usernames:<span class="text-slate-700"> ${res.payload.alternatives.join(
        ", ",
      )} </span>`;
      return false;
    } else {
      errorSpan.innerText = "";
    }
    return true;
  }
}
