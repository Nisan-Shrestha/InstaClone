import { GridItem } from "../component/GridItem";
import { IPost } from "../interfaces/Post.interface";
import { IUser } from "../interfaces/User.interface";
import { fetchView, getCookie, request, updateNavbar } from "../utils/utils";

export class Profile {
  async load(username: string) {
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
    // if (window.history.state.currentTab != "search") {
    //   document.getElementById("mainContainer")!.innerHTML = "";
    //   window.history.replaceState(
    //     { ...window.history.state, currentTab: "search" },
    //     "",
    //   );
    // }
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
    updateNavbar("profile");
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
    let pfpElem = mainContainer.querySelector("[data-pfp]") as HTMLImageElement;
    pfpElem.setAttribute("src", userInfo.pfpUrl!);
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
    mainContainer.querySelector("[data-fullname]")!.textContent =
      userInfo.name!;
    mainContainer.querySelector("[data-bio]")!.textContent = userInfo.bio!;
    // TODO: update Table and backend to implement these
    // mainContainer.querySelector("[data-post-count]")!.textContent =
    //   userInfo.postCount!;
    // mainContainer.querySelector("[data-follower-count]")!.textContent =
    //   userInfo.followerCount!;
    // mainContainer.querySelector("[data-following-count]")!.textContent =
    //   userInfo.followingCount!;

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

    this.renderPostTab(userInfo);
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
}
